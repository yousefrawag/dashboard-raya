import React, { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { GrFormView } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { FaWhatsapp } from "react-icons/fa";
import useQueryDelete from '../../../services/useQueryDelete';
import useQuerygetiteams from "../../../services/Querygetiteams";
import Loader from '../../../components/common/Loader';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import FiltertionHook from '../../../hooks/FiltertionHook';
import { FiFilter, FiX } from "react-icons/fi";

const EmployeeRepoarts = () => {
  const { isError, isLoading, data } = useQuerygetiteams("DeailyRoutes", "DeailyRoutes");
  const { deleteIteam } = useQueryDelete("customers", "customers");
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Clients");
  const filtersDays = ["الكل" , "يومى", "أسبوعى", "شهرى" ];
const [isSectionOpen , setIssectionOpen] = useState(false)

  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
    dateFilter: "الكل",
  });

  const filters = [
    { value: "employeeID.fullName", name: "الإسم  " },
 
  ];

  const filteredData = useMemo(() => {
    if (!data?.data?.records) return [];

    return data.data?.records.filter(item => {
      if (params.searchTerm && params.field) {
        const fieldValue = params.field.split('.').reduce((obj, key) => obj?.[key], item);
        if (!fieldValue?.toLowerCase().includes(params.searchTerm.toLowerCase())) {
          return false;
        }
      }

      if (params.startDate && params.endDate) {
        const itemDate = new Date(item.createdAt);
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);

        if (!isWithinInterval(itemDate, { start: startDate, end: endDate })) {
          return false;
        }
      }

      if (params.dateFilter) {
        const itemDate = new Date(item.createdAt);
        const now = new Date();

        switch (params.dateFilter) {
          case "يومى":
            if (!isWithinInterval(itemDate, { start: startOfDay(now), end: endOfDay(now) })) {
              return false;
            }
            break;
          case "أسبوعى":
            if (!isWithinInterval(itemDate, { start: startOfWeek(now), end: endOfWeek(now) })) {
              return false;
            }
            break;
          case "شهرى":
            if (!isWithinInterval(itemDate, { start: startOfMonth(now), end: endOfMonth(now) })) {
              return false;
            }
            break;
            case "الكل":
             return true ;
             
          default:
            break;
        }
      }

      return true;
    });
  }, [data, params]);
  const handelStringLength = (text) =>{
    if(text?.length > 20) {
      return `${text.substring(0 , 20)}...`
    } 
    return text
  }
  const columns = [
    {
      name: "وصف التسجيل",
      selector: (row) => row?.employeeID?.fullName,
      cell: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            width: "100%",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src={row?.employeeID?.imageURL}
            alt={row?.employeeID?.fullName }
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <span
            style={{
              overflow: "hidden",
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
            }}
          >
            { "تسجيل الدخول  :  " + row?.employeeID?.fullName }
          </span>
        </div>
      ),
    },
  

    {
      name: "الصلاحيه",
      selector: (row) => row?.employeeID?.role?.name,
    },
    {
        name: "الوظيفة",
        selector: (row) => row?.employeeID?.job,
      },
    {
      name: "وقت التسجيل",
      selector: (row) => row.login,
      cell: (row) => (
        <div>{format(new Date(row.login), "p")}</div>
      ),
    },
    {
        name: "تاريخ الخروج",
        selector: (row) => row.logout,
        cell: (row) => (
          <div>{row?.logout ? format(new Date(row.logout), "hh:mm a") : <span  className='text-lg text-green-500'>أونلاين الأن</span>}</div>
        ),
      },

   
  ];

  if (isLoading) {
    return <Loader />;
  }

  const handleDateFilterChange = (filter) => {
    setParams(prevParams => ({
      ...prevParams,
      dateFilter: filter,
    }));
  };

  return (
    <div>
      
      <div>
        {filtersDays.map((filter, index) => (
          <button
            key={index}
            onClick={() => handleDateFilterChange(filter)}
            className={ params.dateFilter === filter ? `bg-main text-white `: "text-white bg-main2 "}
            style={{ margin: '5px', padding: '10px' , borderRadius:"5px"}}
          >
            {filter}
          </button>
        ))}
      </div>
 
                 <button 
                         className="flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"

                 onClick={() => setIssectionOpen(!isSectionOpen)}>
                {open ? <FiX size={20} /> : <FiFilter size={20} />}
        {isSectionOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </button>
          {
            isSectionOpen &&       <FiltertionHook filteredData={filteredData} columns={columns} filters={filters} params={params} setParams={setParams}/>

          }
      <CustomeTabel data={filteredData} columns={columns}/>
    </div>
  );
};

export default EmployeeRepoarts;