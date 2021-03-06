import createStore from "unistore";
import { getFirebaseRef } from "./firebase-utils";

function defaultMap<K, V>(k: K, v: V) {
  return { key: k, value: v };
}
function defaultFilter<K, V>(k: K, v: V) {
  return true;
}

export type ToArrayArgs<K, V> = {
  map?: (k: K, v: V) => any;
  filter?: (k: K, v: V) => boolean;
  initial?: Array<V>;
  getUnsub?: (func: (() => () => void)) => void;
};

export type State = {
  value: any[];
};

export function toArray<K, V>(
  ref: ReturnType<typeof getFirebaseRef>,
  {
    map = defaultMap,
    filter = defaultFilter,
    initial = [],
    getUnsub = () => {}
  } = {
    map: defaultMap,
    filter: defaultFilter,
    initial: [],
    getUnsub: () => {}
  } as ToArrayArgs<K, V>
) {
  const array = createStore({ value: initial } as State);
  const unsubChildAdded = ref.on("child_added", (v: any) => {
    getUnsub(() => () => {
      unsubChildAdded && unsubChildAdded();
      unsubChildRemoved && unsubChildRemoved();
    });

    const valueOrNull = !v ? null : v.val();
    const keyOrNull = !v ? null : v.key;
    const state = array.getState();
    array.setState({
      value: [...state.value, map(keyOrNull, valueOrNull)]
    });
  });
  const unsubChildRemoved = ref.on("child_removed", (v: any) => {
    const valueOrNull = !v ? null : v.val();
    const keyOrNull = !v ? null : v.key;
    const state = array.getState();
    const childIndex = state.value.findIndex((v: any) => v.key === keyOrNull);
    if (childIndex === -1) {
      return;
    }
    const value = state.value;
    value.splice(childIndex, 1);
    array.setState({ value });

    return;
  });
  return array;
}
