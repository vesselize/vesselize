import { createStore } from 'vuex';
import { createVesselize, VueVesselize } from '@vesselize/vue';

class CounterService {
  public getStep(): number {
    return 5;
  }
}

const vueVesselizePlugin: VueVesselize = createVesselize({
  providers: [CounterService],
});

const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    increment(state, { step = 1 } = {}) {
      state.count += step;
    },
  },
  actions: {
    increment(context) {
      const ves = (this as { ves?: VueVesselize }).ves;

      const step = ves.get(CounterService).getStep();

      context.commit('increment', { step });
    },
  },
  plugins: [vueVesselizePlugin.createVuexPlugin('ves')],
});

describe('vesselize vuex plugin tests', () => {
  test('inject instance', () => {
    expect(store.state.count).toBe(0);

    store.dispatch('increment');

    expect(store.state.count).toBe(5);

    store.commit('increment');

    expect(store.state.count).toBe(6);
  });
});
