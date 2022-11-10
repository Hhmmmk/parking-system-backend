import { createServer, IncomingMessage, ServerResponse } from 'http';

import {
  getJSONDataFromRequestStream,
  getQueryParams,
  getPathParams,
  getId,
} from './utils/generateParams.utils';

import { entranceRequest } from './api/entrance/entrance';
import { slotsRequest } from './api/parking/slots';
import { zonesRequest } from './api/parking/zones';
import { customerRequest } from './api/customer/customer';
import { transactionRequest } from './api/transaction/transaction';

const port = 8080;

const listener = async (req: IncomingMessage, res: ServerResponse) => {
  console.log(getQueryParams(req));
  try {
    let result: string | object = 'test';

    if ((req.url as string).match('/entrance(.*?)')) {
      result = (await entranceRequest(req, res)) as string | object;
    } else if ((req.url as string).match('/parking/slots(.*?)')) {
      result = (await slotsRequest(req, res)) as string | object;
    } else if ((req.url as string).match('/parking/zones(.*?)')) {
      result = (await zonesRequest(req, res)) as string | object;
    } else if ((req.url as string).match('/customer(.*?)')) {
      result = (await customerRequest(req, res)) as string | object;
    } else if ((req.url as string).match('/transaction(.*?)')) {
      result = (await transactionRequest(req, res)) as string | object;
    }

    res.end(JSON.stringify(result));
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(error));
  }
};

const server = createServer(listener);
server.listen(port);
