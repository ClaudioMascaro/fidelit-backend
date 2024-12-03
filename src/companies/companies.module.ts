import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { LcardRule } from './entities/lcard-rules.entity';
import { Company } from './entities/company.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { VerificationModule } from 'src/verification/verification.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Address, LcardRule]),
    UsersModule,
    NotificationsModule,
    VerificationModule,
    PaymentsModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
