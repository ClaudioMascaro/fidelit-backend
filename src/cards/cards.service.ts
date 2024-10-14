import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
  async createCard(createCardDto: CreateCardDto): Promise<object> {
    return {
      message: 'Card created!',
      data: createCardDto,
    };
  }
}
