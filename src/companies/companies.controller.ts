import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UsePipes,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  CreateCompanyDto,
  createCompanySchema,
} from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ZodValidationPipe } from 'src/common/validation/pipeline.validation';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Version('1')
  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createCompanySchema))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Version('1')
  @Public()
  @Post('verify')
  async verifyCompany(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    const isVerified = await this.companiesService.verifyCompany(email, code);
    if (!isVerified) {
      throw new BadRequestException('Verification failed');
    }
    return { message: 'Company verified successfully' };
  }

  @Version('1')
  @Patch(':id')
  @Roles(Role.CompanyAdmin)
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req,
  ) {
    const companyId = req.user.company;
    if (companyId !== +id) {
      throw new NotFoundException();
    }
    return this.companiesService.update(companyId, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
