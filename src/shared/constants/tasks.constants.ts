export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export const taskStatusText = {
  [TaskStatus.PENDING]: 'Pendiente',
  [TaskStatus.IN_PROGRESS]: 'En progreso',
  [TaskStatus.COMPLETED]: 'Completada',
  [TaskStatus.CANCELED]: 'Cancelada',
};

export const taskOptions = [
  { label: taskStatusText[TaskStatus.PENDING], value: TaskStatus.PENDING },
  {
    label: taskStatusText[TaskStatus.IN_PROGRESS],
    value: TaskStatus.IN_PROGRESS,
  },
  { label: taskStatusText[TaskStatus.COMPLETED], value: TaskStatus.COMPLETED },
  { label: taskStatusText[TaskStatus.CANCELED], value: TaskStatus.CANCELED },
];
