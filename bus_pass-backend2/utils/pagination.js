export const getPaginationData = (count, pageNo, itemsPerPage) => {
  const totalPages = Math.ceil(count / itemsPerPage);
  const currentPage = parseInt(pageNo) || 1;
  
  return {
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    totalPages,
    itemsPerPage: parseInt(itemsPerPage)
  };
};

export const getPaginationParams = (query) => {
  const pageNo = parseInt(query.pageNo) || 1;
  const itemsPerPage = parseInt(query.itemsPerPage) || 12;
  const offset = (pageNo - 1) * itemsPerPage;
  
  return {
    limit: itemsPerPage,
    offset,
    pageNo,
    itemsPerPage
  };
};
