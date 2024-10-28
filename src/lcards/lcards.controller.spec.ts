import { Test, TestingModule } from '@nestjs/testing';
import { LcardsController } from './lcards.controller';
import { LcardsService } from './lcards.service';

describe('LcardController', () => {
  let lcardsController: LcardsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LcardsController],
      providers: [LcardsService],
    }).compile();

    lcardsController = app.get<LcardsController>(LcardsController);
  });

  describe('createCard', () => {
    it('should return "Card created!"', async () => {
      const createCardDto = {
        name: 'John Doe',
        email: 'johndoe.24@gmail.com',
        phone: '1234567890',
        startingPoints: 0,
        startingStamps: 0,
      };

      const expectedResponse = {
        message: 'Card created!',
        data: createCardDto,
      };

      expect(await lcardsController.createCard(createCardDto)).toEqual(
        expectedResponse,
      );
    });
  });
});
