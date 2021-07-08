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

  it("Should be able to get balance", async () => {
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

    const balance = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${token}`
      }
    );

    expect(balance.body).toHaveProperty('balance');
  });

  it("Should not be able to get balance without token", async () => {
    const response = await request(app).get('/api/v1/statements/balance');

    expect(response.status).toBe(401);
  });

  it("Should not be able to get balance with wrong token", async () => {
    const response = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer jahsdlajkshdbalksdj`
      }
    );

    expect(response.status).toBe(401);
  });
});
