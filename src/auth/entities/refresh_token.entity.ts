import { IsNotEmpty } from 'class-validator';
import {sign} from 'jsonwebtoken';
import EnvVars from 'src/constants/EnvVars';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
class RefreshToken {
  constructor(init?: Partial<RefreshToken>) {
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  userId: string;

  @Column()
  @IsNotEmpty()
  userAgent: string;

  @Column()
  @IsNotEmpty()
  ipAddress: string;

  sign(): string {
    return sign({ ...this }, EnvVars.RefreshSecret);
  }
}

export default RefreshToken;