import { AddMessage } from "../../../domain/usecases/add-message";
import { 
  BodyValidator, 
  Request, 
  Response, 
  Socket, 
  Controller
} from "../../protocols/index";

export default class SendMessageController  implements Controller {
  constructor(
    private readonly _bodyValidator: BodyValidator,
    private readonly _addMessage: AddMessage,
    private readonly _sendMessageNotification: Socket
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const isValid = await this._bodyValidator.isValid(
        request.body, 
        {
          username: {
            isRequered: true
          },
          message: {
            isRequered: true
          },
          date: {
            isRequered: true,
            isDate: true
          }
        }
      );
  
      if(!isValid.success) {
        return {
          statusCode: 400,
          body: new Error(isValid.message)
        }
      }

      const message = await this._addMessage.add(request.body)

      await this._sendMessageNotification.send('new-message', message)
  
      return {
        statusCode: 201,
        body: message
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal Server Error')
      }
    }
  }
}