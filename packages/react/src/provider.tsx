import React, { useMemo } from 'react';
import { VesselizeContext, VesselizeContextValue } from './context';
import { createVesselize, ReactVesselizeOptions } from './vesselize';

export type ProviderPropTypes = {
  children: React.ReactNode;
} & ReactVesselizeOptions;

export function VesselizeProvider({
  providers,
  children,
}: ProviderPropTypes): JSX.Element {
  const contextValue: VesselizeContextValue = useMemo(() => {
    const vesselize = createVesselize({
      providers,
    });

    return {
      vesselize,
    };
  }, [providers]);

  return (
    <VesselizeContext.Provider value={contextValue}>
      {children}
    </VesselizeContext.Provider>
  );
}
