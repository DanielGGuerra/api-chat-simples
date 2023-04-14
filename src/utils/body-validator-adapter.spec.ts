import { BodyValidatorAdapter } from "./body-validator-adapter"
import validator from "validator"

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = () => new BodyValidatorAdapter()

describe('BodyValidatorAdapter', () => {
  test('Should return false if column requered not provide', async () => {
    const sut = makeSut()
    const roles = {
      username: {
        isRequered: true,
      }
    }

    const isValid = await sut.isValid({}, roles)
    expect(isValid).toEqual(expect.objectContaining({ success: false }))
  })
  test('Should return true if column requered is provide', async () => {
    const sut = makeSut()
    const data = {
      username: 'any_username'
    }
    const roles = {
      username: {
        isRequered: true,
      }
    }

    const isValid = await sut.isValid(data, roles)
    expect(isValid).toEqual(expect.objectContaining({ success: true }))
  })
  test('Should return false if email is invalid', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const data = {
      email: 'invalid_email@mail.com'
    }
    const roles = {
      email: {
        isRequered: true,
        isEmail: true
      }
    }

    const isValid = await sut.isValid(data, roles)
    expect(isValid).toEqual(expect.objectContaining({ success: false }))
  })
  test('Should return true if email is valid', async () => {
    const sut = makeSut()
    const data = {
      email: 'valid_email@mail.com'
    }
    const roles = {
      email: {
        isRequered: true,
        isEmail: true
      }
    }
    const isValid = await sut.isValid(data, roles)
    expect(isValid).toEqual(expect.objectContaining({ success: true }))
  })
  test('Should return true if email is valid', async () => {
    const sut = makeSut()
    const data = {
      email: 'valid_email@mail.com'
    }
    const roles = {
      email: {
        isRequered: true,
        isEmail: true
      }
    }
    const isValid = await sut.isValid(data, roles)
    expect(isValid).toEqual(expect.objectContaining({ success: true }))
  })
  test('Should call with correct email', async () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const data = {
      email: 'valid_email@mail.com'
    }
    const roles = {
      email: {
        isRequered: true,
        isEmail: true
      }
    }
    await sut.isValid(data, roles)
    expect(isEmailSpy).toHaveBeenCalledWith(data.email)
  })
  test('Should return true if date is valid', async () => {
    const sut = makeSut()
    const data = {
      date: new Date('2022-01-01')
    }
    const roles = {
      date: {
        isRequered: true,
        isDate: true
      }
    }
    const isValid = await sut.isValid(data, roles)
    expect(isValid).toEqual(expect.objectContaining({ success: true }))
  })
  test('Should return true if date is valid', async () => {
    const sut = makeSut()
    const data = {
      date: new Date('2022-01-01')
    }
    const roles = {
      date: {
        isRequered: true,
        isDate: true
      }
    }
    const isValid = await sut.isValid(data, roles)
    expect(isValid).toEqual(expect.objectContaining({ success: true }))
  })
})