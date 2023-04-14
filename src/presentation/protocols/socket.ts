export interface Socket {
  send (channel: string, message: any): Promise<void>
}