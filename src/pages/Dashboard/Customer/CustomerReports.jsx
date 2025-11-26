import React, { useState, useMemo } from 'react';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { Link } from 'react-router-dom';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

import { FaUsers } from "react-icons/fa";
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import FiltertionHook from "../../../hooks/FiltertionHook";

import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import useQueryupdate from '../../../services/useQueryupdate';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
const CustomerReports = ({id}) => {
  const { data, isLoading } = useQuerygetSpacficIteam("Dealiy-reports/customer", "Dealiy-reports" , id);
  const { deleteIteam } = useQueryDelete("Dealiy-reports", "Dealiy-reports");
  const {updateiteam} = useQueryupdate("Dealiy-reports" , "Dealiy-reports")
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Projects");
  const filtersDays = ["الكل" , "يومى", "أسبوعى", "شهرى" ];

  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
    dateFilter: "الكل",
  });

  const fillters = [
    
    {value:"ReportType", name:" نوع التقرير"},
        // {value:"Customers", name:"العميل"},
    {value:"addedBy.fullName", name:"الموظف"},
        {value:"notes", name:"ملاحظات"},
        



     ]

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
  
    return data.data?.filter(item => {
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

  const handleDateFilterChange = (filter) => {
    setParams(prevParams => ({
      ...prevParams,
      dateFilter: filter,
    }));
  };

   const handelStringLength = (text) =>{
    if(text?.length > 20) {
      return `${text.substring(0 , 20)}...`
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
      name: "أخر ماتم مع العميل ",
      selector: (row) => row?.endcontact ,
       width:"150px" ,
      cell: (row) => <span>{row?.endcontact?.slice(0 , 50) + "..."} </span>,
    },
,
     {
          name: "مصدر العميل",
          selector: (row) => row?.Customers[0]?.source,
        },

        {
        name: "وظيفة العميل",
        selector: (row) => row?.Customers[0]?.clientwork,
         width:"160px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.Customers[0]?.clientwork || "غير متوفر" }
          </span>
        )
      },
      {
        name: "إسم المسوق /ة",
        selector: (row) => row?.Customers[0]?.addBy,
         width:"160px" ,
        cell: (row) => (
          <span
            style={{
          
              whiteSpace: "wrap",
           
    
            }}
          >
            {" "}
           { row?.Customers[0]?.addBy }
          </span>
        )
      },
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
        name: "مصدر العميل",
      width:"120px" ,
        cell: (row) => (
          <span
            style={{
              textOverflow: "ellipsis",
             
            }}
          >
            {" "}
           { row?.Customers[0]?.source}
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
           { row?.Customers[0]?.project}
          </span>
        )
      },
{
  name: "الدفعة الإولى",
  sortable: true,
  width:"200px",
  sortFunction: (rowA, rowB) => {
    return Number(rowA.firstPayment) - Number(rowB.firstPayment);
  },
  cell: (row) => (
    <span>
      {Number(row?.Customers[0]?.firstPayment).toLocaleString("en-US")}
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
           { row?.Customers[0]?.currency}
          </span>
        )
        
      },
     
      {
        name: " اخر ماتم التواصل",
          width:"140px" ,
        selector: (row) => row?.Customers[0]?.clientendRequr,
        cell: (row) => (
          <span
      
            title={row?.Customers[0]?.clientendRequr}
          >
            {" "}
           {handelStringLength (row?.Customers[0]?.clientendRequr)}
          </span>
        )
      },
      {
        name: "هل تمت المعاينة",
        selector: (row) => row?.Customers[0]?.isViwed,
        width:"150px",
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
           { row?.Customers[0]?.isViwed}
          </span>
        ),
      },

      {
        name: "متطلبات العميل",
        selector: (row) => row?.Customers[0]?.clientRequire,
          width:"120px" ,
        cell: (row) => (
          <span
  
            title={row?.Customers[0]?.clientRequire}
          >
            {" "}
           { row?.Customers[0]?.clientRequire}
          </span>
        )
      },
       {
        name: "عدد المتابعات",
          sortable: true ,
        selector: (row) => row?.Customers[0]?.SectionFollow?.length,
          width:"140px" ,
        cell: (row) => (
          <span
  className='flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full'
          
          >
            {" "}
           {row?.Customers[0]?.SectionFollow?.length}
          </span>
        )
      },
{
  name: "تاريخ أخر اتصال",
  width:"140px" ,
  selector: (row) => row?.Customers[0]?.clientendRequr,
  cell: (row) => {
    const lastFollow = row?.Customers[0]?.SectionFollow?.length
      ? [...row?.Customers[0]?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
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
        name: "ملاحظات",
        selector: (row) => row?.Customers[0]?.notes,
        cell: (row) => (
          <span
    
            title={row?.Customers[0]?.notes}
          >
            {" "}
           { handelStringLength(row?.Customers[0]?.notes) }
          </span>
        )
      },
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
 
 console.log("cstomer" , data);
 

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>

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
      <FiltertionHook filteredData={filteredData} columns={columnsfile} filters={fillters} params={params} setParams={setParams} />
      <CustomeTabel data={filteredData} columns={columns} />
    </div>
  );
};

export default CustomerReports;