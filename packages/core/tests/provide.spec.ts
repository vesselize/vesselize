import { Vesselize, IVesselize, VesselizeOptions } from '@vesselize/core';

class UserService {}

class BookService {}

const AppConstants = { name: 'Awesome' };

const DBConfig = {
  host: 'dbhost',
};

const createDBConnection = function () {
  return {
    host: DBConfig.host,
  };
};

const BookServiceSymbol = Symbol('book');

const options: VesselizeOptions = {
  providers: [
    UserService,
    {
      token: 'BookServiceToken',
      useClass: BookService,
    },
    {
      token: 'Constants',
      useValue: AppConstants,
    },
    {
      token: 'DBConnection',
      useFactory: createDBConnection,
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

describe('vesselize provide tests', () => {
  test('simple class provider', () => {
    expect(v.getProvider('UserService')).toBe(UserService);
  });

  test('custom class provider', () => {
    expect(v.getProvider('BookServiceToken')).toBe(BookService);
  });

  test('custom value provider', () => {
    expect(v.getProvider('Constants')).toBe(AppConstants);
  });

  test('custom factory provider', () => {
    expect(v.getProvider('DBConnection')).toBe(createDBConnection);
  });

  test('custom provider with symbol token', () => {
    expect(v.getProvider(BookServiceSymbol)).toBe(BookService);
  });
});
