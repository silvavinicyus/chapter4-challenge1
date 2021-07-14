import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";

interface IRequest {
  sender_id: string;
  user_id: string;
  amount: number;
  description: string;
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({sender_id, user_id, amount, description}: IRequest): Promise<Statement> {
    const receiver_user = await this.usersRepository.findById(user_id);
    let statementOperation;

    if(!receiver_user) {
      throw new CreateStatementError.UserNotFound();
    }

    try{
      const {balance} = await this.statementsRepository.getUserBalance({user_id: sender_id});

      if(balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }

      statementOperation = await this.statementsRepository.create({
        user_id: sender_id,
        type: OperationType.WITHDRAW,
        amount,
        description
      });

      statementOperation = await this.statementsRepository.create({
        user_id,
        sender_id,
        type: OperationType.TRANSFER,
        amount,
        description
      });

    } catch(err) {
      throw new AppError("Erro ao transferir: ", err);
    }

    return statementOperation;
  }
} export {CreateTransferUseCase};
