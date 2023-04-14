import { MessageModel, AddMessageModel } from "../models/message";

export interface AddMessage {
  add: (message: AddMessageModel) => Promise<MessageModel>
}