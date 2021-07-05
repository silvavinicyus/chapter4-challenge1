import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUsecase: GetBalanceUseCase;

describe("Get balance Tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository;
    inMemoryStatementRepository = new InMemoryStatementsRepository;
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUsecase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository);
  });

  it("Should be able to get balance.", async () => {
    const user = await createUserUseCase.execute({
      name: "vinicyus",
      email: "vinicyus@gmail.com",
      password: "admin"
    });

    // await createStatementUseCase.execute({
    //   user_id: user.id as string,
    //   type: OperationType.DEPOSIT,
    //   amount: 150,
    //   description: "deposit of $150"
    // });

    const balance = await getBalanceUsecase.execute({
      user_id: user.id as string,
    })

    expect(balance).toHaveProperty('balance');
  });

  it("Should not be able to get balance when user dont exists.", () => {
    expect(async () => {
     await getBalanceUsecase.execute({
       user_id: "ausdhausdhas",
     })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
