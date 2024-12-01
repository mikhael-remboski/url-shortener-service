class Result<T, E = Error> {
  private constructor(
    public readonly data: T | null,
    public readonly error: E | null,
  ) {}

  static success<T>(data: T): Result<T, null> {
    return new Result(data, null);
  }

  static failure<E>(error: E): Result<null, E> {
    return new Result(null, error);
  }

  isSuccess(): this is Result<T, null> {
    return this.error === null;
  }

  isError(): this is Result<null, E> {
    return this.data === null;
  }
}

export async function safeAsync<T, E = Error>(
  fn: () => Promise<T>,
): Promise<Result<T | null, E | null>> {
  try {
    const result = await fn();
    return Result.success(result);
  } catch (error) {
    return Result.failure(error as E);
  }
}
