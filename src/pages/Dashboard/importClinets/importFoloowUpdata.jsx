import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  FiEdit,
  FiTrash2,
  FiPhone,
  FiCalendar,
  FiCheckCircle,
  FiMessageSquare,
  FiFileText,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import useQueryupdate from '../../../services/useQueryupdate';

/* =========================================================
   Options
   ========================================================= */
const FOLLOW_UP_TYPES = [
  'مكالمة هاتفية',
  'اجتماع',
  'رسالة واتساب',
  'بريد إلكتروني',
  'زيارة ميدانية',
  'تفاوض على السعر',
  'متابعة عرض سعر',
  'متابعة شحنة',
  'متابعة مستندات',
  'اتفاق نهائي',
  'أخرى',
];

const FOLLOW_UP_STATUSES = [
  'جديد',
  'قيد المتابعة',
  'في انتظار رد العميل',
  'في انتظار عرض سعر',
  'تم الاتفاق مبدئيًا',
  'تم الاتفاق نهائيًا',
  'مؤجل',
  'ملغي',
];

const FOLLOW_UP_STATUS_DESCRIPTIONS = {
  جديد: ['لم يتم التواصل بعد', 'تم استلام بيانات مبدئية'],
  'قيد المتابعة': [
    'تم التواصل الأول',
    'تم إرسال معلومات المنتج',
    'بانتظار موافقة داخلية',
  ],
  'في انتظار رد العميل': ['أرسلنا العرض', 'بانتظار قرار العميل'],
  'في انتظار عرض سعر': ['قيد إعداد العرض', 'تم إرسال العرض'],
  'تم الاتفاق مبدئيًا': ['اتفقنا على السعر', 'اتفقنا على المواصفات'],
  'تم الاتفاق نهائيًا': ['تم توقيع الاتفاقية', 'تم استلام الدفعة'],
  مؤجل: ['العميل غير جاهز حاليًا', 'الميزانية غير متوفرة'],
  ملغي: ['العميل رفض', 'السعر غير مناسب', 'تعامل مع منافس'],
};

