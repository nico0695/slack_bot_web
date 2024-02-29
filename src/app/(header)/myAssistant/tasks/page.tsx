import React from 'react';

import { getTasks } from '@services/tasks/tasks.service';

import styles from './tasks.module.scss';
import { TaskStatusText } from '@constants/tasks.constants';

const fetchData = async () => {
  const data = await getTasks();

  return data ?? [];
};

const Tasks = async () => {
  const tasks = await fetchData();

  return (
    <div>
      <h4>To-Do</h4>
      <ul className={styles.tasksList}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.taskItem}>
            <h5>
              {task.title} <span>{TaskStatusText[task.status]}</span>
            </h5>
            <p>{task.description}</p>
          </li>
        ))}

        {tasks.length === 0 && <li>No hay tareas</li>}
      </ul>
    </div>
  );
};

export default Tasks;
