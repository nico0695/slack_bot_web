export interface IPaginationResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  count: number;
}
