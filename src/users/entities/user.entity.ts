import { Task } from '../../tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @OneToMany(() => Task, (task) => task.author)
  task: Task[];
}
