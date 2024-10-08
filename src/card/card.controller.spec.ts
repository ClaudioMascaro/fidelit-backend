import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';

describe('CardController', () => {
  let cardController: CardController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [CardService],
    }).compile();

    cardController = app.get<CardController>(CardController);
  });

  describe('createCard', () => {
    it('should return "Card created!"', async () => {
      const createCardDto = {
        name: 'John Doe',
        email: 'johndoe.24@gmail.com',
        phone: '1234567890',
      };

      const expectedResponse = {
        success: true,
        message: 'Card created!',
        data: createCardDto,
      };

      expect(await cardController.createCard(createCardDto)).toEqual(
        expectedResponse,
      );
    });
  });
});
