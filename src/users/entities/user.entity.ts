import { Exclude } from 'class-transformer';
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
  id: number;
  name: string;
  email: string;

  @Exclude({ toPlainOnly: true })
  password: string;
}
