import {
  Vesselize,
  IVesselize,
  VesselizeOptions,
  Context,
} from '@vesselize/core';

class UserService {}

const fooContext: Context = {
  id: 1000,
};

const barContext: Context = {
  id: 2000,
};

const zooContext: Context = {
  id: 2000,
};

const options: VesselizeOptions = {
  providers: [UserService],
};

let v: IVesselize;

beforeEach(() => {
  v = new Vesselize(options);
});

describe('vesselize context tests', () => {
  test('lookup instance by contexts', () => {
    expect(v.get(UserService)).toBeInstanceOf(UserService);

    expect(v.getInContext(UserService, fooContext)).toBeInstanceOf(UserService);
    expect(v.getInContext(UserService, barContext)).toBeInstanceOf(UserService);
    expect(v.getInContext(UserService, zooContext)).toBeInstanceOf(UserService);
  });

  test('lookup instance by different contexts', () => {
    const s = v.get(UserService);
    const foo = v.getInContext(UserService, fooContext);
    const bar = v.getInContext(UserService, barContext);

    expect(s).not.toBe(foo);

    expect(foo).not.toBe(bar);
  });

  test('lookup instance by same contexts', () => {
    const fooX = v.getInContext(UserService, fooContext);
    const fooY = v.getInContext(UserService, fooContext);

    expect(fooX).toBe(fooY);
  });

  test('lookup instance by contexts which have same id', () => {
    const bar = v.getInContext(UserService, barContext);
    const zoo = v.getInContext(UserService, zooContext);

    expect(bar).not.toBe(zoo);
  });
});
