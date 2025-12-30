import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from '../shared/jwt/jwt.cosntant';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  // ✅ REGISTER
  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashed);
    return { id: user.id, email: user.email };
  }

  // ✅ LOGIN (ISSUE TOKENS + SAVE HASHED RT)
  async login(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: jwtConstants.accessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });


    const hashedRt = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRt);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    if (!refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const rtMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!rtMatches) {
      throw new ForbiddenException('Access denied');
    }

    return this.login(user);
  }


  // ✅ VALIDATE USER (LOCAL STRATEGY)
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }
}
