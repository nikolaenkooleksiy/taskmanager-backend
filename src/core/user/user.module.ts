import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/types/user.repository.interface';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY, UserService],
})
export class UserModule {}
