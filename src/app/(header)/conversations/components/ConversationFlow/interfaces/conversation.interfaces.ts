export enum RoleTypes {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export enum ConversationProviders {
  SLACK = 'slack',
  WEB = 'web',
  ASSISTANT = 'assistant',
}

export interface IConversation {
  role: RoleTypes;
  content: string;
  provider: ConversationProviders;
}

export interface IUserConversation extends IConversation {
  userSlackId?: string;
  userId?: number;
}
