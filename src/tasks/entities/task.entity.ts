import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  done: boolean;

  @ManyToOne(() => User)
  readonly author: User;
}
