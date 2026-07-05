import { type User } from '../model/user.model';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(userId: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByEmail(email: string): Promise<User>;

  upsert(user: User): Promise<User>;
  update(userId: string, user: Partial<User>): Promise<User>;

  delete(userId: string): Promise<void>;
}
