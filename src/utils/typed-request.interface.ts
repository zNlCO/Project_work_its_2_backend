import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// T = body, Q = query string, P = params
export interface TypedRequest<T = unknown, Q = ParsedQs, P = ParamsDictionary>
          extends Request<P, any, T, Q> { };

export { ParsedQs, ParamsDictionary };