export class PaginatedResponseDto<T> {
  constructor(
    public readonly data: T[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly totalPages: number,
  ) {}
}
