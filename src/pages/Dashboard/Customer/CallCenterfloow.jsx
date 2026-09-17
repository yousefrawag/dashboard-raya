import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import useQueryupdate from '../../../services/useQueryupdate';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useQuerygetiteams from '../../../services/Querygetiteams';

const arabicTimeAgo = (date) => {
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });
  return timeAgo;
};

const CallCenterfloow = ({ SectionFollow, id, iseditpage, seSectionFlowwupdate }) => {
  const { updateiteam } = useQueryupdate("customers/sectionfloow", "customers");
  const { data, isLoading } = useQuerygetiteams("callcenterCustomerstauts", "callcenterCustomerstauts");

  const [modulePop, setModulePop] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [relatedCallStatus, SetReltedCallStatus] = useState([]);
  const [formData, setFormData] = useState({
    details: '',
    detailsDate: '',
    CustomerDealsatuts: '',
    CustomerDealsatutsDescrep: "",
    contactNotes: "",
    nextReminderDate: null
  });
  const navigate = useNavigate();

  // Delete functionality
  const handeldelateItem = (itemid) => {
    const data = {
      sectionid: itemid,
      action: 'delete'
    };
    try {
      updateiteam(
        { data, id },
        {
          onSuccess: (response) => {
            toast.success("تم حذف عنصر من قسم المتابعة الخاصة بالعميل");
            setModulePop(false);
            navigate('/cutomers');
          },
          onError: (error) => {
            if (error.response?.data?.mesg) {
              toast.error(error.response.data.mesg);
            } else {
              toast.error('An error occurred. Please try again.');
            }
            setModulePop(false);
          },
        },
      );
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
      setModulePop(false);
    }
  };

  // Open edit modal and set current item
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setFormData({
      details: item.details,
      detailsDate: format(new Date(item.detailsDate), 'yyyy-MM-dd'),
      CustomerDealsatuts: item.CustomerDealsatuts,
      CustomerDealsatutsDescrep: item.CustomerDealsatutsDescrep
    });
    const CurrentItems1 = data?.data?.data?.find((item) => item.name === currentItem?.CustomerDealsatuts);
    SetReltedCallStatus(CurrentItems1?.relatedRegions || []);
    setEditModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === "CustomerDealsatuts") {
      const CurrentItems = data?.data?.data?.find((item) => item.name === value);
      if (CurrentItems) {
        return SetReltedCallStatus(CurrentItems?.relatedRegions || []);
      }
    }
  };

  // Submit updated data
  const handleUpdateSubmit = () => {
    const data = {
      sectionid: currentItem._id,
      action: 'update',
      updates: formData
    };

    updateiteam(
      { data, id },
      {
        onSuccess: (response) => {
          toast.success("تم تحديث بيانات المتابعة بنجاح");
          setEditModalOpen(false);
          navigate('/cutomers');
        },
        onError: (error) => {
          if (error.response?.data?.mesg) {
            toast.error(error.response.data.mesg);
          } else {
            toast.error('حدث خطأ أثناء التحديث');
          }
        },
      }
    );
  };

  const openDeleteConfirmation = (itemId) => {
    setCurrentItem(SectionFollow.find(item => item._id === itemId));
    setModulePop(true);
  };

  useEffect(() => {
    if (currentItem) {
      const CurrentItems1 = data?.data?.data?.find((item) => item.name === currentItem?.CustomerDealsatuts);
      SetReltedCallStatus(CurrentItems1?.relatedRegions || []);
    }
  }, [currentItem]);

  return (
    <>
      {/* ===================== قائمة المتابعات (تصميم جديد) ===================== */}
      <div className="p-4 mt-8 space-y-4">
        {SectionFollow?.length === 0 && (
          <div className="text-center py-10 text-gray-400 border border-dashed border-gray-300 rounded-xl">
            لا توجد متابعات
          </div>
        )}

        {SectionFollow?.map((item) => (
          <div
            key={item?._id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* الهيدر */}
            <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {item?.user?.imageURL ? (
                  <img
                    src={item.user.imageURL}
                    alt="user"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-main/10 text-main flex items-center justify-center font-semibold">
                    {item?.user?.fullName?.charAt(0) || '؟'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                    {item?.user?.fullName || 'مستخدم'}
                  </p>
                  <div className="flex gap-2 text-xs text-gray-400 mt-0.5">
                    <span>نُشر {arabicTimeAgo(item?.createdAt)}</span>
                    {item?.updatedAt && <span>• عُدّل {arabicTimeAgo(item?.updatedAt)}</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-main bg-main/5 hover:bg-main/10 rounded-md transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => openDeleteConfirmation(item?._id)}
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>

            {/* الجسم */}
            <div className="p-4 space-y-3">
              {item?.details && (
                <p className="text-gray-700 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                  {item.details}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {item?.detailsDate && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <span className="text-gray-400">📅</span>
                    {format(new Date(item?.detailsDate), "dd MMMM, yyyy")}
                  </span>
                )}

                {item?.CustomerDealsatuts && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-main text-white">
                    <span className="opacity-75">الحالة</span>
                    {item.CustomerDealsatuts}
                  </span>
                )}

                {item?.CustomerDealsatutsDescrep && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                    <span className="opacity-75">الوصف</span>
                    {item.CustomerDealsatutsDescrep}
                  </span>
                )}
              </div>

              {item?.contactNotes && (
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-3 border-r-4 border-main">
                  <p className="text-xs text-gray-400 mb-1">ملاحظات</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                    {item.contactNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===================== Delete Modal (تصميم جديد) ===================== */}
      {modulePop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl mb-4">
                ⚠
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                تأكيد الحذف
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                هل أنت متأكد أنك تريد حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setModulePop(false)}
                  className="px-5 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    handeldelateItem(currentItem._id);
                    setModulePop(false);
                  }}
                  className="px-5 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== Edit Modal (تصميم جديد) ===================== */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full my-8">
            {/* الهيدر */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                تعديل بيانات المتابعة
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* الجسم */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  التفاصيل
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-main focus:ring-1 focus:ring-main outline-none transition"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  تاريخ الاتصال
                </label>
                <input
                  type="date"
                  name="detailsDate"
                  value={formData.detailsDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-main focus:ring-1 focus:ring-main outline-none transition"
                />
              </div>

              {isLoading ? (
                <p className="text-sm text-gray-400 text-center py-4">loading ...</p>
              ) : (
                <div className="flex flex-col gap-1.5 w-full">
                  <label
                    htmlFor="CustomerDealsatuts"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    حالة العميل مع المتابعة
                  </label>
                  <select
                    value={formData.CustomerDealsatuts}
                    onChange={handleInputChange}
                    required
                    name="CustomerDealsatuts"
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-main focus:ring-1 focus:ring-main outline-none transition"
                  >
                    <option value="">قم بالاختيار</option>
                    {data?.data?.data?.map((item) => (
                      <option key={item?._id} value={item?.name}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="CustomerDealsatutsDescrep"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  وصف حالة العميل مع المتابعة
                </label>
                <select
                  value={formData.CustomerDealsatutsDescrep}
                  onChange={handleInputChange}
                  required
                  name="CustomerDealsatutsDescrep"
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-main focus:ring-1 focus:ring-main outline-none transition"
                >
                  <option value="">قم بالاختيار</option>
                  {relatedCallStatus?.map((item, i) => (
                    <option key={`${item}-${i}`} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  ملاحظات
                </label>
                <textarea
                  name="contactNotes"
                  value={formData.contactNotes}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:border-main focus:ring-1 focus:ring-main outline-none transition"
                  rows="3"
                />
              </div>
            </div>

            {/* الفوتر */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-5 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-5 py-2 text-sm text-white bg-main rounded-lg hover:bg-blue-700 transition-colors"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallCenterfloow;