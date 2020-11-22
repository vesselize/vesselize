import { Vesselize, IVesselize, VesselizeOptions } from '@vesselize/core';

class UserService {}

class BookService {}

const BookServiceSymbol = Symbol('book');

const options: VesselizeOptions = {
  providers: [
    UserService,
    {
      token: 'BookServiceToken',
      useClass: BookService,
    },
    {
      token: BookServiceSymbol,
      useClass: BookService,
    },
  ],
};

let v: IVesselize;

beforeEach(() => {
  v = new Vesselize(options);
});

describe('vesselize lookup tests', () => {
  test('lookup instance of simple constructor by constructor', () => {
    expect(v.get(UserService)).toBeInstanceOf(UserService);
  });

  test('lookup instance of simple constructor by constructor name', () => {
    expect(v.get('UserService')).toBeInstanceOf(UserService);
  });

  test('lookup instance of simple constructor by different token should be same', () => {
    const a = v.get(UserService);
    const b = v.get('UserService');

    expect(a).toBe(b);
  });

  test('lookup instance of class provider by string token', () => {
    expect(v.get('BookServiceToken')).toBeInstanceOf(BookService);
  });

  test('lookup instance of class provider by symbol token', () => {
    expect(v.get(BookServiceSymbol)).toBeInstanceOf(BookService);
  });

  test('lookup instance of class provider by different provider should not be same', () => {
    const a = v.get('BookServiceToken');
    const b = v.get(BookServiceSymbol);

    expect(a).not.toBe(b);
  });
});
