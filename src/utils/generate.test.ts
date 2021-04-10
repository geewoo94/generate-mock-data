import { generate } from './generate';

const removeSpace = (string: string) => {
  const regex = /\s/g
  return string.replace(regex, '');
}

describe('generate', () => {
  test('random string', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: (
        `{
          "id": RANDOM_STRING()
        }`
      )
    };
    const matchRegex = new RegExp('{"id":".{12}"}');

    expect(matchRegex.test(removeSpace(generate(json)))).toBe(true);
  });

  test('random string with custom length', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: (
        `{
          "id": RANDOM_STRING(20)
        }`
      )
    };
    const matchRegex = new RegExp('{"id":".{20}"}');

    expect(matchRegex.test(removeSpace(generate(json)))).toBe(true);
  });

  test('random number', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: (
        `{
          "id": RANDOM_NUMBER()
        }`
      )
    };
    const matchRegex = new RegExp('{"id":[0-9]+}');

    expect(matchRegex.test(removeSpace(generate(json)))).toBe(true);
  });

  test('random number with custom number', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: (
        `{
          "id": RANDOM_NUMBER(999)
        }`
      )
    };
    const matchRegex = new RegExp('{"id":[0-9]+}');

    expect(matchRegex.test(removeSpace(generate(json)))).toBe(true);
  });

  test('random date', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: (
        `{
          "created_at": RANDOM_DATE()
        }`
      )
    };
    const matchRegex = new RegExp('{"created_at":".+"}');

    expect(matchRegex.test(removeSpace(generate(json)))).toBe(true);
  });

  test('with mock model', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: (
        `{
          "created_at": DM(2)
        }`
      )
    };
    const models = [{
      id: 'DM',
      name: 'DM',
      value: (
        `{
          "id": RANDOM_STRING()
        }`
      )
    }]
    const matchRegex = new RegExp('{"created_at":\\[{"id":"(.{12})"},{"id":"(.{12})"}\\]}');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, $1, $2] =removeSpace(generate(json, models)).match(matchRegex) as RegExpMatchArray;

    expect($1 === $2).toBe(false);
    expect(matchRegex.test(removeSpace(generate(json, models)))).toBe(true);
  });
});
