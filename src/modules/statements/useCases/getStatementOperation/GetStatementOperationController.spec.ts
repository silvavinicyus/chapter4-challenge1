import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;

describe("Get Statement Controller Tests", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get statements", async () => {
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

    const deposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 150,
        description: "deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      }
    );

    const statement = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`
      }
    );

    expect(statement.body).toHaveProperty('id');
    expect(statement.status).toBe(200);
  });

  it("Shoudnt be able to get operation without Token", async () => {
    const user = await request(app)
      .post('/api/v1/users')
      .send({
        name: "Vinicyus",
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    const session = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    const {token} = session.body;

    const deposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 150,
        description: "deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      }
    );

    const statement = await request(app).get(`/api/v1/statements/${deposit.body.id}`);

    expect(statement.status).toBe(401);
  });

  it("Shoudnt be able to get operation with wrong statment id", async () => {
    const user = await request(app)
      .post('/api/v1/users')
      .send({
        name: "Vinicyus",
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    const session = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: "vinicyuss@gmail.com",
        password: "admin"
      }
    );

    const {token} = session.body;

    const statement = await request(app).get(`/api/v1/statements/sudhaosiudh`);

    expect(statement.status).toBe(401);
  });
});
