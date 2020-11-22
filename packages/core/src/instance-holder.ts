export interface IHolder<T> {
  instance?: T;

  async?: boolean;
  promise?: Promise<T>;
  isResolved?: boolean;
}

export function createInstanceHolder<T>(
  options: Partial<IHolder<T>>
): IHolder<T> {
  return Object.assign({}, options);
}
