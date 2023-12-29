export interface ITextToSpeech {
  id: number;
  path: string;
  phrase: string;
  username: string;
  slackTeamId?: string;
  slackId?: string;
  createdAt: Date;
}
