import { Inject, Injectable } from '@nestjs/common';
import { User } from './domain/model/user.model';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from './domain/types/user.repository.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserMapper } from './infrastructure/mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async findAll() {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserMapper.toResponse(user));
  }

  async findById(userId: string) {
    const user = await this.userRepository.findById(userId);
    return UserMapper.toResponse(user);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findByUsername(username);
    return UserMapper.toResponse(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    return UserMapper.toResponse(user);
  }

  async upsert(dto: CreateUserDto) {
    const userData = new User({
      id: crypto.randomUUID(),
      username: dto.username,
      email: dto.email,
      avatarUrl: dto.avatarUrl,
      role: 'USER',
      provider: dto.provider,
      providerId: dto.providerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await this.userRepository.upsert(userData);

    return UserMapper.toResponse(user);
  }

  async update(userId: string, dto: UpdateUserDto) {
    const updated = await this.userRepository.update(userId, dto);
    return UserMapper.toResponse(updated);
  }

  async delete(userId: string) {
    await this.userRepository.delete(userId);
  }
}
