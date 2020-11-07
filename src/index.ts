export type Factory<T> = (
  emit: (t: T) => unknown,
  done: () => unknown,
) => unknown;

function makeDeferral<T = void>() {
  let resolve: (t: T) => unknown;
  const promise = new Promise<T>((_res) => {
    resolve = _res;
  });

  // @ts-ignore: resolve is not used before it is defined since the code above runs synchronously
  return [resolve, promise] as const;
}

async function defer() {
  const [resolve, promise] = makeDeferral();
  resolve();

  return promise;
}

export default async function* listenator<T>(factory: Factory<T>) {
  // Set up iterator state
  const queue: Array<T> = [];
  let done = false;
  let [resolve, prom] = makeDeferral();

  // Call the factory function with state modifying functions
  factory(
    // emit
    (t: T) => {
      queue.push(t);
      resolve();
    },
    // done
    () => {
      done = true;
      resolve();
    },
  );

  // Asynchronous iterator loop
  while (true) {
    await prom;
    // Flush all queued values
    while (queue.length > 0) {
      yield queue.shift();
      await defer();
    }
    // At this point the queue is empty, should we complete the iterator?
    if (done) {
      break;
    }
    // If we aren't done yet, set up `resolve` and `prom` for the next value
    [resolve, prom] = makeDeferral();
  }
}
