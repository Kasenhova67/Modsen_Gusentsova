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

export function sortByField<T>(
  items: T[],
  sortBy: keyof T,
  sortOrder: 'ASC' | 'DESC' = 'ASC'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'date') {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortOrder === 'ASC' ? aDate - bDate : bDate - aDate;
    }    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'ASC' ? aValue - bValue : bValue - aValue;
    }    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'ASC'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }    
    return 0;
  });
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