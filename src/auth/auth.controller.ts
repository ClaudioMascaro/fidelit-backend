import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Version,
  UseGuards,
  Get,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';
import { VerificationService } from 'src/verification/verification.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private verificationService: VerificationService,
  ) {}

  @Version('1')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Version('1')
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Request() req) {
    const user = await this.usersService.findOneEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const channel = req.query.channel;

    const toVerify = channel === 'sms' ? user.phone : user.email;

    await this.verificationService.sendVerification(toVerify, channel);
    return { message: 'Verification code sent' };
  }

  @Version('1')
  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    const user = await this.usersService.findOneEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const channel = req.query.channel;
    const toVerify = channel === 'sms' ? user.phone : user.email;

    const isVerified = await this.verificationService.checkVerification(
      toVerify,
      code,
    );
    if (!isVerified) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersService.updatePassword(user.id, newPassword);
    return { message: 'Password reset successfully' };
  }

  @Version('1')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
