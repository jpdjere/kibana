/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';

/**
 * Types the TimeLength as:
 *   - A string that is not empty
 */
export const TimeLength = new t.Type<string, string, unknown>(
  'TimeLength',
  t.string.is,
  (input, context): Either<t.Errors, string> => {
    if (typeof input === 'string' && input.trim() !== '') {
      try {
        const inputLength = input.length;
        const time = parseInt(input.trim().substring(0, inputLength - 1), 10);
        const unit = input.trim().at(-1);
        if (Number.isSafeInteger(time) && (unit === 's' || unit === 'm' || unit === 'h')) {
          return t.success(input);
        } else {
          return t.failure(input, context);
        }
      } catch (error) {
        return t.failure(input, context);
      }
    } else {
      return t.failure(input, context);
    }
  },
  t.identity
);

export type TimeLengthC = typeof TimeLength;
