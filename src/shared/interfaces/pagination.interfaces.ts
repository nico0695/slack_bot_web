export interface IPaginationResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  count: number;
}

export interface IPaginationOptions {
  page: number;
  pageSize?: number;
}
