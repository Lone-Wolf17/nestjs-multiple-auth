import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

import RefreshToken from './entities/refresh_token.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import {
  DecodedAccessToken,
  AuthTokens,
  UserAgentAndIpAddress,
} from './entities/misc';
import EnvVars from 'src/constants/EnvVars';
import { UserDetails } from './utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly userService: UsersService,
  ) {}

  async login(
    email: string,
    password: string,
    values: UserAgentAndIpAddress,
  ): Promise<AuthTokens> {
    const user = await this.userService.findOne({ email }, ['user.password']);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    // verify your user -- use argon2 for password hashing!!
    if (user.password !== password) {
      throw new UnauthorizedException(`Invalid Email or Password`);
    }

    return this.newRefreshAndAccessToken(user, values);
  }

  async socialLogin(
    email: string,
    values: UserAgentAndIpAddress,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    return this.newRefreshAndAccessToken(user, values);
  };

  async logout(refreshStr: string): Promise<void> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);

    if (!refreshToken) {
      throw new UnauthorizedException(`Invalid Token`);
    }

    // delete refreshToken from db
    await this.refreshTokenRepository.remove(refreshToken);
  }

  async validateUser(details: UserDetails) {
    const user = await this.userService.findByEmail(details.email);
    if (user) {
      return user;
    }
    console.log('User not found. Creating...');

    return this.userService.createUser({
      name: details.name,
      email: details.email,
      password: details.name.split(' ')[0].toLowerCase() + 'Pass',
    });
  }

  private async newRefreshAndAccessToken(
    user: User,
    values: UserAgentAndIpAddress,
  ): Promise<AuthTokens> {
    await this.refreshTokenRepository.delete({
      userId: user.id,
      userAgent: values.userAgent,
    });
    let refreshObject = new RefreshToken({
      ...values,
      userId: user.id,
    });

    // add refreshObject to db
    refreshObject = await this.refreshTokenRepository.save(refreshObject);

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

  async refresh(refreshStr: string): Promise<{ access_token: string }> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);
    if (!refreshToken) {
      throw new UnauthorizedException(`Invalid Token`);
    }

    const user = await this.userService.findOne({ id: refreshToken.userId });
    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }

    const accessToken: DecodedAccessToken = {
      userId: refreshToken.userId,
    };

    return {
      access_token: sign(accessToken, EnvVars.AccessSecret, {
        expiresIn: '1h',
      }),
    };
  }

  private async retrieveRefreshToken(
    refreshTokenStr: string,
  ): Promise<RefreshToken> {
    try {
      const decoded = verify(refreshTokenStr, EnvVars.RefreshSecret);

      if (typeof decoded === 'string') {
        throw new UnauthorizedException(`Invalid Token`);
      }
      // console.log("Decoded:: ", decoded);
      return await this.refreshTokenRepository.findOneBy({ id: decoded.id });
    } catch (e) {
      // console.log("Error called:: ", e);
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }
}
