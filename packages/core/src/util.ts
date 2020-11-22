export function isEmpty(value: unknown): boolean {
  return value == null;
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isFunction(value: unknown): boolean {
  return typeof value === 'function';
}

export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}
