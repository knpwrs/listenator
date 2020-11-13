# listenator

![TypeScript](https://img.shields.io/badge/TypeScript-ES2018-blue)
[![Dependency Status](https://img.shields.io/david/knpwrs/listenator.svg)](https://david-dm.org/knpwrs/listenator)
[![devDependency Status](https://img.shields.io/david/dev/knpwrs/listenator.svg)](https://david-dm.org/knpwrs/listenator#info=devDependencies)
[![Build Status](https://img.shields.io/github/workflow/status/knpwrs/listenator/CI)](https://github.com/knpwrs/listenator/actions)
[![Npm Version](https://img.shields.io/npm/v/listenator.svg)](https://www.npmjs.com/package/listenator)
[![Deno](https://img.shields.io/badge/deno-ready-blue)](https://deno.land/x/listenator)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Badges](https://img.shields.io/badge/badges-7-orange.svg)](http://shields.io/)

Turn any event stream into an async generator. Inspired by [`eventChannel`][ec]
from [`redux-saga`][rs]. Includes TypeScript typings.

## Usage

This package has one default export, `listenator`, which takes a function as an
argument. That function should itself take one or two arguments, `emit` and
optionally `done`. `listenator` returns an [Asynchronous Generator][ag] which
yields anything passed to `emit`. Calling `done` will flush any queued events
and then complete the generator.

Note that this package is not transpiled to ES5. It targets ES2018. If you need
to support older browsers or Node versions you will need to process it with
Babel or TypeScript.

## Examples

### Simple

```js
import listenator from 'listenator';

const numbers = listenator((emit, done) => {
  emit(1);
  emit(2);
  emit(3);
  done();
});

// In an async context this will log 1, 2, and then 3:
for await (const num of numbers) {
  console.log(num);
}

// Execution picks up here because `done` was called
console.log('Hello!');
```

### DOM Events

```js
import listenator from 'listenator';

const clicks = listenator((emit) => {
  const button = document.getElementById('my-btn');
  button.addEventListener('click', emit);
});

// In an async context this will log every click event from clicking on #my-btn
for await (const click of clicks) {
  console.log(num);
}
```

### Node Events

```js
import listenator from 'listenator';
import EventEmitter from 'events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

const events = listenator((emit) => {
  myEmitter.on('event', () => {
    console.log('an event occurred!');
  });
});

myEmitter.emit('event', 'foo');

// In an async context:
for await (const event of events) {
  console.log(event); // Logs 'foo', and then all future emits
}
```

### Multiple Arguments

Just pass an array and destructure it on the way out:

```js
import listenator from 'listenator';

const numbers = listenator((emit) => {
  emit([1, 2, 3]);
});

// In an async context:
for await (const [x, y, z] of numbers) {
  console.log(`(${x}, ${y}, ${z})`);
}
```

### Deno

```js
import listenator from 'https://deno.land/x/listenator/mod.ts';

const numbers = listenator((emit, done) => {
  emit(1);
  emit(2);
  emit(3);
  done();
});

// In an async context this will log 1, 2, and then 3:
for await (const num of numbers) {
  console.log(num);
}

// Execution picks up here because `done` was called
console.log('Hello!');
```

## Contributing

Please run `make init` in the root directory before making any commits so the
`commit-msg` hook can validate your commit messages.

## Prior Art

* [`eventChannel`][ec] from [`redux-saga`][rs]
* [`asynciterify`][aify] (less generic than this package, more
  implementation-bound, no TypeScript)

## License

**MIT**

[ag]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
[aify]: https://github.com/mattkrick/asynciterify
[ec]: https://redux-saga.js.org/docs/advanced/Channels.html#using-the-eventchannel-factory-to-connect-to-external-events
[rs]: https://redux-saga.js.org/
