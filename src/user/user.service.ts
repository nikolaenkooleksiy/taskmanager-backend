import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from './repository/user.repository.interface';
import { UserMapper } from './mapper/user.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './model/user.model';

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
