import React, { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useQueryupdate from '../../../services/useQueryupdate';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import Loader from '../../../components/common/Loader';
import CallCenterfloow from './CallCenterfloow';
import useQuerygetiteams from '../../../services/Querygetiteams';
import EmployeeCustomerContactnotes from './EmployeeCustomerContactnotes';
import StatusFilterTabs from '../../../components/common/StatusFilterTabs';
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import PopupCheckdelete from '../../../components/common/popupmdules/PopupCheckdelete';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import ClientRequireSection from './ClientRequireSection';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
const UpdateCutomer = () => {
  const { id } = useParams();
  const { isLoading: getLoadding, data } = useQuerygetSpacficIteam(
    'customers',
    'customers',
    id,
  );
  const { isError, isLoading, updateiteam } = useQueryupdate(
    'customers',
    'customers',
  );
  const { data: projects } = useQuerygetiteams(
    'projects',
    'projects',
  );
   const {data:clientWorkdata } = useQuerygetiteams("client-work" , "client-work")
  const { deleteIteam } = useQueryDelete('customers', 'customers');
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } =
    useGetUserAuthentications('Clients');
  const { data: currencyData } = useQuerygetiteams('currency', 'currency');
  const { data: customerTypes } = useQuerygetiteams(
    'clientStauts',
    'clientStauts',
  );
  const { data: customerCeckstauts } = useQuerygetiteams(
    'clientcheckStauts',
    'clientcheckStauts',
  );
        const { data:ReportTypes, } = useQuerygetiteams('ReportType', 'ReportType');
  
    const {data : customerDealStautsData} = useQuerygetiteams("callcenterCustomerstauts" , "callcenterCustomerstauts")
   const { data:FirsPaymentData } = useQuerygetiteams("firstpayment", "firstpayment");
    const {data:customerRequirements } = useQuerygetiteams("requirements" , "requirements")
  const { data: locations } = useQuerygetiteams('location', 'location');
  const { setModuleDelete } = useDashboardContext();
  const [ClientStauts, setClientSatuts] = useState('');
  const [details, setDeatils] = useState('');
  const [ContactDate, setContactDate] = useState('');
const [relatedRegions, setRelatedRegions] = useState([]);
  const customer = data?.data;
  const [SectionFollowupdate , seSectionFlowwupdate] = useState([])
const [relatedJop , setRelatedJop] = useState([])
const [relatedStatuts2 , SetRelatedStauts] = useState([])
const [retlatedReportType, setRelatedReportType] = useState([])

  const navigate = useNavigate();
  const [properties , setProperties] = useState([])
  const [formsData, setFormsData] = useState({
    addBy: '',
    fullName: '',
     property:"",
    phoneNumber: '',
    secondaryPhoneNumber: '',
    clientStatus: '',
    region: '',
    project: '',
    currency: '',
    cashOption: '',
    firstPayment: '',
    installmentsPyYear: '',
    endContactDate: '',
    customerDate: '',
 
    isViwed: '',
    clientRequire: '',
    CustomerDealsatuts: '',
    source:"" ,
    notes: '',
    Paymentpermonth:"" ,
    userfollow:"" ,
    InstallmentType:"" ,
    clientwork:"" ,
    ReportType:"" ,
    nextReminderDate:"" ,
    clientRequireLocation:"" ,
      clientworkDesc:"" ,
      clientendRequr:"" ,
      relatedStauts:"" ,
      CustomerDealsatutsDescrep:"" ,
      ReportTypeDescriep:""

  });
const [clientRequirements , setClientRequiremnts] = useState([

])
const [retlatedCustomerDealStauts , setRelatedCustomerDealstauts] = useState([])

  const statusConfig = {
    info: {
      label: 'بيانات العميل',
      className: 'text-yellow-600 hover:text-yellow-700',
      icon: 'clock',
    },
    contacts: {
      label: 'إضافة إتصال',
      className: 'text-green-600 hover:text-green-700',
      icon: 'check-circle',
    },
    oldcontact: {
      label: 'جميع الإتصالات',
      className: 'text-main hover:text-green-700',
      icon: 'check-circle',
    },
        require: {
        label: "قسم طلبات العميل" ,
        className: "text-green-600 hover:text-red-700",
        icon: "check-circle"
      },
  };

  const [CurrenTap, setCurrentTap] = useState('info');
  const handelInputschage = (e) => {
    const name = e.target.name;
    const value = e.target.value;
   
    setFormsData((prev) => ({ ...prev, [name]: value }));

  if (name === 'project') {
      const selectedRegion = projects?.data?.allproject?.find(
        (item) => item.projectName === value,
      );
      if (selectedRegion) {
        console.log("prperties" , selectedRegion);
        
        setProperties(selectedRegion.properties || []);
      } else {
        setProperties([]);
      }
    }

        if (name === "region" ) {
    const selectedRegion = locations?.data?.data?.find((item) => item.name === value);
    if (selectedRegion) {
      setRelatedRegions(selectedRegion.relatedRegions || []);
    } else {
      setRelatedRegions([]);
    }
  }

        if (name === "clientwork"  ) {
    const selectedRegion = clientWorkdata?.data?.data?.find((item) => item.name === value);
    if (selectedRegion) {
      setRelatedJop(selectedRegion.relatedRegions || []);
    } else {
      setRelatedJop([]);
    }

    
  }
            if (name === "clientStatus") {
    const selectedRegion = customerTypes?.data?.data?.find((item) => item.name === value);
     console.log("selectedRegion" , selectedRegion)
    if (selectedRegion) {
      SetRelatedStauts(selectedRegion.relatedRegions || []);
    } else {
      SetRelatedStauts([]);
    }
    
  }
         if (name === "CustomerDealsatuts") {
    const selectedRegion = customerDealStautsData?.data?.data?.find((item) => item.name === value);
    if (selectedRegion) {
      setRelatedCustomerDealstauts(selectedRegion.relatedRegions || []);
    } else {
      setRelatedCustomerDealstauts([]);
    }
    
  }
            if (name === "ReportType") {
    const selectedRegion = ReportTypes?.data?.data?.find((item) => item.name === value);
    if (selectedRegion) {
      setRelatedReportType(selectedRegion.relatedRegions || []);
    } else {
      setRelatedReportType([]);
    }
    
  }}
  

  const handelSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      if (ContactDate || details) {
        const data = {
          ...formsData,
          
          clientRequirements ,
          SectionFollow: {
            details: details,
            detailsDate: ContactDate,
            CustomerDealsatuts: formsData.CustomerDealsatuts,
            ReportType:formsData.ReportType ,
            nextReminderDate:formsData.nextReminderDate ,
            CustomerDealsatutsDescrep:formsData.CustomerDealsatutsDescrep,
              contactNotes:formsData.contactNotes,
              ReportTypeDescriep:formsData.ReportTypeDescriep ,
              meeting:formData.customerDate
          },
        };

        if (!formsData.fullName) {
          return toast.error('إسم العميل مطلوب');
        }
        if (!formsData.phoneNumber) {
          return toast.error('رقم الجوال مطلوب');
        }

        if (formData.cashOption === "تقسيط" && !formsData.firstPayment) {
          return toast.error('الدفعه الإولى مطلوبة');
        }
      
        updateiteam(
          { data, id },
          {
            onSuccess: () => {
              e.target.reset();
              setFormsData({
                 addBy: '',
    fullName: '',
    phoneNumber: '',
    property:"",
    secondaryPhoneNumber: '',
    clientStatus: '',
    region: '',
    project: '',
    currency: '',
    cashOption: '',
    firstPayment: '',
    installmentsPyYear: '',
    endContactDate: '',
    customerDate: '',
 
    isViwed: '',
    clientRequire: '',
    CustomerDealsatuts: '',
    source:"" ,
    notes: '',
    Paymentpermonth:"" ,
    userfollow:"" ,
    InstallmentType:"" ,
    clientwork:"" ,
    ReportType:"" ,
    nextReminderDate:"" ,
    clientRequireLocation:"" ,
      clientworkDesc:"" ,
      clientendRequr:""
              })
              setDeatils("")
               setContactDate("")
              toast.success('تم تعديل عميل بنجاح');
             
            },
            onError: (error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.mesg
              ) {
                toast.error(error.response.data.mesg);
              } else {
                toast.error('An error occurred. Please try again.');
              }
            },
          },
        );
      } else {
        const data = {
          ...formsData,
          clientRequirements
        };

        if (!formsData.fullName) {
          return toast.error('إسم العميل مطلوب');
        }
        if (!formsData.phoneNumber) {
          return toast.error('رقم الجوال مطلوب');
        }

        if (!formsData.firstPayment) {
          return toast.error('الدفعه الإولى مطلوبة');
        }
        updateiteam(
          { data, id },
          {
            onSuccess: () => {
              e.target.reset();
                        setFormsData({
                 addBy: '',
    fullName: '',
    phoneNumber: '',
    secondaryPhoneNumber: '',
    clientStatus: '',
    region: '',
    project: '',
    currency: '',
    cashOption: '',
    firstPayment: '',
    installmentsPyYear: '',
    endContactDate: '',
    customerDate: '',
 property:"",
    isViwed: '',
    clientRequire: '',
    CustomerDealsatuts: '',
    source:"" ,
    notes: '',
    Paymentpermonth:"" ,
    userfollow:"" ,
    InstallmentType:"" ,
    clientwork:"" ,
    ReportType:"" ,
    nextReminderDate:"" ,
    clientRequireLocation:"" ,
      clientworkDesc:"" ,
      clientendRequr:""
              })
               setDeatils("")
               setContactDate("")
              toast.success('تم تعديل عميل بنجاح');
             
            },
            onError: (error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.mesg
              ) {
                toast.error(error.response.data.mesg);
              } else {
                toast.error('An error occurred. Please try again.');
              }
            },
          },
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.mesg);
    }
  };
