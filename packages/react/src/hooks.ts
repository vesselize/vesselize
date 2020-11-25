import { useContext } from 'react';
import {
  ProviderToken,
  Context,
  IVesselize,
  ProviderSource,
} from '@vesselize/core';
import { VesselizeContext } from './context';

export function useVesselize(): IVesselize {
  const { vesselize } = useContext(VesselizeContext);

  return vesselize;
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
