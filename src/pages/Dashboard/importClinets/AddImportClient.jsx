import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AddImportExportOrdears from './AddImportExportOrdears';
import useQueryadditeam from '../../../services/Queryadditeam';
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader/index';
import StatusFilterTabs from '../../../components/common/StatusFilterTabs';
import FollowupImportClients from './FollowupImportClients';
const AddImportClient = () => {
  const user = useSelector((state) => state.userState.userinfo);

  const { isLoading, addIteam } = useQueryadditeam('importClients', 'importClients');

  const { data: clientWorkdata } = useQuerygetiteams('client-work', 'client-work');
  const { data: customerTypes } = useQuerygetiteams('clientStauts', 'clientStauts');

  const navigate = useNavigate();

  // ===== التاب النشط =====
  const [activeTab, setActiveTab] = useState('info');

  const statusConfig = {
    info: {
      label: 'بيانات العميل',
      className: 'text-yellow-600 hover:text-yellow-700',
      icon: 'clock',
    },
    followup: {
      label: 'المتابعات والاتصالات',
      className: 'text-yellow-600 hover:text-yellow-700',
      icon: 'clock',
    },
    //     ordears: {
    //   label: 'الطلبات',
    //   className: 'text-yellow-600 hover:text-yellow-700',
    //   icon: 'clock',
    // },
   
  };

  const getCurrentUserId = () =>
    user?.id ?? user?._id ?? user?.userId ?? user?.userID ?? '';

  const [formsData, setFormsData] = useState({
    addBy: getCurrentUserId(),

    // ===== بيانات العميل =====
    fullName: '',
    source: '',
    phoneNumber: '',
    secondaryPhoneNumber: '',
    email: '',
    customerType: '',
    interestType: '',
    priority: '',
    clientStatus: '',
    relatedStauts: '',
    clientwork: '',
    clientworkDesc: '',
    userfollow: '',
    notes: '',

    // ===== حقول المتابعة =====
    followUpType: '',
    detailsDate: '',           // ✅ تاريخ التواصل
    followUpStatus: '',
    followUpStatusDesc: '',
    nextReminderDate: '',
    lastContact: '',
    followUpNotes: '',
  });

  const [relatedJop, setRelatedJop] = useState([]);
  const [relatedStatuts, setRelatedStatuts] = useState([]);

  useEffect(() => {
    const id = getCurrentUserId();
    if (id !== '' && id !== null && id !== undefined) {
      setFormsData((prev) => ({ ...prev, addBy: id }));
    }
  }, [user]);

  const handelInputschage = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setFormsData((prev) => ({ ...prev, [name]: finalValue }));

    /* وظيفة العميل */
    if (name === 'clientwork') {
      const selected = clientWorkdata?.data?.data?.find(
        (item) => item?.name === value
      );
      setRelatedJop(selected?.relatedRegions || []);
      setFormsData((prev) => ({ ...prev, clientworkDesc: '' }));
    }

    /* حالة العميل */
    if (name === 'clientStatus') {
      const selected = customerTypes?.data?.data?.find(
        (item) => item?.name === value
      );
      setRelatedStatuts(selected?.relatedRegions || []);
      setFormsData((prev) => ({ ...prev, relatedStauts: '' }));
    }

    /* حالة المتابعة → تصفير الوصف */
    if (name === 'followUpStatus') {
      setFormsData((prev) => ({ ...prev, followUpStatusDesc: '' }));
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    if (!formsData.fullName?.trim()) return toast.error('إسم العميل مطلوب');
    if (!formsData.phoneNumber?.trim()) return toast.error('رقم الجوال مطلوب');
    if (!formsData.source) return toast.error('مصدر العميل مطلوب');

    const currentUserId = getCurrentUserId();

    const data = {
      ...formsData,
SectionFollow:{
  followUpType:formsData.followUpType,
  detailsDate:formsData.detailsDate,
  followUpStatus:formsData.followUpStatus,
  followUpStatusDesc:formsData.followUpStatusDesc,
  lastContact:formsData.lastContact,
  followUpNotes:formsData.followUpNotes,
}
    };

    // تنظيف الحقول الفارغة
    [
      'email',
      'secondaryPhoneNumber',
      'clientwork',
      'clientworkDesc',
      'relatedStauts',
      'userfollow',
      'notes',
      'followUpType',
      'contactDate',
      'followUpStatus',
      'followUpStatusDesc',
      'nextReminderDate',
      'lastContact',
      'followUpNotes',
    ].forEach((k) => {
      if (!data[k]) delete data[k];
    });

    console.log("data-submited" , data);
    
    try {
      addIteam(data, {
        onSuccess: () => {
          toast.success('تم إضافة العميل بنجاح');
          navigate('/import-clinets');
        },
        onError: (error) => {
          if (error?.response?.status === 404) {
            return toast.error('تم إضافة هذا العميل من قبل');
          }
          toast.error(
            'يوجد خطأ في إضافة العميل - يرجى مراجعة البيانات مرة أخرى'
          );
        },
      });
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة العميل - يرجى المحاولة مرة أخرى');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-full h-full" dir="rtl">
      <form
        onSubmit={handelSubmit}
        className="w-full h-full bg-white rounded-[10px] dark:bg-form-input"
      >
        <StatusFilterTabs
          statusConfig={statusConfig}
          onStatusChange={(key) => setActiveTab(key)}
          selectedStatus={activeTab}
        />

        {/* ================ تاب: بيانات العميل ================ */}
        {activeTab === 'info' && (
          <div className="main-section w-full max-h-[600px] min-h-[100px] p-4 overflow-auto">

            {/* اسم العميل */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="fullName" className="w-full text-lg font-medium text-black dark:text-white">
                اسم العميل *
              </label>
              <input
                type="text" id="fullName" name="fullName" required
                onChange={handelInputschage} value={formsData.fullName}
                placeholder="أدخل اسم العميل"
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>

            {/* جوال 1 */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="w-full text-lg font-medium text-black dark:text-white">
                جوال (1) *
              </label>
              <input
                type="text" id="phoneNumber" name="phoneNumber" required
                onChange={handelInputschage} value={formsData.phoneNumber}
                placeholder="أدخل رقم الجوال"
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>

            {/* جوال اختياري */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="secondaryPhoneNumber" className="w-full text-lg font-medium text-black dark:text-white">
                جوال (اختياري)
              </label>
              <input
                type="text" id="secondaryPhoneNumber" name="secondaryPhoneNumber"
                onChange={handelInputschage} value={formsData.secondaryPhoneNumber}
                placeholder="أدخل رقم جوال إضافي"
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>

            {/* البريد الإلكتروني */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="email" className="w-full text-lg font-medium text-black dark:text-white">
                البريد الإلكتروني
              </label>
              <input
                type="email" id="email" name="email" dir="ltr"
                onChange={handelInputschage} value={formsData.email}
                placeholder="example@email.com"
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              />
            </div>

            {/* نوع العميل */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="customerType" className="w-full text-lg font-medium text-black dark:text-white">
                نوع العميل
              </label>
              <select
                name="customerType" id="customerType"
                onChange={handelInputschage} value={formsData.customerType}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">اختر نوع العميل</option>
                <option value="فرد">فرد</option>
                <option value="شركة">شركة</option>
                <option value="مؤسسة">مؤسسة</option>
                <option value="تاجر">تاجر</option>
                <option value="مستورد">مستورد</option>
                <option value="مصدر">مصدر</option>
                <option value="وكيل">وكيل</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            {/* نوع الاهتمام */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="interestType" className="w-full text-lg font-medium text-black dark:text-white">
                نوع الاهتمام
              </label>
              <select
                name="interestType" id="interestType"
                onChange={handelInputschage} value={formsData.interestType}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">اختر نوع الاهتمام</option>
                <option value="استيراد">استيراد</option>
                <option value="تصدير">تصدير</option>
                <option value="استيراد وتصدير">استيراد وتصدير</option>
              </select>
            </div>

            {/* الأولوية */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="priority" className="w-full text-lg font-medium text-black dark:text-white">
                أولوية العميل
              </label>
              <select
                name="priority" id="priority"
                onChange={handelInputschage} value={formsData.priority}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">اختر الأولوية</option>
                <option value="منخفضة">منخفضة</option>
                <option value="متوسطة">متوسطة</option>
                <option value="عالية">عالية</option>
                <option value="عاجلة">عاجلة</option>
              </select>
            </div>

            {/* مصدر العميل */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="source" className="w-full text-lg font-medium text-black dark:text-white">
                مصدر العميل *
              </label>
              <select
                name="source" id="source" required
                onChange={handelInputschage} value={formsData.source}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">اختر مصدر العميل</option>
                <option value="حملة إعلانية ممولة">حملة إعلانية ممولة</option>
                <option value="علاقات شخصية">علاقات شخصية</option>
                <option value="منصات التواصل الاجتماعي">منصات التواصل الاجتماعي</option>
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

            {/* حالة العميل */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="clientStatus" className="w-full text-lg font-medium text-black dark:text-white">
                حالة العميل *
              </label>
              <select
                name="clientStatus" id="clientStatus" required
                onChange={handelInputschage} value={formsData.clientStatus}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              >
                <option value="">قم بالاختيار</option>
                {customerTypes?.data?.data?.map((item) => (
                  <option key={item?._id} value={item?.name}>{item?.name}</option>
                ))}
              </select>
            </div>

            {/* وصف حالة العميل */}
            <div className="mb-6 flex flex-col gap-2">
              <label htmlFor="relatedStauts" className="w-full text-lg font-medium text-black dark:text-white">
                وصف حالة العميل
              </label>
              <select
                name="relatedStauts" id="relatedStauts"
                onChange={handelInputschage} value={formsData.relatedStauts}
                disabled={!formsData.clientStatus}
                className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formsData.clientStatus ? 'اختر وصف حالة العميل' : 'اختر حالة العميل أولاً'}
                </option>
                {relatedStatuts?.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* وظيفة العميل */}
      

            {/* ملاحظات العميل */}
            <div className="mb-6 flex flex-col gap-2 mt-5">
              <label htmlFor="notes" className="w-full text-lg font-medium text-black dark:text-white">
                ملاحظات
              </label>
              <textarea
                name="notes" id="notes"
                onChange={handelInputschage} value={formsData.notes}
                placeholder="اكتب أي ملاحظات خاصة بالعميل..."
                className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        )}

        {/* ================ تاب: المتابعات والاتصالات ================ */}
        {activeTab === 'followup' && (
          <div className="main-section w-full max-h-[600px] min-h-[100px] p-4 overflow-auto">
            <FollowupImportClients
              formsData={formsData}
              handelInputschage={handelInputschage}
            />
          </div>
        )}

        {/* ================ تاب: الطلبات ================ */}
     
        {/* Buttons */}
        <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
          <div className="add_btn">
            <button
              type="submit"
              className="py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-2"
            >
              <FiPlus /> إضافة
            </button>
          </div>
          <div className="return_btn">
            <NavLink to="/import-clinets" className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-all">
              عودة
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddImportClient;