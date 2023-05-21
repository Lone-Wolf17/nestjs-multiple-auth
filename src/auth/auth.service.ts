import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

import DecodedRefreshToken from './entities/refresh_token.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { DecodedAccessToken, AuthTokens, UserAgentAndIpAddress } from './entities/misc';
import EnvVars from 'src/constants/EnvVars';

@Injectable()
export class AuthService {
  private refreshTokens: DecodedRefreshToken[] = [];

  constructor(private userService: UsersService) {}

  async login(
    email: string,
    password: string,
    values: UserAgentAndIpAddress,
  ): Promise<AuthTokens> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    // verify your user -- use argon2 for password hashing!!
    if (user.password !== password) {
      throw new UnauthorizedException(`Invalid Email or Password`);
    }

    return this.newRefreshAndAccessToken(user, values);
  }

  async logout(refreshStr: string): Promise<void> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);

    if (!refreshToken) {
      throw new UnauthorizedException(`Invalid Token`);
    }

    // delete refreshToken from db
    this.refreshTokens = this.refreshTokens.filter(
      (refreshToken) => refreshToken.id !== refreshToken.id,
    );
  }

  private newRefreshAndAccessToken(
    user: User,
    values: UserAgentAndIpAddress,
  ): Promise<AuthTokens> {
    const refreshObject = new DecodedRefreshToken({
      id:
        this.refreshTokens.length === 0
          ? 0
          : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
      ...values,
      userId: user.id,
    });

    // add refreshObject to db
    this.refreshTokens.push(refreshObject);
    return Promise.resolve({
      refresh_token: refreshObject.sign(),
      access_token: sign(
        {
          userId: user.id,
        },
        EnvVars.AccessSecret,
        { expiresIn: '1h' },
      ),
    });
  }

  async refresh(refreshStr: string): Promise<{access_token: string}> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);
    if (!refreshToken) {
      throw new UnauthorizedException(`Invalid Token`);
    }

    const user = await this.userService.findOne(refreshToken.userId);
    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }

    const accessToken : DecodedAccessToken = {
      userId: refreshToken.userId,
    };

    return {
      access_token: sign(accessToken, EnvVars.AccessSecret, {
        expiresIn: '1h',
      }),
    };
  }

  private retrieveRefreshToken(
    refreshTokenStr: string,
  ): Promise<DecodedRefreshToken> {
    try {
      const decoded = verify(refreshTokenStr, EnvVars.RefreshSecret);

      if (typeof decoded === 'string') {
        throw new UnauthorizedException(`Invalid Token`);
      }
      // console.log("Decoded:: ", decoded);
      // console.log('Refresh Tokens:: ', this.refreshTokens);
      return Promise.resolve(
        this.refreshTokens.find((token) => token.id === decoded.id),
      );
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
