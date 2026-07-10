import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { type IUserRepository } from '../../domain/types/user.repository.interface';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly db: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.db.user.findMany();

    return users.map((user) => UserMapper.toModel(user));
  }

  async findById(userId: string): Promise<User> {
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
    });

    return UserMapper.toModel(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.db.user.findUniqueOrThrow({
      where: { username },
    });

    return UserMapper.toModel(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.db.user.findUniqueOrThrow({
      where: { email },
    });

    return UserMapper.toModel(user);
  }

  async upsert(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const userData = await this.db.user.upsert({
      where: { providerId: user.providerId },
      create: data,
      update: data,
    });

    return UserMapper.toModel(userData);
  }

  async update(userId: string, user: Partial<User>): Promise<User> {
    const updated = await this.db.user.update({
      where: { id: userId },
      data: user,
    });
    return UserMapper.toModel(updated);
  }

  async delete(userId: string): Promise<void> {
    await this.db.user.delete({ where: { id: userId } });
  }
}
