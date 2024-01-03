export enum RoleTypes {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export interface IConversation {
  role: RoleTypes;
  content: string;
}

export interface IUserConversation extends IConversation {
  userSlackId?: string;
}
