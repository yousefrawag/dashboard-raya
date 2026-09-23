import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEdit2, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import useQuerygetiteams from '../../../services/Querygetiteams';
import useQueryupdate from '../../../services/useQueryupdate';

/* =========================================================
   Options ثابتة (نفس صفحة الإضافة)
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

const CURRENCIES = [
  { value: 'USD', label: 'USD - دولار أمريكي' },
  { value: 'EUR', label: 'EUR - يورو' },
  { value: 'EGP', label: 'EGP - جنيه مصري' },
  { value: 'SAR', label: 'SAR - ريال سعودي' },
  { value: 'AED', label: 'AED - درهم إماراتي' },
  { value: 'CNY', label: 'CNY - يوان صيني' },
  { value: 'TRY', label: 'TRY - ليرة تركية' },
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

const YES_NO = [
  { value: 'yes', label: 'نعم' },
  { value: 'no', label: 'لا' },
];

const EMPTY_ORDER = {
  clientId: '',
  opeartionType: '',
  productName: '',
  productCategory: '',
  quantity: '',
  quantityUnit: '',
  productSpecifications: '',
  producingCountry: '',
  producingCity: '',
  receivingCity: '',
  receivingAddress: '',
  shippingType: '',
  containerQuantity: '',
  targetPrice: '',
  currency: '',
  requiredDeliveryDate: '',
  supplierRequired: '',
  customsRequired: '',
  status: 'new',
  notes: '',
};

const inputClass =
  'focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500';

/* =========================================================
   دالة تحويل التاريخ إلى صيغة yyyy-MM-dd للـ input
   ========================================================= */
