import React, { useState } from 'react';
import CustomeTabel from '../../../components/common/CustomeTabel';
import useQuerygetiteams from '../../../services/Querygetiteams';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import Breadcrumb from '../../../components/common/Breadcrumbs/Breadcrumb';
import { GrFormView } from 'react-icons/gr';
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from 'date-fns';
import useQueryDelete from '../../../services/useQueryDelete';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import useQueryupdate from '../../../services/useQueryupdate';
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCube,
  HiOutlineLink,
  HiOutlineScale,
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineSave,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

const ImportRequests = () => {
  // ============ Hooks ============
  const { data, isLoading, isError, refetch } = useQuerygetiteams(
    'importRequest',
    'importRequest'
  );

  const { deleteIteam } = useQueryDelete('importRequest', 'importRequest');

  const { updateiteam, isLoading: loadingUpdate } = useQueryupdate(
    'importRequest',
    'importRequest'
  );

  const { CanDelte, isAdmin, CanAdd, CanEdit } = useGetUserAuthentications('Administration');

  // ============ Local State ============
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    mobile: '',
    productName: '',
    productLink: '',
    quantity: '',
    manufacturerCountry: '',
    deliveryCity: '',
    additionalDetails: '',
    status: 'pending',
  });

  // ============ Handlers ============
  const handleView = (row) => {
    setSelectedItem(row);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedItem(null);
  };

  const handleEditOpen = (row) => {
    setSelectedItem(row);
    setEditForm({
      name: row?.name || '',
      mobile: row?.mobile || '',
      productName: row?.productName || '',
      productLink: row?.productLink || '',
      quantity: row?.quantity || '',
      manufacturerCountry: row?.manufacturerCountry || '',
      deliveryCity: row?.deliveryCity || '',
      additionalDetails: row?.additionalDetails || '',
      status: row?.status || 'pending',
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem?._id) return;

    updateiteam(
      { id: selectedItem._id, data: editForm },
      {
        onSuccess: () => {
          toast.success('تم تحديث الطلب بنجاح');
          handleCloseEditModal();
          refetch?.();
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            'حدث خطأ أثناء تحديث الطلب';
          toast.error(msg);
        },
      }
    );
  };

  // تغيير الحالة مباشرة من الجدول
  const handleStatusChange = (id, newStatus) => {
    updateiteam(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success('تم تغيير حالة الطلب');
          refetch?.();
        },
        onError: () => toast.error('تعذر تحديث الحالة'),
      }
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    deleteIteam(id, {
      onSuccess: () => {
        toast.success('تم حذف الطلب بنجاح');
        refetch?.();
      },
      onError: () => toast.error('تعذر حذف الطلب'),
    });
  };

  // ============ دالة مساعدة لألوان الحالة ============
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'جديد';
      case 'processing':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتمل';
      case 'canceled':
        return 'ملغي';
      default:
        return 'جديد';
    }
  };

  // ============ أعمدة الجدول ============
  const columns = [
    {
      name: 'الاسم',
      selector: (row) => row?.name || '-',
      cell: (row) => (
        <span className="font-medium text-slate-700">{row?.name || '-'}</span>
      ),
      width: '150px',
      sortable: true,
    },
    {
      name: 'رقم الجوال',
      selector: (row) => row?.mobile || '-',
      cell: (row) => <span dir="ltr">{row?.mobile || '-'}</span>,
      width: '140px',
    },
    {
      name: 'اسم المنتج',
      selector: (row) => row?.productName || '-',
      cell: (row) => (
        <span className="font-medium text-amber-700">{row?.productName || '-'}</span>
      ),
      width: '180px',
      sortable: true,
    },
    {
      name: 'الكمية',
      selector: (row) => row?.quantity || '-',
      cell: (row) => <span>{row?.quantity || '-'}</span>,
      width: '100px',
    },
    {
      name: 'بلد المصنع',
      selector: (row) => row?.manufacturerCountry || '-',
      cell: (row) => (
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
          {row?.manufacturerCountry || '-'}
        </span>
      ),
      width: '130px',
    },
    {
      name: 'مدينة الاستلام',
      selector: (row) => row?.deliveryCity || '-',
      cell: (row) => <span>{row?.deliveryCity || '-'}</span>,
      width: '130px',
    },
    {
      name: 'حالة الطلب',
      width: '160px',
      cell: (row) => {
        const status = row?.status || 'pending';
        return (
          <select
            value={status}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            className={`${getStatusColor(status)} px-2 py-1 rounded-full text-xs font-semibold border outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 cursor-pointer w-full`}
            dir="rtl"
          >
            <option value="pending">جديد</option>
            <option value="processing">قيد المعالجة</option>
            <option value="completed">مكتمل</option>
            <option value="canceled">ملغي</option>
          </select>
        );
      },
      sortable: false,
    },
    {
      name: 'تاريخ الإنشاء',
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <span>
          {row?.createdAt ? format(new Date(row.createdAt), 'dd MMMM, yyyy') : '-'}
        </span>
      ),
      width: '160px',
      sortable: true,
    },
    {
      name: 'إجراء',
      width: '150px',
      cell: (row) => (
        <div className="flex items-center justify-center gap-2 w-full">
          {/* عرض */}
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:text-blue-800 transition"
            title="عرض التفاصيل"
          >
            <GrFormView size={22} />
          </button>

          {/* تعديل */}
          {(isAdmin || CanEdit) && (
            <button
              onClick={() => handleEditOpen(row)}
              className="text-amber-600 hover:text-amber-800 transition"
              title="تعديل"
            >
              <MdOutlineEditNote size={22} />
            </button>
          )}

          {/* حذف */}
          {(isAdmin || CanDelte) && (
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => handleDelete(row._id)}
              title="حذف"
            >
              <AiTwotoneDelete size={22} />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ============ Loading / Error ============
  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        حدث خطأ أثناء تحميل البيانات، يرجى المحاولة لاحقاً.
      </div>
    );
  }

  // ============ Render ============
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full flex justify-between items-center mb-6">
        <Breadcrumb
        //   isAdmin={isAdmin}
        //   CanAdd={CanAdd}
          pageName="طلبات الاستيراد"
        //   to="/ImportRequests/add"
        //   title="إضافة طلب"
        />
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-4 overflow-hidden">
        <CustomeTabel
          data={data?.data?.data || []}
          columns={columns}
          noDataMessage="لا توجد طلبات استيراد حالياً"
        />
      </div>

      {/* ====================================================== */}
      {/*  مودال العرض (View)                                    */}
      {/* ====================================================== */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate__animated animate__fadeInUp">
            <button
              onClick={handleCloseViewModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <HiOutlineX size={26} />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-3 flex items-center gap-2">
              <HiOutlineCheckCircle className="text-amber-500" />
              تفاصيل طلب الاستيراد
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* بيانات العميل */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                  <HiOutlineUser /> بيانات العميل
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p>
                    <span className="font-medium">الاسم:</span>{' '}
                    {selectedItem?.name || '-'}
                  </p>
                  <p>
                    <span className="font-medium">رقم الجوال:</span>{' '}
                    <span dir="ltr">{selectedItem?.mobile || '-'}</span>
                  </p>
                </div>
              </div>

              {/* بيانات المنتج */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                  <HiOutlineCube /> بيانات المنتج
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p>
                    <span className="font-medium">اسم المنتج:</span>{' '}
                    {selectedItem?.productName || '-'}
                  </p>
                  <p>
                    <span className="font-medium">الكمية:</span>{' '}
                    {selectedItem?.quantity || '-'}
                  </p>
                </div>
              </div>

              {/* الشحن */}
              <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                  <HiOutlineGlobeAlt /> معلومات الشحن
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                  <p>
                    <span className="font-medium">بلد المصنع:</span>{' '}
                    {selectedItem?.manufacturerCountry || '-'}
                  </p>
                  <p>
                    <span className="font-medium">مدينة الاستلام:</span>{' '}
                    {selectedItem?.deliveryCity || '-'}
                  </p>
                </div>
              </div>

              {/* رابط المنتج */}
              {selectedItem?.productLink && (
                <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                  <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                    <HiOutlineLink /> رابط المنتج
                  </h3>
                  <a
                    href={selectedItem.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                    dir="ltr"
                  >
                    {selectedItem.productLink}
                  </a>
                </div>
              )}

              {/* تفاصيل إضافية */}
              {selectedItem?.additionalDetails && (
                <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                  <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                    <HiOutlineDocumentText /> تفاصيل إضافية
                  </h3>
                  <p className="text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-lg border">
                    {selectedItem.additionalDetails}
                  </p>
                </div>
              )}

              {/* الحالة والتاريخ */}
              <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                  <p>
                    <span className="font-medium">الحالة:</span>{' '}
                    <span
                      className={`${getStatusColor(
                        selectedItem?.status
                      )} px-3 py-1 rounded-full text-xs font-semibold border inline-block`}
                    >
                      {getStatusLabel(selectedItem?.status)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">تاريخ الإنشاء:</span>{' '}
                    {selectedItem?.createdAt
                      ? format(new Date(selectedItem.createdAt), 'dd MMMM, yyyy - HH:mm')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseViewModal}
                className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition shadow-md"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/*  مودال التعديل (Edit)                                  */}
      {/* ====================================================== */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate__animated animate__fadeInUp">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <HiOutlineX size={26} />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-3 flex items-center gap-2">
              <MdOutlineEditNote className="text-amber-500" size={28} />
              تعديل طلب الاستيراد
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* الصف الأول: الاسم + الجوال */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <HiOutlineUser className="inline-block ml-1 text-amber-500" size={16} />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <HiOutlinePhone className="inline-block ml-1 text-amber-500" size={16} />
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={editForm.mobile}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="رقم الجوال"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* الصف الثاني: اسم المنتج + الكمية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <HiOutlineCube className="inline-block ml-1 text-amber-500" size={16} />
                    اسم المنتج
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={editForm.productName}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="اسم المنتج"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <HiOutlineScale className="inline-block ml-1 text-amber-500" size={16} />
                    الكمية
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="الكمية"
                  />
                </div>
              </div>

              {/* الصف الثالث: بلد المصنع + مدينة الاستلام */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <HiOutlineGlobeAlt className="inline-block ml-1 text-amber-500" size={16} />
                    بلد المصنع
                  </label>
                  <input
                    type="text"
                    name="manufacturerCountry"
                    value={editForm.manufacturerCountry}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="بلد المصنع"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <HiOutlineLocationMarker
                      className="inline-block ml-1 text-amber-500"
                      size={16}
                    />
                    مدينة الاستلام
                  </label>
                  <input
                    type="text"
                    name="deliveryCity"
                    value={editForm.deliveryCity}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    placeholder="مدينة الاستلام"
                  />
                </div>
              </div>

              {/* الصف الرابع: رابط المنتج (كامل) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <HiOutlineLink className="inline-block ml-1 text-amber-500" size={16} />
                  رابط المنتج
                </label>
                <input
                  type="url"
                  name="productLink"
                  value={editForm.productLink}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  placeholder="https://example.com/product"
                  dir="ltr"
                />
              </div>

              {/* الحالة */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <HiOutlineCheckCircle
                    className="inline-block ml-1 text-amber-500"
                    size={16}
                  />
                  حالة الطلب
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition cursor-pointer"
                >
                  <option value="pending">جديد</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="completed">مكتمل</option>
                  <option value="canceled">ملغي</option>
                </select>
              </div>

              {/* تفاصيل إضافية (كامل) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <HiOutlineDocumentText
                    className="inline-block ml-1 text-amber-500"
                    size={16}
                  />
                  تفاصيل إضافية
                </label>
                <textarea
                  name="additionalDetails"
                  rows={3}
                  value={editForm.additionalDetails}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-y"
                  placeholder="تفاصيل إضافية..."
                />
              </div>

              {/* الأزرار */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold shadow-md transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingUpdate ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <HiOutlineSave size={18} />
                      حفظ التعديلات
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportRequests;