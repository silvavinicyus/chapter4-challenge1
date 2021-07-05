  import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show a profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Vinicyus",
      email: "vinicyus@gmail.com,",
      password: "admin"
    });

    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile).toHaveProperty('id');
  })

  it("Should not be able to show a profile when user does not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("1092837asdl");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
});
