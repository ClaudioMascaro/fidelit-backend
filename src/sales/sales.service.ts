import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Lcard } from 'src/lcards/entities/lcard.entity';
import { LcardStamp } from 'src/lcards/entities/stamp.entity';
import { LcardRule } from 'src/companies/entities/lcard-rules.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<object> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();

      const company = await queryRunner.manager.findOne(Company, {
        where: { id: createSaleDto.company_id },
      });

      const lcard = await queryRunner.manager.findOne(Lcard, {
        where: {
          id: createSaleDto.lcard_id,
          company_id: createSaleDto.company_id,
        },
        relations: ['user'],
      });

      if (!lcard) {
        throw new BadRequestException('Loyalty card not found');
      }

      const lcardStampsCount = await queryRunner.manager.count(LcardStamp, {
        where: { lcard_id: lcard.id },
      });

      const companyLcardRules = await queryRunner.manager.findOne(LcardRule, {
        where: { id: company.lcard_rules_id },
      });

      if (!companyLcardRules) {
        throw new BadRequestException('Loyalty card rules not found');
      }

      // Create sale
      const sale = new Sale();
      sale.company_id = createSaleDto.company_id;
      sale.user_id = createSaleDto.user_id;
      sale.lcard_id = createSaleDto.lcard_id;
      sale.value = createSaleDto.value;
      sale.created_at = now;
      sale.updated_at = now;

      const createdSale = await queryRunner.manager.save(sale);

      // Update points
      lcard.score += sale.value * companyLcardRules.score_booster;
      lcard.updated_at = now;

      if (lcardStampsCount < companyLcardRules.max_stamps) {
        // Add stamp
        const lcardStamp = new LcardStamp();
        lcardStamp.lcard_id = lcard.id;
        lcardStamp.expires_at = new Date(
          now.getTime() +
            companyLcardRules.stamps_expiration_time * 24 * 60 * 60 * 1000,
        );
        lcardStamp.created_at = now;
        lcardStamp.updated_at = now;

        await queryRunner.manager.save(lcardStamp);
      }

      await queryRunner.manager.save(lcard);

      await queryRunner.commitTransaction();

      // Send notification
      const userPhone = lcard.user.phone;
      const message = `Olá ${lcard.user.name}, você acabou de ganhar ${sale.value * companyLcardRules.score_booster} 
      pontos em seu cartão fidelidade de ${company.name}. Acesse o link do seu cartão para acompanhar seus pontos e carimbos:`;
      await this.notificationsService.sendWhatsAppMessage(
        '+5511985911669',
        message,
      );

      return {
        message: 'Sale created successfully',
        data: createdSale,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
