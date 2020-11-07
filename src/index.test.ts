import listenator from './';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('it should yield asynchronously delivered callback arguments and finish', async () => {
  const gen = listenator<number>((callback, done) => {
    let val = 0;
    const tick = () => {
      setTimeout(() => {
        callback(val++);
        if (val < 3) {
          tick();
        } else {
          done();
        }
      }, 10);
    };
    tick();
  });

  let current = 0;
  let totalValues = 0;

  for await (const num of gen) {
    expect(num).toBe(current++);
    totalValues += 1;
  }

  expect(totalValues).toBe(3);
});

test('it should yield synchronously delivered callback arguments and finish', async () => {
  const gen = listenator<number>((callback, done) => {
    callback(0);
    callback(1);
    callback(2);
    done();
  });

  let current = 0;
  let totalValues = 0;

  for await (const num of gen) {
    expect(num).toBe(current++);
    totalValues += 1;
  }

  expect(totalValues).toBe(3);
});

test('it should yield both asynchronously and synchronously delivered callback arguments and finish', async () => {
  const gen = listenator<number>(async (callback, done) => {
    await delay(10);
    callback(0);
    await delay(10);
    callback(1);
    callback(2);
    done();
  });

  let current = 0;
  let totalValues = 0;

  for await (const num of gen) {
    expect(num).toBe(current++);
    totalValues += 1;
  }

  expect(totalValues).toBe(3);
});

test('it should yield both synchronously and asynchronously delivered callback arguments and finish', async () => {
  const gen = listenator<number>(async (callback, done) => {
    callback(0);
    callback(1);
    await delay(10);
    callback(2);
    await delay(10);
    done();
  });

  let current = 0;
  let totalValues = 0;

  for await (const num of gen) {
    expect(num).toBe(current++);
    totalValues += 1;
  }

  expect(totalValues).toBe(3);
});
