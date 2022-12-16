import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import {
  UserDocument,
  UserMongo,
} from '../../../common/types/schemas/schemas.model';
import { BanUserDto } from './dto/banUser.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserMongo.name) private usersModel: Model<UserDocument>,
  ) {}

  async getUsers(
    page: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: SortOrder,
  ) {
    const user = await this.usersModel
      .find(
        {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        },
        {
          passwordHash: false,
          emailConfirmation: false,
          recoveryData: false,
        },
      )
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });
    const total = await this.usersModel.count({
      $or: [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });
    const pages = Math.ceil(total / pageSize);

    const mappedUser = user.map((obj) => {
      return {
        id: obj.id,
        login: obj.login,
        createdAt: obj.createdAt,
        email: obj.email,
        banInfo: {
          banDate: obj.banInfo.banDate,
          banReason: obj.banInfo.banReason,
          isBanned: obj.banInfo.isBanned,
        },
      };
    });
    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: mappedUser,
    };
  }

  async createUser(newUser: UserMongo): Promise<UserMongo> {
    await this.usersModel.create(newUser);
    return this.usersModel.findOne(
      {
        id: newUser.id,
      },
      { 'banInfo._id': 0 },
    );
  }

  async findByLogin(login: string) {
    return this.usersModel
      .findOne({
        login,
      })
      .lean();
  }

  async findById(id: string) {
    return this.usersModel.findOne({ id }).lean();
  }

  async delUser(id: string) {
    const result = await this.usersModel.deleteOne({
      id,
    });
    return result.deletedCount === 1;
  }

  async findByEmail(email: string): Promise<UserMongo> {
    return this.usersModel.findOne({
      email,
    });
  }

  async findByConfirmCode(code: string) {
    return this.usersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async updateConfirm(id: string) {
    const result = await this.usersModel.updateOne(
      { id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async updateConfirmationCode(id: string) {
    return this.usersModel.findOneAndUpdate(
      { id },
      {
        $set: {
          'emailConfirmation.confirmationCode': v4(),
        },
      },
      { returnDocument: 'after' },
    );
  }

  async addToken(id: string, token: string) {
    return this.usersModel.findOneAndUpdate(
      { id },
      {
        $push: { unused: token.toString() },
      },
      { returnDocument: 'after' },
    );
  }

  async updateUserWithRecoveryData(
    id: string,
    recoveryData: {
      recoveryCode: string;
      isConfirmed: boolean;
      expirationDate: any;
    },
  ) {
    await this.usersModel.updateOne(
      { id },
      { $set: { recoveryData: recoveryData } },
    );
    return this.usersModel.findOne({ id });
  }

  async findUserByCode(recoveryCode: string) {
    return this.usersModel.findOne({
      'recoveryData.recoveryCode': recoveryCode,
    });
  }

  async confirmPassword(id: string, generatePassword: string) {
    await this.usersModel.updateOne(
      { id },
      {
        $set: {
          'recoveryData.isConfirmed': true,
          passwordHash: generatePassword,
        },
      },
    );
    return this.usersModel.findOne({ id });
  }

  findUserByToken(refreshToken: string) {
    return this.usersModel.findOne({ unused: refreshToken });
  }

  banUser(userId: string, banInfo: BanUserDto) {
    if (banInfo.isBanned == true) {
      return this.usersModel.updateOne(
        { id: userId },
        {
          $set: {
            'banInfo.isBanned': banInfo.isBanned,
            'banInfo.banReason': banInfo.banReason,
            'banInfo.banDate': new Date(),
          },
        },
      );
    } else {
      return this.usersModel.updateOne(
        { id: userId },
        {
          $set: {
            'banInfo.isBanned': banInfo.isBanned,
            'banInfo.banReason': null,
            'banInfo.banDate': null,
          },
        },
      );
    }
  }

  async getAllUsers() {
    return this.usersModel.find();
  }
}
