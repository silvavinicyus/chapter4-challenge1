import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const { user_id } = request.params;
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;

    const transfer = await createTransferUseCase.execute({sender_id, user_id, amount, description});

    return response.json(transfer);
  }
} export {CreateTransferController};
