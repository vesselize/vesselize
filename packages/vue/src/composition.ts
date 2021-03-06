import { inject } from 'vue';
import {
  ProviderToken,
  Context,
  IVesselize,
  ProviderSource,
} from '@vesselize/core';
import { INJECT_KEY } from './constant';
import { VueVesselize } from './vesselize';

export function useVesselize(key: string | symbol = INJECT_KEY): VueVesselize {
  return inject(key);
}

export function useProvider<T>(provide: ProviderToken): ProviderSource<T> {
  const vesselize: IVesselize = useVesselize();

  return vesselize.getProvider<T>(provide);
}

export function useInstance<T>(provide: ProviderToken, context?: Context): T {
  const vesselize: IVesselize = useVesselize();

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
  const vesselize: IVesselize = useVesselize();

  if (context) {
    return vesselize.getInContextAsync<T>(provide, context);
  } else {
    return vesselize.getAsync<T>(provide);
  }
}
