import createStore from "unistore";
import { getFirebaseRef } from "./firebase-utils";

function defaultMap<T>(a: T) {
  return a;
}
function defaultFilter<V>(p: V, c: V) {
  return true;
}

export type ToObjectArgs<V> = {
  mapKey?: (m: string) => string | number;
  mapValue?: (m: V) => any;
  filter?: (prevValue: V, currentValue: V) => boolean;
  initial?: State<V>["value"];
  getUnsub?: (func: (() => () => void)) => void;
};
type State<V> = {
  value: {
    [k: string]: V;
  };
};

function has<T>(state: State<T>, key: any) {
  return key in state.value;
}

function get<T>(state: State<T>, key: any) {
  return state.value[key];
}

function set<T>(state: State<T>, key: any, value: T) {
  return {
    value: {
      ...state.value,
      [key]: value
    }
  };
}

function remove<T>(state: State<T>, key: any) {
  const keysAfterRemove = Object.keys(state.value).filter(k => k !== key);
  const valuesAfterRemove = keysAfterRemove.map(k => state.value[k]);
  const newState = keysAfterRemove.reduce((acc: State<T>["value"], cur, i) => {
    const k = cur;
    const v = valuesAfterRemove[i];
    acc[k] = v;
    return acc;
  }, {});
  return {
    value: newState
  };
}

export function toObject<V>(
  ref: ReturnType<typeof getFirebaseRef>,
  {
    mapKey = defaultMap,
    mapValue = defaultMap,
    filter = defaultFilter,
    // For better types. Object cant take enum for keys but maps can.
    initial = {},
    getUnsub = () => {}
  } = {
    mapKey: defaultMap,
    mapValue: defaultMap,
    filter: defaultFilter,
    initial: {},
    getUnsub: () => {}
  } as ToObjectArgs<V>
) {
  const map = createStore({ value: initial });
  const unsubChildAdded = ref.on("child_added", (v: any) => {
    getUnsub(() => () => {
      unsubChildAdded && unsubChildAdded();
      unsubChildRemoved && unsubChildRemoved();
    });
    const valueOrNull = !v ? null : v.val();
    const keyOrNull = !v ? null : v.key;
    const currentMapKey = mapKey(keyOrNull);
    const currentMapValue = mapValue(valueOrNull);
    if (!has(map.getState(), currentMapKey)) {
      map.setState(set(map.getState(), currentMapKey, currentMapValue));
      return;
    }
    const previousMapValue = get(map.getState(), currentMapKey);
    const shouldUpdateValue = filter(previousMapValue, currentMapValue);
    if (!shouldUpdateValue) {
      return;
    }
    map.setState(set(map.getState(), currentMapKey, currentMapValue));

    return;
  });
  const unsubChildRemoved = ref.on("child_removed", (v: any) => {
    const valueOrNull = !v ? null : v.val();
    const keyOrNull = !v ? null : v.key;
    const currentMapKey = mapKey(keyOrNull);
    const currentMapValue = mapValue(valueOrNull);
    if (!has(map.getState(), currentMapKey)) {
      return;
    }
    const previousMapValue = get(map.getState(), currentMapKey);
    const shouldUpdateValue = filter(previousMapValue, currentMapValue);
    if (!shouldUpdateValue) {
      return;
    }
    map.setState(remove(map.getState(), currentMapKey));
    return;
  });
  return map;
}
