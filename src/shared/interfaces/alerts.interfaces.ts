import { IUsers } from './users.interfaces';

export interface IAlert {
  id: number;
  message: string;
  date: string | null;
  sent: boolean;
  user: IUsers;

  createdAt: string;
  deletedAt: string | null;
}

export type AlertFormOmitedFields =
  | 'id'
  | 'createdAt'
  | 'deletedAt'
  | 'user'
  | 'sent';
