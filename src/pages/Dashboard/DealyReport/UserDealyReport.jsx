import React, { useState, useMemo } from 'react';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { Link } from 'react-router-dom';
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from "date-fns";
import { FaUsers } from "react-icons/fa";
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import FiltertionHook from "../../../hooks/FiltertionHook";
import CardDataStats from '../../../components/common/CardDataStats';
import GetProjectStatusChart from '../../../components/common/GetProjectStatusChart';
import GetprojectTypesChart from '../../../components/common/GetprojectTypesChart';
import GetprojectsOpeartionType from '../../../components/common/GetprojectsOpeartionType';
import useQueryupdate from '../../../services/useQueryupdate';
import { FiFilter, FiX } from "react-icons/fi";

const UserDealyReport = () => {
       const [paramsapi, setParamsapi] = useState({
            field: "",
            searchTerm: "",
            startDate: "",
            endDate: "",
          });
  const { data, isLoading } = useQuerygetiteams("Dealiy-reports/user", "Dealiy-reports"  , paramsapi);
  const { deleteIteam } = useQueryDelete("Dealiy-reports", "Dealiy-reports");
  const {updateiteam} = useQueryupdate("projects" , "projects")
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Projects");
  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });
const [isSectionOpen , setIssectionOpen] = useState(false)

  const fillters = [
    {value:"ReportType", name:" نوع التقرير"},
        {value:"Customers[0].fullName", name:"العميل"},
        {value:"endcontact", name:"أخر ماتم التواصل مع العميل"},
            {value:"createdAt", name:"التاريخ"},
 {value:"notes", name:"ملاحظات"},


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

      return fieldValue.toLowerCase().includes(params.searchTerm.toLowerCase());
    }
    return true;
  });
}, [data, params]);
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
      {row?.Customers?.length > 0 ? (
        row.Customers.map((customer, index) => (
          <Link
            key={index}
            to={`/cutomers/${customer._id}`} // يمكنك تعديل الرابط حسب المسار الصحيح
            className="text-blue-600 hover:underline truncate max-w-[220px]"
            title={customer.fullName}
          >
            {customer.fullName}
          </Link>
        ))
      ) : (
        <span className="text-gray-400">لا يوجد عملاء</span>
      )}
    </div>
  ),
} ,

   
       {
        name: "إسم المتابع /ة",
        selector: (row) => row?.Customers[0]?.userfollow,
         width:"160px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.Customers[0]?.userfollow || "غير متوفر" }
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
           { row?.Customers[0]?.clientStatus}
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
           { row?.Customers[0]?.relatedStauts}
          </span>
        )
      },
  
  
 ,
  {
  name: " أخر اتصال",
  selector: (row) => row?.Customers[0]?.clientendRequr,
  width:"230px" ,
  cell: (row) => {
    const lastFollow = row?.Customers[0]?.SectionFollow?.length
      ? [...row?.Customers[0]?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
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
  selector: (row) => row.clientendRequr,
  width:"120px" ,
  cell: (row) => {
    const lastFollow = row.Customers[0]?.SectionFollow?.length
      ? [...row.Customers[0].SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
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
  selector: (row) => row.clientendRequr,
  width:"120px" ,
  cell: (row) => {
    const lastFollow = row.Customers[0]?.SectionFollow?.length
      ? [...row.Customers[0].SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
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
  selector: (row) => row?.Customers[0]?.clientendRequr,
  width:"230px" ,
  cell: (row) => {
    const lastFollow = row?.Customers[0]?.SectionFollow?.length
      ? [...row?.Customers[0]?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >
  
        <p>
          {lastFollow?.detailsDate ? format(new Date(lastFollow?.detailsDate), "dd MMMM, yyyy") : ""}
       
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
  selector: (row) => row?.Customers[0]?.clientendRequr,
  width:"180px" ,
  cell: (row) => {
    const lastFollow = row?.Customers[0]?.SectionFollow?.length
      ? [...row?.Customers[0]?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!row?.Customers[0]?.customerDate) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >
  
        <p>
          {row?.Customers[0]?.customerDate? format(new Date(row?.Customers[0]?.customerDate), "dd MMMM, yyyy") : ""}
       
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
  selector: (row) => row?.Customers[0]?.clientendRequr,
  width:"150px" ,
  cell: (row) => {
    const lastFollow = row?.Customers[0]?.SectionFollow?.length
      ? [...row?.Customers[0]?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

    if (!lastFollow?.nextReminderDate) return <span>لا يوجد</span>;



 

    return (
      <div
    className='flex flex-col gap-3'
    title={lastFollow.details}
      >
        <span className='flex flex-col ' >
  
        <p>
          { lastFollow?.nextReminderDate ? format(new Date(lastFollow?.nextReminderDate), "dd MMMM, yyyy") :""}
       
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
      
          <Link to={`/edtit-dealy/${row._id}`} className="hover:text-primary">
                 <MdOutlineEditNote size={20} />
               </Link> 
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
  width: "280px",
  selector: (row) =>
    row?.Customers?.length > 0
      ? row.Customers.map((c) => c.fullName).join(", ")
      : "لا يوجد عملاء",
} ,
 {
      name: "أخر ماتم مع العميل ",
      selector: (row) => row?.endcontact ,
       width:"150px" ,
     
    },
    {
          name: "جوال 1",
          selector: (row) => row?.Customers[0]?.phoneNumber,
        },
        {
          name: "جوال 2",
          selector: (row) => row?.Customers[0]?.secondaryPhoneNumber,
        },
                       {
        name: "وظيفة العميل",
        selector: (row) => row?.Customers[0]?.clientwork,

      },
            {
          name: "مصدر العميل",
          selector: (row) => row?.Customers[0]?.source,
        },
        {
          name: "حالة العميل",
          selector: (row) => row?.Customers[0]?.clientStatus,
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
          selector: (row) => row?.Customers[0]?.region,
        },
        {
          name: "المشروع المهتم به",
          selector: (row) => row?.Customers[0]?.project,
        },
        {
          name: "نوع العملة",
          selector: (row) => row?.Customers[0]?.currency,
        },
      
    
    
        {
          name: "الدفع كاش",
          selector: (row) => row?.Customers[0]?.cashOption,
        },
        {
          name: " الدفعة الأولى",
          selector: (row) => row?.Customers[0]?.firstPayment,
        },
        {
          name: "تقسيط على كام سنة",
          selector: (row) => row?.Customers[0]?.installmentsPyYear ,
        },
     
     
        {
          name: "اخر ماتم التواصل مع  العميل",
          selector: (row) => row?.Customers[0]?.clientendRequr ,
        },
               {
                  name: "قسم المتابعة",
                  selector: (row) => row?.Customers[0]?.SectionFollow?.map((item) => {
                    const userName = item?.user?.fullName || '';
                    
                    const details = item?.details || '';
                    const detailsDate = item?.detailsDate ? format(new Date(item.detailsDate), "dd MMMM, yyyy") : 'غير محدد';
                    const status = item?.CustomerDealsatuts || '';
                
                    return `الإسم: ${userName}\nالتفاصيل: ${details}\nتاريخ الإتصال: ${detailsDate}\nالحالة: ${status}`;
                  }).join("\n\n") || '', // join to merge multiple items nicely
                } ,
                
 
        {
          name: "هل تمت المعاينة",
          selector: (row) => row?.Customers[0]?.isViwed
       
        },
        {
          name: "متطلبات العميل",
          selector: (row) => row?.Customers[0]?.clientRequire ,
        },
        {
          name: "ملاحظات",
          selector: (row) => row?.Customers[0]?.notes ,
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

                     <button 
                             className="flex items-center gap-2 mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
    
                     onClick={() => setIssectionOpen(!isSectionOpen)}>
                    {open ? <FiX size={20} /> : <FiFilter size={20} />}
            {isSectionOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
              </button>
    {
      isSectionOpen &&  <FiltertionHook setParamsapi={setParamsapi} paramsapi={paramsapi} filteredData={filteredData} columns={columnsfile} filters={fillters} params={params} setParams={setParams} />
    } 
     
      <CustomeTabel data={filteredData} columns={columns} />
    </div>
  );
};

export default UserDealyReport;