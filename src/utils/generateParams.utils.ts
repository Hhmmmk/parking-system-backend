import { IncomingMessage } from 'http';
import * as url from 'url';
import { each } from 'lodash';

export const getJSONDataFromRequestStream = (req: IncomingMessage) =>
  new Promise((resolve) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    req.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
  });

export const getQueryParams = (req: IncomingMessage) => {
  const requestURL = url.parse(req.url as string, true);

  return requestURL.query ? requestURL.query : {};
};

interface paramsInput {
  [key: string]: string;
}

export const getPathParams = (url: string, path: string) => {
  const explodedURL = url.split(/[/?]+/);
  const explodedPath = path.split(/[/?]+/);
  const params: paramsInput = {};

  each(explodedPath, (resources, index) => {
    const pathParam = resources.match(/:(\w.*)/);
    if (pathParam && explodedURL[index]) {
      params[pathParam[1]] = explodedURL[index];
    }
  });

  return params;
};

export const getId = (req: IncomingMessage) => {
  const id = getQueryParams(req).id as string;
  return id;
};
