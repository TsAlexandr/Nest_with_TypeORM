import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserAccount } from '../../common/types/classes/classes';
import { UserEntity } from '../../features/sa/users/entities/user.entity';

@Injectable()
export class UsersRepositoryORM {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUsers(page: number, pageSize: number) {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .getMany();
    const total = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .getCount();
    const pages = Math.ceil(total / pageSize);

    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: total,
      items: user,
    };
  }

  async createUser(newUser: UserAccount) {
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          id: newUser.id,
          email: newUser.email,
          login: newUser.login,
          passwordHash: newUser.passwordHash,
          createdAt: newUser.createdAt,
        },
      ])
      .execute();
  }

  async findByLogin(login: string) {
    return this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .where('login like :login', { login: `%${login}%` })
      .getOne();
  }

  async findById(id: string) {
    return this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
  }

  async delUser(id: string) {
    return this.dataSource
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('id = :id', { id })
      .execute();
  }

  async findByEmail(email: string) {
    return this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .where('email like :email', { email: `%${email}%` })
      .getOne();
  }

  async findByConfirmCode(code: string) {
    return this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .where('code like :code', { code: `%${code}%` })
      .getOne();
  }

  async updateConfirm(id: string) {
    return;
  }

  async updateConfirmationCode(id: string) {
    return;
  }

  async addToken(id: string, token: string) {
    return;
  }
}
