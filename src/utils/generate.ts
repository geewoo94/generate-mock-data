import { nanoid } from 'nanoid';

import { Model } from '../type';

const makeRandomString = (val = 12) => nanoid(val);
const makeRandomNumber = (val = 10) => Math.floor(Math.random() * val);
const makeRandomDate = (n = -7) => {
  const currentTime = new Date().getTime();
  const prevNthTime = new Date().getTime() - 1000 * 60 * 60 * 24 * -n;

  return new Date(
    prevNthTime + Math.random() * (currentTime - prevNthTime)
  );
};

export const interpolateParentheses = (
  target: string,
  key: string,
  callback: (val?: number) => any
) => {
  const regexObject = new RegExp(`${key}\\(\\)`, 'g');
  const regexArray = new RegExp(`${key}\\((\\-?\\d+)\\)`, 'g');

  if (regexObject.test(target)) {
    return target.replace(regexObject, callback());
  }

  if (regexArray.test(target)) {
    return target.replace(regexArray, (_, $1) => callback($1));
  }

  return target;
};

export const generate = (json: Model, models: Model[] = []) => {
  const parsers = [
    {
      name: 'RANDOM_STRING',
      callback: (val: number = 12) => `"${makeRandomString(val)}"`,
    },
    {
      name: 'RANDOM_NUMBER',
      callback: (val: number = 10) => `${makeRandomNumber(val)}`,
    },
    {
      name: 'RANDOM_DATE',
      callback: (n: number = -7) => `"${makeRandomDate(n).toISOString()}"`,
    }
  ];

  for (const model of models) {
    parsers.push({
      name: model.name,
      callback: (val?: number) => {
        if (!val) return parse(model);

        let result = [];

        for (let i = 0; i < val; i++) {
          result.push(parse(model));
        }

        return '[' + result.join(',') + ']';
      },
    });
  }

  return parse(json);

  function parse(model: Model) {
    let result = model.value;

    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      result = interpolateParentheses(result, parser.name, parser.callback);
    }

    return result;
  }
};
