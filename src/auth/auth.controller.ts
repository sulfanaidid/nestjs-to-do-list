import { Body, Controller, Post, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decoretor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Throttle({
    login: {
      limit: 5,
      ttl: 60,
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }


  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(
    @CurrentUser() user: { userId: number },
    @Req() req,
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ForbiddenException('No refresh token');
    }

    const refreshToken = authHeader.replace('Bearer ', '').trim();

    return this.authService.refreshTokens(user.userId, refreshToken);
  }


  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: { userId: number }) {
    await this.usersService.updateRefreshToken(user.userId);
    return null;
  }

}
