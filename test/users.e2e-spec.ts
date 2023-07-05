import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import { EmailAlreadyTakenException } from '../src/users/exception/email-already-taken.exception';
import { User, UserRole } from '../src/users/entities/user.entity';
import {
  buildAccessToken,
  buildUser,
  getFirstName,
  getId,
} from './utils/user.generate';
import { TransformStringToDate } from '../src/shared/utils/transform-date.utils';
import { UserNotFoundException } from '../src/users/exception';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let listUser: User[];
  let user: User;
  const accessTokenAdmin = buildAccessToken(UserRole.ADMIN);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await app.init();

    listUser = await userRepository.save([
      buildUser({ birthday: TransformStringToDate('19/12/2000') }),
      buildUser({ birthday: TransformStringToDate('19/12/2000') }),
      buildUser({ birthday: TransformStringToDate('19/12/2000') }),
    ]);
    user = listUser[0];
  });

  afterAll(async () => {
    await userRepository.clear();
    app.close();
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const expectedStatus = HttpStatus.OK;

      const actual = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toHaveLength(listUser.length);
    });

    it('should return unathorized error when bearer token is not passed', async () => {
      const expectedStatus = HttpStatus.UNAUTHORIZED;

      const actual = await request(app.getHttpServer()).get('/users');

      expect(actual.status).toEqual(expectedStatus);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return a user searched by id', async () => {
      const expectedStatus = HttpStatus.OK;
      const expectedBody = expect.objectContaining({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      const actual = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toEqual(expectedBody);
      expect(actual.body).not.toHaveProperty('password');
    });

    it('should return an error when user does not exists', async () => {
      const userId = getId({ min: 1, max: 10000 });
      const expectedStatus = HttpStatus.NOT_FOUND;
      const expectedError = new UserNotFoundException({ id: userId });

      const actual = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toEqual(expectedError.getResponse());
    });

    it('should return unathorized error when bearer token is not passed', async () => {
      const expectedStatus = HttpStatus.UNAUTHORIZED;

      const actual = await request(app.getHttpServer()).get(
        `/users/${user.id}`,
      );

      expect(actual.status).toEqual(expectedStatus);
    });
  });

  describe('POST /users', () => {
    const user = buildUser();

    it('should create a new user and return without sensitive info', async () => {
      const expectedStatus = HttpStatus.CREATED;
      const expectedBody = expect.objectContaining({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      const actual = await request(app.getHttpServer())
        .post('/users')
        .send(user);

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toEqual(expectedBody);
      expect(actual.body).not.toHaveProperty('password');
    });

    it("should return an error when user's email already taken", async () => {
      const expectedError = new EmailAlreadyTakenException(user.email);
      const expectedStatus = HttpStatus.CONFLICT;

      const actual = await request(app.getHttpServer())
        .post('/users')
        .send(user);

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toEqual(
        expect.objectContaining(expectedError.getResponse()),
      );
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should update and return a users that exists in the db', async () => {
      const expectedFirstName = getFirstName();
      const expectedStatus = HttpStatus.OK;

      const actual = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({ firstName: expectedFirstName });

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toHaveProperty('firstName', expectedFirstName);
    });

    it('should return an error when user does not exits', async () => {
      const userId = getId({ min: 1, max: 10000 });
      const expectedFirstName = getFirstName();
      const expectedStatus = HttpStatus.NOT_FOUND;
      const expectedError = new UserNotFoundException({ id: userId });

      const actual = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`)
        .send({ firstName: expectedFirstName });

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toEqual(expectedError.getResponse());
    });

    it('should return unathorized error when bearer token is not passed', async () => {
      const expectedStatus = HttpStatus.UNAUTHORIZED;

      const actual = await request(app.getHttpServer()).patch(
        `/users/${user.id}`,
      );

      expect(actual.status).toEqual(expectedStatus);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete and return a users that exists in the db', async () => {
      const expectedStatus = HttpStatus.OK;

      const actual = await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(actual.status).toEqual(expectedStatus);
    });

    it('should return an error when user does not exits', async () => {
      const userId = getId({ min: 1, max: 10000 });
      const expectedStatus = HttpStatus.NOT_FOUND;
      const expectedError = new UserNotFoundException({ id: userId });

      const actual = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessTokenAdmin}`);

      expect(actual.status).toEqual(expectedStatus);
      expect(actual.body).toEqual(expectedError.getResponse());
    });

    it('should return unathorized error when bearer token is not passed', async () => {
      const expectedStatus = HttpStatus.UNAUTHORIZED;

      const actual = await request(app.getHttpServer()).delete(
        `/users/${user.id}`,
      );

      expect(actual.status).toEqual(expectedStatus);
    });
  });
});
