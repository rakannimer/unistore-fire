# Unistore Fire

## Realtime Database

Map your Firebase database to [unistore](https://github.com/developit/unistore#usage) Stores.

This module exports 3 methods :

- toBox
- toObject
- toArray

## Usage

```typescript
import { toBox, toObject, toArray } from "unistore-fire";

const ref = firebase.database().ref("path/to/data");
const box = toBox(ref);
const map = toObject(ref);
const array = toArray(ref);
```

Check [the tests](__tests__) for more examples !
