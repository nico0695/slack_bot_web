import React from 'react';

import { getTasks } from '@services/tasks/tasks.service';

import Tasks from './page.client';

const fetchData = async () => {
  const data = await getTasks();

  return data ?? [];
};

const TasksContainer = async () => {
  const initialData = await fetchData();

  return <Tasks initialTasks={initialData} />;
};

export default TasksContainer;
