export interface PaginationParams {
  page?: number;
  page_size?: number;
  order?: 'asc' | 'desc';
  order_by?: string;
  search?: Record<string, string>;
}

export const paginateAndSort = (query: PaginationParams) => {
  let { page = 1, order = 'desc', order_by = '', page_size = 10, search = {} } = query;

  // Convert values to proper types
  const take = parseInt(String(page_size)) || 10;
  const skip = (parseInt(String(page)) - 1) * take;
  order = ['asc', 'desc'].includes(order.toLowerCase())
    ? (order.toLowerCase() as 'asc' | 'desc')
    : 'desc';

  let orderBy = order_by ? buildOrderBy(order_by, order) : undefined;

  const where = {
    AND: Object.entries(search).map(([key, value]) => buildWhereCondition(key, value))
  };

  return { skip, take, orderBy, where };
};

const buildOrderBy = (orderBy: string, order: 'asc' | 'desc') => {
  const keys = orderBy.split('.');
  let orderQuery: any = {};

  if (keys.length === 1) {
    orderQuery[keys[0]] = order;
  } else {
    let currentLevel: any = orderQuery;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        currentLevel[keys[i]] = order;
      } else {
        currentLevel[keys[i]] = {};
        currentLevel = currentLevel[keys[i]];
      }
    }
  }

  return orderQuery;
};

const buildWhereCondition = (key: string, value: string) => {
  const keys = key.split('.');
  let whereQuery: any = {};

  if (keys.length === 1) {
    // Direct field, like 'name'
    whereQuery[keys[0]] = { contains: value };
  } else {
    let currentLevel: any = whereQuery;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        currentLevel[keys[i]] = { contains: value };
      } else {
        currentLevel[keys[i]] = {};
        currentLevel = currentLevel[keys[i]];
      }
    }
  }

  return whereQuery;
};
