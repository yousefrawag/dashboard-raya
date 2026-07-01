import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import useQueryadditeam from '../../../services/Queryadditeam';
import toast from 'react-hot-toast';
import Loader from '../../../components/common/Loader/index';
import useQuerygetiteams from '../../../services/Querygetiteams';
import EmployeeCustomerContactnotes from './EmployeeCustomerContactnotes';
import { useSelector } from 'react-redux';
import StatusFilterTabs from '../../../components/common/StatusFilterTabs';
import ClientRequireSection from './ClientRequireSection';

const AddCustomer = () => {
  const user = useSelector((state) => state.userState.userinfo);
  const { isError, isLoading, addIteam } = useQueryadditeam(
    'customers',
    'customers',
  );
  const { data } = useQuerygetiteams(
    'projects',
    'projects',
  );
  const { data: currencyData } = useQuerygetiteams('currency', 'currency');
  const { data: clientWorkdata } = useQuerygetiteams(
    'client-work',
    'client-work',
  );
  const { data: customerTypes } = useQuerygetiteams(
    'clientStauts',
    'clientStauts',
  );
  const { data: customerRequirements } = useQuerygetiteams(
    'requirements',
    'requirements',
  );
  const { data: customerCeckstauts } = useQuerygetiteams(
    'clientcheckStauts',
    'clientcheckStauts',
  );
  const { data: customerDealStautsData } = useQuerygetiteams(
    'callcenterCustomerstauts',
    'callcenterCustomerstauts',
  );
        const { data:ReportTypes, } = useQuerygetiteams('ReportType', 'ReportType');

  const { data: locations } = useQuerygetiteams('location', 'location');
   const { data:FirsPaymentData } = useQuerygetiteams("firstpayment", "firstpayment");
  const statusConfig = {
    info: {
      label: 'بيانات العميل',
      className: 'text-yellow-600 hover:text-yellow-700',
      icon: 'clock',
    },
    contacts: {
      label: 'قسم الإتصالات',
      className: 'text-green-600 hover:text-green-700',
      icon: 'check-circle',
    },
    require: {
      label: 'قسم طلبات العميل',
      className: 'text-green-600 hover:text-red-700',
      icon: 'check-circle',
    },
  };
  const [CurrenTap, setCurrentTap] = useState('info');
  const [relatedRegions, setRelatedRegions] = useState([]);
  const [formsData, setFormsData] = useState({
    addBy:  user?.fullName,
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
    clientRequire: [],
    CustomerDealsatuts: '',
    source: '',
    notes: '',
    Paymentpermonth: '',
    userfollow: '',
    governote: '',
    InstallmentType: '',
    clientwork: '',
    clientRequireLocation: '',
    clientworkDesc: '',
    clientendRequr: '',
    relatedStauts: '',
    CustomerDealsatutsDescrep: '',
    contactNotes:"",
    ReportTypeDescriep:"",
     ReportType:"" 
  });
  const [clientRequirements, setClientRequiremnts] = useState([]);
  const [relatedJop, setRelatedJop] = useState([]);
  const [ContactDate, setContactDate] = useState('');
  const [details, setDeatils] = useState('');
  const [relatedStatuts, SetRelatedStauts] = useState([]);
  const [retlatedCustomerDealStauts, setRelatedCustomerDealstauts] = useState(
    []
  );
  const [properties , setProperties] = useState([])
  const [retlatedReportType, setRelatedReportType] = useState([])
  const navigate = useNavigate();
  const handelInputschage = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormsData((prev) => ({ ...prev, [name]: value }));
    if (name === 'region') {
      const selectedRegion = locations?.data?.data?.find(
        (item) => item.name === value,
      );
      if (selectedRegion) {
        setRelatedRegions(selectedRegion.relatedRegions || []);
      } else {
        setRelatedRegions([]);
      }
    }
if (name === 'project') {
  const selectedProject = data?.data?.allproject?.find(
    (item) => item.projectName === value
  );

  console.log("SELECTED PROJECT", selectedProject);
  console.log("PROPERTIES", selectedProject?.properties);

  setProperties(selectedProject?.properties || []);
}

    if (name === 'clientwork') {
      const selectedRegion = clientWorkdata?.data?.data?.find(
        (item) => item.name === value,
      );
      if (selectedRegion) {
        setRelatedJop(selectedRegion.relatedRegions || []);
      } else {
        setRelatedJop([]);
      }
    }

    if (name === 'clientStatus') {
      const selectedRegion = customerTypes?.data?.data?.find(
        (item) => item.name === value,
      );
      if (selectedRegion) {
        SetRelatedStauts(selectedRegion.relatedRegions || []);
      } else {
        SetRelatedStauts([]);
      }
    }
    if (name === 'CustomerDealsatuts') {
      const selectedRegion = customerDealStautsData?.data?.data?.find(
        (item) => item.name === value,
      );
      if (selectedRegion) {
        setRelatedCustomerDealstauts(selectedRegion.relatedRegions || []);
      } else {
        setRelatedCustomerDealstauts([]);
      }
    }
               if (name === "ReportType") {
              console.log("report-name" , name)
    const selectedRegion = ReportTypes?.data?.data?.find((item) => item.name === value);
    if (selectedRegion) {
      setRelatedReportType(selectedRegion.relatedRegions || []);
    } else {
      setRelatedReportType([]);
    }
    
  }
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    try {
      if (ContactDate || details) {
        const data = {
          ...formsData,
          clientRequirements,
          SectionFollow: {
             details: details,
            detailsDate: ContactDate,
            CustomerDealsatuts: formsData.CustomerDealsatuts,
            ReportType:formsData.ReportType ,
            nextReminderDate:formsData.nextReminderDate ,
            CustomerDealsatutsDescrep:formsData.CustomerDealsatutsDescrep,
              contactNotes:formsData.contactNotes ,
                ReportTypeDescriep:formsData.ReportTypeDescriep,
                     meeting:formsData.customerDate
          },
        };

        if (!formsData.fullName) {
          return toast.error('إسم العميل مطلوب');
        }
        if (!formsData.phoneNumber) {
          return toast.error('رقم الجوال مطلوب');
        }

        return addIteam(data, {
          onSuccess: () => {
            toast.success('تم اضافه عميل بنجاح');
            navigate('/cutomers');
          },
          onError: (error) => {
            if (error.response && error.response.status === 404) {
              return toast.error('تم إضافه هذا العميل من قبل ');
            }
            toast.error(
              'يوجد خطأ في اضافة عميل - يرجي مراجعه البيانات مري اخري',
            );
          },
        });
      } else {
        const data = {
          ...formsData,
          clientRequirements,
        };
        if (!formsData.fullName) {
          return toast.error('إسم العميل مطلوب');
        }
        if (!formsData.phoneNumber) {
          return toast.error('رقم الجوال مطلوب');
        }

        return addIteam(data, {
          onSuccess: () => {
            toast.success('تم اضافه عميل بنجاح');
            navigate('/cutomers');
          },
          onError: (error) => {
            if (error.response && error.response.status === 404) {
              return toast.error('تم إضافه هذا العميل من قبل ');
            }
            toast.error(
              'يوجد خطأ في اضافة عميل - يرجي مراجعه البيانات مري اخري',
            );
          },
        });
      }
    } catch (error) {}
  };
  if (isLoading) {
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
                name="addBy"
                onChange={handelInputschage}
                value={formsData.addBy}
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
                name="fullName"
                required
                onChange={handelInputschage}
                value={formsData.fullName}
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
                value={formsData.phoneNumber}
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
                value={formsData.secondaryPhoneNumber}
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
                {clientWorkdata?.data?.data?.map((item) => {
                  return <option value={item?.name}>{item?.name}</option>;
                })}
              </select>
            </div>

            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="clientworkDesc"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                وصف وظيفة العميل *
              </label>
              <select
                name="clientworkDesc"
                id="clientworkDesc"
                onChange={handelInputschage}
                value={formsData.clientworkDesc}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">اختر وصف وظيفة العميل</option>
                {relatedJop?.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
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
                <option value="منصات التواصل الاجتماعي">
                  منصات التواصل الاجتماعي (Instagram / Facebook / TikTok)
                </option>
                <option value="بحث في جوجل">بحث في جوجل (SEO)</option>
                <option value="زيارة مباشرة للموقع">زيارة مباشرة للموقع</option>
                <option value="حملة بريد إلكتروني">حملة بريد إلكتروني</option>
                <option value="فعالية أو معرض">فعالية أو معرض</option>
                <option value="اتصال مباشر">اتصال مباشر (Cold Calling)</option>
                <option value="عميل حالي قام بالإحالة">
                  عميل حالي قام بالإحالة
                </option>
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
                id="clientStatus"
                onChange={handelInputschage}
                value={formsData.clientStatus}
                required
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
                وصف حالة العميل *
              </label>
              <select
                name="relatedStauts"
                id="relatedStauts"
                onChange={handelInputschage}
                value={formsData.relatedStauts}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">اختر وصف حالة العميل</option>
                {relatedStatuts?.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
              </select>
            </div>

            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="region"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                المنطقة*
              </label>
              <select
                name="region"
                id="region"
                required
                value={formsData.region}
                onChange={handelInputschage}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                {locations?.data?.data?.map((item) => {
                  return (
                    <option key={item?._id} value={item?.name}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <label
                htmlFor="governote"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                الموقع*
              </label>
              <select
                name="governote"
                id="governote"
                required
                value={formsData.governote}
                onChange={handelInputschage}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                {relatedRegions?.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 flex flex-col  gap-2">
              <label
                htmlFor="project"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                المشروع المهتم بة*
              </label>
              <select
                name="project"
                required
                onChange={handelInputschage}
                value={formsData.project}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                {data?.data?.data?.map((item) => {
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
                onChange={handelInputschage}
                name="currency"
                value={formsData.currency}
                id="currency"
                required
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
                htmlFor="cashOption"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                ألية الدفع*
              </label>
              <select
                onChange={handelInputschage}
                name="cashOption"
                required
                value={formsData.cashOption}
                id="cashOption"
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option>قم بالإختيار</option>
                <option value="كاش"> كاش</option>
                <option value="تقسيط"> تقسيط</option>
                <option value="معاملة بنكية"> معاملة بنكية</option>
              </select>
            </div>

            {formsData.cashOption === 'تقسيط' ||
            formsData.cashOption === 'معاملة بنكية' ? (
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
              // <div className="mb-6 flex flex-col gap-2">
              //   <label
              //     htmlFor="firstPayment"
              //     className="w-full text-lg font-medium text-black dark:text-white"
              //   >
              //     الدفعه الأولى *
              //   </label>
              //   <select
              //     name="firstPayment"
              //     id="firstPayment"
              //     onChange={handelInputschage}
              //     value={formsData.firstPayment}
              //     className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              //   >
              //     <option value="">اختر الدفعة</option>
              //     <option value="100000">100,000</option>
              //     <option value="150000">150,000</option>
              //     <option value="200000">200,000</option>
              //     <option value="250000">250,000</option>
              //     <option value="300000">300,000</option>
              //     <option value="350000">350,000</option>
              //     <option value="400000">400,000</option>
              //     <option value="450000">450,000</option>
              //     <option value="500000">500,000</option>
              //     <option value="550000">550,000</option>
              //     <option value="600000">600,000</option>
              //     <option value="650000">650,000</option>
              //     <option value="700000">700,000</option>
              //     <option value="750000">750,000</option>
              //     <option value="800000">800,000</option>
              //     <option value="850000">850,000</option>
              //     <option value="900000">900,000</option>
              //     <option value="950000">950,000</option>
              //     <option value="1000000">1,000,000</option>
              //     <option value="1050000">1,050,000</option>
              //     <option value="1100000">1,100,000</option>
              //     <option value="1150000">1,150,000</option>
              //     <option value="1200000">1,200,000</option>
              //     <option value="1250000">1,250,000</option>
              //     <option value="1300000">1,300,000</option>
              //     <option value="1350000">1,350,000</option>
              //     <option value="1400000">1,400,000</option>
              //     <option value="1450000">1,450,000</option>
              //     <option value="1500000">1,500,000</option>
              //   </select>
              // </div>
            ) : null}

            {formsData.cashOption === 'تقسيط' ? (
              <div className="mb-6 flex flex-col  gap-2">
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
            ) : null}

            {formsData.cashOption === 'تقسيط' ? (
              <>
                <div className="mb-6 flex flex-col  gap-2">
                  <label
                    htmlFor="InstallmentType"
                    className="w-full text-lg font-medium text-black dark:text-white"
                  >
                    نوع التقسيط
                  </label>
                  <select
                    required
                    name="InstallmentType"
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
                <div className="mb-6 flex flex-col  gap-2">
                  <label
                    htmlFor="installmentsPyYear"
                    className="w-full text-lg font-medium text-black dark:text-white"
                  >
                    تقسيط على كام * {formsData.InstallmentType}
                  </label>
                  <input
                    type="number"
                    onChange={handelInputschage}
                    id="installmentsPyYear"
                    value={formsData.installmentsPyYear}
                    name="installmentsPyYear"
                    required
                    className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
                  />
                </div>
              </>
            ) : null}

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
                value={formsData.clientendRequr}
                className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              ></textarea>
            </div> */}

            <div className="mb-6 flex flex-col  gap-2 mt-5">
              <label
                htmlFor="notes"
                className="w-full text-lg font-medium text-black dark:text-white"
              >
                ملاحظات
              </label>
              <textarea
                name="notes"
                onChange={handelInputschage}
                value={formsData.notes}
                className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        )}

        {CurrenTap === 'contacts' && (
          <EmployeeCustomerContactnotes
          retlatedReportType={retlatedReportType}
            retlatedCustomerDealStauts={retlatedCustomerDealStauts}
            data={customerDealStautsData}
            formsData={formsData}
            CustomerDealsatuts={formsData.CustomerDealsatuts}
            handelInputschage={handelInputschage}
            details={details}
            setDeatils={setDeatils}
            ContactDate={ContactDate}
            setContactDate={setContactDate}
          />
        )}
        {CurrenTap === 'require' && (
          <ClientRequireSection
            formsData={formsData}
            clientRequirements={clientRequirements}
            setClientRequiremnts={setClientRequiremnts}
          />
        )}
        <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
          <div className="add_btn">
            <button
              type="submit"
              className={` py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600`}
            >
              إضافة
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
    </div>
  );
};

export default AddCustomer;
