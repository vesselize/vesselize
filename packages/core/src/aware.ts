import { IVesselize } from './vesselize';

export interface VesselizeAware {
  setVesselize(v: IVesselize): void;
}
