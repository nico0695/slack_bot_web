import { Profiles } from '../constants/users.constants';

export interface IUsers {
  id?: number;
  username: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  createdAt: string;

  slackId?: string;
  slackTeamId?: string;

  supabaseId?: string;

  profile: Profiles;
}

export type UserFormOmitedFields =
  | 'id'
  | 'createdAt'
  | 'supabaseId'
  | 'slackId'
  | 'slackTeamId';
