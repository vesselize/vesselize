/**
 * @jest-environment jsdom
 */

import React, { PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IVesselize, VesselizeProvider, connect } from '@vesselize/react';

class UserService {
  getUserId(): string {
    return 'User-001';
  }
}

type VesselizeProps = PropsWithChildren<{
  vesselize?: IVesselize;
}>;

class Profile extends React.Component<VesselizeProps> {
  render() {
    const { vesselize } = this.props;
    const userService = vesselize.get<UserService>('UserService');

    return <p>{userService.getUserId()}</p>;
  }
}

const ConnectedProfile = connect()(Profile);

let container: Element;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('vesselize with react class component tests', () => {
  test('use instance', () => {
    act(() => {
      ReactDOM.render(
        <VesselizeProvider providers={[UserService]}>
          <ConnectedProfile />
        </VesselizeProvider>,
        container
      );
    });

    const p = container.querySelector('p');

    expect(p.textContent).toBe('User-001');
  });
});
