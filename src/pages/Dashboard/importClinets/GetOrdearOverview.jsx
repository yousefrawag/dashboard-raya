import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FiArrowRight,
  FiEdit,
  FiUser,
  FiPackage,
  FiTruck,
  FiGlobe,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiMapPin,
  FiBox,
  FiClipboard,
  FiInfo,
} from 'react-icons/fi';

import HeadPagestyle from '../../../components/common/HeadPagestyle';
import Loader from '../../../components/common/Loader';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';

/* =========================================================
   Options (نفس المستخدمة في الفورم والجدول)
   ========================================================= */
const OPERATION_TYPES = [
  { value: 'import', label: 'استيراد' },
  { value: 'export', label: 'تصدير' },
];

const QUANTITY_UNITS = [
  { value: 'piece', label: 'قطعة' },
  { value: 'kilogram', label: 'كيلوجرام' },
  { value: 'ton', label: 'طن' },
  { value: 'carton', label: 'كرتونة' },
  { value: 'pallet', label: 'طبلية / منصة' },
  { value: 'container', label: 'حاوية' },
  { value: 'liter', label: 'لتر' },
  { value: 'meter', label: 'متر' },
  { value: 'square_meter', label: 'متر مربع' },
];

const SHIPPING_TYPES = [
  { value: 'full_container', label: 'حاوية كاملة' },
  { value: 'shared_container', label: 'حاوية مشتركة' },
  { value: 'air_freight', label: 'شحن جوي' },
  { value: 'sea_freight', label: 'شحن بحري' },
  { value: 'land_freight', label: 'شحن بري' },
];

const ORDER_STATUSES = [
  { value: 'new', label: 'طلب جديد' },
  { value: 'searching_supplier', label: 'جاري البحث عن مورد' },
  { value: 'supplier_found', label: 'تم العثور على مورد' },
  { value: 'quotation_preparing', label: 'جاري إعداد عرض السعر' },
  { value: 'quotation_sent', label: 'تم إرسال عرض السعر' },
  { value: 'negotiation', label: 'قيد التفاوض' },
  { value: 'approved', label: 'تم اعتماد الطلب' },
  { value: 'in_progress', label: 'جاري تنفيذ الطلب' },
  { value: 'shipping', label: 'جاري الشحن' },
  { value: 'customs', label: 'جاري التخليص الجمركي' },
  { value: 'delivered', label: 'تم التسليم' },
  { value: 'completed', label: 'تم الانتهاء' },
  { value: 'rejected', label: 'تم رفض الطلب' },
  { value: 'cancelled', label: 'تم إلغاء الطلب' },
];

const STATUS_BADGE_STYLES = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  searching_supplier: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  supplier_found: 'bg-teal-100 text-teal-700 border-teal-200',
  quotation_preparing: 'bg-purple-100 text-purple-700 border-purple-200',
  quotation_sent: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  negotiation: 'bg-orange-100 text-orange-700 border-orange-200',
  approved: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  in_progress: 'bg-blue-200 text-blue-800 border-blue-300',
  shipping: 'bg-amber-100 text-amber-700 border-amber-200',
  customs: 'bg-lime-100 text-lime-700 border-lime-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-200 text-gray-700 border-gray-300',
};

const getLabel = (list, value) =>
  list.find((item) => item.value === value)?.label || value || '—';

const safeFormatDate = (date, fmt = 'dd MMMM, yyyy') => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  try {
    return format(d, fmt);
  } catch {
    return '—';
  }
};