const STATUS_STYLES = {
  جديد: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  'قيد المتابعة': { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  'في انتظار رد العميل': { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
  'في انتظار عرض سعر': { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  'تم الاتفاق مبدئيًا': { bg: 'bg-teal-50', border: 'border-teal-400', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-700' },
  'تم الاتفاق نهائيًا': { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  مؤجل: { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700', badge: 'bg-gray-200 text-gray-700' },
  ملغي: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
};

/* =========================================================
   Safe date helpers (بيمنعوا RangeError: Invalid time value)
   ========================================================= */
const safeFormat = (date, fmt = 'dd MMMM, yyyy') => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  try {
    return format(d, fmt);
  } catch {
    return null;
  }
};

const safeTimeAgo = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  try {
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return null;
  }
};

const inputClass =
  'focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500';

const EMPTY_FORM = {
  followUpType: '',
  detailsDate: '',
  followUpStatus: '',
  followUpStatusDesc: '',
  lastContact: '',
  followUpNotes: '',
};

const ImportFoloowUpdata = ({ SectionFollow = [], id }) => {
  const { updateiteam } = useQueryupdate(
    'importClients/sectionfloow',
    'importClients'
  );
  const navigate = useNavigate();

  const [modulePop, setModulePop] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  /* ============ حذف ============ */
  const handeldelateItem = (itemid) => {
    const data = { sectionid: itemid, action: 'delete' };
    try {
      updateiteam(
        { data, id },
        {
          onSuccess: () => {
            toast.success('تم حذف المتابعة بنجاح');
            setModulePop(false);
            navigate(0);
          },
          onError: (error) => {
            toast.error(error?.response?.data?.mesg || 'حدث خطأ أثناء الحذف');
            setModulePop(false);
          },
        }
      );
    } catch {
      toast.error('حدث خطأ أثناء الحذف');
      setModulePop(false);
    }
  };

  /* ============ فتح مودال التعديل ============ */
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setFormData({
      followUpType: item?.followUpType || '',
      detailsDate: safeFormat(item?.detailsDate, 'yyyy-MM-dd') || '',
      followUpStatus: item?.followUpStatus || '',
      followUpStatusDesc: item?.followUpStatusDesc || '',
      lastContact: item?.lastContact || '',
      followUpNotes: item?.followUpNotes || '',
    });
    setEditModalOpen(true);
  };

  /* ============ تغيير حقول المودال ============ */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'followUpStatus') {
      setFormData((prev) => ({
        ...prev,
        followUpStatus: value,
        followUpStatusDesc: '',
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ============ حفظ التعديل ============ */
  const handleUpdateSubmit = () => {
    if (!formData.followUpType) return toast.error('نوع المتابعة مطلوب');
    if (!formData.detailsDate) return toast.error('تاريخ التواصل مطلوب');
    if (!formData.followUpStatus) return toast.error('حالة المتابعة مطلوبة');

    const data = {
      sectionid: currentItem._id,
      action: 'update',
      updates: formData,
    };

    updateiteam(
      { data, id },
      {
        onSuccess: () => {
          toast.success('تم تحديث المتابعة بنجاح');
          setEditModalOpen(false);
          navigate(0);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.mesg || 'حدث خطأ أثناء التحديث'
          );
        },
      }
    );
  };

  const openDeleteConfirmation = (itemId) => {
    setCurrentItem(SectionFollow.find((item) => item._id === itemId));
    setModulePop(true);
  };

  const availableDescriptions =
    FOLLOW_UP_STATUS_DESCRIPTIONS[formData.followUpStatus] || [];

  /* ============ Empty state ============ */
  if (!SectionFollow?.length) {
    return (
      <div className="w-full p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg m-5">
        <FiMessageSquare className="mx-auto text-4xl mb-3 text-gray-300" />
        لا توجد متابعات مسجلة لهذا العميل بعد
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-4 mt-2">
        {SectionFollow.map((item) => {
          const statusStyle =
            STATUS_STYLES[item?.followUpStatus] || {
              bg: 'bg-white',
              border: 'border-gray-300',
              badge: 'bg-gray-200 text-gray-700',
            };

          const createdAtAgo = safeTimeAgo(item?.createdAt);
          const updatedAtAgo = safeTimeAgo(item?.updatedAt);
          const formattedDate = safeFormat(item?.detailsDate);

          return (
            <div
              key={item?._id}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border-r-4 ${statusStyle.border} overflow-hidden`}
            >
              {/* رأس الكارت */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {item?.user?.imageURL ? (
                    <img
                      src={item.user.imageURL}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-main/10 text-main flex items-center justify-center font-semibold">
                      {item?.user?.fullName?.charAt(0) || '؟'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item?.user?.fullName || 'مستخدم'}
                    </p>
                    <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {createdAtAgo && <span>نُشر {createdAtAgo}</span>}
                      {updatedAtAgo && <span>• عُدّل {updatedAtAgo}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    type="button"
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                    title="تعديل"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteConfirmation(item?._id)}
                    type="button"
                    className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                    title="حذف"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* جسم الكارت */}
              <div className="p-4 space-y-3">
                {/* الصف الأول - بيانات أساسية */}
                <div className="flex flex-wrap gap-2">
                  {item?.followUpType && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm">
                      <FiPhone size={13} />
                      {item.followUpType}
                    </span>
                  )}

                  {formattedDate && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm">
                      <FiCalendar size={13} />
                      {formattedDate}
                    </span>
                  )}

                  {item?.followUpStatus && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusStyle.badge}`}
                    >
                      <FiCheckCircle size={13} />
                      {item.followUpStatus}
                    </span>
                  )}

                  {item?.followUpStatusDesc && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                      {item.followUpStatusDesc}
                    </span>
                  )}
                </div>

                {/* آخر ما تم التواصل */}
                {item?.lastContact && (
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-md p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <FiMessageSquare size={12} />
                      آخر ما تم التواصل
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                      {item.lastContact}
                    </p>
                  </div>
                )}

                {/* ملاحظات */}
                {item?.followUpNotes && (
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-md p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <FiFileText size={12} />
                      ملاحظات
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                      {item.followUpNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================
          Delete Modal
      ============================================ */}
      {modulePop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              تأكيد الحذف
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              هل أنت متأكد أنك تريد حذف هذه المتابعة؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModulePop(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  handeldelateItem(currentItem._id);
                  setModulePop(false);
                }}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          Edit Modal
      ============================================ */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              تعديل بيانات المتابعة
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  نوع المتابعة *
                </label>
                <select
                  name="followUpType"
                  value={formData.followUpType}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">قم بالاختيار</option>
                  {FOLLOW_UP_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  تاريخ التواصل *
                </label>
                <input
                  type="date"
                  name="detailsDate"
                  value={formData.detailsDate}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  حالة العميل مع المتابعة *
                </label>
                <select
                  name="followUpStatus"
                  value={formData.followUpStatus}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">قم بالاختيار</option>
                  {FOLLOW_UP_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  وصف حالة المتابعة
                </label>
                <select
                  name="followUpStatusDesc"
                  value={formData.followUpStatusDesc}
                  onChange={handleInputChange}
                  disabled={!formData.followUpStatus}
                  className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {formData.followUpStatus
                      ? 'اختر الوصف'
                      : 'اختر الحالة أولاً'}
                  </option>
                  {availableDescriptions.map((d, i) => (
                    <option key={`${d}-${i}`} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 lg:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  آخر ما تم التواصل
                </label>
                <textarea
                  name="lastContact"
                  value={formData.lastContact}
                  onChange={handleInputChange}
                  rows="3"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2 lg:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ملاحظات
                </label>
                <textarea
                  name="followUpNotes"
                  value={formData.followUpNotes}
                  onChange={handleInputChange}
                  rows="3"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 text-white bg-main rounded hover:bg-blue-700 transition-colors"
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

export default ImportFoloowUpdata;