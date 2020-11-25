import React from 'react';
import { IVesselize } from '@vesselize/core';

export interface VesselizeContextValue {
  vesselize: IVesselize;
}

const VesselizeContext: React.Context<VesselizeContextValue> = React.createContext(
  null
);

export { VesselizeContext };
