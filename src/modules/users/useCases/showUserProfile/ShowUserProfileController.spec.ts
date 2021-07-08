import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';
import { v4 as uuidv4 } from 'uuid';
// import { hash } from 'bcrypt';

let connection: Connection;

describe("Show User Profile Controller Tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show profile", async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: "admin",
        email: "admin@rentx.com.br",
        password: "admin"
      });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "admin@rentx.com.br",
        password: "admin"
      }
    );

    const {token} = response.body;

    const user = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`
    });

    expect(user.body).toHaveProperty('id');
  });
});
