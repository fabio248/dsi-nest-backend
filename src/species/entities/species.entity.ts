import { Column, Entity, OneToMany } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { EntityBase } from '../../shared/entities/base-entity';

@Entity()
export class Specie extends EntityBase {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Pet, (pet) => pet.specie)
  pet: Pet[];
}
