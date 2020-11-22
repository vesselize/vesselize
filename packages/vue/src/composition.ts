import { inject } from 'vue';
import { ProviderToken, Context, IVesselize, Ctor } from '@vesselize/core';
import { INJECT_KEY } from './constant';
import { VueVesselize } from './plugin';

export function useVessel(key: string | symbol = INJECT_KEY): VueVesselize {
  return inject(key);
}

export function useCtor(provide: ProviderToken): Ctor {
  const vesselize: IVesselize = useVessel();

  return vesselize.getProvider(provide);
}

export function useInstance<T>(provide: ProviderToken, context?: Context): T {
  const vesselize: IVesselize = useVessel();

  if (context) {
    return vesselize.getInContext<T>(provide, context);
  } else {
    return vesselize.get<T>(provide);
  }
}

export function useAsyncInstance<T>(
  provide: ProviderToken,
  context?: Context
): Promise<T> {
  const vesselize: IVesselize = useVessel();

  if (context) {
    return vesselize.getInContextAsync<T>(provide, context);
  } else {
    return vesselize.getAsync<T>(provide);
  }
}
