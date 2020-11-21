import { Vesselize, IVesselize } from '../src';

let v: IVesselize;

beforeEach(() => {
  v = new Vesselize();
});

describe('vesselize lookup tests', () => {
  test('lookup value', () => {
    expect(v.get()).toBe('Vesselize');
  });
});
