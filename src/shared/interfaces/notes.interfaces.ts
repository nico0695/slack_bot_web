import { IUsers } from './users.interfaces';

export interface INote {
  id?: number;
  title: string;
  description: string;
  tag: string;

  user: IUsers;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type NoteFormOmitedFields =
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'user';
