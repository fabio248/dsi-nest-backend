import { Entity, Column } from 'typeorm';
import { EntityBase } from './base-entity';

@Entity()
export abstract class Person extends EntityBase {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  birthday: Date;
}
