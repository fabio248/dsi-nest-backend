import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Specie } from '../../species/entities/species.entity';
import { EntityBase } from '../../shared/entities/base-entity';

export enum Gender {
  M = 'macho',
  F = 'hembra',
}
@Entity('pet')
export class Pet extends EntityBase {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  raza: string;

  @Column()
  color: string;

  @Column({ name: 'is_have_tatto' })
  isHaveTatto: boolean;

  @Column()
  pedigree: boolean;

  @Column()
  birthday: Date;

  //   @OneToOne(() => MedicalHistory, (medicalHistory) => medicalHistory.pet, {
  //     cascade: true,
  //   })
  //   @JoinColumn({ referencedColumnName: 'id', name: 'medical_history_id' })
  //   medicalHistory: MedicalHistory;

  @ManyToOne(() => Specie, (specie) => specie.pet)
  @JoinColumn({ referencedColumnName: 'id', name: 'specie_id' })
  specie: Specie;

  @ManyToOne(() => User, (user) => user.pet)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: User;
}
