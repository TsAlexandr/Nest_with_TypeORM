import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { IBlogsRepository } from '../interfaces/IBlogsRepository';

@ValidatorConstraint({ name: 'blogId', async: true })
@Injectable()
export class BlogIdValidation implements ValidatorConstraintInterface {
  constructor(private blogsRepository: IBlogsRepository) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const blogId = await this.blogsRepository.getBloggersById(value);
    if (!blogId) return false;
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Blog doesn't exist";
  }
}
