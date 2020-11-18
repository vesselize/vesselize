import { inject } from 'vue';
import { INJECT_KEY } from './constant';
import { VueVesselize } from './plugin';

export function useVessel(): VueVesselize | undefined {
  return inject(INJECT_KEY);
}
