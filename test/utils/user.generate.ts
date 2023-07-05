import { faker } from '@faker-js/faker';
import * as Jwt from 'jsonwebtoken';
import { UserRole } from '../../src/users/entities/user.entity';

export const getId = faker.number.int;
export const getFirstName = faker.person.firstName;
export const getLastName = faker.person.lastName;
export const getEmail = faker.internet.email;
export const getPassword = faker.internet.password;
export const getBirthday = faker.date.birthdate;

export function buildUser({ ...overrides } = {}) {
  return {
    firstName: getFirstName(),
    lastName: getLastName(),
    email: getEmail(),
    password: getPassword(),
    birthday: convertDate(getBirthday().toString()),
    ...overrides,
  };
}

export function buildAccessToken(role: UserRole) {
  return Jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function convertDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-SV');
}
