import createHttpError from 'http-errors';

export const calculatePaginationData = (count, perPage, page) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page && page <= totalPages);
  const hasPreviousPage = page !== 1 && page <= totalPages;

  if (page > totalPages) {
    throw createHttpError(
      400,
      `Bed request, check page and perPage. Params for now: total page = ${totalPages}, perPage = ${perPage}. You're trying open page ${page}`,
    );
    return;
  }
  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