useEffect(() => {
  if (!customer) return;

  setFormsData((prev) => ({
    ...prev,
    addBy: customer.addBy,
    property:customer?.property ,
    fullName: customer.fullName,
    phoneNumber: customer.phoneNumber,
    secondaryPhoneNumber: customer.secondaryPhoneNumber,
    firstPayment: customer.firstPayment,
    installmentsPyYear: customer.installmentsPyYear,
    clientRequire: customer.clientRequire,
    clientStatus: customer.clientStatus,
    endContactDate: customer.endContactDate,
    clientendRequr: customer.clientendRequr,
    project: customer.project,
    notes: customer.notes,
    region: customer.region,
    currency: customer.currency,
    cashOption: customer.cashOption,
    source: customer.source,
    isViwed: customer.isViwed,
    Paymentpermonth: customer.Paymentpermonth,
    userfollow: customer.userfollow,
    governote: customer.governote,
    InstallmentType: customer.InstallmentType,
    clientwork: customer.clientwork,
    clientRequireLocation: customer.clientRequireLocation,
    clientworkDesc: customer.clientworkDesc ,
    relatedStauts: customer?.relatedStauts ,
  }));

  setClientRequiremnts(customer.clientRequirements || []);
  seSectionFlowwupdate(customer.SectionFollow || []);

}, [customer]);

