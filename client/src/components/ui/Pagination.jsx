import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) {
      pageNumbers.unshift(1);
      if (startPage > 2) {
        pageNumbers.splice(1, 0, "...");
      }
    }

    if (endPage < totalPages) {
      pageNumbers.push(totalPages);
      if (endPage < totalPages - 1) {
        pageNumbers.splice(pageNumbers.length - 1, 0, "...");
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-xs bg-accent shadow-sm disabled:bg-secondary rounded-md text-primary-foreground
        transition-all duration-300"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage || page === "..."}
          className={`px-2 py-1 text-xs rounded-md 
            transition-all duration-300
            ${
              page == currentPage
                ? "bg-primary-highlight text-primary-highlight-foreground"
                : "bg-accent shadow-sm text-primary-foreground"
            }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-xs bg-accent disabled:bg-secondary shadow-sm rounded-md text-primary-foreground
        transition-all duration-300"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Pagination;
