import React, { useState, useMemo } from 'react';
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
import { FiFilter, FiX } from "react-icons/fi";
import { MdOutlineAddIcCall } from "react-icons/md";
import { format, startOfDay, endOfDay,startOfYear , endOfYear, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

import GetclientsWithviedtyes from "../../../components/common/GetclientsWithviedtyes"
import GetclientMostReqions from "../../../components/common/GetclientMostReqions"
import GetClientsCashoption from "../../../components/common/GetClientsCashoption"
import GetClientSource from '../../../components/common/GetClientSource';
import GetclientsFirstpayments from "../../../components/common/GetclientsFirstpayments"
import MostEmployeeaddecutomers from '../../../components/common/MostEmployeeaddecutomers';
import MostPorjectRequestsBycustomers from '../../../components/common/MostPorjectRequestsBycustomers';
import CustomersJourneyAnalytics from '../../../components/common/CustomersJourneyAnalytics';
const CutsomerRepoarts = () => {
       const [paramsapi, setParamsapi] = useState({
          field: "",
          searchTerm: "",
          startDate: "",
          endDate: "",
        });
  const { isError, isLoading, data } = useQuerygetiteams("customers", "customers" , paramsapi);
  const { deleteIteam } = useQueryDelete("customers", "customers");
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Clients");
  const filtersDays = ["الكل" , "يومى", "أسبوعى", "شهرى" , "سنوى" ];
const [isSectionOpen , setIssectionOpen] = useState(false)

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
, {value:"ContactDate", name:"تاريخ التواصل"} 
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
                           case "سنوى":
                  if (!isWithinInterval(itemDate, { 
                    start: startOfYear(now), 
                    end: endOfYear(now) 
                  })) {
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
    name: " إتصال",
    width:"100px" ,
    selector: (row) => row?.fullName,
    cell: (row) => (
      <Link to={`/customer-add-contact/${row._id}`} className='flex items-center justify-center'>
        <MdOutlineAddIcCall size={25} />

      </Link>
    )
  },
      {
        name: "إسم المشترى",
        width:"110px" ,
        selector: (row) => row?.fullName,
        cell: (row) => (
                  <Link   target="_blank" 
  rel="noopener noreferrer" to={`/cutomers/${row._id}`} >{row.fullName}</Link>
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
         width:"110px" ,
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
        name: " المسوق /ة",
        selector: (row) => row?.addBy,
         width:"110px" ,
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
        name: " المتابع /ة",
        selector: (row) => row?.userfollow,
         width:"110px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.userfollow || "غير متوفر" }
          </span>
        )
      },
         {
        name: "منطقة",
        selector: (row) => row?.region,
         width:"110px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.region || "غير متوفر" }
          </span>
        )
      },
     {
        name: "الموقع",
        selector: (row) => row?.governote,
         width:"110px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.governote || "غير متوفر" }
          </span>
        )
      },

       {
        name: "حالة العميل",
      width:"99px" ,
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
             
            }}
          >
            {" "}
           { row?.clientStatus}
          </span>
        )
      },
         {
        name: " تابع",
      width:"99px" ,
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
             
            }}
          >
            {" "}
           { row?.relatedStauts}
          </span>
        )
      },
      {
        name: "مصدر العميل",
      width:"120px" ,
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
        name: "المشروع المهتم به",
      width:"120px" ,
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
             
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
  width:"120px",
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
     width:"80px" ,
        cell: (row) => (
          <span
         
          >
            {" "}
           { row?.currency}
          </span>
        )
        
      },
  
      {
        name: "  المعاينة",
        selector: (row) => row.isViwed,
        width:"100px",
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              
            }}
            className='text-center flex jusitfy-center items-center'
          >
            {" "}
           { row.isViwed}
          </span>
        ),
      },

