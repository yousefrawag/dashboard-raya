import React from 'react'
import HeadPagestyle from '../../../components/common/HeadPagestyle'
import CustomeTabel from '../../../components/common/CustomeTabel'
import { GrFormView } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { format, differenceInDays, differenceInHours, differenceInMinutes  , formatDistanceToNow } from "date-fns";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { FaWhatsapp } from "react-icons/fa";
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import useQuerygetiteams from "../../../services/Querygetiteams"
import Loader from '../../../components/common/Loader';
import { MdOutlineAddIcCall } from "react-icons/md";

import { useState , useMemo } from 'react';
import FiltertionHook from '../../../hooks/FiltertionHook';

const GetCustomers = () => {
     const [paramsapi, setParamsapi] = useState({
        field: "",
        searchTerm: "",
        startDate: "",
        endDate: "",
      });
   const [params, setParams] = useState({
        field: "",
        searchTerm: "",
        startDate: "",
        endDate: "",
        toLength:"" ,
        fromLength:""

      });
  const { isError , isLoading , data} = useQuerygetiteams("customers" , "customers" , paramsapi)
  const {deleteIteam} = useQueryDelete("customers" , "customers")
  const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("Clients")
// handel filter 
   console.log("customer" , data);
   
    
      const filters = [
        
        {value:"addBy", name:"إسم المسوق"}, 
        {value:"userfollow", name:"إسم المتابع"}, 

        {value:"fullName", name:"إسم المشترى"} 
        ,{value:"phoneNumber", name:"جوال"} 
          
         ,{value:"secondaryPhoneNumber", name:"جوال2"}
         ,{value:"clientwork", name:"وظيفة العميل"} 
             ,{value:"source", name:"مصدر العميل"} 
        , {value:"clientStatus", name:"حالة العميل"} 
    
        ,{value:"region", name:"موقع المشروع"} 

        , {value:"project", name:"مهتم بمشروع"} 
        , {value:"currency", name:"نوع العملة"} 
    
        , {value:"cashOption", name:"الدفع كاش"} 
    
        , {value:"firstPayment", name:"الدفعة الإولى"} 
        , {value:"installmentsPyYear", name:"تقسيط على كام سنة"} 
    ,{value:"length", name:"عدد المتابعات"} 
        , {value:"clientendRequr", name:" أخر ماتم التواصل مع العميل"} 
  , {value:"ContactDate", name:"تاريخ التواصل"}  
        , {value:"isViwed", name:"هل تمت المعاينة"} 
        , {value:"clientRequire", name:"متطلبات العميل"} 
        , {value:"notes", name:"ملاحظات"} 
     
      ];
      const arabicTimeAgo = (date) => {
        const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });
    
        // Replace English words with Arabic equivalents
        return timeAgo
           
    };
const filteredData = useMemo(() => {
  if (!data?.data?.data) return [];

  return data.data?.data.filter(item => {
     if (params.field === "length" && (params.fromLength || params.toLength)) {
      const count = item?.SectionFollow?.length || 0;
      const from = Number(params.fromLength) || 0;
      const to = Number(params.toLength) || Infinity;
      return count >= from && count <= to;
    }
    if (params.searchTerm && params.field) {
     

      const fieldValue = params.field.split('.').reduce((obj, key) => obj?.[key], item);

      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(params.searchTerm.toLowerCase());
      }

      // لو القيمة مش string نحولها لنص
      if (fieldValue != null) {
        return String(fieldValue).toLowerCase().includes(params.searchTerm.toLowerCase());
      }

      return false;
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
    name: "إضافة إتصال",
    width:"120px" ,
    selector: (row) => row?.fullName,
    cell: (row) => (
      <Link to={`/customer-add-contact/${row._id}`} className='flex items-center justify-center'>
        <MdOutlineAddIcCall size={25} />

      </Link>
    )
  },
      {
        name: "إسم المشترى",
        width:"160px" ,
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
        name: "إسم المسوق /ة",
        selector: (row) => row?.addBy,
         width:"160px" ,
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
        name: "إسم المتابع /ة",
        selector: (row) => row?.userfollow,
         width:"160px" ,
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
        name: "حالة العميل",
      width:"120px" ,
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
  width:"200px",
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
        name: " اخر ماتم التواصل",
          width:"140px" ,
        selector: (row) => row.clientendRequr,
        cell: (row) => (
          <span
      
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
           { row.isViwed}
          </span>
        ),
      },

      {
        name: "متطلبات العميل",
        selector: (row) => row?.clientRequire,
          width:"120px" ,
        cell: (row) => (
          <span
  
            title={row?.clientRequire}
          >
            {" "}
           { row?.clientRequire}
          </span>
        )
      },
         {
        name: "عدد متطلبات العميل",
          sortable: true ,
            selector: (row) => row?.clientRequirements?.length,
          width:"140px" ,
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
          width:"140px" ,
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
  width:"140px" ,
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
  name: " أخر اتصال",
  selector: (row) => row.clientendRequr,
  width:"230px" ,
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
        name: "إسم المتابع /ة",
        selector: (row) => row?.userfollow,

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
        name: "عدد المتابعات",
          sortable: true ,
        selector: (row) => row?.SectionFollow?.length || 0,
          width:"140px" ,
        cell: (row) => (
          <span
  className='flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full'
          
          >
            {" "}
           {row.SectionFollow?.length || 0}
          </span>
        )
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
          name: "اخر ماتم التواصل مع  العميل",
          selector: (row) => row.clientendRequr ,
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

        
   
    
      ];
if(isLoading){
  return <Loader />
}      
  return (
    <div>
        <HeadPagestyle isAdmin={isAdmin} CanAdd={CanAdd}  pageName="العملاء" to="/Add-Customer" title="إضافة عميل"/>
        <div  className='mt-[-20px]'>
        <FiltertionHook setParamsapi={setParamsapi} paramsapi={paramsapi} filteredData={filteredData} columns={columnsfile} key="المشاريع العامه.xlsx" filters={filters} params={params} setParams={setParams}/>

        </div>
<div  className='mt-[-20px]'>
        <CustomeTabel   defaultSortField="firstPayment"
  defaultSortAsc={false}  data={filteredData} columns={columns}/>
</div>

    </div>
  )
}

export default GetCustomers