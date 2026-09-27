import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import {
  FiEye,
  FiEdit2,
  FiPlus,
  FiPackage,
  FiShoppingBag,
} from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

import CustomeTabel from '../../../components/common/CustomeTabel';
import Loader from '../../../components/common/Loader';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import useQueryupdate from '../../../services/useQueryupdate';
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';

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

/* =========================================================
   Component
   ========================================================= */
const GetClientOrdears = ({ clientId }) => {
  /* ==================== Data ==================== */
  const { isLoading, data } = useQuerygetSpacficIteam(
    'ordears/client-ordears',
    'ordears/client-ordears',
    clientId
  );

  const { updateiteam } = useQueryupdate('ordears', 'ordears');
  const { deleteIteam } = useQueryDelete('ordears', 'ordears');
  const { CanAdd, CanEdit, CanDelte, isAdmin } =
    useGetUserAuthentications('Clients');

  /* ==================== Local state ==================== */
  const [deleteId, setDeleteId] = useState(null);

  /* ==================== Filtered orders ==================== */
  const orders = useMemo(() => {
    // دعم أكثر من شكل للـ response
    return (
      data?.data?.data || // { data: { data: [...] } }
      data?.data ||       // { data: [...] }
      []
    );
  }, [data]);

  /* ==================== Handlers ==================== */
  const handelStringLength = (text) => {
    if (!text) return '—';
    return text.length > 20 ? `${text.substring(0, 20)}...` : text;
  };

  const handleStatusChange = (id, newStatus) => {
    try {
      updateiteam(
        { id, data: { status: newStatus } },
        {
          onSuccess: () => toast.success('تم تحديث حالة الطلب'),
          onError: () => toast.error('حدث خطأ أثناء تحديث الحالة'),
        }
      );
    } catch {
      toast.error('حدث خطأ');
    }
  };

  const handelDelateItem = (id) => {
    try {
      deleteIteam(id, {
        onSuccess: () => {
          toast.success('تم حذف الطلب بنجاح');
          setDeleteId(null);
        },
        onError: () => toast.error('حدث خطأ أثناء الحذف'),
      });
    } catch {
      toast.error('هناك خطأ في الحذف - تواصل مع الدعم الفني');
    }
  };

  /* ==================== Columns ==================== */
  const columns = [
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

    /* حالة الطلب */
    {
      name: 'حالة الطلب',
      width: '160px',
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

    /* آخر تحديث */
    {
      name: 'آخر تحديث',
      width: '130px',
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

    /* تاريخ الإنشاء */
    {
      name: 'تاريخ الإنشاء',
      width: '130px',
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

  /* ==================== Render ==================== */
  if (isLoading) return <Loader />;

  /* لا توجد طلبات */
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-main/10 flex items-center justify-center mb-4">
          <FiShoppingBag size={36} className="text-main" />
        </div>
        <p className="text-lg font-semibold text-black dark:text-white mb-1">
          لا توجد طلبات لهذا العميل
        </p>
        <p className="text-sm text-gray-500 mb-5">
          لم يقم هذا العميل بإضافة أي طلبات حتى الآن
        </p>

        {/* {(isAdmin || CanAdd) && (
          <Link
            to={`/ImportOrdear/new?clientId=${clientId}`}
            className="flex items-center gap-2 py-2 px-6 rounded-md bg-main text-white hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> إضافة طلب جديد
          </Link>
        )} */}
      </div>
    );
  }

  /* يوجد طلبات */
  return (
    <div className="space-y-4">
      {/* Header صغير مع عدد الطلبات + زر إضافة */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiPackage className="text-main" />
          <span>
            عدد الطلبات:{' '}
            <strong className="text-black dark:text-white">
              {orders.length}
            </strong>
          </span>
        </div>
{/* 
        {(isAdmin || CanAdd) && (
          <Link
            to={`/ImportOrdear/new?clientId=${clientId}`}
            className="flex items-center gap-2 py-2 px-4 rounded-md bg-main text-white hover:bg-blue-700 transition-colors text-sm"
          >
            <FiPlus size={16} /> إضافة طلب
          </Link>
        )} */}
      </div>

      {/* الجدول */}
      <CustomeTabel
        defaultSortField="createdAt"
        defaultSortAsc={false}
        data={orders}
        columns={columns}
      />

      {/* تأكيد الحذف */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-form-input rounded-xl p-6 w-[90%] max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذه العملية.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button
                onClick={() => handelDelateItem(deleteId)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetClientOrdears;