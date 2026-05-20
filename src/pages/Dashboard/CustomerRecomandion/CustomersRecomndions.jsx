import React from 'react';
import AdvancedFilter from '../../../components/common/AdvancedFilter';
import { FiSearch, FiDownload, FiRefreshCcw, FiChevronDown } from "react-icons/fi";
import CustomeTabel from '../../../components/common/CustomeTabel'
import { Link } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineAddIcCall } from "react-icons/md";
import * as XLSX from "xlsx";
import StatusFilterTabs from '../../../components/common/StatusFilterTabs';
import { format, differenceInDays, differenceInHours, differenceInMinutes  , formatDistanceToNow } from "date-fns";
import { useState } from 'react';
import authFetch from '../../../utils/axiosAuthfetch';
import TeaxtareGenralSearch from '../../../components/common/TeaxtareGenralSearch';
import Loader from '../../../components/common/Loader';
import { useNavigate } from "react-router-dom";
import CustomersJourneyAnalytics from '../../../components/common/CustomersJourneyAnalytics';

const CustomersRecommendations = () => {
       const [formData, setFormData] = useState({
      addBy: "",
      userfollow:"",
      clientwork: [],
      source: [],
      clientStatus: [],
      region: [],
      project: [],
      cashOption: "",
      firstPaymentFrom: null ,
      firstPaymentTo:null,
      InstallmentType: "",
      followFrom: "",
      followTo: "",
      ordersFrom: "",
      ordersTo: "",
      isViwed: [],
      clientendRequr: "",
      rquireLocation: "",
      requireRegion: "",
      require: "",
      requireType: "",
       governote:[] ,
       relatedStauts:[]
    });
     const [allwords , setWords] = useState([])
    const [data , setData] = useState([])
    const [isloading , setIsloading] = useState(false)
const navigate  = useNavigate()
     const statusConfig = {
     
        info: {
          label: "بحث مخصص" ,
          className: "text-yellow-600 hover:text-yellow-700",
          icon: "clock"
        },
        genrale: {
          label: "بحث عام" ,
          className: "text-green-600 hover:text-green-700",
          icon: "check-circle"
        },
          ai: {
          label: "تحليلات ذكاء اصطناعى" ,
          className: "text-green-600 hover:text-red-700",
          icon: "check-circle"
        },
     
     
    
      }; 
      const [CurrenTap , setCurrentTap] = useState("info")

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

const handelSubmit =  async (e) => {
  e.preventDefault();
  try {
    setIsloading(true)
       const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        // إزالة القيم الفارغة، ولكن الاحتفاظ بـ 0
        return value !== "" && value !== null && value !== undefined;
      })
    );
    if(CurrenTap === "info"){
  //  const respones = await authFetch.get("customers/recomandion" , {params:{...cleanedData , CurrenTap} })
         navigate(`/customers-search-results?${new URLSearchParams({...cleanedData , CurrenTap})}`);

   
    // setData(respones?.data?.data)
    //   setIsloading(false)
    } else {

            navigate(`/customers-search-results?${new URLSearchParams({ allwords, CurrenTap })}`);

    //      const respones = await authFetch.get("customers/recomandion" , {params:{allwords , CurrenTap} })
    // setData(respones?.data?.data)
    // setIsloading(false)
    }
 

    
  } catch (error) {
    console.log(error);
    setIsloading(false)
    
  }
}
const handelReset = () => {
  setFormData({
     addBy: "",
      userfollow:"",
      clientwork: [],
      source: [],
      clientStatus: [],
      region: "",
      project: [],
      cashOption: [],
      firstPaymentFrom: "" ,
      firstPaymentTo:"",
      InstallmentType: "",
      followFrom: "",
      followTo: "",
      ordersFrom: "",
      ordersTo: "",
      isViwed: [],
      clientendRequr: "",
      rquireLocation: [],
      requireRegion: [],
      require: [],
      requireType: [],
      governote:[]
  })
  setWords([])
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
const convertToExcel = (data, columns, sheetName = "البيانات") => {
  // إنشاء headers
  const headers = columns.map((col) => col.name);
  
  // إنشاء البيانات
  const rows = data.map((item) =>
    columns.map((col) => {
      let value = "";
      if (col.selector) {
        value = col.selector(item);
      }
      // تحويل القيمة لـ string وتنظيفها
      return String(value || "").trim();
    })
  );

  // دمج headers مع البيانات
  const worksheetData = [headers, ...rows];
  
  // إنشاء worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // تحسين تنسيق الأعمدة
  const colWidths = headers.map((header, index) => {
    const maxContentLength = Math.max(
      header.length,
      ...rows.map(row => String(row[index] || "").length)
    );
    return { width: Math.min(Math.max(maxContentLength + 2, 10), 50) };
  });
  
  worksheet['!cols'] = colWidths;
  
  // إضافة تنسيق للـ header
  if (!worksheet['!merges']) worksheet['!merges'] = [];
  worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });
  
  // إنشاء workbook
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
  return (
    <div className="min-h-screen  text-center rounded-lg ">


      <form  onSubmit={handelSubmit}>

      
            <div className="flex gap-2 lg:flex-row flex-col w-full lg:w-auto m-5">
                  <button
               
                type='submit'
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600  text-white p-4  rounded-lg shadow-md"
              >
               بحث
              </button>
              <button
                onClick={handelReset}
                type='button'
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-md"
              >
                <FiRefreshCcw /> إعادة تعيين
              </button>

      
            </div>

            <div>
                      <StatusFilterTabs  statusConfig={statusConfig} onStatusChange={(key) => setCurrentTap(key)} selectedStatus={CurrenTap}/>
              
            </div>

            {
              CurrenTap === "info" && <AdvancedFilter formData={formData} setFormData={setFormData} />
            }


            {
              CurrenTap === "genrale" && <TeaxtareGenralSearch allwords={allwords} setWords={setWords} />
            }
            {
              CurrenTap === "ai" &&   <CustomersJourneyAnalytics />
            }
          


</form>
{/* {
  isloading ? <Loader /> : 
  <div className='mt-10 bg-gray-50 w-full p-4 rounded-md border-dashed'>
  <CustomeTabel  data={data} columns={columns}/>
</div>
} */}

    </div>
  );
};

export default CustomersRecommendations;