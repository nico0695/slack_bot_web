import { IUsers } from './users.interfaces';

import { LinkStatus } from '@constants/links.constants';

export interface ILink {
  id?: number;
  url: string;
  title?: string;
  description?: string;
  tag?: string;
  status: LinkStatus;
  user: IUsers;
  createdAt: Date;
  deletedAt: Date;
}

export type LinkFormOmitedFields = 'id' | 'createdAt' | 'deletedAt' | 'user';
