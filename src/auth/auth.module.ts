import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { CompaniesModule } from 'src/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { VerificationService } from 'src/verification/verification.service';

@Module({
  imports: [
    CompaniesModule,
    UsersModule,
    TypeOrmModule.forFeature([Company]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: await configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: await configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    VerificationService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
