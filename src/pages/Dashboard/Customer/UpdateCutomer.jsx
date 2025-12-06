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
    'projects/selectproject',
    'projects/selectproject',
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
  const navigate = useNavigate();

  const [formsData, setFormsData] = useState({
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

  });
const [clientRequirements , setClientRequiremnts] = useState([

])
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
  };

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
          },
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
    clientworkDesc: customer.clientworkDesc
  }));

  setClientRequiremnts(customer.clientRequirements || []);
  seSectionFlowwupdate(customer.SectionFollow || []);

}, [customer]);



/* 2) لما locations تتحمّل → هات الـ related regions */
useEffect(() => {
  if (!customer || !locations?.data?.data) return;

  const regionItem = locations.data.data.find(
    (item) => item.name === customer.region
  );

  setRelatedRegions(regionItem?.relatedRegions || []);

}, [customer, locations]);



/* 3) لما clientWorkdata يتحمّل → هات الـ related jobs */
useEffect(() => {
  if (!customer || !clientWorkdata?.data?.data) return;

  const jobItem = clientWorkdata.data.data.find(
    (item) => item.name === customer.clientwork
  );

  setRelatedJop(jobItem?.relatedRegions || []);

}, [customer, clientWorkdata]);

console.log("customer" , customer);


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
                {projects?.data?.allproject?.map((item) => {
                  return (
                    <option key={item._id} value={item.projectName}>
                      {item.projectName}{' '}
                    </option>
                  );
                })}
              </select>
            </div>

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


{
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
}
           

        // تحديث

  {
      formsData.cashOption === "تقسيط" || formsData.cashOption === "معاملة بنكية" ? 
      <div className="mb-6 flex flex-col gap-2">
  <label
    htmlFor="firstPayment"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    الدفعه الأولى *"تحديث"
  </label>
  <select
    name="firstPayment"
    id="firstPayment"
    onChange={handelInputschage}
    value={formsData.firstPayment}
    required
    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
  >
    <option value="">اختر الدفعة</option>
      <option value="100000">100,000</option>
    <option value="150000">150,000</option>
    <option value="200000">200,000</option>
    <option value="250000">250,000</option>
    <option value="300000">300,000</option>
    <option value="350000">350,000</option>
    <option value="400000">400,000</option>
    <option value="450000">450,000</option>
    <option value="500000">500,000</option>
    <option value="550000">550,000</option>
    <option value="600000">600,000</option>
    <option value="650000">650,000</option>
    <option value="700000">700,000</option>
    <option value="750000">750,000</option>
    <option value="800000">800,000</option>
    <option value="850000">850,000</option>
    <option value="900000">900,000</option>
    <option value="950000">950,000</option>
    <option value="1000000">1,000,000</option>
    <option value="1050000">1,050,000</option>
    <option value="1100000">1,100,000</option>
    <option value="1150000">1,150,000</option>
    <option value="1200000">1,200,000</option>
    <option value="1250000">1,250,000</option>
    <option value="1300000">1,300,000</option>
    <option value="1350000">1,350,000</option>
    <option value="1400000">1,400,000</option>
    <option value="1450000">1,450,000</option>
    <option value="1500000">1,500,000</option>
  </select>
</div>  : null
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
            <div className="mb-6 flex flex-col  gap-2 mt-5">
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
            </div>
            <div className="mb-6 flex flex-col  gap-2 mt-5">
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
            </div>


{/* <div className="mb-6 grid  gap-2">
  <label
    htmlFor="clientRequire"
    className="w-full text-lg font-medium text-black dark:text-white"
  >
    متطلبات العميل*
  </label>

  <div className="grid gap-2">
    {customerRequirements?.data?.data.map((item) => (
      <label key={item?._id} className="flex items-center gap-2 text-main">
        <input
          type="checkbox"
          name="clientRequire"
          value={item?.name}
          checked={formsData.clientRequire?.includes(item?.name)}
          onChange={(e) => {
            const value = e.target.value;
            const checked = e.target.checked;
            let updated = [...(formsData.clientRequire || [])];

            if (checked) {
              updated.push(value);
            } else {
              updated = updated.filter((v) => v !== value);
            }

            handelInputschage({
              target: {
                name: 'clientRequire',
                value: updated,
              },
            });
          }}
          className="accent-primary"
        />
        {item?.name}
      </label>
    ))}
  </div>
</div> */}

{/* {
  formsData.clientRequire.length &&   <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="clientRequireLocation"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
أختر موقع الطلب*
</label>
    <select
     required name="clientRequireLocation"
     onChange={handelInputschage}
     value={formsData.clientRequireLocation}
      id="clientRequireLocation"
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
      <option value="">أختر</option>
<option value="القدس">
  القدس
</option>
<option value="اريحا">
  اريحا
</option>
<option value="رام الله">
  رام الله

</option>
<option value="بيت حنينا">
   بيت حنينا


</option>
<option value="صور باهر">
    صور باهر



</option>
<option value="شعفاط السهل">
     شعفاط السهل




</option>
<option value="تل الفول">
      تل الفول





</option>
<option value="شعفاط">
      شعفاط




</option>
<option value="بيت صفافا - الشرفات">
      بيت صفافا - الشرفات

</option>
<option value="ام طوبا">
   ام طوبا

</option>

<option value="بيت صفافا">
 بيت صفافا
</option>


<option value="حي الهجره">
حي الهجره

</option>

<option value="كفر عقب">
كفر عقب

</option>
<option value="وادي الحمص">
وادي الحمص

</option>
<option value="البوابه">
البوابه

</option>
<option value="سطح مرحبا">
سطح مرحبا


</option>
<option value="المصيون">
 المصيون



</option>
<option value="المصايف">
 المصايف



</option>
<option value="البيرة">
 البيرة



</option>
<option value="طلعه مشتل قلقيلية">
 طلعه مشتل قلقيلية




</option>
    </select>
  </div>
} */}

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
          <div>
            <EmployeeCustomerContactnotes
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
          <CallCenterfloow SectionFollow={SectionFollowupdate} id={id}  seSectionFlowwupdate={seSectionFlowwupdate} />
        )}
   {
    CurrenTap === "require" && <ClientRequireSection formsData={formsData} clientRequirements={clientRequirements} setClientRequiremnts={setClientRequiremnts} />

   }
        <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
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
        </div>
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
