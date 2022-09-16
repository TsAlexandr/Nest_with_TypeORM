import { Test, TestingModule } from '@nestjs/testing';
import { BloggersController } from './bloggers.controller';

describe('BloggersController', () => {
  let controller: BloggersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BloggersController],
      providers: [],
    }).compile();

    controller = module.get<BloggersController>(BloggersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
