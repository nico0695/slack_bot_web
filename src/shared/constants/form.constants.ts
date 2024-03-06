export const validationMessages = {
  required: 'Este campo es requerido',
  invalidEmail: 'Ingrese un email válido',
  pattern: 'Ingrese un valor válido',
};

export enum ActionTypes {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  DETAIL = 'detail',
}

export const buttonActionLabel = {
  [ActionTypes.CREATE]: 'Crear',
  [ActionTypes.UPDATE]: 'Actualizar',
  [ActionTypes.DELETE]: 'Eliminar',
  [ActionTypes.DETAIL]: 'Detalle',
};
