import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Version('1')
  @Post()
  async createCard(@Body() createCardDto: CreateCardDto): Promise<object> {
    return this.cardService.createCard(createCardDto);
  }
}
