export type PaginationParams = {
  page: number;
  limit: number;
  enablePagination: boolean;
};

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  enablePagination: boolean;
}
