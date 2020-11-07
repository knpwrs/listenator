import listenator from './';

test('it should asynchronously yield callback arguments and finish', async () => {
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

test('it should synchronously yield callback arguments and finish', async () => {
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
