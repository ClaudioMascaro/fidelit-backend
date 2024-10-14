import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { LcardRule } from './entities/lcard-rules.entity';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UsersService } from 'src/users/users.service';

import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,

    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,

    @InjectRepository(LcardRule)
    private readonly lcardRulesRepository: Repository<LcardRule>,
    private readonly usersService: UsersService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
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

    const { id: addressId } = await this.addressesRepository.save(address);

    const lcardRule = new LcardRule();
    lcardRule.max_stamps = createCompanyDto.lcard_rule.max_stamps;
    lcardRule.stamps_prize = createCompanyDto.lcard_rule.stamps_prize;
    lcardRule.score_goal = createCompanyDto.lcard_rule.score_goal;
    lcardRule.score_goal_prize = createCompanyDto.lcard_rule.score_goal_prize;
    lcardRule.score_booster = createCompanyDto.lcard_rule.score_booster;
    lcardRule.created_at = now;
    lcardRule.updated_at = now;

    const { id: lcardRuleId } = await this.lcardRulesRepository.save(lcardRule);

    const company = new Company();
    company.name = createCompanyDto.name;
    company.description = createCompanyDto.description;
    company.segment = createCompanyDto.segment;
    company.logo = createCompanyDto.logo;
    company.website = createCompanyDto.website;
    company.email = createCompanyDto.email;
    company.phone = createCompanyDto.phone;
    company.cnpj = createCompanyDto.cnpj;
    company.main_address_id = addressId;
    company.lcard_rules_id = lcardRuleId;
    company.created_at = now;
    company.updated_at = now;

    company.plan_id = 1;
    company.subscription_id = 1;
    const createdCompany = await this.companiesRepository.save(company);

    const userDto: CreateUserDto = {
      name: 'Company Admin',
      email: createCompanyDto.email,
      phone: createCompanyDto.phone,
      cnpj: createCompanyDto.cnpj,
      password: createCompanyDto.password,
      role: 'company_admin',
      company_id: createdCompany.id,
    };

    const createdUser = await this.usersService.create(userDto);

    return createdCompany;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
