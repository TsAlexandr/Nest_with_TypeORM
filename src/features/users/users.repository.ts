import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../common/types/classes/classes';
import { EmailInputDto } from '../auth/dto/emailInput.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('Users') private usersModel) {}

  async getUsers(page: number, pageSize: number) {
    const user = await this.usersModel
      .find({}, { _id: 0, passwordHash: false, 'banInfo._id': 0, __v: 0 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const total = await this.usersModel.countDocuments({});
    const pages = Math.ceil(total / pageSize);

    const mappedUser = user.map((obj) => {
      return {
        id: obj.accountData.id,
        login: obj.accountData.login,
        createdAt: obj.accountData.createdAt,
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

  async createUser(newUser: User): Promise<User> {
    await this.usersModel.create(newUser);
    const isCreated = await this.usersModel.findOne({
      'accountData.id': newUser.accountData.id,
    });
    return isCreated;
  }

  async findByLogin(login: string) {
    const user = await this.usersModel
      .findOne({
        'accountData.login': login,
      })
      .lean();
    return user;
  }

  async findById(id: string) {
    const user = await this.usersModel.findOne({ 'accountData.id': id }).lean();
    return user;
  }

  async delUser(id: string) {
    const result = await this.usersModel.deleteOne({
      'accountData.id': id,
    });
    return result.deletedCount === 1;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({
      'accountData.email': email,
    });
    return user;
  }

  async findByConfirmCode(code: string) {
    const user = await this.usersModel.findOne({
      'emailConfirm.confirmationCode': code,
    });
    return user;
  }

  async updateConfirm(id: string) {
    const result = await this.usersModel.updateOne(
      { 'accountData.id': id },
      { $set: { 'emailConfirm.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async updateConfirmationCode(id: string) {
    const updatedUser = await this.usersModel.findOneAndUpdate(
      { 'accountData.id': id },
      {
        $set: {
          'emailConfirm.confirmationCode': v4(),
        },
      },
      { returnDocument: 'after' },
    );
    return updatedUser;
  }

  async addToken(id: string, token: string) {
    const updatedUser = await this.usersModel.findOneAndUpdate(
      { 'accountData.id': id },
      {
        $push: { 'accountData.unused': token.toString() },
      },
      { returnDocument: 'after' },
    );
    return updatedUser;
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
      { 'accountData.id': id },
      { $set: { recoveryData: recoveryData } },
    );
    return this.usersModel.findOne({ 'accountData.id': id });
  }

  async findUserByCode(recoveryCode: string) {
    const user = await this.usersModel.findOne({
      'recoveryData.recoveryCode': recoveryCode,
    });
    return user;
  }

  async confirmPassword(id: string, generatePassword: string) {
    await this.usersModel.updateOne(
      { 'accountData.id': id },
      {
        $set: {
          'recoveryData.isConfirmed': true,
          'accountData.passwordHash': generatePassword,
        },
      },
    );
    return this.usersModel.findOne({ 'accountData.id': id });
  }
}
