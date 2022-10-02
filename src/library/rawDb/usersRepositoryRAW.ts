import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User, UserAccount } from '../../common/types/classes/classes';

@Injectable()
export class UsersRepositoryRAW {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUsers(page: number, pageSize: number) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "users"
    OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY`,
      [(page - 1) * pageSize, pageSize],
    );
    const total = await this.dataSource.query(`SELECT COUNT(*) FROM "users"`);
    const pages = Math.ceil(total / pageSize);

    return {
      pagesCount: pages,
      page: page,
      pageSize: pageSize,
      totalCount: parseInt(total[0].count),
      items: user,
    };
  }

  async createUser(newUser: UserAccount): Promise<User> {
    await this.dataSource.query(`
    INSERT INTO "users"`);
    const user = await this.dataSource.query(
      `
    SELECT * FROM "users"
    WHERE "login" LIKE $1`,
      [newUser.login],
    );
    return user[0];
  }

  async findByLogin(login: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "users"
    WHERE "login" LIKE $1`,
      ['%' + login + '%'],
    );
    return user[0];
  }

  async findById(id: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "users"
    WHERE "id" LIKE $1`,
      [id],
    );
    return user[0];
  }

  async delUser(id: string) {
    return await this.dataSource.query(
      `DELETE FROM "users"
              WHERE "id" = $1`,
      [id],
    );
  }

  async findByEmail(email: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "users"
    WHERE "email" LIKE $1`,
      ['%' + email + '%'],
    );
    return user[0];
  }

  async findByConfirmCode(code: string) {
    const user = await this.dataSource.query(
      `
    SELECT * FROM "users"
    WHERE "code" LIKE $1`,
      ['%' + code + '%'],
    );
    return user[0];
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
