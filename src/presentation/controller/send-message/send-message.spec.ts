import SendMessageController from "./send-message";
import { AddMessageModel, MessageModel } from "../../../domain/models/message";
import { AddMessage } from "../../../domain/usecases/add-message";
import { 
  BodyValidator, 
  Socket,
  BodyValidatorResult,
  BodyValidatorRole
} from "../../protocols/index";

const makeBodyValidatorStup = () => {
  class BodyValidatorStup implements BodyValidator {
    async isValid(body: any, roles: Record<string, BodyValidatorRole>): Promise<BodyValidatorResult> {
      return {
        success: true,
        message: 'valid_message'
      }
    }
  }
  return new BodyValidatorStup();
}

const makeAddMessageStup = () => {
  class AddMessageStup implements AddMessage {
    async add (message: AddMessageModel): Promise<MessageModel> {
      return new Promise(resolve => resolve({
        id: 'valid_id',
        username: 'valid_username',
        message: 'valid_message',
        date: new Date('2022-01-01 12:30')
      }))
    }
  }
  return new AddMessageStup()
}

const makeSendMessageNotificationStup = () => {
  class SendMessageNotificationStup implements Socket {
    async send(channel: string, message: any): Promise<void> {
      new Promise(resolve => resolve(undefined))
    }
  }
  return new SendMessageNotificationStup()
}
const makeSut = () => {
  const bodyValidatorStup = makeBodyValidatorStup()
  const addMessageStup = makeAddMessageStup()
  const sendMessageNotificationStup = makeSendMessageNotificationStup()
  const sut = new SendMessageController(
    bodyValidatorStup, 
    addMessageStup,
    sendMessageNotificationStup
  )
  return {
    sendMessageNotificationStup,
    bodyValidatorStup,
    addMessageStup,
    sut
  }
}

describe('SendMessageController', () => {
  test('Should return 400 if no username is provided', async () => {
    const { sut, bodyValidatorStup } = makeSut()

    jest.spyOn(bodyValidatorStup, 'isValid').mockReturnValueOnce(new Promise(resolve=> resolve({ success: false, message: 'invalid_param' })))

    const request = {
      body: {
        message: 'any_message',
        date: new Date('2022-03-05 12:30')
      }
    }

    const response = await sut.handle(request)
    
    expect(response.statusCode).toBe(400)
  })
  test('Should return 400 if no message is provided', async () => {
    const { sut, bodyValidatorStup } = makeSut()

    jest.spyOn(bodyValidatorStup, 'isValid').mockReturnValueOnce(new Promise(resolve=> resolve({ success: false, message: 'invalid_param' })))

    const request = {
      body: {
        username: 'any_username',
        date: new Date('2022-03-05 12:30')
      }
    }

    const response = await sut.handle(request)
    
    expect(response.statusCode).toBe(400)
  })
  test('Should return 400 if no date is provided', async () => {
    const { sut, bodyValidatorStup } = makeSut()

    jest.spyOn(bodyValidatorStup, 'isValid').mockReturnValueOnce(new Promise(resolve=> resolve({ success: false, message: 'invalid_param' })))

    const request = {
      body: {
        username: 'any_username',
        message: 'any_message'
      }
    }

    const response = await sut.handle(request)
    
    expect(response.statusCode).toBe(400)
  })
  test('Should call BodyValidator with correct body schema', async() => {
    const { sut, bodyValidatorStup } = makeSut()

    const isValidSpy = jest.spyOn(bodyValidatorStup, 'isValid')

    const request = {
      body: {
        username: 'valid_username',
        message: 'valid_message',
        date: new Date('2022-03-02 12:40')
      }
    }

    await sut.handle(request)

    expect(isValidSpy).toHaveBeenCalledWith(request.body, expect.anything())
  })
  test('Should return 500 if BodyValidator throws', async() => {
    const { sut, bodyValidatorStup } = makeSut()

    jest.spyOn(bodyValidatorStup, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const request = {
      body: {
        username: 'any_username',
        message: 'any_message',
        date: new Date('2022-01-15 15:10')
      }
    }

    const response = await sut.handle(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new Error('Internal Server Error'))
  })
  test('Should call AddMessage with correct values', async() => {
    const { sut, addMessageStup } = makeSut()
    
    const addSpy = jest.spyOn(addMessageStup, 'add')
    
    const request = {
      body: {
        username: 'any_username',
        message: 'any_message',
        date: new Date('2022-01-01 22:11')
      }
    }

    await sut.handle(request)

    expect(addSpy).toHaveBeenCalledWith(request.body)
  })
  test('Should return 500 if AddMessage throws', async() => {
    const { sut, addMessageStup } = makeSut()
    
    jest.spyOn(addMessageStup, 'add').mockImplementationOnce(() => { 
      throw new Error()
    })
    
    const request = {
      body: {
        username: 'any_username',
        message: 'any_message',
        date: new Date('2022-01-01 22:11')
      }
    }

    const response = await sut.handle(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new Error('Internal Server Error'))
  })
  test('Should call SendMessageNotification with correct values', async() => {
    const { 
      sut, 
      addMessageStup,
      sendMessageNotificationStup
    } = makeSut()
    
    const messagefake = {
      id: 'any_id',
      username: 'any_username',
      message: 'any_message',
      date: new Date('2022-01-01 22:11')
    }

    jest.spyOn(addMessageStup, 'add').mockImplementationOnce(() => {
      return new Promise(resolve => resolve(messagefake))
    })

    const sendSpy = jest.spyOn(sendMessageNotificationStup, 'send')
    
    const request = {
      body: {
        username: 'any_username',
        message: 'any_message',
        date: new Date('2022-01-01 22:11')
      }
    }

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(expect.anything(), messagefake)
  })
  test('Should return 500 if SendMessageNotification throws', async() => {
    const { sut, sendMessageNotificationStup } = makeSut()
    
    jest.spyOn(sendMessageNotificationStup, 'send').mockImplementationOnce(() => { 
      throw new Error()
    })
    
    const request = {
      body: {
        username: 'any_username',
        message: 'any_message',
        date: new Date('2022-01-01 22:11')
      }
    }

    const response = await sut.handle(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new Error('Internal Server Error'))
  })
})