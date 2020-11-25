import React, { PropsWithChildren } from 'react';
import { IVesselize } from '@vesselize/core';
import { useVesselize } from './hooks';

type PropsObject = Record<string, unknown>;

export function connect(/* options */) {
  return function <P extends PropsWithChildren<PropsObject>>(
    WrappedComponent: React.ComponentType<P>
  ): React.FC<P> {
    return function withVesselize(props: P) {
      const vesselize: IVesselize = useVesselize();

      // @todo: conflict with @vue/runtime-dom.d.ts
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return <WrappedComponent vesselize={vesselize} {...props} />;
    };
  };
}
