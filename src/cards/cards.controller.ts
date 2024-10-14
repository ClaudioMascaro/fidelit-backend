import { Body, Controller, Post, UsePipes, Version } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto, createCardSchema } from './dto/create-card.dto';
import { ZodValidationPipe } from 'src/common/validation/pipeline.validation';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  @Version('1')
  @Post()
  @UsePipes(new ZodValidationPipe(createCardSchema))
  async createCard(@Body() createCardDto: CreateCardDto): Promise<object> {
    return this.cardService.createCard(createCardDto);
  }
}
