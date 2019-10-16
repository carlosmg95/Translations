import * as jwt from 'jsonwebtoken';

import log from './log';
import { UserResponse } from '../type-res';

const getTokenData = (headers: any): any => {
  const auth: string = headers.authorization;

  if (!auth) {
    log.info('There is no logged user.');
    return undefined;
  }

  const token: string = auth.replace('Bearer ', '');
  const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET);

  return decoded;
};

const getUserId = (headers: any): string =>
  getTokenData(headers) ? getTokenData(headers).id : '0';

const userIsAdmin = (headers: any): boolean =>
  getTokenData(headers) ? getTokenData(headers).admin : false;

const userIsAllowed = async (
  prisma: any,
  headers: any,
  resource: 'projects' | 'languages',
  resourceKey: string,
  resourceValue: string,
): Promise<boolean> => {
  const userId: string = getUserId(headers);
  const user: any = await prisma.query.user(
    { where: { id: userId } },
    UserResponse,
  );
  return user[resource].map(r => r[resourceKey]).indexOf(resourceValue) > -1;
};

export { getUserId, userIsAdmin, userIsAllowed };
