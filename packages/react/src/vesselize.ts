import { VesselizeOptions, AbstractPowerVesselize } from '@vesselize/core';

export type ReactVesselizeOptions = VesselizeOptions;

export function createVesselize(
  options: ReactVesselizeOptions
): ReactVesselize {
  return new ReactVesselize(options);
}

export class ReactVesselize extends AbstractPowerVesselize {
  constructor(options: ReactVesselizeOptions) {
    const { ...vesselizeOptions } = options;

    super(vesselizeOptions);
  }
}
