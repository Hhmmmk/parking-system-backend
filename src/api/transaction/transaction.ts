import { IncomingMessage, ServerResponse } from 'http';
import {
  getJSONDataFromRequestStream,
  getQueryParams,
  getPathParams,
  getId,
} from '../../utils/generateParams.utils';

export const transactionRequest = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const customerId = getId(req);

  const getResult = (await getJSONDataFromRequestStream(req)) as {
    transactionId: undefined | string;
  };

  if (!customerId) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return 'Successfully retrieved all active transactions from database';
  }

  if (!getResult.transactionId) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return "Successfully retrieved customer's transactions from database";
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return 'Successfully retrieved transaction data from database';
  }
};
