import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Vinicyus",
      email: "vinicyus@gmail.com,",
      password: "admin"
    });

    expect(user).toHaveProperty('id');
  });

  it("Should not be able to create a new user with existent email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Vinicyus",
        email: "vinicyus@gmail.com,",
        password: "admin"
      });

      await createUserUseCase.execute({
        name: "Vinicyus",
        email: "vinicyus@gmail.com,",
        password: "admin"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
