import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Address } from './entities/address.entity';
import { LcardRule } from './entities/lcard-rules.entity';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { Role } from 'src/auth/enums/role.enum';
import { VerificationService } from 'src/verification/verification.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Lcard } from 'src/lcards/entities/lcard.entity';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly verificationService: VerificationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();

      const address = new Address();
      address.street = createCompanyDto.address.street;
      address.number = createCompanyDto.address.number;
      address.additional = createCompanyDto.address.additional;
      address.neighborhood = createCompanyDto.address.neighborhood;
      address.city = createCompanyDto.address.city;
      address.state = createCompanyDto.address.state;
      address.zip = createCompanyDto.address.zip;
      address.country = createCompanyDto.address.country;
      address.created_at = now;
      address.updated_at = now;

      const createdAddress = await queryRunner.manager.save(address);

      const lcardRule = new LcardRule();
      lcardRule.max_stamps = createCompanyDto.lcard_rule.max_stamps;
      lcardRule.stamps_prize = createCompanyDto.lcard_rule.stamps_prize;
      lcardRule.score_goal = createCompanyDto.lcard_rule.score_goal;
      lcardRule.score_goal_prize = createCompanyDto.lcard_rule.score_goal_prize;
      lcardRule.score_booster = createCompanyDto.lcard_rule.score_booster;
      lcardRule.stamps_expiration_time =
        createCompanyDto.lcard_rule.stamps_expiration_time;
      lcardRule.score_expiration_time =
        createCompanyDto.lcard_rule.score_expiration_time;
      lcardRule.created_at = now;
      lcardRule.updated_at = now;

      const createdLcardRule = await queryRunner.manager.save(lcardRule);

      const company = new Company();
      company.name = createCompanyDto.name;
      company.description = createCompanyDto.description;
      company.segment = createCompanyDto.segment;
      company.logo = createCompanyDto.logo;
      company.website = createCompanyDto.website;
      company.email = createCompanyDto.email;
      company.phone = createCompanyDto.phone;
      company.cnpj = createCompanyDto.cnpj;
      company.main_address_id = createdAddress.id;
      company.lcard_rules_id = createdLcardRule.id;
      company.created_at = now;
      company.updated_at = now;
      company.plan_id = 1;
      company.subscription_id = 1;
      company.verified = false;

      const createdCompany = await queryRunner.manager.save(company);

      const userDto: CreateUserDto = {
        name: 'Company Admin',
        email: createCompanyDto.email,
        phone: createCompanyDto.phone,
        cnpj: createCompanyDto.cnpj,
        password: createCompanyDto.password,
        role: Role.CompanyAdmin,
        company_id: createdCompany.id,
      };

      const createdUser = await this.usersService.create(userDto);

      await queryRunner.commitTransaction();

      // Send verification
      await this.verificationService.sendVerification(
        createdCompany.email,
        'email',
      );

      return {
        message: 'Please verify your email to activate your account',
        data: {
          ...createdCompany,
          user: createdUser,
          address: createdAddress,
          lcard_rule: createdLcardRule,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async verifyCompany(email: string, code: string): Promise<boolean> {
    const verified = await this.verificationService.checkVerification(
      email,
      code,
    );
    if (verified) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const company = await queryRunner.manager.findOne(Company, {
          where: { email },
        });

        if (company) {
          company.verified = true;
          await queryRunner.manager.save(company);

          await queryRunner.commitTransaction();
          return true;
        }
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw new BadRequestException(err.message);
      } finally {
        await queryRunner.release();
      }
    }
  }

  async createUser(createCompanyUser: CreateUserDto) {
    const userDto: CreateUserDto = {
      name: createCompanyUser.name,
      password: createCompanyUser.password,
      email: createCompanyUser.email,
      phone: createCompanyUser.phone,
      cpf: createCompanyUser.cpf,
      company_id: createCompanyUser.company_id,
      birthday: createCompanyUser.birthday,
      role: Role.CompanyUser,
    };

    return await this.usersService.create(userDto);
  }

  async resendVerificationCode(email: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const company = await queryRunner.manager.findOne(Company, {
      where: { email },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return await this.verificationService.sendVerification(email, 'email');
  }

  findAll() {
    return `This action returns all companies`;
  }

  async findOne(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner.manager.findOne(Company, {
      where: { id },
      relations: ['address', 'lcard_rule'],
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const company = await queryRunner.manager.findOne(Company, {
        where: { id },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const now = new Date();

      if (updateCompanyDto.address) {
        const address = await queryRunner.manager.findOne(Address, {
          where: { id: company.main_address_id },
        });

        if (address) {
          address.street = updateCompanyDto.address.street || address.street;
          address.number = updateCompanyDto.address.number || address.number;
          address.additional =
            updateCompanyDto.address.additional || address.additional;
          address.neighborhood =
            updateCompanyDto.address.neighborhood || address.neighborhood;
          address.city = updateCompanyDto.address.city || address.city;
          address.state = updateCompanyDto.address.state || address.state;
          address.zip = updateCompanyDto.address.zip || address.zip;
          address.country = updateCompanyDto.address.country || address.country;
          address.updated_at = now;

          await queryRunner.manager.save(address);
        }
      }

      if (updateCompanyDto.lcard_rule) {
        const lcardRule = await queryRunner.manager.findOne(LcardRule, {
          where: { id: company.lcard_rules_id },
        });

        if (lcardRule) {
          const oldScoreBooster = lcardRule.score_booster;

          lcardRule.max_stamps =
            updateCompanyDto.lcard_rule.max_stamps || lcardRule.max_stamps;
          lcardRule.stamps_prize =
            updateCompanyDto.lcard_rule.stamps_prize || lcardRule.stamps_prize;
          lcardRule.score_goal =
            updateCompanyDto.lcard_rule.score_goal || lcardRule.score_goal;
          lcardRule.score_goal_prize =
            updateCompanyDto.lcard_rule.score_goal_prize ||
            lcardRule.score_goal_prize;
          lcardRule.score_booster =
            updateCompanyDto.lcard_rule.score_booster ||
            lcardRule.score_booster;
          lcardRule.stamps_expiration_time =
            updateCompanyDto.lcard_rule.stamps_expiration_time ||
            lcardRule.stamps_expiration_time;
          lcardRule.score_expiration_time =
            updateCompanyDto.lcard_rule.score_expiration_time ||
            lcardRule.score_expiration_time;
          lcardRule.updated_at = now;

          await queryRunner.manager.save(lcardRule);

          if (
            oldScoreBooster < lcardRule.score_booster ||
            lcardRule.score_booster > 1
          ) {
            const lcards = await queryRunner.manager.find(Lcard, {
              where: { company_id: company.id },
              relations: ['user'],
            });

            for (const lcard of lcards) {
              const message =
                `Olá ${lcard.user.name},\n\n` +
                `${company.name} está oferecendo um novo multiplicador de pontos ` +
                `para suas compras! Agora, você ganhará ${lcardRule.score_booster}x mais pontos ` +
                `em cada compra realizada.\n\n` +
                `Aproveite essa oportunidade para acumular mais pontos e desfrutar dos benefícios ` +
                `de fidelidade que preparamos para você.\n\n` +
                `Acesse o link do seu cartão para ver as recompensas e acompanhar seus pontos e carimbos: ` +
                `https://google.com.br\n\n`;
              await this.notificationsService.sendWhatsAppMessage(
                lcard.user.phone,
                message,
              );
            }
          }

          if (
            oldScoreBooster > lcardRule.score_booster &&
            lcardRule.score_booster === 1
          ) {
            const lcards = await queryRunner.manager.find(Lcard, {
              where: { company_id: company.id },
              relations: ['user'],
            });

            for (const lcard of lcards) {
              const message =
                `Olá ${lcard.user.name},\n\n` +
                `A promoção de multiplicação de pontos de ${company.name} se encerrou. \n\n` +
                `Fique ligado para novas promoções e oportunidades de acumular mais pontos!` +
                `\n\nAcesse o link do seu cartão para ver as recompensas e acompanhar ` +
                `seus pontos e carimbos: \n\nhttps://google.com.br`;
              await this.notificationsService.sendWhatsAppMessage(
                lcard.user.phone,
                message,
              );
            }
          }
        }
      }

      company.name = updateCompanyDto.name || company.name;
      company.description = updateCompanyDto.description || company.description;
      company.segment = updateCompanyDto.segment || company.segment;
      company.logo = updateCompanyDto.logo || company.logo;
      company.website = updateCompanyDto.website || company.website;
      company.email = updateCompanyDto.email || company.email;
      company.phone = updateCompanyDto.phone || company.phone;
      company.cnpj = updateCompanyDto.cnpj || company.cnpj;
      company.updated_at = now;

      const updatedCompany = await queryRunner.manager.save(company);

      await queryRunner.commitTransaction();

      return {
        ...updatedCompany,
        address: await queryRunner.manager.findOne(Address, {
          where: { id: updatedCompany.main_address_id },
        }),
        lcard_rule: await queryRunner.manager.findOne(LcardRule, {
          where: { id: updatedCompany.lcard_rules_id },
        }),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const company = await queryRunner.manager.findOne(Company, {
        where: { id },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      await queryRunner.manager.remove(company);

      await queryRunner.commitTransaction();

      return { message: 'Company removed successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
