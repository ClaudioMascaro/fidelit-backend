import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UsePipes,
  Version,
} from '@nestjs/common';
import { LcardsService } from './lcards.service';
import { CreateLcardDto, createLcardSchema } from './dto/create-card.dto';
import { ZodValidationPipe } from 'src/common/validation/pipeline.validation';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('lcards')
export class LcardsController {
  constructor(private readonly lcardService: LcardsService) {}

  @Version('1')
  @Post()
  @Roles(Role.CompanyAdmin, Role.CompanyUser)
  @UsePipes(new ZodValidationPipe(createLcardSchema))
  async createLcard(
    @Body() createLcardDto: CreateLcardDto,
    @Request() req,
  ): Promise<object> {
    createLcardDto.company_id = req.user.company;
    return this.lcardService.createLcard(createLcardDto);
  }

  @Version('1')
  @Get()
  @Roles(Role.CompanyAdmin, Role.CompanyUser)
  async getCards(@Request() req): Promise<object> {
    return this.lcardService.listLcards(req.user.company);
  }

  @Version('1')
  @Get(':id')
  @Roles(Role.CompanyAdmin, Role.CompanyUser)
  async getCard(@Request() req, @Param('id') id: number): Promise<object> {
    const company_id = req.user.company;
    return this.lcardService.getLcard(id, company_id);
  }
}
