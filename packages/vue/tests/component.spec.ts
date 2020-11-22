/**
 * @jest-environment jsdom
 */

import { ComponentOptions } from 'vue';
import { mount } from '@vue/test-utils';
import {
  Context,
  useVessel,
  useCtor,
  useInstance,
  useAsyncInstance,
  createVesselize,
  Vesselize,
  VueVesselize,
} from '@vesselize/vue';

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

const vueVesselizePlugin: VueVesselize = createVesselize({
  providers: [
    UserService,
    {
      token: 'AsyncUserService',
      useFactory: userServiceFactory,
    },
  ],
});

const foocontext: Context = {
  id: 999,
};

const RootApp: ComponentOptions = {
  template: `<div>{{ userId }}</div>`,

  setup() {
    const vesselize = useVessel();
    const userService = useInstance('UserService');
    const asyncUserService = useAsyncInstance('AsyncUserService');

    const userServiceInContext = useInstance('UserService', foocontext);
    const asyncUserServiceInContext = useAsyncInstance(
      'AsyncUserService',
      foocontext
    );

    const UserService = useCtor('UserService');

    return {
      vesselize,
      userService,
      userServiceInContext,
      asyncUserService,
      asyncUserServiceInContext,
      UserService,
    };
  },

  data() {
    return {
      userId: '',
    };
  },

  created() {
    this.userId = this.getUserId();
  },

  methods: {
    getUserId(): string {
      return this.userService.getUserId();
    },

    getVesselize(): Vesselize {
      return this.vesselize as Vesselize;
    },
  },
};

describe('vesselize vue plugin tests', () => {
  test('inject instance', () => {
    const wrapper = mount(RootApp, {
      global: {
        plugins: [vueVesselizePlugin],
      },
    });
    const { vm } = wrapper;
    const vesselize = vm.getVesselize();
    const userService = vesselize.get('UserService');

    expect(vm.userService).toBeInstanceOf(UserService);
    expect(vm.userService).toBe(userService);
    expect(vm.userService.getUserId()).toBe('User-100');
  });

  test('inject instance in context', () => {
    const wrapper = mount(RootApp, {
      global: {
        plugins: [vueVesselizePlugin],
      },
    });
    const { vm } = wrapper;

    expect(vm.userServiceInContext).toBeInstanceOf(UserService);
    expect(vm.userServiceInContext).not.toBe(vm.userService);
    expect(vm.userServiceInContext.getUserId()).toBe('User-100');
  });

  test('inject async instance', () => {
    const wrapper = mount(RootApp, {
      global: {
        plugins: [vueVesselizePlugin],
      },
    });
    const { vm } = wrapper;
    const asyncUserService = vm.asyncUserService;
    const asyncUserServiceInContext = vm.asyncUserServiceInContext;

    return Promise.all([asyncUserService, asyncUserServiceInContext]).then(
      ([service, serviceInContext]) => {
        expect(service.getUserId()).toBe('User-200');

        expect(serviceInContext).toBeInstanceOf(UserService);
        expect(serviceInContext).not.toBe(service);
        expect(serviceInContext.getUserId()).toBe('User-200');
      }
    );
  });

  test('get data from injected service', () => {
    const wrapper = mount(RootApp, {
      global: {
        plugins: [vueVesselizePlugin],
      },
    });

    expect(wrapper.get('div').text()).toBe('User-100');
    expect(wrapper.vm.getUserId()).toBe('User-100');
  });

  test('get provider constructor', () => {
    const wrapper = mount(RootApp, {
      global: {
        plugins: [vueVesselizePlugin],
      },
    });
    const { vm } = wrapper;

    expect(vm.UserService).toBe(UserService);
  });
});