const GetOrdearOverview = () => {
  const { id } = useParams();
  const { isLoading, data } = useQuerygetSpacficIteam('ordears', 'ordears', id);

  const order = data?.data;

  if (isLoading) return <Loader />;

  if (!order) {
    return (
      <div className="w-full h-full p-10 text-center">
        <p className="text-red-500 text-xl font-semibold">
          لم يتم العثور على بيانات الطلب
        </p>
        <Link
          to="/ImportOrdear"
          className="inline-block mt-4 px-5 py-2 bg-main text-white rounded-md"
        >
          العودة للطلبات
        </Link>
      </div>
    );
  }

  const statusBadge =
    STATUS_BADGE_STYLES[order?.status] ||
    'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="w-full h-full" dir="rtl">
      <HeadPagestyle
        pageName="تفاصيل الطلب"
        to="/ImportOrdear"
        title="عوده"
      />

      {/* ==================== Actions ==================== */}
      <div className="flex gap-4 m-5 flex-wrap">
        <Link
          to={`/import-clients/orders/edit/${id}`}
          className="py-2 px-6 bg-main text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FiEdit /> تعديل الطلب
        </Link>
        <Link
          to="/ImportOrdear"
          className="py-2 px-6 bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 hover:bg-gray-300 transition-colors"
        >
          <FiArrowRight /> عوده
        </Link>
      </div>

      <div className="p-5 space-y-5">
        {/* =========================================================
            Hero Card — العميل + الحالة + رقم الطلب
        ========================================================= */}
        <div className="bg-white dark:bg-form-input rounded-2xl border border-gray-200 dark:border-form-strokedark shadow-sm overflow-hidden">
          <div className="bg-gradient-to-l from-main/10 to-transparent p-5 flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              {order?.clientId?._id ? (
                <Link
                  to={`/import-clinets/${order.clientId._id}`}
                  className="w-14 h-14 rounded-full bg-main/10 text-main flex items-center justify-center text-xl font-bold hover:bg-main/20 transition-colors"
                  title="عرض العميل"
                >
                  {order.clientId?.fullName?.charAt(0) || '؟'}
                </Link>
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                  <FiUser size={22} />
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 mb-0.5">العميل</p>
                {order?.clientId?._id ? (
                  <Link
                    to={`/import-clinets/${order.clientId._id}`}
                    className="text-lg font-bold text-black dark:text-white hover:text-main transition-colors"
                  >
                    {order.clientId?.fullName || '—'}
                  </Link>
                ) : (
                  <p className="text-lg font-bold text-black dark:text-white">
                    —
                  </p>
                )}
                {order?.clientId?.phoneNumber && (
                  <p className="text-sm text-gray-500" dir="ltr">
                    {order.clientId.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`inline-block px-3 py-1.5 text-sm font-medium rounded-full border ${statusBadge}`}
              >
                {getLabel(ORDER_STATUSES, order?.status)}
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>رقم الطلب:</span>
                <span className="font-mono" dir="ltr">
                  {order?._id?.slice(-8) || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-gray-100 dark:border-form-strokedark">
            <StatCell
              icon={<FiClipboard />}
              label="نوع العملية"
              value={getLabel(OPERATION_TYPES, order?.opeartionType)}
              highlight
            />
            <StatCell
              icon={<FiBox />}
              label="الكمية"
              value={`${order?.quantity || '—'} ${
                order?.quantityUnit
                  ? `(${getLabel(QUANTITY_UNITS, order.quantityUnit)})`
                  : ''
              }`}
            />
            <StatCell
              icon={<FiTruck />}
              label="نوع الشحن"
              value={getLabel(SHIPPING_TYPES, order?.shippingType)}
            />
            <StatCell
              icon={<FiDollarSign />}
              label="السعر المستهدف"
              value={
                order?.targetPrice
                  ? `${order.targetPrice} ${order.currency || ''}`
                  : '—'
              }
              dir="ltr"
            />
          </div>
        </div>

        {/* =========================================================
            بيانات المنتج
        ========================================================= */}
        <Section title="بيانات المنتج" icon={<FiPackage />}>
          <Field label="اسم المنتج" value={order?.productName} />
          <Field label="تصنيف المنتج" value={order?.productCategory} />
          <Field
            label="مواصفات وتفاصيل المنتج"
            value={order?.productSpecifications}
            full
          />
        </Section>

        {/* =========================================================
            بيانات الشحن والاستلام
        ========================================================= */}
        <Section title="بيانات الشحن والاستلام" icon={<FiTruck />}>
          <Field
            label="الدولة المنتجة"
            value={order?.producingCountry}
            icon={<FiGlobe />}
          />
          <Field
            label="المدينة / المنطقة المنتجة"
            value={order?.producingCity}
            icon={<FiMapPin />}
          />
          <Field
            label="مدينة الاستلام"
            value={order?.receivingCity}
            icon={<FiMapPin />}
          />
          <Field
            label="عنوان الاستلام"
            value={order?.receivingAddress}
            icon={<FiMapPin />}
          />
          <Field
            label="نوع الشحن"
            value={getLabel(SHIPPING_TYPES, order?.shippingType)}
            icon={<FiTruck />}
          />
          <Field
            label="عدد الحاويات"
            value={order?.containerQuantity}
            icon={<FiBox />}
          />
        </Section>

        {/* =========================================================
            بيانات السعر والتسليم
        ========================================================= */}
        <Section title="بيانات السعر والتسليم" icon={<FiDollarSign />}>
          <Field
            label="السعر المستهدف"
            value={order?.targetPrice}
            dir="ltr"
          />
          <Field label="العملة" value={order?.currency} />
          <Field
            label="تاريخ التسليم المطلوب"
            value={safeFormatDate(order?.requiredDeliveryDate)}
            icon={<FiCalendar />}
          />
        </Section>

        {/* =========================================================
            الخدمات المطلوبة
        ========================================================= */}
        <Section title="الخدمات المطلوبة" icon={<FiCheckCircle />}>
          <ServiceBadge
            label="توفير مورد"
            value={order?.supplierRequired}
          />
          <ServiceBadge
            label="خدمة الشحن"
            value={order?.shippingRequired}
          />
          <ServiceBadge
            label="التخليص الجمركي"
            value={order?.customsRequired}
          />
        </Section>

        {/* =========================================================
            ملاحظات
        ========================================================= */}
        {order?.notes && (
          <Section title="ملاحظات الطلب" icon={<FiFileText />}>
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 border-r-4 border-main">
                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {order.notes}
                </p>
              </div>
            </div>
          </Section>
        )}

        {/* =========================================================
            تواريخ
        ========================================================= */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
          <div className="flex items-center gap-2">
            <FiCalendar size={13} />
            <span>تاريخ الإنشاء:</span>
            <span className="font-medium">
              {safeFormatDate(order?.createdAt)}
            </span>
          </div>
          {order?.updatedAt && (
            <div className="flex items-center gap-2">
              <FiInfo size={13} />
              <span>آخر تحديث:</span>
              <span className="font-medium">
                {safeFormatDate(order?.updatedAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Sub-components
   ========================================================= */

/* بطاقة الإحصائيات العلوية */
const StatCell = ({ icon, label, value, dir, highlight }) => (
  <div
    className={`p-4 border-l border-gray-100 dark:border-form-strokedark last:border-l-0 ${
      highlight ? 'bg-main/5' : ''
    }`}
  >
    <div className="flex items-center gap-2 text-gray-400 mb-1.5">
      <span className="text-main">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
    <p
      className="text-base font-semibold text-black dark:text-white"
      dir={dir}
    >
      {value || '—'}
    </p>
  </div>
);

/* قسم كامل */
const Section = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-form-input rounded-2xl border border-gray-200 dark:border-form-strokedark shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-form-strokedark bg-gray-50/50 dark:bg-gray-900/20">
      <span className="text-main">{icon}</span>
      <h3 className="text-base font-semibold text-black dark:text-white">
        {title}
      </h3>
    </div>
    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

/* حقل واحد */
const Field = ({ label, value, full, dir, icon }) => (
  <div className={full ? 'md:col-span-2 lg:col-span-3' : ''}>
    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
    <p
      className="text-sm font-medium text-black dark:text-white break-words"
      dir={dir}
    >
      {value || '—'}
    </p>
  </div>
);

/* Badge للخدمات */
const ServiceBadge = ({ label, value }) => {
  const isYes = value === 'yes';
  const isNo = value === 'no';
  const isUnknown = !isYes && !isNo;

  const cls = isYes
    ? 'bg-green-100 text-green-700 border-green-200'
    : isNo
    ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-gray-100 text-gray-500 border-gray-200';

  const text = isYes ? 'نعم' : isNo ? 'لا' : 'غير محدد';

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-gray-400">{label}</span>
      <span
        className={`inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-medium border ${cls}`}
      >
        {isYes && <FiCheckCircle size={12} />}
        {text}
      </span>
    </div>
  );
};

export default GetOrdearOverview;