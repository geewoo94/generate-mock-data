import { generate, interpolateParentheses } from './generate';

const removeSpace = (string: string) => {
  const regex = /\s/g
  return string.replace(regex, '');
}

describe('interpolateParentheses', () => {
  test('should replace source', () => {
    const target = 'RANDOM_STRING()';
    const key = 'RANDOM_STRING';
    const to = () => "some";
    const expected = "some";

    expect(interpolateParentheses(target, key, to)).toEqual(expected);
  });

  test('should replace array source', () => {
    const target = 'RANDOM_STRING(3)';
    const key = 'RANDOM_STRING';
    const to = (val?: number) => {
      if (!val) {
        return '{ id: "some" }';
      }

      let result = [];

      for (let i = 0; i < val; i++) {
        result.push('{ id: "some" }');
      }

      return '[' + result.join(',') + ']';
    };
    const expected = '[{ id: "some" },{ id: "some" },{ id: "some" }]';

    expect(interpolateParentheses(target, key, to)).toEqual(expected);
  });

  test('variable case', () => {
    const target = '{ "id": RANDOM_STRING() }';
    const key = 'RANDOM_STRING';
    const to = () => '"some_key"';
    const expected = '{ "id": "some_key" }';

    expect(interpolateParentheses(target, key, to)).toEqual(expected);
  });

  test('return original target if there is no match key', () => {
    const target = '{ "id": RANDOM_STRING() }';
    const key = 'UNEXPECTED';
    const to = () => '"some_key"';
    const expected = '{ "id": RANDOM_STRING() }';

    expect(interpolateParentheses(target, key, to)).toEqual(expected);
  });
});

describe('generate', () => {
  test('random string', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: `{
          "id": RANDOM_STRING()
        }`,
    };
    const matchRegex = new RegExp('{"id":".{12}"}');
    const result = removeSpace(generate(json))
    const expected = result.match(matchRegex);

    expect(result).not.toBeNull();
    expect(result).toEqual((expected as RegExpMatchArray)[0]);
  });

  test('random string with custom length', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: `{
          "id": RANDOM_STRING(20)
        }`,
    };
    const matchRegex = new RegExp('{"id":".{20}"}');
    const result = removeSpace(generate(json))
    const expected = result.match(matchRegex);

    expect(result).not.toBeNull();
    expect(result).toEqual((expected as RegExpMatchArray)[0]);
  });

  test('random number', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: `{
          "id": RANDOM_NUMBER()
        }`,
    };
    const matchRegex = new RegExp('{"id":[0-9]+}');
    const result = removeSpace(generate(json))
    const expected = result.match(matchRegex);

    expect(result).not.toBeNull();
    expect(result).toEqual((expected as RegExpMatchArray)[0]);
  });

  test('random number with custom number', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: `{
          "id": RANDOM_NUMBER(999)
        }`,
    };
    const matchRegex = new RegExp('{"id":[0-9]+}');
    const result = removeSpace(generate(json))
    const expected = result.match(matchRegex);

    expect(result).not.toBeNull();
    expect(result).toEqual((expected as RegExpMatchArray)[0]);
  });

  test('random date', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: `{
          "created_at": RANDOM_DATE()
        }`,
    };
    const matchRegex = new RegExp('{"created_at":".+"}');
    const result = removeSpace(generate(json))
    const expected = result.match(matchRegex);

    expect(result).not.toBeNull();
    expect(result).toEqual((expected as RegExpMatchArray)[0]);
  });

  test('with mock model once', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: `{
          "created_at": DM()
        }`,
    };
    const models = [
      {
        id: 'DM',
        name: 'DM',
        value: `{
          "id": RANDOM_STRING()
        }`,
      },
    ];
    const matchRegex = new RegExp(
      '{"created_at":{"id":"(.{12})"}}'
    );
    const result = removeSpace(generate(json, models))
    const expected = result.match(matchRegex);

    expect(result).not.toBeNull();
    expect(result).toEqual((expected as RegExpMatchArray)[0]);
  });

  test('with mock model', () => {
    const json = {
      id: '@json',
      name: '@json',
      value: `{
          "created_at": DM(2)
        }`,
    };
    const models = [
      {
        id: 'DM',
        name: 'DM',
        value: `{
          "id": RANDOM_STRING()
        }`,
      },
    ];
    const matchRegex = new RegExp(
      '{"created_at":\\[{"id":"(.{12})"},{"id":"(.{12})"}\\]}'
    );
    const result = removeSpace(generate(json, models))
    const expected = result.match(matchRegex);

    expect(result).not.toBeNull();
    expect(result).toEqual((expected as RegExpMatchArray)[0]);
    expect((expected as RegExpMatchArray)[1]).not.toEqual((expected as RegExpMatchArray)[2]);
  });
});
