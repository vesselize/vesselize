import { App } from 'vue';
import { Store, Plugin } from 'vuex';
import {
  Vesselize,
  VesselizeOptions,
  IVesselize,
  Context,
  ProviderToken,
  ProviderSource,
} from '@vesselize/core';
import { INJECT_KEY, VUEX_KEY } from './constant';

export type VueVesselizeOptions = {
  key?: string | symbol;
} & VesselizeOptions;

export function createVesselize(options: VueVesselizeOptions): VueVesselize {
  return new VueVesselize(options);
}

export class VueVesselize implements IVesselize {
  private vesselize: Vesselize;
  private injectKey: string | symbol;

  constructor(options: VueVesselizeOptions) {
    this.vesselize = new Vesselize(options);
  }

  getProvider<T>(provide: ProviderToken<T>): ProviderSource<T> {
    return this.vesselize.getProvider(provide);
  }

  get<T = any>(provide: ProviderToken<T>): T {
    return this.vesselize.get(provide);
  }

  getAsync<T = any>(provide: ProviderToken<T>): Promise<T> {
    return this.vesselize.getAsync(provide);
  }

  getInContext<T = any>(provide: ProviderToken<T>, context: Context): T {
    return this.vesselize.getInContext(provide, context);
  }

  getInContextAsync<T = any>(
    provide: ProviderToken<T>,
    context: Context
  ): Promise<T> {
    return this.vesselize.getInContextAsync(provide, context);
  }

  install(app: App): void {
    app.provide(this.injectKey || INJECT_KEY, this);
  }

  createVuexPlugin<T>(key: string | symbol = VUEX_KEY): Plugin<T> {
    return (store: Store<T>) => {
      store[key] = this;
    };
  }
}
