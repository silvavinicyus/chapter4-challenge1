import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation Tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository;
    inMemoryStatementRepository = new InMemoryStatementsRepository;
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
  });

  it("Should be able to get statement operation.", async () => {
    const user = await createUserUseCase.execute({
      name: "vinicyus",
      email: "vinicyus2@gmail.com",
      password: "admin"
    });

    const statement = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 150,
        description: "deposit of $150"
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toHaveProperty('id');
  });

  it("Should not be able to get a statement when user does not exists.", () => {
    expect(async () => {
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

      await getStatementOperationUseCase.execute({
        user_id: "auhsdauishdaiush",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a statement when statement does not exists.", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "vinicyus",
        email: "vinicyus1@gmail.com",
        password: "admin"
      });

      const a = await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "aushdiasuhd",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
