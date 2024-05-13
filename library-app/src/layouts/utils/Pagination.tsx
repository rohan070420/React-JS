import React from "react";

export const Pagination: React.FC<{
  currentPage: number;
  totalPage: number;
  paginate: any;
}> = (props) => {
  const pageNumbers = [];
  if (props.currentPage === 1) {
    pageNumbers.push(props.currentPage);
    if (props.totalPage >= props.currentPage + 1) {
      pageNumbers.push(props.currentPage + 1);
    }
    if (props.totalPage >= props.currentPage + 2) {
      pageNumbers.push(props.currentPage + 2);
    }
  } else if (props.currentPage > 1) {
    if (props.totalPage >= 3) {
      if (props.currentPage - 2 !== 0) {
        pageNumbers.push(props.currentPage - 2);
      }
      pageNumbers.push(props.currentPage - 1);
    } else {
      pageNumbers.push(props.currentPage - 1);
    }
    pageNumbers.push(props.currentPage);

    if (props.totalPage >= props.currentPage + 1) {
      pageNumbers.push(props.currentPage + 1);
    }
    if (props.totalPage >= props.currentPage + 2) {
      pageNumbers.push(props.currentPage + 2);
    }
  }

  return (
    <nav aria-label="...">
      <ul className="pagination">
        <li className="page-item" onClick={() => props.paginate(1)}>
          <button className="page-link">First Page</button>
        </li>
        {pageNumbers.map((num) => (
          <li
            key={num}
            className={
              "page-item" + (props.currentPage === num ? " active" : "")
            }
            onClick={() => props.paginate(num)}
          >
            <button className="page-link">{num}</button>
          </li>
        ))}

        <li
          className="page-item"
          onClick={() => props.paginate(props.totalPage)}
        >
          <button className="page-link">Last Page</button>
        </li>
      </ul>
    </nav>
  );
};
