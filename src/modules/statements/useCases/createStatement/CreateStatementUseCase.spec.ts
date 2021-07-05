import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement Tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository;
    inMemoryStatementRepository = new InMemoryStatementsRepository;
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new statment", async () => {
    const user = await createUserUseCase.execute({
      name: "vinicyus",
      email: "vinicyus@gmail.com",
      password: "admin"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 150,
      description: "deposit of $150"
    });

    expect(statement).toHaveProperty('id');
  });

  it("Should not be able to create a new statement when user no exists.", () => {
    expect(async () => {
      const statement = await createStatementUseCase.execute({
        user_id: "aushdauidhasu",
        type: OperationType.DEPOSIT,
        amount: 150,
        description: "deposit of $150"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create a new withdraw statement when amount is not enough.", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "vinicyus",
        email: "vinicyus@gmail.com",
        password: "admin"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "withdraw of $150"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});
