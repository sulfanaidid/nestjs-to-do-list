import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../shared/jwt/jwt.strategy';
import { jwtConstants } from '../shared/jwt/jwt.cosntant';
import { LocalStrategy } from './strategies/local.strategy';
import { RtStrategy } from 'src/shared/jwt/rt.strategy';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: jwtConstants.accessSecret,
            signOptions: {
                expiresIn: jwtConstants.refreshExpiresIn,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RtStrategy],
})
export class AuthModule { }
