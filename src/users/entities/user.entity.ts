import { Column, Entity } from 'typeorm';
import { Person } from '../../shared/entities/person.entity';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity()
export class User extends Person {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  direction?: string;

  @Column({ length: 10, nullable: true })
  dui?: string;

  @Column()
  password: string;

  @Column({ name: 'recorvery_token', nullable: true })
  recoveryToken?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role?: UserRole;

  //   @OneToMany(() => Pet, (pet) => pet.user, { cascade: true })
  //   pet: Pet[];

  //   @OneToMany(() => Appointment, (appointment) => appointment.client)
  //   appointments: Appointment[];
}
