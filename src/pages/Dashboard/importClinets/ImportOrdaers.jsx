import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { FiFilter, FiX, FiEye, FiEdit2 } from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import FiltertionHook from '../../../hooks/FiltertionHook';
import Loader from '../../../components/common/Loader';
import useQuerygetiteams from '../../../services/Querygetiteams';
import useQueryupdate from '../../../services/useQueryupdate';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import PopupCheckdelete from '../../../components/common/popupmdules/PopupCheckdelete';

/* =========================================================
   Options
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
  { value: 'pallet', label: 'طبلية' },
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

const ImportOrdaers = () => {
  /* ==================== State ==================== */
  const [paramsapi, setParamsapi] = useState({
    field: '',
    searchTerm: '',
    startDate: '',
    endDate: '',
  });

  const [params, setParams] = useState({
    field: '',
    searchTerm: '',
    startDate: '',
    endDate: '',
    toLength: '',
    fromLength: '',
  });

  const [isSectionOpen, setIssectionOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ==================== Data ==================== */
  const { isLoading, data } = useQuerygetiteams('ordears', 'ordears');
  const { updateiteam } = useQueryupdate('ordears', 'ordears');
  const { CanAdd, CanEdit, CanDelte, isAdmin } =
    useGetUserAuthentications('Clients');

  /* ==================== Filters ==================== */
  const filters = [
    { value: 'client.fullName', name: 'اسم العميل' },
    { value: 'productName', name: 'اسم المنتج' },
    { value: 'productCategory', name: 'تصنيف المنتج' },
    { value: 'opeartionType', name: 'نوع العملية' },
    { value: 'producingCountry', name: 'الدولة المنتجة' },
    { value: 'receivingCity', name: 'مدينة الاستلام' },
    { value: 'shippingType', name: 'نوع الشحن' },
    { value: 'status', name: 'حالة الطلب' },
    { value: 'currency', name: 'العملة' },
    { value: 'targetPrice', name: 'السعر المستهدف' },
    { value: 'supplierRequired', name: 'يحتاج مورد؟' },
    { value: 'customsRequired', name: 'يحتاج تخليص جمركي؟' },
  ];

  /* ==================== Filtered Data ==================== */
  const filteredData = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.filter((item) => {
      if (
        params.field === 'length' &&
        (params.fromLength || params.toLength)
      ) {
        const count = item?.quantity || 0;
        const from = Number(params.fromLength) || 0;
        const to = Number(params.toLength) || Infinity;
        return count >= from && count <= to;
      }

      if (params.searchTerm && params.field) {
        const fieldValue = params.field
          .split('.')
          .reduce((obj, key) => obj?.[key], item);

        if (typeof fieldValue === 'string') {
          return fieldValue
            .toLowerCase()
            .includes(params.searchTerm.toLowerCase());
        }

        if (fieldValue != null) {
          return String(fieldValue)
            .toLowerCase()
            .includes(params.searchTerm.toLowerCase());
        }

        return false;
      }

      return true;
    });
  }, [data, params]);

  /* ==================== Change Status ==================== */
  const handleStatusChange = (id, newStatus) => {
    try {
      const payload = { status: newStatus };
      updateiteam(
        { id, data: payload },
        {
          onSuccess: () => {
            toast.success('تم تحديث حالة الطلب');
          },
          onError: () => {
            toast.error('حدث خطأ أثناء تحديث الحالة');
          },
        }
      );
    } catch {
      toast.error('حدث خطأ');
    }
  };

  /* ==================== Helper ==================== */
  const handelStringLength = (text) => {
    if (!text) return '—';
    if (text?.length > 20) {
      return `${text.substring(0, 20)}...`;
    }
    return text;
  };

  /* ==================== Columns ==================== */
  const columns = [
    /* العميل */
    {
      name: 'العميل',
      selector: (row) => row?.clientId?.fullName,
      cell: (row) =>
        row?.clientId?._id ? (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to={`/import-clinets/${row.clientId._id}`}
            className="text-main hover:underline"
          >
            {row.clientId.fullName}
          </Link>
        ) : (
          <span>—</span>
        ),
    },

    /* نوع العملية */
    {
      name: 'نوع العملية',
      selector: (row) => row?.opeartionType,
      cell: (row) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
            row?.opeartionType === 'import'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}
        >
          {getLabel(OPERATION_TYPES, row?.opeartionType)}
        </span>
      ),
    },

    /* المنتج */
    {
      name: 'المنتج',
      selector: (row) => row?.productName,
      cell: (row) => (
        <span title={row?.productName}>
          {handelStringLength(row?.productName)}
        </span>
      ),
    },

    /* الكمية */
    {
      name: 'الكمية',
      selector: (row) => row?.quantity,
      cell: (row) => (
        <span>
          {row?.quantity || '—'}{' '}
          {row?.quantityUnit
            ? `(${getLabel(QUANTITY_UNITS, row?.quantityUnit)})`
            : ''}
        </span>
      ),
    },

    /* نوع الشحن */
    {
      name: 'نوع الشحن',
      selector: (row) => row?.shippingType,
      cell: (row) => (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
          {getLabel(SHIPPING_TYPES, row?.shippingType)}
        </span>
      ),
    },

    /* السعر */
    {
      name: 'السعر',
      selector: (row) => row?.targetPrice,
      cell: (row) => (
        <span dir="ltr">
          {row?.targetPrice
            ? `${row.targetPrice} ${row.currency || ''}`
            : '—'}
        </span>
      ),
    },

    /* ✅ حالة الطلب — select ملوّن inline */
    {
      name: 'حالة الطلب',
       width:"160px",
      selector: (row) => row?.status,
      cell: (row) => {
        const badgeClass =
          STATUS_BADGE_STYLES[row?.status] ||
          'bg-gray-100 text-gray-700 border-gray-200';

        return (
          <select
            value={row?.status || ''}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            disabled={!isAdmin && !CanEdit}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border cursor-pointer outline-none transition-all whitespace-nowrap ${badgeClass} disabled:cursor-not-allowed`}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        );
      },
    },

    /* تاريخ الإنشاء */


    /* آخر تحديث */
    {
      name: 'آخر تحديث',
      width:"130px",
      selector: (row) => row?.updatedAt,
      sortable: true,
      cell: (row) => {
        if (!row?.updatedAt) return '—';
        try {
          return formatDistanceToNow(new Date(row.updatedAt), {
            addSuffix: true,
          });
        } catch {
          return '—';
        }
      },
    },
    {
      name: 'تاريخ الإنشاء',
       width:"130px",
      selector: (row) => row?.createdAt,
      sortable: true,
      cell: (row) =>
        row?.createdAt
          ? format(new Date(row.createdAt), 'dd MMMM, yyyy')
          : '—',
    },
    /* الإجراءات */
    {
      name: 'إجراءات',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* عرض */}
          <Link
            to={`/ImportOrdear/${row._id}`}
            className="text-main hover:text-blue-700 transition-colors"
            title="عرض التفاصيل"
          >
            <FiEye size={18} />
          </Link>

          {/* تعديل */}
          {(isAdmin || CanEdit) && (
            <Link
              to={`/ImportOrdear/edit/${row._id}`}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <FiEdit2 size={17} />
            </Link>
          )}

          {/* حذف */}
          {(isAdmin || CanDelte) && (
            <button
              type="button"
              onClick={() => setDeleteId(row._id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="حذف"
            >
              <MdOutlineDelete size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  /* ==================== Columns Excel ==================== */
  const columnsfile = [
    { name: 'العميل', selector: (row) => row?.client?.fullName || '—' },
    {
      name: 'نوع العملية',
      selector: (row) => getLabel(OPERATION_TYPES, row?.opeartionType),
    },
    { name: 'اسم المنتج', selector: (row) => row?.productName },
    { name: 'تصنيف المنتج', selector: (row) => row?.productCategory },
    { name: 'الكمية', selector: (row) => row?.quantity },
    {
      name: 'وحدة الكمية',
      selector: (row) => getLabel(QUANTITY_UNITS, row?.quantityUnit),
    },
    { name: 'الدولة المنتجة', selector: (row) => row?.producingCountry },
    { name: 'المدينة المنتجة', selector: (row) => row?.producingCity },
    { name: 'مدينة الاستلام', selector: (row) => row?.receivingCity },
    { name: 'عنوان الاستلام', selector: (row) => row?.receivingAddress },
    {
      name: 'نوع الشحن',
      selector: (row) => getLabel(SHIPPING_TYPES, row?.shippingType),
    },
    { name: 'عدد الحاويات', selector: (row) => row?.containerQuantity },
    { name: 'السعر المستهدف', selector: (row) => row?.targetPrice },
    { name: 'العملة', selector: (row) => row?.currency },
    {
      name: 'تاريخ التسليم',
      selector: (row) =>
        row?.requiredDeliveryDate
          ? format(new Date(row.requiredDeliveryDate), 'dd MMMM, yyyy')
          : '—',
    },
    {
      name: 'حالة الطلب',
      selector: (row) => getLabel(ORDER_STATUSES, row?.status),
    },
    { name: 'ملاحظات', selector: (row) => row?.notes },
    {
      name: 'تاريخ الإنشاء',
      selector: (row) =>
        row?.createdAt
          ? format(new Date(row.createdAt), 'dd MMMM, yyyy')
          : '—',
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <HeadPagestyle
        isAdmin={isAdmin}
        CanAdd={CanAdd}
        pageName="جميع الطلبات"
        to="/ImportOrdear/new"
        title="إضافة طلب جديد"
      />

      {/* زر عرض/إخفاء الفلاتر */}
      <button
        className="flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        onClick={() => setIssectionOpen(!isSectionOpen)}
      >
        {isSectionOpen ? <FiX size={20} /> : <FiFilter size={20} />}
        {isSectionOpen ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
      </button>

      {/* الفلاتر */}
      {isSectionOpen && (
        <div>
          <FiltertionHook
            setParamsapi={setParamsapi}
            paramsapi={paramsapi}
            filteredData={filteredData}
            columns={columnsfile}
            key="الطلبات.xlsx"
            filters={filters}
            params={params}
            setParams={setParams}
          />
        </div>
      )}

      {/* الجدول */}
      <div>
        <CustomeTabel
          defaultSortField="createdAt"
          defaultSortAsc={false}
          data={filteredData}
          columns={columns}
        />
      </div>

      {/* مودال تأكيد الحذف */}
      {deleteId && (
        <PopupCheckdelete
          value={true}
          navigatepage="/ImportOrdear"
          deleteKey="ordears"
          titale="الطلب"
          id={deleteId}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default ImportOrdaers;