# Unistore Fire

[![CircleCI][circleci-badge]][circleci-href]
[![NPM][npm-version-badge]][npm-href]
[![BundlePhobia][bundlephobia-badge]][bundlephobia-href]

## Peer Dependencies

This library relies on having firebase (web, admin or react-native) and unistore installed and initialized. If you haven't installed them previously :

```sh
  yarn add unistore firebase
  # or yarn add unistore firebase-admin
  # or yarn add unistore react-native-firebase
  # Or npm i unistore firebase
```

### Install

```sh
  yarn add unistore-fire
  # Or npm i unistore-fire
```

### Usage

#### Realtime Database

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
box.getState(); //  { value: valueFromFirebase }
const map = toObject(ref);
map.getState(); // { value: { [key:keyFromFirebase]: valueFromFirebase } }
const array = toArray(ref);
array.getState(); // { value: Array<{ key:keyFromFirebase, value:valueFromFirebase }> }
```

## API

### Input

Any firebase ref, with or without sorting, limiting

### Output

A unistore store that always has the latest value of the ref inside it.

#### toBox

The state has the following shape :

```typescript
type State = {
  value: ValueFromFirebase | null;
};
```

#### toObject

The state has the following shape :

```typescript
type State = {
  value: { [key: keyFromFirebase]: ValueFromFirebase } | null;
};
```

#### toArray

The state has the following shape :

```typescript
type State = {
  value: Array<{ key: keyFromFirebase; value: ValueFromFirebase }>;
};
```

Check [the tests](__tests__) for more examples !

[circleci-href]: https://circleci.com/gh/rakannimer/unistore-fire
[circleci-badge]: https://img.shields.io/circleci/project/github/rakannimer/unistore-fire.svg
[npm-href]: https://www.npmjs.com/package/unistore-fire
[npm-version-badge]: https://img.shields.io/npm/v/npm.svg
[npm-license-badge]: https://img.shields.io/github/license/rakannimer/unistore-fire.svg
[bundlephobia-badge]: https://img.shields.io/bundlephobia/minzip/unistore-fire.svg
[bundlephobia-href]: https://bundlephobia.com/result?p=unistore-fire
