'use client';
import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

import { ITask } from '@interfaces/tasks.interfaces';
import { getTasks } from '@services/tasks/tasks.service';

import styles from './tasks.module.scss';
import { taskStatusText } from '@constants/tasks.constants';

import { ActionTypes } from '@constants/form.constants';
import TaskForm from './components/TaskForm/TaskForm';

import { useToggle } from '@hooks/useToggle/useToggle';

import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton';
import Dialog from '@components/Dialog/Dialog';
import IconButton from '@components/Buttons/IconButton/IconButton';

interface ITasksProps {
  initialTasks: ITask[];
}

const Tasks = ({ initialTasks }: ITasksProps) => {
  const [isOpen, , openDialog, closeDialog] = useToggle();

  const [selectionData, setSelectionData] = useState<{
    action: ActionTypes;
    data?: ITask;
  }>({
    action: ActionTypes.DETAIL,
    data: undefined,
  });

  const [tasks, setTasks] = useState<ITask[]>(initialTasks);

  const fetchData = async () => {
    const data = await getTasks();

    setTasks(data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className={styles.tasksHeader}>
        <h4>To-Do</h4>

        <PrimaryButton
          label="Nueva tarea"
          onClick={() => {
            openDialog();
            setSelectionData({
              action: ActionTypes.CREATE,
              data: undefined,
            });
          }}
        />
      </div>
      <ul className={styles.tasksList}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.taskItem}>
            <h5>
              {task.title} <span>{taskStatusText[task.status]}</span>
            </h5>
            <p>{task.description}</p>

            <div className={styles.actionButtons}>
              <IconButton
                onClick={() => {
                  openDialog();
                  setSelectionData({
                    action: ActionTypes.DELETE,
                    data: task,
                  });
                }}
              >
                <FaRegTrashAlt size={18} color={'var(--blue-bayoux-300)'} />
              </IconButton>

              <IconButton
                onClick={() => {
                  openDialog();
                  setSelectionData({
                    action: ActionTypes.UPDATE,
                    data: task,
                  });
                }}
              >
                <FaRegEdit size={18} color={'var(--blue-bayoux-300)'} />
              </IconButton>
            </div>
          </li>
        ))}

        {tasks.length === 0 && <li>No hay tareas</li>}
      </ul>

      <Dialog title="Nueva tarea" isOpen={isOpen} hideModal={closeDialog}>
        <TaskForm
          action={selectionData.action}
          data={selectionData.data}
          onSubmit={() => {
            fetchData();
            closeDialog();
          }}
        />
      </Dialog>
    </div>
  );
};

export default Tasks;
