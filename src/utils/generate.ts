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

  models.forEach((model) => {
    parsers.push({
      name: model.name,
      callback: (value: number = 0) => {
        if (value === 0) return parse(model);

        let result = '';

        for (let i = 0; i < value; i++) {
          result += parse(model) + (i < value - 1 ? ',' : '');
        }

        return '[' + result + ']';
      }
    })
  });

  return parse(json);

  function parse(model: Model) {
    let result = model.value;

    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      const regexArray = new RegExp(`${parser.name}\\((\\-?\\d+)\\)`, 'g');
      const regexObject = new RegExp(`${parser.name}\\(\\)`, 'g');

      if (regexObject.test(model.value)) {
        result = result.replace(regexObject, () => {
          return parser.callback();
        })
      }

      if (regexArray.test(model.value)) {
        result = result.replace(regexArray, (_, p1: string) => {
          return parser.callback(Number(p1));
        });
      }
    }

    return result;
  }
};
