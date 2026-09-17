import React from 'react';

// أنواع المتابعة المناسبة لعملاء الاستيراد والتصدير
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

// حالات العميل مع المتابعة
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

// الأوصاف المرتبطة بكل حالة متابعة
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

const FollowupImportClients = ({ formsData, handelInputschage }) => {
  // الأوصاف المتاحة بناءً على الحالة المختارة
  const availableDescriptions =
    FOLLOW_UP_STATUS_DESCRIPTIONS[formsData.followUpStatus] || [];

  return (
    <div className="w-full border-[1px] border-[#eee] p-4 rounded-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* =========================
            نوع المتابعة
        ========================== */}
        <div className="mb-6 flex flex-col gap-2 w-full">
          <label
            htmlFor="followUpType"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            نوع المتابعة *
          </label>
          <select
            name="followUpType"
            id="followUpType"
            value={formsData.followUpType || ''}
            onChange={handelInputschage}
            required
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">قم بالاختيار</option>
            {FOLLOW_UP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* =========================
            تاريخ التواصل ✅ (محدد أساسي)
        ========================== */}
        <div className="mb-6 flex flex-col gap-2 w-full">
          <label
            htmlFor="detailsDate"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            تاريخ التواصل *
          </label>
          <input
            type="date"
            id="detailsDate"
            name="detailsDate"
            value={formsData.detailsDate || ''}
            onChange={handelInputschage}
            required
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          />
        </div>

        {/* =========================
            حالة العميل مع المتابعة
        ========================== */}
        <div className="mb-6 flex flex-col gap-2 w-full">
          <label
            htmlFor="followUpStatus"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            حالة العميل مع المتابعة *
          </label>
          <select
            name="followUpStatus"
            id="followUpStatus"
            value={formsData.followUpStatus || ''}
            onChange={handelInputschage}
            required
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">قم بالاختيار</option>
            {FOLLOW_UP_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* =========================
            وصف حالة العميل مع المتابعة
        ========================== */}
        <div className="mb-6 flex flex-col gap-2 w-full">
          <label
            htmlFor="followUpStatusDesc"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            وصف حالة العميل مع المتابعة
          </label>
          <select
            name="followUpStatusDesc"
            id="followUpStatusDesc"
            value={formsData.followUpStatusDesc || ''}
            onChange={handelInputschage}
            disabled={!formsData.followUpStatus}
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {formsData.followUpStatus
                ? 'اختر الوصف'
                : 'اختر الحالة أولاً'}
            </option>
            {availableDescriptions.map((desc, index) => (
              <option key={`${desc}-${index}`} value={desc}>
                {desc}
              </option>
            ))}
          </select>
        </div>

        {/* =========================
            موعد التنبيه (اختياري)
        ========================== */}
      

        {/* =========================
            آخر ما تم التواصل
        ========================== */}
        <div className="mb-6 flex flex-col gap-2 w-full lg:col-span-2">
          <label
            htmlFor="lastContact"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            آخر ما تم التواصل مع العميل
          </label>
          <textarea
            name="lastContact"
            id="lastContact"
            value={formsData.lastContact || ''}
            onChange={handelInputschage}
            placeholder="اكتب ملخص آخر تواصل مع العميل..."
            className="min-h-[150px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          ></textarea>
        </div>

        {/* =========================
            ملاحظات المتابعة
        ========================== */}
        <div className="mb-6 flex flex-col gap-2 w-full lg:col-span-2">
          <label
            htmlFor="followUpNotes"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            ملاحظات
          </label>
          <textarea
            name="followUpNotes"
            id="followUpNotes"
            value={formsData.followUpNotes || ''}
            onChange={handelInputschage}
            placeholder="اكتب أي ملاحظات خاصة بالمتابعة..."
            className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          ></textarea>
        </div>

      </div>
    </div>
  );
};

export default FollowupImportClients;