import listenator from './';

test('it should foo', async () => {
  for await (const str of listenator()) {
    expect(str).toBe('foo');
  }
});
