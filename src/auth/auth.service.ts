import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, cpf, phone, password } = signInDto;

    if (!email && !cpf && !phone) {
      throw new UnauthorizedException(
        'At least one of the identification credentials must be provided',
      );
    }

    let user: User;

    if (email) {
      user = await this.usersService.findOneEmail(email);
    }

    if (cpf) {
      user = await this.usersService.findOneCpf(cpf);
    }

    if (phone) {
      user = await this.usersService.findOnePhone(phone);
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = this.usersService.compare({
      passwordHash: user.password,
      passwordSalt: user.salt,
      password,
    });

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      company: user.company_id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
