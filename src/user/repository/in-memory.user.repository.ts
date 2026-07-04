import { User } from '../model/user.model';
import { IUserRepository } from './user.repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  private users = new Map<string, User>();

  findAll(): Promise<User[]> {
    return Promise.resolve(Array.from(this.users.values()));
  }

  findById(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) return Promise.reject(new Error('User not found'));
    return Promise.resolve(user);
  }

  findByUsername(username: string): Promise<User> {
    const user = Array.from(this.users.values()).find(
      (u) => u.username === username,
    );
    if (!user) return Promise.reject(new Error('User not found'));
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    if (!user) return Promise.reject(new Error('User not found'));
    return Promise.resolve(user);
  }

  create(user: User): Promise<User> {
    const newUser = new User({ ...user, id: crypto.randomUUID() });
    this.users.set(newUser.id, newUser);
    return Promise.resolve(newUser);
  }

  update(userId: string, user: Partial<User>): Promise<User> {
    const existing = this.users.get(userId);
    if (!existing) return Promise.reject(new Error('User not found'));
    const updated = new User({ ...existing, ...user });
    this.users.set(userId, updated);
    return Promise.resolve(updated);
  }

  delete(userId: string): Promise<void> {
    if (!this.users.has(userId))
      return Promise.reject(new Error('User not found'));
    this.users.delete(userId);
    return Promise.resolve();
  }
}
