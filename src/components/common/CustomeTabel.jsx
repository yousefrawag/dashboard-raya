import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const CustomeTabel = ({ columns, data }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("customerTablePage") || 1)
  );

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: isDarkMode ? "#1A222C" : "#F1F5F9",
        color: "#79818F",
        fontSize: "18px",
        fontWeight: "normal",
        border: "none",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        color: isDarkMode ? "#ccc" : "#000",
        backgroundColor: isDarkMode ? "#202938" : "#FFF",
      },
    },
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem("customerTablePage", page);
  };

  return (
    <div className="p-4 space-y-4 rounded-md bg-[#fff] dark:bg-boxdark">
      <DataTable
        columns={columns}
        data={data}
        selectableRows
        fixedHeader
        fixedHeaderScrollHeight="450px"
        pagination
        paginationDefaultPage={currentPage}
        onChangePage={handlePageChange}
        customStyles={customStyles}
        className="rounded-lg text-sm text-gray-700 border-none"
      />
    </div>
  );
};

export default CustomeTabel;