const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UpdateOrdear = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ============ جلب الأوردر الحالي ============ */
  const {
    data: orderData,
    isLoading: orderLoading,
    isError: orderError,
  } = useQuerygetSpacficIteam('ordears', 'ordears', id);

  const currentOrder = orderData?.data;

  /* ============ جلب كل العملاء ============ */
  const { data: clientsData, isLoading: clientsLoading } = useQuerygetiteams(
    'importClients',
    'importClients'
  );

  /* ============ endpoint تعديل الطلب ============ */
  const { updateiteam, isLoading: updatingOrder } = useQueryupdate(
    'ordears',
    'ordears'
  );

  const [formData, setFormData] = useState({ ...EMPTY_ORDER });
  const [clientSearch, setClientSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  /* ============ تعبئة الفورم عند وصول بيانات الأوردر ============ */
  useEffect(() => {
    if (currentOrder && !isDataLoaded) {
      const order = currentOrder;

      // استخراج clientId سواء كان object أو string
      const clientId =
        typeof order.clientId === 'object'
          ? order.clientId?._id || ''
          : order.clientId || '';

      // استخراج بيانات العميل لعرضها في مربع البحث
      let clientDisplay = '';
      if (typeof order.clientId === 'object' && order.clientId) {
        clientDisplay = `${order.clientId.fullName || ''} — ${
          order.clientId.phoneNumber || ''
        }`;
      }

      setFormData({
        clientId,
        opeartionType: order.opeartionType || '',
        productName: order.productName || '',
        productCategory: order.productCategory || '',
        quantity: order.quantity || '',
        quantityUnit: order.quantityUnit || '',
        productSpecifications: order.productSpecifications || '',
        producingCountry: order.producingCountry || '',
        producingCity: order.producingCity || '',
        receivingCity: order.receivingCity || '',
        receivingAddress: order.receivingAddress || '',
        shippingType: order.shippingType || '',
        containerQuantity: order.containerQuantity || '',
        targetPrice: order.targetPrice || '',
        currency: order.currency || '',
        requiredDeliveryDate: formatDateForInput(order.requiredDeliveryDate),
        supplierRequired: order.supplierRequired || '',
        customsRequired: order.customsRequired || '',
        status: order.status || 'new',
        notes: order.notes || '',
      });

      setClientSearch(clientDisplay);
      setIsDataLoaded(true);
    }
  }, [currentOrder, isDataLoaded]);

  /* ============ فلترة العملاء حسب البحث ============ */
  useEffect(() => {
    const clients = clientsData?.data?.data || [];
    if (!clientSearch.trim()) {
      setFilteredClients(clients.slice(0, 50));
      return;
    }
    const search = clientSearch.toLowerCase();
    const filtered = clients.filter(
      (c) =>
        c?.fullName?.toLowerCase().includes(search) ||
        c?.phoneNumber?.includes(search)
    );
    setFilteredClients(filtered.slice(0, 50));
  }, [clientSearch, clientsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ============ اختيار عميل ============ */
  const handleSelectClient = (client) => {
    setFormData((prev) => ({ ...prev, clientId: client._id }));
    setClientSearch(`${client.fullName} — ${client.phoneNumber || ''}`);
    setShowDropdown(false);
  };

  /* ============ إرسال التعديل ============ */
  const handelSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.clientId) {
      return toast.error('يجب اختيار العميل أولاً');
    }
    if (!formData.opeartionType) {
      return toast.error('نوع العملية مطلوب');
    }
    if (!formData.productName?.trim()) {
      return toast.error('اسم المنتج مطلوب');
    }
    if (!formData.quantity) {
      return toast.error('الكمية مطلوبة');
    }
    if (!formData.quantityUnit) {
      return toast.error('وحدة الكمية مطلوبة');
    }

    // تنظيف الحقول الفارغة
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(
        ([, v]) => v !== '' && v !== null && v !== undefined
      )
    );

    try {
      updateiteam(
        { data: cleanedData, id },
        {
          onSuccess: () => {
            toast.success('تم تعديل الطلب بنجاح ✅');
            navigate('/ImportOrdear');
          },
          onError: (error) => {
            if (error?.response?.status === 404) {
              return toast.error('هذا الطلب غير موجود');
            }
            toast.error(
              error?.response?.data?.mesg ||
                'يوجد خطأ في تعديل الطلب - يرجى مراجعة البيانات مرة أخرى'
            );
          },
        }
      );
    } catch (error) {
      toast.error('حدث خطأ أثناء تعديل الطلب - يرجى المحاولة مرة أخرى');
    }
  };

  /* ============ حالات التحميل والخطأ ============ */
  if (orderLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          جاري تحميل بيانات الطلب...
        </p>
      </div>
    );
  }

  if (orderError || !currentOrder) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20">
        <p className="text-red-500 text-lg mb-4">
          ❌ فشل في تحميل بيانات الطلب
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-main text-white py-2 px-6 rounded-md hover:opacity-90 transition"
        >
          عودة
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full" dir="rtl">
      <form
        onSubmit={handelSubmit}
        className="w-full h-full bg-white rounded-[10px] dark:bg-form-input p-5"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-form-strokedark">
          <h2 className="text-xl font-bold text-black dark:text-white">
            تعديل الطلب
          </h2>
        </div>

        <div className="main-section w-full max-h-[650px] min-h-[100px] p-4 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ============================================
                اختيار العميل (بحث)
            ============================================ */}
            <div className="flex flex-col gap-2 lg:col-span-2 relative">
              <label className="text-lg font-medium text-black dark:text-white">
                العميل *
              </label>
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowDropdown(true);
                  if (formData.clientId) {
                    setFormData((prev) => ({ ...prev, clientId: '' }));
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="ابحث بالاسم أو رقم الجوال..."
                className={inputClass}
              />

              {/* Dropdown نتائج البحث */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-form-input border border-gray-200 dark:border-form-strokedark rounded-md shadow-lg max-h-64 overflow-y-auto z-20">
                  {clientsLoading ? (
                    <p className="p-3 text-sm text-gray-500">جاري التحميل...</p>
                  ) : filteredClients.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">
                      لا توجد نتائج مطابقة
                    </p>
                  ) : (
                    filteredClients.map((c) => (
                      <button
                        type="button"
                        key={c._id}
                        onClick={() => handleSelectClient(c)}
                        className={`w-full text-right p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                          formData.clientId === c._id
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : ''
                        }`}
                      >
                        <p className="font-medium text-gray-900 dark:text-white">
                          {c.fullName}
                        </p>
                        {c.phoneNumber && (
                          <p className="text-xs text-gray-500 mt-0.5" dir="ltr">
                            {c.phoneNumber}
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}

              {formData.clientId && (
                <p className="text-xs text-green-600">✓ تم اختيار العميل</p>
              )}
            </div>

            {/* نوع العملية */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                نوع العملية *
              </label>
              <select
                name="opeartionType"
                value={formData.opeartionType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">قم بالاختيار</option>
                {OPERATION_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* اسم المنتج */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                اسم المنتج *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="مثال: ماكينات تعبئة"
                className={inputClass}
              />
            </div>

            {/* تصنيف المنتج */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                تصنيف المنتج
              </label>
              <input
                type="text"
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                placeholder="مثال: معدات صناعية"
                className={inputClass}
              />
            </div>

            {/* الكمية */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                الكمية *
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="مثال: 500"
                className={inputClass}
              />
            </div>

            {/* وحدة الكمية */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                وحدة الكمية *
              </label>
              <select
                name="quantityUnit"
                value={formData.quantityUnit}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">قم بالاختيار</option>
                {QUANTITY_UNITS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* مواصفات المنتج */}
            <div className="flex flex-col gap-2 lg:col-span-2">
              <label className="text-lg font-medium text-black dark:text-white">
                مواصفات وتفاصيل المنتج
              </label>
              <textarea
                name="productSpecifications"
                value={formData.productSpecifications}
                onChange={handleChange}
                placeholder="اكتب المواصفات التفصيلية للمنتج..."
                className={`${inputClass} min-h-[120px]`}
              ></textarea>
            </div>

            {/* الدولة المنتجة */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                الدولة المنتجة
              </label>
              <input
                type="text"
                name="producingCountry"
                value={formData.producingCountry}
                onChange={handleChange}
                placeholder="مثال: الصين"
                className={inputClass}
              />
            </div>

            {/* المدينة المنتجة */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                المدينة / المنطقة المنتجة
              </label>
              <input
                type="text"
                name="producingCity"
                value={formData.producingCity}
                onChange={handleChange}
                placeholder="مثال: شنغهاي"
                className={inputClass}
              />
            </div>

            {/* مدينة الاستلام */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                مدينة الاستلام
              </label>
              <input
                type="text"
                name="receivingCity"
                value={formData.receivingCity}
                onChange={handleChange}
                placeholder="مثال: القاهرة"
                className={inputClass}
              />
            </div>

            {/* عنوان الاستلام */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                عنوان الاستلام
              </label>
              <input
                type="text"
                name="receivingAddress"
                value={formData.receivingAddress}
                onChange={handleChange}
                placeholder="العنوان التفصيلي للاستلام"
                className={inputClass}
              />
            </div>

            {/* نوع الشحن */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                نوع الشحن
              </label>
              <select
                name="shippingType"
                value={formData.shippingType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">قم بالاختيار</option>
                {SHIPPING_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* عدد الحاويات */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                عدد الحاويات
              </label>
              <input
                type="text"
                name="containerQuantity"
                value={formData.containerQuantity}
                onChange={handleChange}
                placeholder="مثال: 2"
                className={inputClass}
              />
            </div>

            {/* السعر المستهدف */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                السعر المستهدف
              </label>
              <input
                type="text"
                name="targetPrice"
                value={formData.targetPrice}
                onChange={handleChange}
                placeholder="مثال: 25000"
                className={inputClass}
              />
            </div>

            {/* العملة */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                العملة
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">قم بالاختيار</option>
                {CURRENCIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* تاريخ التسليم */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                تاريخ التسليم المطلوب
              </label>
              <input
                type="date"
                name="requiredDeliveryDate"
                value={formData.requiredDeliveryDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* هل يحتاج مورد؟ */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                هل يحتاج إلى توفير مورد؟
              </label>
              <select
                name="supplierRequired"
                value={formData.supplierRequired}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">قم بالاختيار</option>
                {YES_NO.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* هل يحتاج تخليص جمركي؟ */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                هل يحتاج إلى خدمة التخليص الجمركي؟
              </label>
              <select
                name="customsRequired"
                value={formData.customsRequired}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">قم بالاختيار</option>
                {YES_NO.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* حالة الطلب */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium text-black dark:text-white">
                حالة الطلب *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                {ORDER_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ملاحظات الطلب */}
            <div className="flex flex-col gap-2 lg:col-span-2">
              <label className="text-lg font-medium text-black dark:text-white">
                ملاحظات الطلب
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="أي ملاحظات إضافية على الطلب..."
                className={`${inputClass} min-h-[120px]`}
              ></textarea>
            </div>

          </div>
        </div>

        {/* ============================================
            Buttons
        ============================================ */}
        <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input rounded-md">
          <div className="add_btn">
            <button
              type="submit"
              disabled={updatingOrder}
              className="py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiEdit2 />
              {updatingOrder ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>

          <div className="return_btn">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-all flex items-center gap-2"
            >
              <FiArrowRight /> عودة
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrdear;