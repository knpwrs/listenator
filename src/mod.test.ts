import listenator from './mod';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('it should yield asynchronously delivered callback arguments and finish', async () => {
  const gen = listenator<number>((emit, done) => {
    let val = 0;
    const tick = () => {
      setTimeout(() => {
        emit(val++);
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
  const gen = listenator<number>((emit, done) => {
    emit(0);
    emit(1);
    emit(2);
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
  const gen = listenator<number>(async (emit, done) => {
    await delay(10);
    emit(0);
    await delay(10);
    emit(1);
    emit(2);
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
  const gen = listenator<number>(async (emit, done) => {
    emit(0);
    emit(1);
    await delay(10);
    emit(2);
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

test('it should stop accepting events after done is called', async () => {
  const gen = listenator<number>(async (emit, done) => {
    emit(0);
    emit(1);
    done();
    emit(2);
  });

  let current = 0;
  let totalValues = 0;

  for await (const num of gen) {
    expect(num).toBe(current++);
    totalValues += 1;
  }

  expect(totalValues).toBe(2);
});
