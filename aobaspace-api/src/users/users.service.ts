import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // In a real app, hash password before saving
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOrCreateBySso(ssoProvider: string, ssoId: string): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { ssoProvider, ssoId } });
    if (!user) {
      // Create a new user if not found
      user = this.usersRepository.create({
        username: `${ssoProvider}_${ssoId}`, // Example username
        email: `${ssoId}@${ssoProvider}.com`, // Placeholder email
        ssoProvider,
        ssoId,
        // Assign default roles, etc.
      });
      await this.usersRepository.save(user);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}