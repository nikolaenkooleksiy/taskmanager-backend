import { Prisma, User as PrismaUser } from '@prisma/client';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../model/user.model';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  static toModel(user: PrismaUser): User {
    return new User(user);
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      email: user.email,
      role: user.role,
      provider: user.provider,
      providerId: user.providerId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
