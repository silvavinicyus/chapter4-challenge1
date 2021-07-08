import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;

describe("Get Statement Controller Tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create statement deposit", async () => {
    const user = await request(app)
      .post('/api/v1/users')
      .send({
        name: "Vinicyus",
        email: "vinicyuss@gmail.com",
        password: "admin"
    });

    const session = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    const {token} = session.body;

    const statement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 150,
        description: "deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      }
    );

    expect(statement.body).toHaveProperty('id');
    expect(statement.status).toBe(201);
  });

  it("Should be able to create statement withdraw", async () => {
    const user = await request(app)
      .post('/api/v1/users')
      .send({
        name: "Vinicyus",
        email: "vinicyuss@gmail.com",
        password: "admin"
    });

    const session = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    const {token} = session.body;

    const statement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 250,
        description: "deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      }
    );

    const withdraw = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: "withdraw"
      })
      .set({
        Authorization: `Bearer ${token}`
      }
    );

    expect(withdraw.body).toHaveProperty('id');
    expect(withdraw.status).toBe(201);
  });
});
