import React, { useState, useEffect } from "react";
import useQuerygetiteams from "../../services/Querygetiteams";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { format, differenceInDays, differenceInHours, differenceInMinutes  , formatDistanceToNow } from "date-fns";
const STATUS_COLORS = {
  "عدم الاتصال": "#EF4444",
  "تم التواصل": "#F97316",
  "غير محتمل": "#F59E0B",
  "محتمل": "#EAB308",
  "قيد التفاوض (على السعر / الشروط)": "#3B82F6",
  "VIP": "#10B981",
  "VIP+": "#059669",
  "اشترى": "#8B5CF6",
  "لم يتم التواصل": "#6B7280"
};

const STATUS_ORDER = [
  "عدم الاتصال",
  "تم التواصل",
  "غير محتمل",
  "محتمل",
  "قيد التفاوض (على السعر / الشروط)",
  "VIP",
  "VIP+",
  "اشترى"
];


const CustomersJourneyAnalytics = () => {
  const [params, setParams] = useState({
    dateFilter: "all",
    clientStatus: "all",
    segmentType: "all",
    employeeId: "all"
  });

  const [dateRange, setDateRange] = useState("all");
  const [customerSegment, setCustomerSegment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedUser , setSelectaedUser] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(true);

  const { data, isLoading } = useQuerygetiteams(
    "customers/journey-analytics",
    "customers/analytics/journey",
    params
  );

  useEffect(() => {
    setParams(prev => ({
      ...prev,
      dateFilter: dateRange,
      segmentType: customerSegment,
      employeeId: selectedEmployee
    }));
  }, [dateRange, customerSegment, selectedEmployee]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-500 text-lg">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  const apiData = data?.data?.data || {};
  const customers = apiData?.customers || [];
  const analytics = apiData.analytics || {};
  const conversionRateByStatus = analytics.conversionRateByStatus || {};
  const employeePerformance = analytics.employeePerformance || [];
  const advancedStats = analytics.advancedStats || {};
  const customersNeedingFollowup = analytics.customersNeedingFollowup || [];
  const employeeFollowupClassification = analytics?.employeeFollowupClassification || []
  const employeeFollowupDetails = analytics?.employeeFollowupDetails.find((user) => selectedUser === user?.employeeId) || []

 const handelStringLength = (text) =>{
    if(text?.length > 20) {
      return `${text.substring(0 , 20)}...`
    } 
    return text
  }
     const columnsfile = [
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
  name: "تاريخ أخر اتصال",
  selector: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

    return lastFollow
      ? new Date(lastFollow.createdAt).toLocaleDateString("ar-EG")
      : "لا يوجد";
  },
  cell: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

    if (!lastFollow) return <span>لا يوجد</span>;

    return <span>{new Date(lastFollow.createdAt).toLocaleDateString("ar-EG")}</span>;
  }
}
 ,
{
  name: "أخر حالة اتصال",
  selector: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

    return lastFollow?.CustomerDealsatuts || "لا يوجد";
  },
  cell: (row) => {
    const lastFollow = row.SectionFollow?.length
      ? [...row.SectionFollow].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

    return <span>{lastFollow?.CustomerDealsatuts || "لا يوجد"}</span>;
  }
}

,
{
  name: "أخر اتصال",
  selector: (row) => {
    if (!row.SectionFollow?.length) return "لا يوجد";

    const lastFollow = [...row.SectionFollow].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    return [
      lastFollow.CustomerDealsatuts,
      lastFollow.details,
      lastFollow.user?.fullName,
      new Date(lastFollow.createdAt).toLocaleDateString("ar-EG")
    ]
      .filter(Boolean)
      .join(" - ");
  }
}



