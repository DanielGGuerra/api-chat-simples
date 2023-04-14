export interface MessageModel {
  id: string
  username: string
  message: string
  date: Date
}

export interface AddMessageModel {
  username: string
  message: string
  date: Date
}