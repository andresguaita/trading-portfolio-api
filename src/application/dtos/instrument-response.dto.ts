export class InstrumentResponseDto {
  constructor(
    public readonly id: number,
    public readonly ticker: string,
    public readonly name: string,
    public readonly type: string,
  ) {}
}