{
  name: "متطلبات العميل",
  width: "160px",
  cell: (row) => {
    const firstRequirement = row?.clientRequirements?.[0];

    const text = firstRequirement
      ? `${firstRequirement.requireType || ""} - ${
          firstRequirement.rquireLocation || ""
        }`
      : "-";

    return (
      <div
        title={text}
        style={{
          maxWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "12px",
        }}
      >
        {text}
      </div>
    );
  },
}
 , 
         {
        name: "عدد متطلبات ",
          sortable: true ,
            selector: (row) => row?.clientRequirements?.length,
          width:"100px" ,
        cell: (row) => (
          <span
  className='flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full'
          
          >
            {" "}
           {row.clientRequirements?.length || 0}
          </span>
        )
      },
       {
        name: "عدد المتابعات",
          sortable: true ,
        selector: (row) => row?.SectionFollow?.length,
          width:"110px" ,
        cell: (row) => (
          <span
  className='flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full'
          
          >
            {" "}
           {row.SectionFollow?.length}
          </span>
        )
      },
{
  name: "تاريخ أخر اتصال",
  width:"110px" ,
  selector: (row) => row.clientendRequr,
  cell: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
          لا يوجد تواصل
        </span>
      );
    }

    const lastDate = new Date(lastFollow.createdAt);
    const now = new Date();

    const diffInMinutes = Math.floor((now - lastDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    let timeAgo = "";
    if (diffInDays > 0) {
      timeAgo = `منذ ${diffInDays} ${diffInDays === 1 ? "يوم" : "أيام"}`;
    } else if (diffInHours > 0) {
      timeAgo = `منذ ${diffInHours} ساعة`;
    } else if (diffInMinutes > 0) {
      timeAgo = `منذ ${diffInMinutes} دقيقة`;
    } else {
      timeAgo = "الآن";
    }

    // 👇 اللون يتغير حسب عدد الأيام
    const badgeColor =
      diffInDays >= 7
        ? "bg-red-100 text-red-700"
        : diffInDays >= 3
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";

    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}
      >
        {timeAgo}
      </span>
    );
  },
}
 ,
{
  name: "أخر اتصال",
  width: "120px",

  // ✅ ده اللي Excel هيقراه
  selector: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

    if (!lastFollow) return "لا يوجد";

    const userName = lastFollow?.user?.fullName || "غير معروف";
    const details = lastFollow?.details || "";

    return `${userName} - ${details}`;
  },

  // ✅ ده للعرض فقط
  cell: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

    if (!lastFollow) return <span>لا يوجد</span>;

    return (
      <div className="flex flex-col gap-2" title={lastFollow.details}>
        <div className="flex items-center gap-2">
          {lastFollow?.user?.imageURL && (
            <img
              src={lastFollow.user.imageURL}
              alt=""
              className="w-6 h-6 rounded-full"
            />
          )}
          <p className="text-xs font-medium">
            {lastFollow?.user?.fullName}
          </p>
        </div>

        <div className="text-xs text-gray-600">
          {handelStringLength(lastFollow.details)}
        </div>
      </div>
    );
  }
}

,
  {
  name: " أخر حالة",
  selector: (row) => row.SectionFollow,
  width:"120px" ,
  cell: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >

   
        </span>
        {
         lastFollow?.CustomerDealsatuts
        }
      {
      
      }
      </div>
    );
  },
}
,
      {
        name: "ملاحظات",
        selector: (row) => row?.notes,
        cell: (row) => (
          <span
    
            title={row?.notes ? row?.notes?.slice(0 , 40) :"غير متوفر"}
          >
            {" "}
           { handelStringLength(row?.notes) }
          </span>
        )
      },
        {
          name:"تاريخ الإنشاء",
          selector: (row) => row.createdAt,
           sortable: true ,
           width:"150px",
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
  name: "كل المتابعات",
  selector: (row) => {
    if (!row.SectionFollow?.length) return "لا يوجد";

    return [...row.SectionFollow]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((follow) =>
        [
          follow.CustomerDealsatuts,
          follow.details,
          follow.user?.fullName,
          new Date(follow.createdAt).toLocaleDateString("ar-EG"),
        ]
          .filter(Boolean)
          .join(" - ")
      )
      .join(" | ");
  },
},
        
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
                                <button 
                         className="flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"

                 onClick={() => setIssectionOpen(!isSectionOpen)}>
                {open ? <FiX size={20} /> : <FiFilter size={20} />}
        {isSectionOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </button>
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
      {/* <div>
        <CustomersJourneyAnalytics customers={filteredData} />
      </div> */}
    {
      isSectionOpen &&      <FiltertionHook setParamsapi={setParamsapi} paramsapi={paramsapi}  filteredData={filteredData} columns={columnsfile} filters={filters} params={params} setParams={setParams}/>

    }
      <CustomeTabel data={filteredData} columns={columns}/>
    </div>
  );
};

export default CutsomerRepoarts;