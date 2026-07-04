import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../model/user.model';
import { IUserRepository } from './user.repository.interface';
import { UserMapper } from '../mapper/user.mapper';

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

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const createdUser = await this.db.user.create({ data });

    return UserMapper.toModel(createdUser);
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
