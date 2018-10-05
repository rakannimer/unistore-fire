import { Store } from "unistore";

export function waitUntilBox<T>(store: Store<{ value: T }>) {
  return new Promise(resolve => {
    store.subscribe(state => {
      if (state.value !== null) resolve(state);
    });
  });
}
