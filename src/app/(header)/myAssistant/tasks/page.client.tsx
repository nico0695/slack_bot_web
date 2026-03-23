'use client';
import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaRegTrashAlt, FaTasks } from 'react-icons/fa';

import { ITask } from '@interfaces/tasks.interfaces';
import { getTasks } from '@services/tasks/tasks.service';

import styles from './tasks.module.scss';
import { taskStatusText, TaskStatus, taskOptions } from '@constants/tasks.constants';

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
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const fetchData = async () => {
    const data = await getTasks();

    setTasks(data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterOptions = [{ label: 'Todas', value: 'all' as const }, ...taskOptions];
  const filteredTasks = statusFilter === 'all' ? tasks : tasks.filter((t) => t.status === statusFilter);

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

      <div className={styles.filterChips}>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`${styles.chip}${statusFilter === option.value ? ` ${styles.chipActive}` : ''}`}
            onClick={() => setStatusFilter(option.value as TaskStatus | 'all')}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul className={styles.tasksList}>
        {filteredTasks.map((task) => (
          <li key={task.id} className={styles.taskItem} data-status={task.status}>
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

        {filteredTasks.length === 0 && (
          <li className={styles.emptyState}>
            <FaTasks size={32} />
            {tasks.length === 0 ? (
              <>
                <p>No tenés tareas todavía</p>
                <button
                  className={styles.emptyStateAction}
                  onClick={() => {
                    openDialog();
                    setSelectionData({ action: ActionTypes.CREATE, data: undefined });
                  }}
                >
                  Crear primera tarea
                </button>
              </>
            ) : (
              <p>No hay tareas con ese estado</p>
            )}
          </li>
        )}
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
