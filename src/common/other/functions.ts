export function filterBySearch<T>(
  items: T[],
  search: string,
  getField: (item: T) => string
): T[] {
  if (!search) return items;
  const searchLower = search.toLowerCase();
  return items.filter(item =>
    getField(item).toLowerCase().includes(searchLower)
  );
}

async findAll(query: QueryTransactionDto) {
  const { page, limit, type, categoryId, dateFrom, dateTo, search, sortBy, sortOrder } = query;

  const qb = this.transactionRepository.createQueryBuilder('t');

  if (type) qb.andWhere('t.type = :type', { type });
  if (categoryId) qb.andWhere('t.categoryId = :categoryId', { categoryId });
  if (dateFrom) qb.andWhere('t.date >= :dateFrom', { dateFrom });
  if (dateTo) qb.andWhere('t.date <= :dateTo', { dateTo });
  if (search) qb.andWhere('t.description ILIKE :search', { search: `%${search}%` });
  const sortField = sortBy === 'date' ? 't.date' : 't.amount';
  qb.orderBy(sortField, sortOrder);

  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
) {
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
