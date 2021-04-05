import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

import { Model } from '../type';

export const generate = (json: Model, models: Model[]) => {
  const parsers = [
    {
      name: 'RANDOM_STRING',
      callback: (value: number = 12) => `"${nanoid(value)}"`,
    },
    {
      name: 'RANDOM_NUMBER',
      callback: (value: number = 10) => `${Math.floor(Math.random() * value)}`,
    },
    {
      name: 'RANDOM_DATE',
      callback: (value: number = -7) => {
        const currentDate = dayjs().toDate().getTime();
        const prevSevenDate = dayjs().date(value).toDate().getTime();
        return `"${(new Date(prevSevenDate + Math.random() * (currentDate - prevSevenDate))).toISOString()}"`;
      }
    }
  ];

  models.forEach((model) => {
    parsers.push({
      name: model.name,
      callback: (value: number = 0) => {
        if (value === 0) {
          return parse(model);
        }

        let result = '';

        for (let i = 0; i < value; i++) {
          if (i === 0) result += '[';

          result += parse(model);
          if (i < value - 1) result += ',';
          if (i === value - 1) result += ']';
        }

        return result;
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
