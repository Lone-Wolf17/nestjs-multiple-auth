import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDetails } from 'src/auth/utils/types';

@Injectable()
export class UsersService {
  private users: User[] = [
    new User({
      id: 0,
      name: 'Bob',
      email: 'bob@gmail.com',
      password: 'bobPass',
    }),

    new User({
      id: 1,
      name: 'John',
      email: 'john@gmail.com',
      password: 'johnPass',
    }),

    new User({
      id: 2,
      name: 'Gary',
      email: 'gary@gmail.com',
      password: 'garyPass',
    }),
  ];

  findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    return Promise.resolve(user);
  }

  findOne(id: number): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);
    return Promise.resolve(user);
  }

  createUser(details: UserDetails) {
    const newUser = new User({
      id: this.users.length,
      email: details.email,
      name: details.name,
      password: details.name.split(' ')[0].toLowerCase() + 'Pass',
    });
    this.users.push(newUser);
    return newUser;
  }
}
