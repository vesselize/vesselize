import { App } from 'vue';
import { Vesselize } from '@vesselize/core';
import { INJECT_KEY } from './constant';

export function createVesselize(): VueVesselize {
  return new VueVesselize();
}

export class VueVesselize {
  private vesselize: Vesselize;

  constructor() {
    this.vesselize = new Vesselize();
  }

  get(): unknown {
    return this.vesselize.get();
  }

  install(app: App): void {
    app.provide(INJECT_KEY, this);
  }
}
