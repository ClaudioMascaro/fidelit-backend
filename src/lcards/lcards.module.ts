import { Module } from '@nestjs/common';
import { LcardsController } from './lcards.controller';
import { LcardsService } from './lcards.service';
import { Company } from 'src/companies/entities/company.entity';
import { Lcard } from './entities/lcard.entity';
import { LcardRule } from 'src/companies/entities/lcard-rules.entity';
import { LcardStamp } from './entities/stamp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Lcard, LcardRule, LcardStamp]),
    UsersModule,
  ],
  controllers: [LcardsController],
  providers: [LcardsService],
})
export class LcardsModule {}
