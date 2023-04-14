import { AddMessageModel, MessageModel } from "../../domain/models/message";
import { AddMessage } from "../../domain/usecases/add-message";

export default class DbAddMessage implements AddMessage {
  async add (message: AddMessageModel): Promise<MessageModel> {
    throw new Error('Não implementado')
  }
}