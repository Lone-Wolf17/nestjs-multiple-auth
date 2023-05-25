import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';

type UserFindOptionsWhere = FindOptionsWhere<User> | FindOptionsWhere<User>[];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  /** The Add Select allows us to select fields that are usually Hidden
   * Remember to prefix the field/column with "user."
   */
  async findOne(where: UserFindOptionsWhere, addSelect: string[] = []): Promise<User> {
    return await this.userRepository.createQueryBuilder("user").addSelect(addSelect).
    setFindOptions({
      where,
    }).getOne();
  }

  async findOneOrFail(where: UserFindOptionsWhere): Promise<User> {
    const user = await this.userRepository.findOneBy(where);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(details: CreateUserDto) {
    const newUser = this.userRepository.create(details);
    return await this.userRepository.save(newUser);
  }
}