console.log("customer" , customer);


/* 2) لما locations تتحمّل → هات الـ related regions */
useEffect(() => {
  if (!customer || !locations?.data?.data) return;

  const regionItem = locations.data.data.find(
    (item) => item.name === customer.region
  );

  setRelatedRegions(regionItem?.relatedRegions || []);

}, [customer, locations]);

useEffect(() => {
  if (!customer || !customerTypes?.data?.data) return;

  const regionItem = customerTypes.data.data.find(
    (item) => item.name === customer.clientStatus
  );

  SetRelatedStauts(regionItem?.relatedRegions || []);

}, [customer, customerTypes]);

/* 3) لما clientWorkdata يتحمّل → هات الـ related jobs */
useEffect(() => {
  if (!customer || !clientWorkdata?.data?.data) return;

  const jobItem = clientWorkdata.data.data.find(
    (item) => item.name === customer.clientwork
  );

  setRelatedJop(jobItem?.relatedRegions || []);

}, [customer, clientWorkdata]);




  if (isLoading || getLoadding) {
    return <Loader />;
  }
  return (
    <div className="w-full h-full">
      <form
        onSubmit={handelSubmit}
        className="w-full h-full bg-white rounded-[10px] dark:bg-form-input"
      >
        {/* <div className="dark:bg-form-input flex items-center shadow-lg gap-4 mb-4 w-full h-full p-4 bg-white rounded-[10px]">
          <div className="icon p-2 bg-main rounded-full">
            <FaRegPenToSquare />
          </div>
          <p className="font-semibold text-lg">ادخل بيانات العميل</p>
        </div> */}

        <StatusFilterTabs
          statusConfig={statusConfig}
          onStatusChange={(key) => setCurrentTap(key)}
          selectedStatus={CurrenTap}
        />

        <span>إجراء</span>
        <div className="flex gap-5 m-5 ">
                <button
              type="submit"
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              حفظ
            </button>
          {isAdmin || CanEdit ? (
            <Link
              to={`/Edit-Customer/${id}`}
              className="w-20 p-2 bg-main text-white rounded-md text-center"
            >
              تعديل
            </Link>
          ) : null}
          <Link
            to="/cutomers"
            className="w-20 p-2 text-center bg-main text-white rounded-md"
          >
            عوده
          </Link>
          {isAdmin || CanDelte ? (
            <button
              type="button"
              onClick={() => setModuleDelete(true)}
              className="w-20 p-2 bg-main text-white rounded-md"
            >
              حذف
            </button>
          ) : null}
        </div>
        {CurrenTap === 'info' && (
          <div className="main-section w-full max-h-[400px] min-h-[100px] p-4 overflow-auto	">
            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="addBy"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                اسم المسوق /ة*
              </label>
              <input
                type="text"
                id="addBy"
                onChange={handelInputschage}
                value={formsData?.addBy}
                name="addBy"
                required
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>
               <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="userfollow"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
      اسم المتابع /ة*
    </label>
    <input
      type="text"
      id="userfollow"
      name="userfollow"
      onChange={handelInputschage}
      value={formsData.userfollow}
      required
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    />
  </div>
            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="fullName"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                اسم المشترى*
              </label>
              <input
                type="text"
                id="fullName"
                onChange={handelInputschage}
                defaultValue={formsData?.fullName}
                name="fullName"
                required
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>

            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="phoneNumber"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                جوال (1)*
              </label>
              <input
                type="text"
                id="phoneNumber"
                onChange={handelInputschage}
                name="phoneNumber"
                required
                defaultValue={formsData?.phoneNumber}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>
            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="secondaryPhoneNumber"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                جوال (اختياري)
              </label>
              <input
                type="text"
                id="secondaryPhoneNumber"
                name="secondaryPhoneNumber"
                onChange={handelInputschage}
                defaultValue={formsData?.secondaryPhoneNumber}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>
            
   <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="clientwork"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
      وظيفة العميل *

    </label>
      <select
      name="clientwork"
      id="clientwork"
      onChange={handelInputschage}
      value={formsData.clientwork}
      
    
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
  <option value="">اختر وظيفة العميل</option>
{
  clientWorkdata?.data?.data?.map((item) => {
    return <option value={item?.name}>{item?.name}</option>
  })
}
 
    </select>
  </div>

      <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="clientworkDesc"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
    وصف  وظيفة العميل  *

    </label>
    <select
      name="clientworkDesc"
      id="clientworkDesc"
      onChange={handelInputschage}
      value={formsData.clientworkDesc}
      
    
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
  <option value="">اختر وصف وظيفة العميل</option>
{
  relatedJop?.map((item) => {
    return <option value={item}>{item}</option>
  })
}
 
    </select>
  </div>

              <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="source"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
      مصدر العميل *

    </label>
    <select
      name="source"
      id="source"
      onChange={handelInputschage}
      value={formsData.source}
      required
    
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
  <option value="">اختر مصدر العميل</option>
  <option value="حملة إعلانية ممولة">حملة إعلانية ممولة</option>
  <option value="علاقات شخصية">علاقات شخصية</option>
  <option value="منصات التواصل الاجتماعي">منصات التواصل الاجتماعي (Instagram / Facebook / TikTok)</option>
  <option value="بحث في جوجل">بحث في جوجل (SEO)</option>
  <option value="زيارة مباشرة للموقع">زيارة مباشرة للموقع</option>
  <option value="حملة بريد إلكتروني">حملة بريد إلكتروني</option>
  <option value="فعالية أو معرض">فعالية أو معرض</option>
  <option value="اتصال مباشر">اتصال مباشر (Cold Calling)</option>
  <option value="عميل حالي قام بالإحالة">عميل حالي قام بالإحالة</option>
  <option value="حملة واتساب">حملة واتساب</option>
  <option value="أخرى">أخرى</option>
 
    </select>
  </div>
            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="clientStatus"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                حاله العميل *
              </label>
              <select
                name="clientStatus"
                onChange={handelInputschage}
                id="clientStatus"
                required
                value={formsData.clientStatus}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                {customerTypes?.data?.data?.map((item) => {
                  return (
                    <option key={item?._id} value={item?.name}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>
               <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="relatedStauts"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
    وصف  حالة العميل  *

    </label>
    <select
      name="relatedStauts"
      id="relatedStauts"
      onChange={handelInputschage}
      value={formsData.relatedStauts}
      
    
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
  <option value="">اختر وصف حالة العميل</option>
{
  relatedStatuts2?.map((item) => {
    return <option value={item}>{item}</option>
  })
}
 
    </select>
  </div>
            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="region"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                موقع المشروع*
              </label>
              <select
                name="region"
                onChange={handelInputschage}
                id="region"
                value={formsData.region || ""}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                {locations?.data?.data?.map((item) => {
                  return (
                    <option key={item?._id} value={item?.name?.trim()}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>

  <div className="mb-6 flex flex-col gap-2">
  <label htmlFor="governote" className="w-full text-lg font-medium text-black dark:text-white">
    المنطقة*
  </label>
  <select
    name="governote"
    id="governote"
    required
    value={formsData.governote || ""}
    onChange={handelInputschage}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option>قم بالإختيار</option>
    {relatedRegions?.map((region, index) => (
      <option key={index} value={region?.trim()}>
        {region}
      </option>
    ))}
  </select>
</div>

            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="region"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                المشروع المهتم بة*
              </label>
              <select
                name="project"
                required
                onChange={handelInputschage}
                value={formsData.project || ""}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                {projects?.data?.data?.map((item) => {
                  return (
                  <option
  key={item._id}
  value={item.projectName}
>
  {item.projectName} —{" "}

  <span
    className={
      item.properties?.length > 0
        ? "text-green-600 font-bold"
        : "text-red-500 font-bold"
    }
  >
    {item.properties?.length > 0
      ? `متوفر شقق (${item.properties.length})`
      : "غير متوفر"}
  </span>
</option>
                  );
                })}
              </select>
            </div>

 {/* <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="property"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
               اختر الشقة المهتم بها العميل
              </label>
              <select
                name="property"
                id="property"
                onChange={handelInputschage}
                value={formsData.property}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">اختر وصف الشقة المهتم بها العميل</option>
                {properties?.map((item) => {
                  return <option value={item?.unitName}>{item?.unitName}</option>;
                })}
              </select>
            </div> */}

            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="currency"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                نوع العملة*
              </label>
              <select
                name="currency"
                onChange={handelInputschage}
                id="currency"
                required
                value={formsData.currency}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                {currencyData?.data?.data?.map((item) => {
                  return (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="region"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                 ألية الدفع*
              </label>
              <select
                name="cashOption"
                required
                onChange={handelInputschage}
                id="cashOption"
               
                value={formsData.cashOption}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                <option value="كاش"> كاش</option>
                <option value="تقسيط"> تقسيط</option>
                 <option value="معاملة بنكية"> معاملة بنكية</option>
              </select>
            </div>


{/* {
  formsData.cashOption === "تقسيط" || formsData.cashOption === "معاملة بنكية" ?
   <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="firstPayment"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
              "قديم"  الدفعه الأولى *
              </label>
              <input
                type="text"
                id="firstPayment"
                onChange={handelInputschage}
                name="firstPayment"
                value={formsData.firstPayment}
               
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div> : null
} */}
           

    

  {
      formsData.cashOption === "تقسيط" || formsData.cashOption === "معاملة بنكية" ? 
              <div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="installmentsFirstPyment"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    الدفعة الأولى*
  </label>
  <select
    id="firstPayment"
    name="firstPayment"
     onChange={handelInputschage}
                  value={formsData.firstPayment}
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر الدفعة الأولى</option>
 {
  FirsPaymentData?.data?.data?.map((item) => {
    return <option value={item?.name} key={item?._id}>{item?.name.toLocaleString('en-US')}</option>
  })
 }
  </select>
</div>

      : null
  }
{
   formsData.cashOption === "تقسيط"  &&               <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="firstPayment"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
     الدفعه الشهرية 

    </label>
    <input
      type="number"
      onChange={handelInputschage}
      id="Paymentpermonth"
      value={formsData.Paymentpermonth}
      name="Paymentpermonth"
 
   
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    />
  </div>
}

{
   formsData.cashOption === "تقسيط"  &&       <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="InstallmentType"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
نوع التقسيط
</label>
    <select
     required name="InstallmentType"
     onChange={handelInputschage}
     value={formsData.InstallmentType}
      id="InstallmentType"
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
      <option value="">أختر</option>
<option value="سنوى">سنوى</option>
<option value="شهرى">شهرى</option>
    </select>
  </div>
}
 {
  formsData.cashOption === "تقسيط"  &&     <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="installmentsPyYear"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                تقسيط على كام  *  {formsData.InstallmentType}
              </label>
              <input
                type="number"
                value={formsData.installmentsPyYear}
                onChange={handelInputschage}
                id="installmentsPyYear"
                name="installmentsPyYear"
              
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>
 }

        
        
         

            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="isViwed"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                هل تمت المعاينة *
              </label>
              <select
                required
                name="isViwed"
                id="isViwed"
                onChange={handelInputschage}
                value={formsData.isViwed}
             
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">أختر</option>
                {customerCeckstauts?.data?.data.map((item) => {
                  return (
                    <option key={item?._id} value={item?.name}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* <div className="mb-6 flex flex-col  gap-2 mt-5">
              <label
                htmlFor="clientendRequr"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                أخر ماتم التواصل
              </label>
              <textarea
                name="clientendRequr"
                onChange={handelInputschage}
                defaultValue={formsData?.clientendRequr}
                className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              ></textarea>
            </div> */}
            {/* <div className="mb-6 flex flex-col  gap-2 mt-5">
              <label
                htmlFor="clientRequire"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                متطلبات العميل
                // قديم واجب تحديث متطلبات العميل من خانة اسفل 
              </label>
              <textarea
                name="clientRequire"
                onChange={handelInputschage}
               
                defaultValue={customer?.clientRequire}
                className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              ></textarea>
            </div> */}



            <div className="mb-6 flex flex-col  gap-2 mt-5">
              <label
                htmlFor="assetsName"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                ملاحظات
              </label>
              <textarea
                defaultValue={customer?.notes}
                onChange={handelInputschage}
                name="notes"
                className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        )}

        {CurrenTap === 'contacts' && (
          <div className='max-h-[400px] min-h-[100px] p-4 overflow-auto	'>
            <EmployeeCustomerContactnotes
            retlatedReportType={retlatedReportType}
            data={customerDealStautsData}
              retlatedCustomerDealStauts={retlatedCustomerDealStauts}
              details={details}
              formsData={formsData}
              setDeatils={setDeatils}
              handelInputschage={handelInputschage}
              CustomerDealsatuts={formsData.CustomerDealsatuts}
              ContactDate={ContactDate}
              setContactDate={setContactDate}
            />
          </div>
        )}
        {CurrenTap === 'oldcontact' && (
        <div className='max-h-[300px] min-h-[100px] p-4 overflow-auto'>
           <CallCenterfloow SectionFollow={SectionFollowupdate} id={id}  seSectionFlowwupdate={seSectionFlowwupdate} />
        </div> 
        )}
   {
    CurrenTap === "require" && 
      <div className='max-h-[300px] min-h-[100px] p-4 overflow-auto'>
    <ClientRequireSection formsData={formsData} clientRequirements={clientRequirements} setClientRequiremnts={setClientRequiremnts} />

      </div>

   }
        {/* <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
          <div className="add_btn">
            <button
              type="submit"
              className={` py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600`}
            >
              حفظ
            </button>
          </div>
          <div className="return_btn">
            <NavLink
              to="/cutomers"
              className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md"
            >
              عوده
            </NavLink>
          </div>
        </div> */}
      </form>
      <PopupCheckdelete
        navigatepage="/cutomers"
        deleteKey="customers"
        titale="العميل"
        id={id}
      />
      <span>إجراء</span>
      <div className="flex gap-5 m-5">
        {isAdmin || CanEdit ? (
          <Link
            to={`/Edit-Customer/${id}`}
            className="w-20 p-2 bg-main text-white rounded-md text-center"
          >
            تعديل
          </Link>
        ) : null}
        <Link
          to="/cutomers"
          className="w-20 p-2 text-center bg-main text-white rounded-md"
        >
          عوده
        </Link>
        {isAdmin || CanDelte ? (
          <button
            type="button"
            onClick={() => setModuleDelete(true)}
            className="w-20 p-2 bg-main text-white rounded-md"
          >
            حذف
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default UpdateCutomer;
