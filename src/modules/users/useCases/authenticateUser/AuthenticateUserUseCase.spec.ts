import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User Tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to authenticate a user", async () => {
    const user = await createUserUseCase.execute({
      name: "vinicyus",
      email: "vinicyus346@gmail.com",
      password: "admin"
    });

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: "admin"
    });

    expect(userAuthenticated).toHaveProperty('token');
  });

  it("Should not be able to authenticate when there is no user", async () => {
    expect(async () => {
      const userAuthenticated = await authenticateUserUseCase.execute({
        email: "vini@gmail.com",
        password: "admin"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate when password is wrong", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "vinicyus",
        email: "vinicyus346@gmail.com",
        password: "admin"
      });

      const userAuthenticated = await authenticateUserUseCase.execute({
        email: "vinicyus346@gmail.com",
        password: "admin1"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
