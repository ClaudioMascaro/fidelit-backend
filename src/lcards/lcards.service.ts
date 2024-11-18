import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateLcardDto } from './dto/create-card.dto';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/enums/role.enum';
import { Lcard } from './entities/lcard.entity';
import { LcardStamp } from './entities/stamp.entity';
import { LcardRule } from 'src/companies/entities/lcard-rules.entity';
import { Company } from 'src/companies/entities/company.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class LcardsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
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

      // Send notification
      const message =
        `Olá ${user.name}, seu cartão de fidelidade de ${company.name} acaba de ser criado!` +
        `\n\nAcesse o link abaixo para acompanhar e ficar ligado nas recompensas que você pode ganhar:` +
        `\n\nhttps://google.com.br`;
      await this.notificationsService.sendWhatsAppMessage(user.phone, message);

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

  async listLcards(company_id: number): Promise<object> {
    try {
      const lcardsWithDetails = await this.dataSource.manager
        .createQueryBuilder(Lcard, 'lcard')
        .leftJoinAndSelect('lcard.user', 'user')
        .leftJoinAndSelect('lcard.stamps', 'stamps')
        .where('lcard.company_id = :company_id', { company_id })
        .select([
          'lcard.id',
          'lcard.company_id',
          'lcard.score',
          'lcard.score_expires_at',
          'lcard.created_at',
          'lcard.updated_at',
          'user.id',
          'user.name',
          'user.email',
          'user.phone',
          'user.cpf',
          'user.birthday',
          'user.created_at',
          'user.updated_at',
          'stamps.id',
          'stamps.expires_at',
          'stamps.created_at',
          'stamps.updated_at',
        ])
        .getMany();

      return {
        message: 'Cards listed successfully',
        data: lcardsWithDetails,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getLcard(id: number, company_id: number): Promise<object> {
    try {
      const lcardWithDetails = await this.dataSource.manager
        .createQueryBuilder(Lcard, 'lcard')
        .leftJoinAndSelect('lcard.user', 'user')
        .leftJoinAndSelect('lcard.stamps', 'stamps')
        .where('lcard.id = :id', { id })
        .andWhere('lcard.company_id = :company_id', { company_id })
        .select([
          'lcard.id',
          'lcard.company_id',
          'lcard.score',
          'lcard.score_expires_at',
          'lcard.created_at',
          'lcard.updated_at',
          'user.id',
          'user.name',
          'user.email',
          'user.phone',
          'user.cpf',
          'user.birthday',
          'user.created_at',
          'user.updated_at',
          'stamps.id',
          'stamps.expires_at',
          'stamps.created_at',
          'stamps.updated_at',
        ])
        .getOne();

      return {
        message: 'Card retrieved successfully',
        data: lcardWithDetails,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
