import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;

describe("Authenticate User Controller Tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate", async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: "Vinicyus",
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    expect(response.body).toHaveProperty('token');
  });

  it("Shouldn't be able to authenticate with non existent user ", async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "wrong-email@gmail.com",
        password: "admin"
      }
    );

    expect(response.status).toBe(401);
  });

  it("Shouldn't be able to authenticate with wrong password ", async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "vinicyuss@gmail.com",
        password: "wrong-password"
      }
    );

    expect(response.status).toBe(401);
  });
})
