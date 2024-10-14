import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

describe('CardController', () => {
  let cardsController: CardsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService],
    }).compile();

    cardsController = app.get<CardsController>(CardsController);
  });

  describe('createCard', () => {
    it('should return "Card created!"', async () => {
      const createCardDto = {
        name: 'John Doe',
        email: 'johndoe.24@gmail.com',
        phone: '1234567890',
        startingPoints: 0,
        startingStamps: 0,
        stampsCap: 10,
      };

      const expectedResponse = {
        message: 'Card created!',
        data: createCardDto,
      };

      expect(await cardsController.createCard(createCardDto)).toEqual(
        expectedResponse,
      );
    });
  });
});
