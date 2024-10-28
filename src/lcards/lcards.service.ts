import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLcardDto } from './dto/create-card.dto';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';
import { Lcard } from './entities/lcard.entity';
import { LcardStamp } from './entities/stamp.entity';
import { LcardRule } from 'src/companies/entities/lcard-rules.entity';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class LcardsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async createLcard(createLcardDto: CreateLcardDto): Promise<object> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();

      let user: User;

      const company = await queryRunner.manager.findOne(Company, {
        where: { id: createLcardDto.company_id },
      });

      const companyLcardRules = await queryRunner.manager.findOne(LcardRule, {
        where: { id: company.lcard_rules_id },
      });

      user = await this.usersService.findOneEmail(createLcardDto.email);
      if (!user) {
        const newUser = new User();

        newUser.name = createLcardDto.name;
        newUser.email = createLcardDto.email;
        newUser.phone = createLcardDto.phone;
        newUser.cpf = createLcardDto.cpf;
        newUser.company_id = createLcardDto.company_id;
        newUser.birthday = new Date(createLcardDto.birthday);
        newUser.role = Role.CardHolder;
        newUser.created_at = now;
        newUser.updated_at = now;

        user = await queryRunner.manager.save(newUser);
      }

      const lcard = new Lcard();

      lcard.company_id = createLcardDto.company_id;
      lcard.user_id = user.id;
      lcard.score = createLcardDto.startingPoints;
      lcard.score_expires_at = new Date(
        now.getTime() +
          companyLcardRules.score_expiration_time * 24 * 60 * 60 * 1000,
      );
      lcard.created_at = now;
      lcard.updated_at = now;

      const createdLcard = await queryRunner.manager.save(lcard);

      const stamps = [];

      for (let i = 0; i < createLcardDto.startingStamps; i++) {
        const lcardStamp = new LcardStamp();
        lcardStamp.lcard_id = createdLcard.id;
        lcardStamp.expires_at = new Date(
          now.getTime() +
            companyLcardRules.stamps_expiration_time * 24 * 60 * 60 * 1000,
        );
        lcardStamp.created_at = now;
        lcardStamp.updated_at = now;

        await queryRunner.manager.save(lcardStamp);

        stamps.push(lcardStamp);
      }

      await queryRunner.commitTransaction();

      const createdLcardResponse = {
        ...createdLcard,
        user: user,
        stamps,
      };

      return {
        message: 'Card created successfully',
        data: createdLcardResponse,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
