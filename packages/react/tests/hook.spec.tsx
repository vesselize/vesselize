/**
 * @jest-environment jsdom
 */

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  Ctor,
  Context,
  VesselizeProvider,
  ReactVesselizeOptions,
  useProvider,
  useInstance,
  useAsyncInstance,
} from '@vesselize/react';

class UserService {
  private userId: string;

  constructor(userId = 'User-100') {
    this.userId = userId;
  }

  public getUserId(): string {
    return this.userId;
  }
}

const userServiceFactory = function (): Promise<UserService> {
  return Promise.resolve(new UserService('User-200'));
};

function Profile() {
  const foocontext: Context = {
    id: 999,
  };

  const [asyncUserId, setAsyncUserId] = useState(null);
  const [asyncUserIdInContext, setAsyncUserIdInContext] = useState(null);

  const userService = useInstance<UserService>('UserService');
  const asyncUserService = useAsyncInstance<UserService>('AsyncUserService');

  const userServiceInContext = useInstance<UserService>(
    'UserService',
    foocontext
  );
  const asyncUserServiceInContext = useAsyncInstance<UserService>(
    'AsyncUserService',
    foocontext
  );

  const UserServiceClass = useProvider('UserService') as Ctor<UserService>;
  const customUserService = new UserServiceClass('User-300');

  useEffect(() => {
    asyncUserService.then((service) => {
      setAsyncUserId(service.getUserId());
    });

    asyncUserServiceInContext.then((service) => {
      setAsyncUserIdInContext(service.getUserId());
    });
  }, []);

  return (
    <div>
      <p id="sync">{userService.getUserId()}</p>
      <p id="async">{asyncUserId}</p>
      <p id="sync-context">{userServiceInContext.getUserId()}</p>
      <p id="async-context">{asyncUserIdInContext}</p>
      <p id="provider">{customUserService.getUserId()}</p>
    </div>
  );
}

const options: ReactVesselizeOptions = {
  providers: [
    UserService,
    {
      token: 'AsyncUserService',
      useFactory: userServiceFactory,
    },
  ],
};

let container: Element;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('vesselize with react function component tests', () => {
  test('use instance', async () => {
    await act(async () => {
      ReactDOM.render(
        <VesselizeProvider providers={options.providers}>
          <Profile />
        </VesselizeProvider>,
        container
      );
    });

    const p = container.querySelector('#sync');

    expect(p.textContent).toBe('User-100');
  });

  test('use instance in context', async () => {
    await act(async () => {
      ReactDOM.render(
        <VesselizeProvider providers={options.providers}>
          <Profile />
        </VesselizeProvider>,
        container
      );
    });

    const p = container.querySelector('#sync-context');

    expect(p.textContent).toBe('User-100');
  });

  test('use async instance', async () => {
    await act(async () => {
      ReactDOM.render(
        <VesselizeProvider providers={options.providers}>
          <Profile />
        </VesselizeProvider>,
        container
      );
    });

    const p1 = container.querySelector('#async');
    const p2 = container.querySelector('#async-context');

    expect(p1.textContent).toBe('User-200');
    expect(p2.textContent).toBe('User-200');
  });

  test('use provider constructor', async () => {
    await act(async () => {
      ReactDOM.render(
        <VesselizeProvider providers={options.providers}>
          <Profile />
        </VesselizeProvider>,
        container
      );
    });

    const p = container.querySelector('#provider');

    expect(p.textContent).toBe('User-300');
  });
});
