export interface BodyValidatorResult {
  success: boolean
  message: string | string
}

export interface BodyValidatorRole {
  isRequered: boolean
  isEmail?: boolean
  isDate?: boolean
}

export interface BodyValidator {
  isValid(body: any, roles: Record<string, BodyValidatorRole>): Promise<BodyValidatorResult>
}