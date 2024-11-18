import {
  Controller,
  Post,
  Body,
  UsePipes,
  Request,
  Version,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, createSaleSchema } from './dto/create-sale.dto';
import { ZodValidationPipe } from 'src/common/validation/pipeline.validation';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Version('1')
  @Post()
  @Roles(Role.CompanyAdmin, Role.CompanyUser)
  @UsePipes(new ZodValidationPipe(createSaleSchema))
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @Request() req,
  ): Promise<object> {
    createSaleDto.company_id = req.user.company;
    return this.salesService.create(createSaleDto);
  }
}
