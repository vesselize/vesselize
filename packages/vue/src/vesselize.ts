import { App } from 'vue';
import { Store, Plugin } from 'vuex';
import { VesselizeOptions, AbstractPowerVesselize } from '@vesselize/core';
import { INJECT_KEY, VUEX_KEY } from './constant';

export type VueVesselizeOptions = {
  key?: string | symbol;
} & VesselizeOptions;

export function createVesselize(options: VueVesselizeOptions): VueVesselize {
  return new VueVesselize(options);
}

export class VueVesselize extends AbstractPowerVesselize {
  private injectKey: string | symbol;

  constructor(options: VueVesselizeOptions) {
    const { key, ...vesselizeOptions } = options;

    super(vesselizeOptions);

    this.injectKey = key;
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
