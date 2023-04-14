import { BodyValidator, BodyValidatorResult, BodyValidatorRole } from "../presentation/protocols/body-validator";
import validator from "validator";

export class BodyValidatorAdapter implements BodyValidator {
  async isValid(body: any, roles: Record<string, BodyValidatorRole>): Promise<BodyValidatorResult> {
    const columns = Object.keys(roles)
    for(const column of columns) {
      const role = roles[column]
      const columnValue = body[column]

      if(role.isRequered && !columnValue) {
        return {
          success: false,
          message: `column ${column} is requered`
        }
      }

      if(role.isEmail && !validator.isEmail(columnValue)) {
        return {
          success: false,
          message: `column ${column} is invalid`
        }
      }

      if(role.isDate && !(columnValue instanceof Date)) {
        return {
          success: false,
          message: `column ${column} is invalid`
        }
      }
    }

    return {
      success: true,
      message: 'all columns valid'
    }
  }
}