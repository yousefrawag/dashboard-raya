import CustomeTabel from '../../../components/common/CustomeTabel'
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import authFetch from "../../../utils/axiosAuthfetch";
import Loader from "../../../components/common/Loader";
import { FiSearch, FiDownload, FiRefreshCcw, FiChevronDown } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineAddIcCall } from "react-icons/md";
import * as XLSX from "xlsx";
import StatusFilterTabs from '../../../components/common/StatusFilterTabs';
import { format, differenceInDays, differenceInHours, differenceInMinutes  , formatDistanceToNow } from "date-fns";
const Customerdata = () => {
      const [searchParams] = useSearchParams();
 const [data, setData] = useState([]);
  const [isloading, setIsloading] = useState(true);
//     const handelReset = () => {
//   setFormData({
//      addBy: "",
//       userfollow:"",
//       clientwork: [],
//       source: [],
//       clientStatus: [],
//       region: "",
//       project: [],
//       cashOption: "",
//       firstPaymentFrom: null ,
//       firstPaymentTo:null,
//       InstallmentType: "",
//       followFrom: "",
//       followTo: "",
//       ordersFrom: "",
//       ordersTo: "",
//       isViwed: [],
//       clientendRequr: "",
//       rquireLocation: "",
//       requireRegion: "",
//       require: "",
//       requireType: "",
//       governote:""
//   })
//   setWords([])
// }


  const handelStringLength = (text) =>{
    if(text?.length > 20) {
      return `${text.substring(0 , 20)}...`
    } 
    return text
  }
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
        selector: (row) => row?.SectionFollow?.length ? row?.SectionFollow?.length  : 0,
          width:"140px" ,
    
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
         const columnsforcompaign  = [
     
        {
          name: "fullName",
          selector: (row) => row.fullName,
        },
        {
          name: "phoneNumber",
          selector: (row) => row.phoneNumber,
        },
   
        
   
    
      ];

// دالة لتحويل البيانات لـ Excel
const convertToExcel = (data, columnsfile, sheetName = "البيانات") => {
  const headers = columnsfile.map((col) => col.name);

  const rows = data.map((item) =>
    columnsfile.map((col) => {
      let value = "";
      if (col.selector) {
        value = col.selector(item);
      }
     return value !== undefined && value !== null ? String(value) : "";

    })
  );

  const worksheetData = [headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const colWidths = headers.map((header, index) => {
    const maxContentLength = Math.max(
      header.length,
      ...rows.map((row) => String(row[index] || "").length)
    );
    return { width: Math.min(Math.max(maxContentLength + 2, 10), 50) };
  });

  worksheet["!cols"] = colWidths;

  // ❌ احذف الدمج
  // worksheet["!merges"] = [];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  return workbook;
};

// دالة محسنة لتحميل جميع البيانات

const downloadExcel = (filename = "جميع_البيانات.xlsx") => {
  try {
    if (!data || data.length === 0) {
      alert("لا توجد بيانات للتحميل");
      return;
    }

    const workbook = convertToExcel(data, columnsfile, "جميع العملاء");
    
    // إعدادات إضافية لتحسين الملف
    const excelBuffer = XLSX.write(workbook, { 
      bookType: "xlsx", 
      type: "array",
      bookSST: false,
      cellStyles: true
    });
    
    const blob = new Blob([excelBuffer], { 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // تنظيف الذاكرة
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
  } catch (error) {
    console.error("Error downloading Excel:", error);
    alert("حدث خطأ أثناء تحميل الملف");
  }
};

// دالة محسنة لتحميل بيانات الواتساب
const downloadWhatsAppData = (filename = "بيانات_الواتساب.xlsx") => {
  try {
    if (!data || data.length === 0) {
      alert("لا توجد بيانات للتحميل");
      return;
    }

    // تصفية البيانات لتحتوي فقط على العملاء الذين لديهم أرقام هواتف
    const whatsappData = data.filter(item => 
      item.phoneNumber && item.phoneNumber.toString().trim() !== ''
    );

    if (whatsappData.length === 0) {
      alert("لا توجد أرقام هواتف متاحة للتحميل");
      return;
    }

    const workbook = convertToExcel(whatsappData, columnsforcompaign, "بيانات الواتساب");
    
    const excelBuffer = XLSX.write(workbook, { 
      bookType: "xlsx", 
      type: "array",
      bookSST: false,
      cellStyles: true
    });
    
    const blob = new Blob([excelBuffer], { 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // تنظيف الذاكرة
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
  } catch (error) {
    console.error("Error downloading WhatsApp data:", error);
    alert("حدث خطأ أثناء تحميل ملف الواتساب");
  }
};

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const paramsObj = Object.fromEntries([...searchParams]);
        const res = await authFetch.get("customers/recomandion", { params: paramsObj });
        setData(res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsloading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

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

  return (
      <div className="p-4">
        
        <div className='flex  items-center justify-between mb-10'>
              <h2 className="text-xl font-bold mb-3">نتائج البحث  <span className='text-red-500'>{data?.length ? data?.length : 0}</span></h2>
                  <Link to="/Recommendations" className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      عوده
                    </Link>
        </div>
      <div className="mb-6 flex gap-2 lg:flex-row flex-col">
  <button
    onClick={downloadExcel}
    type='button'
    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
  >
    تحميل جميع البيانات
  </button>
  <button
    onClick={downloadWhatsAppData}
    type='button'
    className="flex items-center px-5 py-3 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
  >
    تحميل البيانات لحمله واتساب
  </button>
</div>

      {isloading ? (
        <Loader />
      ) : (
        <CustomeTabel columns={columns} data={data} />
      )}
    </div>
  )
}

export default Customerdata