import React from "react";
import {
  FaUsers,
  FaChartLine,
  FaBullhorn,
  FaMousePointer,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import {  FaExchangeAlt, FaUserPlus, FaTrash } from "react-icons/fa";

import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { GrFormView } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { format, differenceInDays, differenceInHours, differenceInMinutes  , formatDistanceToNow } from "date-fns";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import useQuerygetiteams from "../../../services/Querygetiteams"
import Loader from '../../../components/common/Loader';
import { MdOutlineAddIcCall } from "react-icons/md";
import SuccessInline from "../../../components/common/SuccessInline"
import { useState , useMemo } from 'react';
import FiltertionHook from '../../../hooks/FiltertionHook';import useQueryupdate from "../../../services/useQueryupdate";
import toast from "react-hot-toast";
import { useDashboardContext } from "../../../context/DashboardProviedr";
import AisgineClienttouser from "../../../components/common/popupmdules/AisgineClienttouser";
const StatCard = ({ title, value, icon, color }) => (
  <div
    className={`flex items-center justify-between p-5 rounded-2xl shadow-md bg-white hover:shadow-lg transition-all duration-300 border-l-4 ${color}`}
  >
    <div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className="text-3xl opacity-70 text-gray-500">{icon}</div>
  </div>
);

const LeadsBoard = ({ stats = {} }) => {
  const {isLoading , data} = useQuerygetiteams("customers/leads" , "customers/leads")
  const {isloading:loaddingConvert , updateiteam } = useQueryupdate("customers/lead-convert" , "customers/leads") 

  const { updateiteam:SendToarchiev } = useQueryupdate("customers/customer-archive" , "customers/leads") 
const {   AsigineclientTouser , setAsigine  } = useDashboardContext()
const [CurrentLead , setCurrentLead] = useState("")
  const {
    totalLeads = 0,
    totalVisits = 0,
    conversionRate = "0%",
    activeCampaigns = 0,
    newClients = 0,
    platformStats = [
      { name: "Facebook", leads: 120, icon: <FaFacebook />, color: "text-blue-600" },
      { name: "Instagram", leads: 80, icon: <FaInstagram />, color: "text-pink-500" },
      // { name: "WhatsApp", leads: 50, icon: <FaWhatsapp />, color: "text-green-500" },
    ],
  } = stats;
     const [params, setParams] = useState({
          field: "",
          searchTerm: "",
          startDate: "",
          endDate: "",
        });

       const filters = [
        
        {value:"addBy", name:"إسم المسوق"}, 

        {value:"fullName", name:"إسم المشترى"} 
        ,{value:"phoneNumber", name:"جوال"} 
 
    
        ,{value:"region", name:"موقع المشروع"} 
        , {value:"project", name:"مهتم بمشروع"} 
        , {value:"currency", name:"نوع العملة"} 
    
        , {value:"cashOption", name:"الدفع كاش"} 
    
        , {value:"firstPayment", name:"الدفعة الإولى"} 

     
      ];
  const filteredData = useMemo(() => {
    if (!data?.data?.data) return [];
  
    return data.data?.data.filter(item => {
      if (params.searchTerm && params.field) {
        console.log("params.searchTerm", params.searchTerm);
        console.log("params.field", params.field);
  
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

  const handleConvertToCustomer = (id) => {
    try {
          const data = {

    }
 updateiteam({id ,  data} , {
  onSuccess:() => {
    toast.success("تم تحويل الطلب الى عميل فعلى ")
  } ,
  onError:() => {
    toast.error("هناك خطاء فى تحويل العميل ")
  }
 })
    } catch (error) {
      console.log(error);
      
    }

};

const handleAssignFollower = (lead) => {
  
setAsigine(true)
setCurrentLead(lead)
};

const handleDeleteLead = (id) => {
  if (window.confirm("هل أنت متأكد من حذف هذا العميل المحتمل؟")) {
      try {
          const data = {
status:true
    }
 SendToarchiev({id ,  data} , {
  onSuccess:() => {
    toast.success("تم  الطلب الى ارشيف العملاء")
  } ,
  onError:() => {
    toast.error("هناك خطاء فى  حذف العميل ")
  }
 })
    } catch (error) {
      console.log(error);
      
    }
  }
};


const columns = [
  {
    name: "إسم المشترى",
    width: "160px",
    selector: (row) => row?.fullName,
    cell: (row) => (
      <Link
        target="_blank"
        rel="noopener noreferrer"
        to={`/cutomers/${row._id}`}
      >
        {row.fullName}
      </Link>
    ),
  },
  {
    name: "جوال 1",
    cell: (row) => (
      <span
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {row.phoneNumber}
        <a
          style={{ fontSize: "20px", color: "#075E54" }}
          href={`whatsapp://send?phone=${row.phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp />
        </a>
      </span>
    ),
  },
  {
    name: "الايميل",
    width: "170px",
    cell: (row) => (
      <span
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "wrap",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span>{row?.email?.substring(0, 20) || "غير متوفر"}</span>
      </span>
    ),
  },
   {
    name: "نوع العملية",
    width: "170px",
    cell: (row) => (
      <span
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "wrap",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span>{row?.opeartiontype || "غير متوفر"}</span>
      </span>
    ),
  },
  {
    name: "المنطقة",
    selector: (row) => row.region,
  },
  {
    name: "الموقع",
    width: "120px",
    cell: (row) => <span>{row?.governote}</span>,
  },
  {
    name: "العملة",
    width: "120px",
    cell: (row) => <span>{row?.currency}</span>,
  },
  {
    name: "الدفعة الإولى",
    sortable: true,
    width: "200px",
    sortFunction: (rowA, rowB) =>
      Number(rowA.firstPayment) - Number(rowB.firstPayment),
    cell: (row) => (
      <span>{Number(row?.firstPayment).toLocaleString("en-US")}</span>
    ),
  },
    {
    name: "ملاحظات",
    width: "120px",
    cell: (row) => <span>{row?.notes || "غير متوفر"}</span>,
  },
  {
    name: "تاريخ الإنشاء",
    selector: (row) => row.createdAt,
    sortable: true,
    width: "150px",
    cell: (row) => (
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "wrap",
        }}
      >
        {format(new Date(row.createdAt), "dd MMMM, yyyy")}
      </span>
    ),
  },
  {
    name: "الإجراءات",
    width: "160px",
    cell: (row) => (
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* تحويل إلى عميل */}


        {/* إضافة موظف متابعة */}
        <FaUserPlus
          style={{ cursor: "pointer", color: "#198754" }}
          title="إضافة موظف متابعة"
          onClick={() => handleAssignFollower(row?._id)}
        />

        {/* حذف */}
        <FaTrash
          style={{ cursor: "pointer", color: "#dc3545" }}
          title="حذف"
          onClick={() => handleDeleteLead(row?._id)}
        />
      </div>
    ),
  },
];


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
          name: "موقع المشروع",
          selector: (row) => row.region,
        },
  
        {
          name: "نوع العملة",
          selector: (row) => row?.currency,
        },
      
    
    
   
        {
          name: " الدفعة الأولى",
          selector: (row) => row.firstPayment,
        },
     
     
   

        {
          name: "متطلبات العميل",
          selector: (row) => row.clientRequire ,
        },
        {
          name: "ملاحظات",
          selector: (row) => row.notes ,
        }
      ]

        

   
if(isLoading || loaddingConvert) {
 <div className="w-full flex items-center justify-center bg-red-500">
  {/* <SuccessInline /> */}
  <span>مخشييهىل</span>
 </div> 
}    
      

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم الـ Leads</h1>
          <p className="text-gray-500 mt-2">
            عرض سريع لأداء الحملات التسويقية عبر جميع المنصات
          </p>
        </header>

        {/* MAIN STATS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <StatCard
            title="إجمالي الـ Leads"
            value={filteredData?.length || 0}
            icon={<FaUsers />}
            color="border-green-500"
          />
          <StatCard
            title="إجمالي الزيارات"
            value={data?.data?.LeadsVistors[0]?.count}
            icon={<FaMousePointer />}
            color="border-blue-500"
          />
          <StatCard
            title="نسبة التحويل"
            value={conversionRate}
            icon={<FaChartLine />}
            color="border-yellow-500"
          />

        </div>

        {/* PLATFORM PERFORMANCE */}
        {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            الأداء حسب المنصة
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {platformStats.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${p.color}`}>{p.icon}</div>
                  <span className="font-medium text-gray-800">{p.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{p.leads} Leads</span>
              </div>
            ))}
          </div>
        </div> */}

        {/* TABLE PLACEHOLDER */}
        <div className="mt-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              قائمة العملاء المحتملين (Leads)
            </h3>
           <span></span>
          </div>
<FiltertionHook  filters={filters} columns={columnsfile} params={params} setParams={setParams} filteredData={filteredData}/>
          <div className="border-2 border-dashed rounded-xl  text-gray-400">
          <CustomeTabel   defaultSortField="firstPayment"
  defaultSortAsc={false}  data={filteredData} columns={columns}/>
          </div>
        </div>
      </div>
      <AisgineClienttouser  CurrentLead={CurrentLead} setCurrentLead={setCurrentLead}/>
    </section>
  );
};

export default LeadsBoard;

/* usage example:
import LeadsBoard from "./LeadsBoard";

const mockData = {
  totalLeads: 250,
  totalVisits: 2400,
  conversionRate: "10.4%",
  activeCampaigns: 6,
  newClients: 20,
  platformStats: [
    { name: "Facebook", leads: 120, icon: <FaFacebook />, color: "text-blue-600" },
    { name: "Instagram", leads: 80, icon: <FaInstagram />, color: "text-pink-500" },
    { name: "WhatsApp", leads: 50, icon: <FaWhatsapp />, color: "text-green-500" },
  ],
};
<LeadsBoard stats={mockData} />
*/
