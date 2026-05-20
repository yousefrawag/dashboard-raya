import React, { useState, useMemo } from 'react';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { Link } from 'react-router-dom';
import { format, startOfDay, endOfDay,startOfYear , endOfYear, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

import { FaUsers } from "react-icons/fa";
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import FiltertionHook from "../../../hooks/FiltertionHook";
import { FiFilter, FiX } from "react-icons/fi";
import GetReportTypes from '../../../components/common/GetReportTypes';
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import useQueryupdate from '../../../services/useQueryupdate';
const BrokerReports = () => {
       const [paramsapi, setParamsapi] = useState({
          field: "",
          searchTerm: "",
          startDate: "",
          endDate: "",
        });
  const { data, isLoading } = useQuerygetiteams("broker-deaily", "broker-deaily" , paramsapi);
  const { deleteIteam } = useQueryDelete("broker-deaily", "broker-deaily");
  const {updateiteam} = useQueryupdate("broker-deaily" , "broker-deaily")
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Projects");
  const filtersDays = ["الكل" , "يومى", "أسبوعى", "شهرى" ,  "سنوى"];
const [isSectionOpen , setIssectionOpen] = useState(false)

  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
    dateFilter: "الكل",
  });

  const fillters = [
    
    {value:"ReportType", name:" نوع التقرير"},
        {value:"Customer", name:"العميل"},
           {value:"endcontact", name:"أخر ماتم التواصل مع العميل"},
    {value:"addedBy.fullName", name:"الموظف"},
        {value:"notes", name:"ملاحظات"},
           {value:"createdAt", name:"التاريخ"},
         
        



     ]

  const filteredData = useMemo(() => {
    if (!data?.data?.data) return [];
  
    return data.data.data.filter(item => {
      if (params.searchTerm && params.field) {
        let fieldValue;
  
        if (params.field.startsWith("Customers")) {
          // Flatten all customer names
          fieldValue = item.Customers?.map(c => c.fullName).join(" ") || "";
        } else {
          fieldValue = params.field.split('.').reduce((obj, key) => obj?.[key], item) || "";
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
        return fieldValue.toLowerCase().includes(params.searchTerm.toLowerCase());
    
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

  const handleDateFilterChange = (filter) => {
    setParams(prevParams => ({
      ...prevParams,
      dateFilter: filter,
    }));
  };
 const SendeProjectToarchev = (id , status) => {
try {
  const data = {
    status
  }
     updateiteam( { id , data }, {
        onSuccess: () => {
    
          toast.success("تم  إرسال مشروع الى الأرشيف بنجاح");
        },
      });
} catch (error) {
  
}
 } 
   const handelStringLength = (text) =>{
    if(text?.length > 20) {
      return `${text.substring(0 , 40)}...`
    } 
    return text
  }

  const columns = [
 
 
    {
      name: "الموظف",
      width:"170px",
      selector: (row) =><div>

       
           <img className='w-[30px] h-[30px] rounded-full' src={row?.addedBy?.imageURL} alt='user-image' />
           <span>
            { row?.addedBy?.fullName}
           </span>
       
      </div>
    },
 
    {
      name: "نوع التقرير",
      selector: (row) => row?.ReportType ,
       width:"150px" ,
      cell: (row) => <span>{row?.ReportType} </span>,
    },
        {
      name: "وصف التقرير",
      selector: (row) => row?.ReportTypeDescriep ,
       width:"150px" ,
      cell: (row) => <span>{row?.ReportTypeDescriep} </span>,
    },
{
  name: "العملاء",
 width: "160px",
  cell: (row) => (
    <div className="flex flex-col gap-1">
         <Link
            key={row?.Customer?._id || "peok"}
            to={`/cutomers/${row?.Customer?._id}`} // يمكنك تعديل الرابط حسب المسار الصحيح
            className="text-blue-600 hover:underline truncate max-w-[220px]"
            title={row?.Customer?.fullName}
          >
            {row?.Customer?.fullName}
          </Link>
    </div>
  ),
} ,

      {
        name: "إسم المسوق /ة",
        selector: (row) => row?.Customer?.addBy,
         width:"160px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.Customer?.addBy }
          </span>
        )
      },
       {
        name: "إسم المتابع /ة",
        selector: (row) => row?.Customer?.userfollow,
         width:"160px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.Customer?.userfollow || "غير متوفر" }
          </span>
        )
      },
       {
        name: "حالة العميل",
      width:"120px" ,
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
             
            }}
          >
            {" "}
           { row?.Customer?.clientStatus}
          </span>
        )
      },
             {
        name: "تبعية حاله العميل",
      width:"180px" ,
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
             
            }}
          >
            {" "}
           { row?.Customer?.relatedStauts}
          </span>
        )
      },
  

 ,
  {
  name: " أخر اتصال",
  selector: (row) => row?.Customer?.clientendRequr,
  width:"230px" ,
  cell: (row) => {
    const lastFollow = row?.Customer?.SectionFollow?.length
      ? [...row?.Customer?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >
        <img src={lastFollow?.user?.imageURL} alt="" srcset="" />
        <p>
        {
          lastFollow?.user?.fullName
        }
        </p>
        </span>
        {
          handelStringLength( lastFollow.details)
        }
      {
      
      }
      </div>
    );
  },
}
,
  {
  name: " أخر حالة",
  selector: (row) => row?.clientendRequr,
  width:"120px" ,
  cell: (row) => {
    const lastFollow = row.Customer?.SectionFollow?.length
      ? [...row.Customer?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
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
  name: "تبعية أخر حالة ",
  selector: (row) => row?.clientendRequr,
  width:"120px" ,
  cell: (row) => {
    const lastFollow = row.Customer?.SectionFollow?.length
      ? [...row.Customer?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow?.CustomerDealsatutsDescrep) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >

   
        </span>
        {
         lastFollow?.CustomerDealsatutsDescrep
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
     
      cell: (row) => <div   
      style={{
       
       whiteSpace: "wrap",
    

     }}
     title={row?.notes}>{row?.notes}</div>,
      
    },

       {
      name: "الملفات",
      selector: (row) => row?.notes,
     
      cell: (row) => <div   
      style={{
       
       whiteSpace: "wrap",
    

     }}
     >{row?.docsURLs?.map((item) => {
      return <a href={item.fileURL} key={item?.fileID} >
عرض ملف
      </a>
     })}</div>,
      
    },
      {
  name: "تاريخ التواصل",
  selector: (row) => row?.Customer?.clientendRequr,
  width:"230px" ,
  cell: (row) => {
    const lastFollow = row?.Customer?.SectionFollow?.length
      ? [...row?.Customer?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >
  
        <p>
          {format(new Date(lastFollow?.detailsDate), "dd MMMM, yyyy")}
       
        </p>
        </span>
     
      {
      
      }
      </div>
    );
  },
}
,

      {
  name: "تاريخ تحديد موعد",
  selector: (row) => row?.Customer?.clientendRequr,
  width:"180px" ,
  cell: (row) => {
    const lastFollow = row?.Customer?.SectionFollow?.length
      ? [...row?.Customer?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!row?.Customer?.customerDate) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >
  
        <p>
          {format(new Date(row?.Customer?.customerDate), "dd MMMM, yyyy")}
       
        </p>
        </span>
     
      {
      
      }
      </div>
    );
  },
}
,
      {
  name: "تاريخ التنبيه",
  selector: (row) => row?.Customer?.clientendRequr,
  width:"150px" ,
  cell: (row) => {
    const lastFollow = row?.Customer?.SectionFollow?.length
      ? [...row?.Customer?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow?.nextReminderDate) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >
  
        <p>
          {format(new Date(lastFollow?.nextReminderDate), "dd MMMM, yyyy")}
       
        </p>
        </span>
     
      {
      
      }
      </div>
    );
  },
}
,


{
      name: "تاريخ الإنشاء",
      selector: (row) => row.createdAt,
      cell: (row) => <div   
       style={{
        
        whiteSpace: "wrap",
       
     

      }}
      title={format(new Date(row.createdAt), "dd MMMM, yyyy")}>{format(new Date(row.createdAt), "dd MMMM, yyyy")}</div>,
    },
   {
         name: "اجراء",
         selector: (row) => row.procedure,
         cell: (row) => (
           <div className="flex items-center justify-center gap-5">
      
          {/* <Link to={`/edtit-dealy/${row._id}`} className="hover:text-primary">
                 <MdOutlineEditNote size={20} />
               </Link>  */}
             {
               isAdmin || CanDelte ?
                 <button className="hover:text-red-500" onClick={() => deleteIteam(row._id)}>
                   <AiTwotoneDelete size={20} />
                 </button> : null
             }
           </div>
         ),
       },

  
  ];

  const columnsfile = [
    {
      name: "الموظف",
      selector: (row) => row?.addedBy?.fullName,
    },
    {
      name: "نوع التقرير",
      selector: (row) => row?.ReportType,
    },
{
  name: "العملاء",
 width: "160px",
  cell: (row) =>  {row?.Customer?.fullName}
} ,
 {
      name: "أخر ماتم مع العميل ",
      selector: (row) => row?.endcontact ,
       width:"150px" ,
     
    },
    {
          name: "جوال 1",
          selector: (row) => row?.Customer?.phoneNumber,
        },
        {
          name: "جوال 2",
          selector: (row) => row?.Customer?.secondaryPhoneNumber,
        },
                       {
        name: "وظيفة العميل",
        selector: (row) => row?.Customer?.clientwork,

      },
            {
          name: "مصدر العميل",
          selector: (row) => row?.Customer?.source,
        },
        {
          name: "حالة العميل",
          selector: (row) => row?.Customer?.clientStatus,
          cell: (row) => (
            <span
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {" "}
              {row?.Customers[0]?.clientStatus }
            </span>
          ),
        },
        {
          name: "موقع المشروع",
          selector: (row) => row?.Customers?.region,
        },
        {
          name: "المشروع المهتم به",
          selector: (row) => row?.Customers?.project,
        },
        {
          name: "نوع العملة",
          selector: (row) => row?.Customers?.currency,
        },
      
    
    
        {
          name: "الدفع كاش",
          selector: (row) => row?.Customer?.cashOption,
        },
        {
          name: " الدفعة الأولى",
          selector: (row) => row?.Customer?.firstPayment,
        },
        {
          name: "تقسيط على كام سنة",
          selector: (row) => row?.Customer?.installmentsPyYear ,
        },
     
     
        {
          name: "اخر ماتم التواصل مع  العميل",
          selector: (row) => row?.Customer?.clientendRequr ,
        },
               {
                  name: "قسم المتابعة",
                  selector: (row) => row?.Customer?.SectionFollow?.map((item) => {
                    const userName = item?.user?.fullName || '';
                    
                    const details = item?.details || '';
                    const detailsDate = item?.detailsDate ? format(new Date(item.detailsDate), "dd MMMM, yyyy") : 'غير محدد';
                    const status = item?.CustomerDealsatuts || '';
                
                    return `الإسم: ${userName}\nالتفاصيل: ${details}\nتاريخ الإتصال: ${detailsDate}\nالحالة: ${status}`;
                  }).join("\n\n") || '', // join to merge multiple items nicely
                } ,
                
 
        {
          name: "هل تمت المعاينة",
          selector: (row) => row?.Customer?.isViwed
       
        },
        {
          name: "متطلبات العميل",
          selector: (row) => row?.Customer?.clientRequire ,
        },
        {
          name: "ملاحظات",
          selector: (row) => row?.Customer?.notes ,
        },

    {
      name: "ملاحظات",
      selector: (row) => row?.notes,
    },
    {
      name: "تاريخ الإنشاء",
      selector: (row) => format(new Date(row.createdAt ), "dd MMMM, yyyy"),
   
    },

  
  ];
 
 

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <HeadPagestyle pageName="التقرير اليومى" isAdmin={isAdmin} CanAdd={CanAdd} to="/Add-dealyReport" title="إضافة تقرير" />

     <div  className='mb-10'>
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

      <div className='w-full h-full'>
        <GetReportTypes  data={filteredData}/>
      </div>
                    <button 
                         className="flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"

                 onClick={() => setIssectionOpen(!isSectionOpen)}>
                {open ? <FiX size={20} /> : <FiFilter size={20} />}
        {isSectionOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </button>
          {
            isSectionOpen &&       <FiltertionHook  setParamsapi={setParamsapi} paramsapi={paramsapi}  filteredData={filteredData} columns={columnsfile} filters={fillters} params={params} setParams={setParams} />

          }
      <CustomeTabel data={filteredData} columns={columns} />
    </div>
  );
};

export default BrokerReports;