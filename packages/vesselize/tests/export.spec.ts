import { IVesselize, Vesselize } from 'vesselize';

class UserService {}

let v: IVesselize;

beforeEach(() => {
  v = new Vesselize({
    providers: [UserService],
  });
});

describe('vesselize entry tests', () => {
  test('lookup instance', () => {
    expect(v.get(UserService)).toBeInstanceOf(UserService);
  });
});
