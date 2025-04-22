"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateAndSort = void 0;
const paginateAndSort = (query, userId) => {
    let { page = 1, order = 'desc', order_by = '', page_size = 10, search = {} } = query;
    // Convert values to proper types
    const take = parseInt(String(page_size)) || 10;
    const skip = (parseInt(String(page)) - 1) * take;
    order = ['asc', 'desc'].includes(order.toLowerCase())
        ? order.toLowerCase()
        : 'desc';
    let orderBy = order_by ? buildOrderBy(order_by, order) : undefined;
    console.log('search', search);
    const whereConditions = Object.entries(search).map(([key, value]) => buildWhereCondition(key, value));
    if (userId) {
        whereConditions.push({ user_id: userId });
    }
    const where = {
        AND: whereConditions
    };
    return { skip, take, orderBy, where };
};
exports.paginateAndSort = paginateAndSort;
const buildOrderBy = (orderBy, order) => {
    const keys = orderBy.split('.');
    let orderQuery = {};
    if (keys.length === 1) {
        orderQuery[keys[0]] = order;
    }
    else {
        let currentLevel = orderQuery;
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                currentLevel[keys[i]] = order;
            }
            else {
                currentLevel[keys[i]] = {};
                currentLevel = currentLevel[keys[i]];
            }
        }
    }
    return orderQuery;
};
const buildWhereCondition = (key, value) => {
    const keys = key.split('.');
    let whereQuery = {};
    if (keys.length === 1) {
        // Direct field, like 'name'
        whereQuery[keys[0]] = { contains: value };
    }
    else {
        let currentLevel = whereQuery;
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                currentLevel[keys[i]] = { contains: value };
            }
            else {
                currentLevel[keys[i]] = {};
                currentLevel = currentLevel[keys[i]];
            }
        }
    }
    return whereQuery;
};
