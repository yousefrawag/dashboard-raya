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
import GetclientsTypes from "../../../components/common/GetclientsTypes"

import GetclientsWithviedtyes from "../../../components/common/GetclientsWithviedtyes"
import GetclientMostReqions from "../../../components/common/GetclientMostReqions"
import GetClientsCashoption from "../../../components/common/GetClientsCashoption"
import GetClientSource from '../../../components/common/GetClientSource';
import GetclientsFirstpayments from "../../../components/common/GetclientsFirstpayments"
import MostEmployeeaddecutomers from '../../../components/common/MostEmployeeaddecutomers';
import MostPorjectRequestsBycustomers from '../../../components/common/MostPorjectRequestsBycustomers';
const CutsomerRepoarts = () => {
  const { isError, isLoading, data } = useQuerygetiteams("customers", "customers");
  const { deleteIteam } = useQueryDelete("customers", "customers");
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Clients");
  const filtersDays = ["الكل" , "يومى", "أسبوعى", "شهرى" ];

  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
    dateFilter: "الكل",
  });

    
  const filters = [
    {value:"addBy", name:"إسم المسوق"}, 

    {value:"fullName", name:"إسم المشترى"} 
    ,{value:"phoneNumber", name:"جوال"} 
        ,{value:"secondaryPhoneNumber", name:"جوال 2"} 

      ,{value:"source", name:"مصدر العميل"} 
    , {value:"clientStatus", name:"حالة العميل"} 

    ,{value:"region", name:"موقع المشروع"} 
    , {value:"project", name:"مهتم بمشروع"} 
    , {value:"currency", name:"نوع العملة"} 

    , {value:"cashOption", name:"الدفع كاش"} 

    , {value:"firstPayment", name:"الدفعة الإولى"} 
    , {value:"installmentsPyYear", name:"تقسيط على كام سنة"} 

    , {value:"clientendRequr", name:" أخر ماتم التواصل مع العميل"} 

    , {value:"isViwed", name:"هل تمت المعاينة"} 
    , {value:"clientRequire", name:"متطلبات العميل"} 
    , {value:"notes", name:"ملاحظات"} 
 
  ];

  const filteredData = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data?.data.filter(item => {
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
    name: "إسم المشترى",
    selector: (row) => row?.fullName,
    cell: (row) => (
              <Link to={`/cutomers/${row._id}`} >{row.fullName}</Link>
    )
  },
      {
        name: "جوال 1",
     
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display:"flex",
              flexDirection:"column",
              gap:"10px"
            }}
          >
            {" "}
           { row.phoneNumber}
      
            <a style={{fontSize:"20px" , color:"#075E54"}}  href={`whatsapp://send?phone=${row.phoneNumber}`} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
            </a>
         
          </span>
        ),
      },
         {
              name: "جوال 2",
           
              cell: (row) => (
                <span
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display:"flex",
                    flexDirection:"column",
                    gap:"10px"
                  }}
                >
                  {" "}
                 { row.secondaryPhoneNumber || "غير متوفر"}
            
                  <a style={{fontSize:"20px" , color:"#075E54"}}  href={`whatsapp://send?phone=${row.secondaryPhoneNumber}`} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp />
                  </a>
               
                </span>
              ),
            },
              {
        name: "وظيفة العميل",
        selector: (row) => row?.clientwork,
         width:"160px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.clientwork || "غير متوفر" }
          </span>
        )
      },
            {
        name: "مصدر العميل",
    
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
             
            }}
          >
            {" "}
           { row?.source}
          </span>
        )
      },
      {
        name: "إسم المسوق /ة",
        selector: (row) => row?.addBy,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.addBy }
          </span>
        )
      },
      {
        name: "المشروع المهتم به",
    
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
              overflow: "hidden",
            }}
          >
            {" "}
           { row?.project}
          </span>
        )
      },
    {
  name: "الدفعة الإولى",
  sortable: true,
  // لو حابب ترتب بشكل رقمي
  sortFunction: (rowA, rowB) => {
    return Number(rowA.firstPayment) - Number(rowB.firstPayment);
  },
  cell: (row) => (
    <span>
      {Number(row?.firstPayment).toLocaleString("en-US")}
    </span>
  ),
} ,
           {
        name: "العملة",
     width:"120px" ,
        cell: (row) => (
          <span
         
          >
            {" "}
           { row?.currency}
          </span>
        )
        
      },
      {
        name: "تاريخ أخر تواصل",
        selector: (row) => row.endContactDate,
        cell: (row) => {
          const date = new Date(row.endContactDate);
          return isNaN(date) ? (
            "غير معروف"
          ) : (
            <span
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "wrap",
                overflow: "hidden",
              }}
              title ={format(date, "dd MMMM, yyyy")}
            >
  
              { row.endContactDate  ? format(date, "dd MMMM, yyyy") :"غير مضاف"}
            </span>
          );
        },
      },
      {
        name: " اخر ماتم التواصل",
        selector: (row) => row.clientendRequr,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
            title={row?.clientendRequr}
          >
            {" "}
           {handelStringLength (row?.clientendRequr)}
          </span>
        )
      },
      {
        name: "هل تمت المعاينة",
        selector: (row) => row.isViwed,
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              
            }}
          >
            {" "}
           { row.isViwed}
          </span>
        ),
      },
      {
        name: "متطلبات العميل",
        selector: (row) => row?.clientRequire,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
            title={row?.clientRequire}
          >
            {" "}
            { row?.clientRequire}
          </span>
        )
      },
      {
        name: "ملاحظات",
        selector: (row) => row?.notes,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
            title={row?.notes}
          >
            {" "}
           { handelStringLength(row?.notes) }
          </span>
        )
      },
        {
          name:"تاريخ الإنشاء",
          selector: (row) => row.createdAt,
          cell: (row) => <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace:"wrap"}}>{format(new Date(row.createdAt), "dd MMMM, yyyy")}</span>
        },

      ];
      
     const columnsfile = [
        {
          name: "إسم المسوق",
          selector: (row) => row.addBy,
        },
        {
          name: "إسم المشترى",
          selector: (row) => row.fullName,
        },
        {
          name: "جوال 1",
          selector: (row) => row.phoneNumber,
        },
        {
          name: "جوال 2",
          selector: (row) => row.secondaryPhoneNumber,
        },
                {
        name: "وظيفة العميل",
        selector: (row) => row?.clientwork,

      },
              {
          name: "مصدر العميل",
          selector: (row) => row.source,
        },
        {
          name: "حالة العميل",
          selector: (row) => row.clientStatus,
          cell: (row) => (
            <span
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {" "}
              {row.clientStatus }
            </span>
          ),
        },
        {
          name: "موقع المشروع",
          selector: (row) => row.region,
        },
        {
          name: "المشروع المهتم به",
          selector: (row) => row?.project,
        },
        {
          name: "نوع العملة",
          selector: (row) => row?.currency,
        },
      
    
    
        {
          name: "الدفع كاش",
          selector: (row) => row.cashOption,
        },
        {
          name: " الدفعة الأولى",
          selector: (row) => row.firstPayment,
        },
        {
          name: "تقسيط على كام سنة",
          selector: (row) => row.installmentsPyYear ,
        },
     
        {
          name: "تاريخ اخر تواصل",
          selector: (row) => format(new Date(row.endContactDate ), "dd MMMM, yyyy"),
       
        },
        {
          name: "اخر ماتم التواصل مع  العميل",
          selector: (row) => row.clientendRequr ,
        },
        {
          name: "تحديد موعد ",
          selector: (row) => format(new Date(row.customerDate ), "dd MMMM, yyyy"),
       
        },
        {
          name: "هل تمت المعاينة",
          selector: (row) => row.isViwed
       
        },
        {
          name: "متطلبات العميل",
          selector: (row) => row.clientRequire ,
        },
        {
          name: "ملاحظات",
          selector: (row) => row.notes ,
        },
        {
          name: "قسم المتابعة",
          selector: (row) => row?.SectionFollow?.map((item) => {
            const userName = item?.user?.fullName || '';
            const createdAt = item?.createdAt ? arabicTimeAgo(item?.createdAt) : '';
            const details = item?.details || '';
            const detailsDate = item?.detailsDate ? format(new Date(item.detailsDate), "dd MMMM, yyyy") : 'غير محدد';
            const status = item?.CustomerDealsatuts || '';
        
            return `الإسم: ${userName}\nتاريخ النشر: ${createdAt}\nالتفاصيل: ${details}\nتاريخ الإتصال: ${detailsDate}\nالحالة: ${status}`;
          }).join("\n\n") || '', // join to merge multiple items nicely
        } ,
        
        {
          name: "تاريخ الانشاء",
          selector: (row) =>  format(new Date(row.createdAt ), "dd MMMM, yyyy"),
      
        },
    
      ];;
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
      <HeadPagestyle isAdmin={isAdmin} CanAdd={CanAdd} pageName="تقارير العملاء" to="/Add-Customer" title="إضافة عميل"/>
      
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
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
      
    <GetclientsTypes  data={filteredData}  setparams={setParams}/>
    <GetclientsWithviedtyes  data={filteredData} setparams={setParams}/>
    <GetclientMostReqions  data={filteredData} setparams={setParams}/>
    <MostEmployeeaddecutomers  data={filteredData} setparams={setParams} />
    <GetClientsCashoption  data={filteredData} setparams={setParams}/>
    <GetclientsFirstpayments  data={filteredData} setparams={setParams}/>
    <MostPorjectRequestsBycustomers data={filteredData} setparams={setParams}/>
    <GetClientSource  data={filteredData} setparams={setParams}/>
      </div>
      <Link  to="/dashboard">
      جميع الإحصائيات
      </Link>
      <FiltertionHook filteredData={filteredData} columns={columnsfile} filters={filters} params={params} setParams={setParams}/>
      <CustomeTabel data={filteredData} columns={columns}/>
    </div>
  );
};

export default CutsomerRepoarts;