,
  {
          name: "متطلبات العميل قديم",
          selector: (row) => row.clientRequire ,
        },


      {
  name: "متطلبات العميل جديد",
  selector: (row) => {
    if (!row.clientRequirements?.length) return "لا يوجد";

    return row.clientRequirements
      .map(req =>
        [
          req.rquireLocation,
          req.requireRegion,
          req.require,
          req.requireType
        ]
          .filter(Boolean)
          .join(" - ")
      )
      .join(" | ");
  },
  cell: (row) => (
    <div className="flex flex-col gap-1">
      {row.clientRequirements?.map(item => (
        <div key={item._id} className="text-xs">
          {item.rquireLocation} - {item.requireRegion} - {item.require} - {item.requireType}
        </div>
      ))}
    </div>
  )
}
,


            {
          name: "عدد متطلبات العميل ",
          selector: (row) => row?.clientRequirements?.length ?  row?.clientRequirements?.length : 0
          
        },
      
            {
        name: "عدد المتابعات",
          sortable: true ,
        selector: (row) => row?.SectionFollow?.length ? row?.SectionFollow?.length  : 0,
          width:"140px" ,
    
      },

         {
          name: "المشروع المهتم به",
          selector: (row) => row?.project,
        },

   {
          name: "ملاحظات",
          selector: (row) => row.notes ,
        },




        {
          name: "إسم المسوق",
          selector: (row) => row.addBy,
        },
           {
        name: "إسم المتابع /ة",
        selector: (row) => row?.userfollow,

      },
          {
          name: " الدفعة الأولى",
          selector: (row) => row.firstPayment,
        },

      {
          name: "نوع العملة",
          selector: (row) => row?.currency,
        },

   
        {
          name: "هل تمت المعاينة",
          selector: (row) => row.isViwed
       
        },

       {
          name: "مصدر العميل",
          selector: (row) => row.source,
        }, 
    {
          name: "اخر ماتم التواصل مع  العميل",
          selector: (row) => row.clientendRequr ,
        },


                       {
        name: "وظيفة العميل",
        selector: (row) => row?.clientwork,

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
          name:"تاريخ الإنشاء",
          selector: (row) => format(new Date(row.createdAt), "dd MMMM, yyyy"),
           sortable: true ,
           width:"150px",
          cell: (row) => <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace:"wrap"}}>{format(new Date(row.createdAt), "dd MMMM, yyyy")}</span>
        },


        //  {
        //   name: "وصف حالة العميل",
        //   selector: (row) => row.relatedStauts,
        //   cell: (row) => (
        //     <span
        //       style={{
        //         textOverflow: "ellipsis",
        //         whiteSpace: "nowrap",
        //         overflow: "hidden",
        //       }}
        //     >
        //       {" "}
        //       {row.relatedStauts }
        //     </span>
        //   ),
        // },
        // {
        //   name: "منطقة المشروع",
        //   selector: (row) => row.region,
        // },
        //     {
        //   name: "موقع المشروع",
        //   selector: (row) => row.governote,
        // },
        // {
        //   name: "المشروع المهتم به",
        //   selector: (row) => row?.project,
        // },
    
      
    
    
        // {
        //   name: "الدفع كاش",
        //   selector: (row) => row.cashOption,
        // },
  
        // {
        //   name: "تقسيط على كام سنة",
        //   selector: (row) => row.installmentsPyYear ,
        // },
     
     
    

      
     

        
   
    
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
  const convertToExcel = (customers, columnsfile, sheetName = "البيانات") => {
  const headers = columnsfile.map((col) => col.name);

  const rows = customers.map((item) =>
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
    if (!customers || customers.length === 0) {
      alert("لا توجد بيانات للتحميل");
      return;
    }

    const workbook = convertToExcel(customers, columnsfile, "جميع العملاء");
    
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
    if (!customers || customers.length === 0) {
      alert("لا توجد بيانات للتحميل");
      return;
    }

    // تصفية البيانات لتحتوي فقط على العملاء الذين لديهم أرقام هواتف
    const whatsappData = customers.filter(item => 
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
  
  if (!analytics || Object.keys(analytics).length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <span className="text-6xl mb-4 block">📊</span>
          <p className="text-gray-500 text-lg">لا توجد بيانات عملاء للتحليل</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50" dir="rtl">
      {/* ===== HEADER ===== */}
                   <div className="mb-6 flex gap-2 justify-end lg:flex-row flex-col">
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
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              تحليل رحلة العملاء
            </h1>
            <p className="text-gray-500 mt-1">
              تحليل {advancedStats.totalCustomers || 0} عميل • {advancedStats.totalFollowups || 0} متابعة
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm"
                    value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">كل الفترات</option>
              <option value="week">آخر أسبوع</option>
              <option value="month">آخر شهر</option>
              <option value="quarter">آخر ٣ شهور</option>
            </select>
            
            <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm"
                    value={customerSegment} onChange={(e) => setCustomerSegment(e.target.value)}>
              <option value="all">كل العملاء</option>
              <option value="converted">المحولين</option>
              <option value="vip">VIP</option>
              <option value="hot">واعدين</option>
            </select>
               {/* <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm"
                    value={params.clientStatus} onChange={(e) => setParams({...params , clientStatus:e.target.value})}>
              <option value="all">كل العملاء</option>
       {
        STATUS_ORDER?.map((stauts) => {
          return <option value={stauts}> {stauts}</option>
        })
       }
            </select> */}

            <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm"
                    value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="all">كل الموظفين</option>
              {employeePerformance.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-600 text-sm mb-1">معدل التحويل الكلي</div>
                <div className="text-2xl font-bold text-gray-900">
                  {advancedStats.conversionRate_total || 0}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {advancedStats.convertedCustomers || 0} من {advancedStats.totalCustomers || 0}
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-600 text-sm mb-1">متوسط مدة التحويل</div>
                <div className="text-2xl font-bold text-gray-900">
                  {advancedStats.averageDaysToConversion || 0} يوم
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {advancedStats.conversionCount || 0} عملية تحويل
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-amber-600 text-sm mb-1">متابعات عاجلة</div>
                <div className="text-2xl font-bold text-gray-900">
                  {advancedStats.kpis?.urgentFollowupsNeeded || 0}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  بحاجة متابعة فورية
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-600 text-sm mb-1">عملاء نشطين</div>
                <div className="text-2xl font-bold text-gray-900">
                  {advancedStats.kpis?.weeklyActiveCustomers || 0}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  خلال آخر ٧ أيام
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 1. معدل التحويل لكل حالة ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">🔄</span>
            معدل التحويل للشراء - حسب الحالة
          </h3>
          <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            من أول ظهور للحالة → اشترى
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_ORDER.filter(s => s !== 'اشترى').map(status => {
            const rate = conversionRateByStatus[status] || { conversionRate: 0, totalCustomers: 0, convertedCustomers: 0, averageDaysToConvert: 0 };
            
            return (
              <div key={status} 
                   className="relative bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition cursor-pointer"
                   onClick={() => setSelectedStatus(status)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full" 
                       style={{ backgroundColor: `${STATUS_COLORS[status]}20` }}>
                    <div className="w-full h-full rounded-full border-2"
                         style={{ borderColor: STATUS_COLORS[status] }}></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{status}</h4>
                    <span className="text-xs text-gray-500">
                      {rate.totalCustomers || 0} عميل
                    </span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">نسبة التحويل</span>
                    <span className="font-bold" style={{ color: STATUS_COLORS[status] }}>
                      {rate.conversionRate || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full"
                         style={{ width: `${rate.conversionRate || 0}%`, backgroundColor: STATUS_COLORS[status] }}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">عملاء تحولوا:</span>
                  <span className="font-bold text-gray-900">{rate.convertedCustomers || 0}</span>
                </div>
                
                {rate.averageDaysToConvert > 0 && (
                  <div className="mt-2 text-xs bg-gray-100 p-2 rounded-lg text-center">
                    ⏱️ متوسط {rate.averageDaysToConvert} يوم من {status}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* شرح طريقة الحساب */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
          <span className="font-bold">ℹ️ طريقة الحساب:</span> نسبة العملاء الذين ظهرت لديهم هذه الحالة ثم وصلوا لمرحلة "اشترى" لاحقاً
        </div>
      </div>

      {/* ===== 2. تقييم أداء الموظفين ===== */}
     {/* ===== تقييم أداء الموظفين ===== */}
<div className="bg-white rounded-2xl shadow-sm p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold flex items-center gap-2">
      <span className="text-xl">👥</span>
      تقييم أداء الموظفين
    </h3>
    <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
      {employeePerformance.length} موظف
    </span>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {employeePerformance.map((emp) => {
      // ✅ دمج بيانات التصنيف مع بيانات الأداء
      const classification = employeeFollowupClassification?.find(
        item => item.employeeId === emp.employeeId
      ) || {};
      
      return (
        <div key={emp.employeeId} 
             className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition">
          
          {/* ===== رأس البطاقة ===== */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {emp.employeeName?.charAt(0) || 'م'}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{emp.employeeName}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  emp.performanceLevel === 'ممتاز' ? 'bg-green-100 text-green-700' :
                  emp.performanceLevel === 'جيد جداً' ? 'bg-blue-100 text-blue-700' :
                  emp.performanceLevel === 'جيد' ? 'bg-yellow-100 text-yellow-700' :
                  emp.performanceLevel === 'متوسط' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {emp.performanceLevel}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{emp.successRate}%</div>
              <div className="text-xs text-gray-500">نسبة نجاح</div>
            </div>
          </div>
          
          {/* ===== إحصائيات سريعة (من employeePerformance) ===== */}
          <div className="grid grid-cols-4 gap-1 mb-3 text-center text-xs">
            <div className="bg-white p-2 rounded-lg">
              <div className="font-bold text-gray-900">{emp.totalFollowups}</div>
              <div className="text-gray-500">متابعات</div>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <div className="font-bold text-green-600">{emp.statusImprovements || 0}</div>
              <div className="text-gray-500">تحسن</div>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <div className="font-bold text-red-600">{emp.statusDegradations || 0}</div>
              <div className="text-gray-500">تدهور</div>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <div className="font-bold text-purple-600">{emp.customersConverted || 0}</div>
              <div className="text-gray-500">تحويل</div>
            </div>
          </div>
          
          {/* ===== ✅ توزيع حالات المتابعات (من employeeFollowupClassification) ===== */}
          <div className="mb-3 p-3 bg-white bg-opacity-60 rounded-lg">
            <h5 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
              <span>📊</span> توزيع المتابعات حسب الحالة
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(classification.followupsByStatus || {}).slice(0, 6).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" 
                         style={{ backgroundColor: STATUS_COLORS[status] || '#6B7280' }}></div>
                    <span className="text-gray-600 truncate max-w-[80px]">{status}</span>
                  </div>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* ===== تفاصيل الأداء ===== */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">⏱️ سرعة الاستجابة:</span>
              <span className="font-bold text-gray-900">
                {emp.averageResponseHours || 0} ساعة
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">👥 عملاء فريدين:</span>
              <span className="font-bold text-gray-900">{emp.uniqueCustomers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">🏆 نقاط الأداء:</span>
              <span className="font-bold text-gray-900">{emp.performanceScore || 0}</span>
            </div>
          </div>
          
          {/* ===== مؤشر التحسن/التدهور/الثبات (من التصنيف) ===== */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span className="text-green-600">تحسن {classification.improvementRate || 0}%</span>
              <span className="text-red-600">تدهور {classification.degradationRate || 0}%</span>
              <span className="text-yellow-600">
                ثبات {classification.totalFollowups ? 
                  (100 - ((classification.improvementRate || 0) + (classification.degradationRate || 0))).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" 
                   style={{ width: `${classification.improvementRate || 0}%` }}></div>
              <div className="bg-red-500 h-full" 
                   style={{ width: `${classification.degradationRate || 0}%` }}></div>
              <div className="bg-yellow-500 h-full" 
                   style={{ width: `${classification.totalFollowups ? 
                     100 - ((classification.improvementRate || 0) + (classification.degradationRate || 0)) : 0}%` }}></div>
            </div>
          </div>
          
          {/* ===== مؤشر النجاح/الفشل ===== */}
          <div className="mt-3 flex gap-1">
            <div className="flex-1 bg-green-100 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full"
                   style={{ width: `${(emp.successfulInteractions / (emp.successfulInteractions + emp.failedInteractions || 1)) * 100}%` }}></div>
            </div>
            <span className="text-[10px] text-gray-500">
              {emp.successfulInteractions || 0} ناجحة / {emp.failedInteractions || 0} فاشلة
            </span>
          </div>
              <button type="button" onClick={() => setSelectaedUser(emp.employeeId) } className="text-xs bg-white px-3 py-1 rounded-full shadow-sm hover:shadow transition">
                 رؤيه المتابعات
                    </button>
        </div>
      );
    })}

  </div>

  
  {/* ===== شرح معايير التقييم ===== */}
  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
    <details>
      <summary className="font-bold text-gray-700 cursor-pointer">📊 معايير تقييم الموظفين</summary>
      <div className="mt-2 space-y-1 text-gray-600">
        <p>• <span className="font-bold">المتابعة الناجحة:</span> أدت لتحسن حالة العميل (مثل محتمل ← VIP) أو شراء</p>
        <p>• <span className="font-bold">المتابعة الفاشلة:</span> لم تغير الحالة أو أدت لتدهورها</p>
        <p>• <span className="font-bold">تحسين الحالة:</span> انتقال العميل لمرحلة أعلى في سلم التحويل</p>
        <p>• <span className="font-bold">سرعة الاستجابة:</span> متوسط الوقت بين متابعات الموظف لنفس العميل</p>
        <p>• <span className="font-bold">نقاط الأداء:</span> تحويل (٥٠) + تحسن (٢٠) - تدهور (١٥) + متابعات ناجحة (١٠)</p>
      </div>
    </details>
  </div>
    {
    selectedUser &&   <div className="w-full h-full bg-gray-50 rounded-l p-3">
      <span onClick={() => setSelectaedUser(null)} className="text-3xl text-red-500 flex items-end p-2 cursor-pointer">
        x
      </span>

<h2  className="flex gap-5 items-center justify-center text-lg">
  {
    employeeFollowupDetails?.employeeName
  }
  <h1  className="text-red-500 ">
    {
       employeeFollowupDetails?.followups?.length + " " +  "متابعة"
    }
  </h1>
</h2>
<div className="space-y-3 max-h-96 overflow-y-auto">
  {
    employeeFollowupDetails?.followups?.map((follow) => {
return (
   <div key={follow.followId} 
                     className={`p-4 m-3 rounded-xl border-r-4 bg-red-50 border-orange-500 hover:shadow-md transition cursor-pointer
                          
                                  'bg-yellow-50 border-yellow-500'}`}
                   >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{follow.customerName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${STATUS_COLORS[follow.status] || '#9CA3AF'}20`, 
                                       color: STATUS_COLORS[follow.status] || '#6B7280' }}>
                          {follow.status}
                        </span>
                        {/* <span className="text-xs text-gray-500">
                          {follow.daysSinceLastFollowup ? `${customer.daysSinceLastFollowup} يوم` : 'جديد'}
                        </span> */}
                      </div>
                    </div>
                  
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {follow.details}
                  </p>
                  
                  <div className="mt-2 flex items-center justify-between">
                    {/* <span className="text-xs text-gray-500">
                      {customer.suggestedAction}
                    </span> */}
                    <Link target="_blank"  to={`/cutomers/${follow.customerId}`}  className="text-xs bg-white px-3 py-1 rounded-full shadow-sm hover:shadow transition">
                      متابعة الآن
                    </Link>
                  </div>
                </div>
)
    })
  }

</div>
  </div>
  }

</div>


      {/* ===== 3. العملاء المستحقين للمتابعة ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* العملاء المستحقين للمتابعة */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-xl">⏰</span>
              العملاء المستحقين للمتابعة
            </h3>
            <span className="text-sm bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
              {customersNeedingFollowup.length} عميل
            </span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {customersNeedingFollowup.length > 0 ? (
              customersNeedingFollowup.map((customer) => (
                <div key={customer.customerId} 
                     className={`p-4 rounded-xl border-r-4 hover:shadow-md transition cursor-pointer
                                ${customer.priority === 'urgent' ? 'bg-red-50 border-red-500' :
                                  customer.priority === 'high' ? 'bg-orange-50 border-orange-500' :
                                  'bg-yellow-50 border-yellow-500'}`}
                     onClick={() => setSelectedCustomer(customer)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{customer.customerName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${STATUS_COLORS[customer.currentStatus] || '#9CA3AF'}20`, 
                                       color: STATUS_COLORS[customer.currentStatus] || '#6B7280' }}>
                          {customer.currentStatus}
                        </span>
                        <span className="text-xs text-gray-500">
                          {customer.daysSinceLastFollowup ? `${customer.daysSinceLastFollowup} يوم` : 'جديد'}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        customer.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        customer.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {customer.priority === 'urgent' ? 'عاجل' :
                         customer.priority === 'high' ? 'مرتفع' : 'متوسط'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {customer.reason}
                  </p>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {customer.suggestedAction}
                    </span>
                    <Link target="_blank"  to={`/cutomers/${customer.customerId}`}  className="text-xs bg-white px-3 py-1 rounded-full shadow-sm hover:shadow transition">
                      متابعة الآن
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا يوجد عملاء بحاجة للمتابعة حالياً
              </div>
            )}
          </div>
        </div>

        {/* توزيع الحالات الحالية */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            توزيع العملاء - الحالة الحالية
          </h3>
          
          <div className="space-y-4">
            {Object.entries(advancedStats.statusDistribution || {})
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => {
                const percentage = advancedStats.totalCustomers > 0 
                  ? ((count / advancedStats.totalCustomers) * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={status} className="group">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" 
                             style={{ backgroundColor: STATUS_COLORS[status] || '#6B7280' }}></div>
                        <span className="font-medium text-gray-700">{status}</span>
                      </div>
                      <span className="text-gray-600">
                        {count} عميل ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-2.5 rounded-full transition-all duration-1000"
                           style={{ width: `${percentage}%`, backgroundColor: STATUS_COLORS[status] || '#6B7280' }}>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ===== 4. العملاء المتوقع تحويلهم ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">🔮</span>
            العملاء المتوقع تحويلهم
          </h3>
          <span className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
            {analytics.predictedConversions?.length || 0} عميل متوقع
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.predictedConversions?.map((prediction) => (
            <div key={prediction.customerId} 
                 className="relative group bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {prediction.customerName?.charAt(0) || 'ع'}
                </div>
                <div>
                  <Link target="_blank"  to={`/cutomers/${prediction.customerId}`} className="font-bold text-gray-900">{prediction.customerName}</Link>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${STATUS_COLORS[prediction.currentStatus]}20`, 
                                 color: STATUS_COLORS[prediction.currentStatus] }}>
                    {prediction.currentStatus}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">احتمالية التحويل</span>
                  <span className="font-bold text-purple-700">{prediction.conversionProbability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-l from-purple-600 to-indigo-600"
                       style={{ width: `${prediction.conversionProbability}%` }}>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {prediction.factors?.map((factor, i) => (
                  <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                    {factor}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">
                  {prediction.recommendedAction}
                </span>
                <Link target="_blank"  to={`/cutomers/${prediction.customerId}`}  className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition">
                  تواصل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal تفاصيل العميل */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">تفاصيل العميل</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.customerName?.charAt(0) || 'ع'}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900">{selectedCustomer.customerName}</h4>
                  <span className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: `${STATUS_COLORS[selectedCustomer.currentStatus]}20`, 
                                 color: STATUS_COLORS[selectedCustomer.currentStatus] }}>
                    {selectedCustomer.currentStatus}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">آخر متابعة</div>
                  <div className="font-bold text-gray-900">
                    {selectedCustomer.lastFollowupDate 
                      ? new Date(selectedCustomer.lastFollowupDate).toLocaleDateString('ar-EG')
                      : 'لم يتم التواصل'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">منذ</div>
                  <div className="font-bold text-gray-900">
                    {selectedCustomer.daysSinceLastFollowup ? `${selectedCustomer.daysSinceLastFollowup} يوم` : 'جديد'}
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="font-bold text-red-700 mb-2">{selectedCustomer.reason}</div>
                <p className="text-gray-700 text-sm">{selectedCustomer.suggestedAction}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-bold text-gray-900 mb-2">آخر ملاحظة</div>
                <p className="text-gray-700 text-sm">{selectedCustomer.lastFollowupNote || 'لا توجد ملاحظات'}</p>
              </div>
              
              <Link target="_blank"  to={`/cutomers/${selectedCustomer.customerId}`} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition">
                بدء متابعة الآن
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersJourneyAnalytics;