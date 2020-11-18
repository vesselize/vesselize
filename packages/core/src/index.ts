export interface IVesselize {
  get(): string;
}

export class Vesselize implements IVesselize {
  get(): string {
    return 'Vesselize';
  }
}
