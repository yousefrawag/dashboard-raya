import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import { FaWhatsapp } from "react-icons/fa";
import CallCenterfloow from './CallCenterfloow';
import StatusFilterTabs from "../../../components/common/StatusFilterTabs"
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import PopupCheckdelete from '../../../components/common/popupmdules/PopupCheckdelete';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import ClientOrders from './ClientOrders';
import CustomerReports from './CustomerReports';
const GetCustomerByid = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuerygetSpacficIteam("customers", "customers", id);
  const {deleteIteam} = useQueryDelete("customers" , "customers")
  const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("Clients")
    const {  setModuleDelete } =  useDashboardContext()
    const [SectionFollowupdate , seSectionFlowwupdate] = useState([])
  
  const customer = data?.data;
      const lastFollow = customer?.SectionFollow?.length
      ? [...customer?.SectionFollow].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;
  const navigate = useNavigate()
useEffect(() => {
  if(customer){
    seSectionFlowwupdate(customer?.SectionFollow)
  }
} , [customer])
  const statusConfig = {
 
    info: {
      label: "بيانات العميل" ,
      className: "text-yellow-600 hover:text-yellow-700",
      icon: "clock"
    },
    contacts: {
      label: "قسم الإتصالات" ,
      className: "text-green-600 hover:text-green-700",
      icon: "check-circle"
    },
      Reports: {
      label: "تقارير العميل" ,
      className: "text-green-600 hover:text-green-700",
      icon: "check-circle"
    },
       require: {
        label: "قسم طلبات العميل" ,
        className: "text-green-600 hover:text-red-700",
        icon: "check-circle"
      },
 
 

  }; 
  const [CurrenTap , setCurrentTap] = useState("info")

  if (isLoading) {
    return <p className="text-center text-xl font-semibold">جاري تحميل البيانات...</p>;
  }

  if (!customer) {
    return <p className="text-center text-red-500 text-xl font-semibold">لم يتم العثور على بيانات العميل</p>;
  }

  // Customer details mapping (to make UI dynamic)
  const customerDetails = [
    { label: "إسم المشترى", value: customer?.fullName },
    { label: "إسم المسوق /ة", value: customer?.addBy },
     { label: "إسم المتابع /ة", value: customer?.userfollow },
          { label: "الجوال", value: customer?.phoneNumber },
           { label: "وظيفة العميل", value: customer?.clientwork },
                 { label: "مصدر العميل", value: customer?.source },
       { label: "حالة العميل", value: customer?.clientStatus },
  
          { label: "موقع المشروع ", value: customer?.region },
                  { label: "منظقة المشروع ", value: customer?.governote },
          { label: "المشروع المهتم به", value: customer?.project },
           { label: "العملة", value: customer?.currency },
           { label: "ألية الدفع*", value: customer?.cashOption },
    { label: "الدفعة الإولى", value: customer?.firstPayment || "غير متوفر" },
        { label: "الدفعة الشهرية", value: customer?.Paymentpermonth || "غير متوفر" },
        { label: "تقسيط على كام سنة *", value: customer?.installmentsPyYear || "غير متوفر" },
    { label: "تاريخ أخر تواصل", value: lastFollow?.createdAt ? format(new Date(lastFollow?.createdAt ), "dd MMMM, yyyy") : "غير مضاف" },
    { label: "اخر ماتم التواصل", value: customer?.clientendRequr || "غير متوفر" },
    { label: "هل تمت المعاينة", value: customer?.isViwed },
 
    { label: "متطلبات العميل", value: customer?.clientRequire || "غير متوفر" }, 
    { label: "موقع الطلب", value: customer?.clientRequireLocation || "غير متوفر" }, 
    { label: "ملاحظات", value: customer?.notes || "غير متوفر" },
    { label: "تاريخ الإنشاء", value: customer?.createdAt ? format(new Date(customer?.createdAt), "dd MMMM, yyyy") : "غير متوفر" },
 
  ];

  return (
    <div className='w-full h-full'>
      <HeadPagestyle pageName="بيانات العميل" to="/cutomers" title="عوده" />
      <StatusFilterTabs  statusConfig={statusConfig} onStatusChange={(key) => setCurrentTap(key)} selectedStatus={CurrenTap}/>
   <span>
    إجراء
   </span>
   <div  className='flex gap-5 m-5'>
      
    {
      isAdmin || CanEdit ?    <Link to={`/Edit-Customer/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
      : null
    }
         <Link to="/cutomers"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
                     عوده
                     </Link>
{
  isAdmin || CanDelte ? 
  <button type='button' onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>حذف</button>
  : null
}

   </div>
    {
      CurrenTap === "info" &&   <div className='w-full h-full grid grid-cols-1 gap-4 xl:grid-cols-2 shadow-md p-5'>
      {/* Map through customer details */}
      {customerDetails.map((item, index) => (
        <div key={index} className="mb-4 flex flex-col gap-2">
          <span className="text-lg font-medium text-gray-700 dark:text-white">{item.label}</span>
          <p className="dark:border-form-strokedark dark:bg-form-input text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm">
            {item.value}
          </p>
        </div>
      ))}


   
    </div>
    }
    
    {
      CurrenTap === "contacts" &&     <CallCenterfloow id={id}  SectionFollow={SectionFollowupdate} seSectionFlowwupdate={seSectionFlowwupdate}/>
    }
    {
      CurrenTap === "Reports" && <CustomerReports  id={id} />
    }
    {
      CurrenTap === "require" && <ClientOrders  clientRequirements={customer?.clientRequirements || []}/>
    }
      <PopupCheckdelete value={true} navigatepage='/cutomers' deleteKey="customers/customer-archive" titale="العميل" id={id} />


    </div>
  );
};

export default GetCustomerByid;
