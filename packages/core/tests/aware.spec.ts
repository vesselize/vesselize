import {
  Vesselize,
  IVesselize,
  VesselizeOptions,
  VesselizeAware,
} from '@vesselize/core';

class UserService implements VesselizeAware {
  public accountService: AccountService;

  setVesselize(v: IVesselize): void {
    this.accountService = v.get(AccountService);
  }

  getUserId(): string {
    return 'User001';
  }

  getAccountId(): string {
    return this.accountService.getAccountId();
  }
}

class AccountService implements VesselizeAware {
  public userService: UserService;

  setVesselize(v: IVesselize): void {
    this.userService = v.get(UserService);
  }

  getAccountId(): string {
    return 'Account001';
  }

  getUserId(): string {
    return this.userService.getUserId();
  }
}

const options: VesselizeOptions = {
  providers: [UserService, AccountService],
};

let v: IVesselize;

beforeEach(() => {
  v = new Vesselize(options);
});

describe('vesselize aware tests', () => {
  test('circle dependency', () => {
    const userService = v.get(UserService);
    const accountService = v.get(AccountService);

    const userId = userService.getUserId();
    const accountId = accountService.getAccountId();

    expect(userService.getAccountId()).toBe(accountId);
    expect(accountService.getUserId()).toBe(userId);
  });
});
