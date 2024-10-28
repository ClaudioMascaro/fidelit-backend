import {
  Body,
  Controller,
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
  async createCard(
    @Body() createLcardDto: CreateLcardDto,
    @Request() req,
  ): Promise<object> {
    createLcardDto.company_id = req.user.company;
    return this.lcardService.createLcard(createLcardDto);
  }
}
