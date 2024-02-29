import { IUsers } from './users.interfaces';

import { TaskStatus } from '@constants/tasks.constants';

export interface ITask {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  alertDate?: Date | null;
  user: IUsers;

  createdAt: Date;
  deletedAt: Date;
}
