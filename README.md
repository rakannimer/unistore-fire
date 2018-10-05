# Mobx Fire

Map your Firebase database to [unistore](https://github.com/developit/unistore#usage) Stores.

This module exports 3 methods :

- toBox
- toMap
- toArray

## Usage

```typescript
import { toBox, toMap, toArray } from "unistore-fire";

const ref = firebase.database().ref("path/to/data");
const box = toBox(ref);
const map = toMap(ref);
const array = toArray(ref);
```

Check [the tests](__tests__) for more examples !
