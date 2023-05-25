import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import RefreshToken from './entities/refresh_token.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FirebaseStrategy],
})
export class AuthModule {}
