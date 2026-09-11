import React, { useState } from 'react';
import CustomeTabel from '../../../components/common/CustomeTabel';
import useQuerygetiteams from '../../../services/Querygetiteams';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import Breadcrumb from '../../../components/common/Breadcrumbs/Breadcrumb';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import { GrFormView } from 'react-icons/gr';
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import useQueryDelete from '../../../services/useQueryDelete';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import useQueryupdate from '../../../services/useQueryupdate';
import { RiFileTransferLine } from 'react-icons/ri';
import { FaFile, FaVideo, FaImage, FaFilePdf, FaFileWord, FaDownload, FaEye } from 'react-icons/fa';

// ✅ دالة لتصنيف الملف حسب الامتداد
const getFileType = (url = '') => {
  const cleanUrl = url.split('?')[0].toLowerCase();
  const ext = cleanUrl.split('.').pop();

  const imageExts = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'];
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'];
  const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (docExts.includes(ext)) return 'doc';
  return 'other';
};

// ✅ أيقونة حسب نوع المستند
const getDocIcon = (url = '') => {
  const ext = url.split('?')[0].toLowerCase().split('.').pop();
  if (ext === 'pdf') return <FaFilePdf className="text-red-500" size={20} />;
  if (ext === 'doc' || ext === 'docx') return <FaFileWord className="text-blue-600" size={20} />;
  return <FaFile className="text-gray-500" size={20} />;
};

const SharedProperty = () => {
  const { data, isLoading, isError } = useQuerygetiteams('sharedProperty', 'sharedProperty');
  const { deleteIteam } = useQueryDelete('sharedProperty', 'sharedProperty');

  const { updateiteam } = useQueryupdate("sharedProperty", "sharedProperty");

  const { updateiteam: ConvertItem } = useQueryupdate("sharedProperty/convert", "sharedProperty");
  const { CanDelte, isAdmin, CanAdd } = useGetUserAuthentications('Administration');

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // فتح نافذة العرض
  const handleView = (row) => {
    setSelectedProperty(row);
    setShowViewModal(true);
  };

  // إغلاق نافذة العرض
  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedProperty(null);
  };

  const ReviewStatushandelr = (id, status) => {
    try {
      const data = { status };
      updateiteam({ id, data }, {
        onSuccess: () => {
          toast.success("تم تغير حالة الطلب");
        },
      });
    } catch (error) { }
  }

  const handleConvertToProject = (id) => {
    try {
      const data = { status: "تحديث" };
      ConvertItem({ id, data }, {
        onSuccess: () => {
          toast.success("تم تحويل الطلب الى مشروع فعلى");
        },
      });
    } catch (error) { }
  }

  // أعمدة الجدول
  const columns = [
    {
      name: 'اسم العميل',
      selector: (row) => row?.client?.fullName || '-',
      width: "150px",
      cell: (row) => (
        <span className="font-medium text-slate-700">{row?.client?.fullName || '-'}</span>
      ),
      sortable: true,
    },
    {
      name: 'البريد الإلكتروني',
      width: "150px",
      selector: (row) => row?.client?.email || '-',
      cell: (row) => <span>{row?.client?.email || '-'}</span>,
    },
    {
      name: 'رقم الجوال',
      width: "150px",
      selector: (row) => row?.client?.phone || '-',
      cell: (row) => <span dir="ltr">{row?.client?.phone || '-'}</span>,
    },
    {
      name: 'حالة الطلب',
      width: "150px",
      cell: (row) => {
        const status = row?.status || 'جديد';

        const getColor = (s) => {
          if (s === 'جديد') return 'bg-blue-100 text-blue-800 border-blue-300';
          if (s === 'تم التواصل') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
          if (s === 'تم الاتفاق') return 'bg-green-100 text-green-800 border-green-300';
          if (s === 'لم يتم الاتفاق') return 'bg-red-100 text-red-800 border-red-300';
          if (s === 'تم تحويله إلى مشروع') return 'bg-purple-100 text-purple-800 border-purple-300';
          return 'bg-gray-100 text-gray-800 border-gray-300';
        };

        const handleChange = (e) => {
          const newStatus = e.target.value;
          ReviewStatushandelr(row._id, newStatus);
        };

        return (
          <select
            value={status}
            onChange={handleChange}
            className={`${getColor(status)} px-2 py-1 rounded-full text-xs font-semibold border outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer w-full`}
            dir="rtl"
          >
            <option value="جديد">جديد</option>
            <option value="تم التواصل">تم التواصل</option>
            <option value="تم الاتفاق">تم الاتفاق</option>
            <option value="لم يتم الاتفاق">لم يتم الاتفاق</option>
            <option value="تم تحويله إلى مشروع">تم تحويله إلى مشروع</option>
          </select>
        );
      },
      sortable: false,
    },
    {
      name: 'نوع العقار',
      selector: (row) => row?.project?.estateType || '-',
      cell: (row) => (
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
          {row?.project?.estateType || '-'}
        </span>
      ),
    },
    {
      name: 'المنطقة',
      selector: (row) => row?.project?.governoate || '-',
      cell: (row) => <span>{row?.project?.governoate || '-'}</span>,
    },
    {
      name: 'حالة العقار',
      selector: (row) => row?.project?.projectSatatus || '-',
      cell: (row) => (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
          {row?.project?.projectSatatus || '-'}
        </span>
      ),
    },
    {
      name: 'نوع العملية',
      selector: (row) => row?.project?.operationType || '-',
      cell: (row) => (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
          {row?.project?.operationType || '-'}
        </span>
      ),
    },
    {
      name: 'نوع العمله',
      selector: (row) => row?.project?.pymentType || '-',
      cell: (row) => (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
          {row?.project?.pymentType || '-'}
        </span>
      ),
    },
    {
      name: 'السعر الإجمالي',
      width: "150px",
      selector: (row) => row?.project?.estatePrice,
      cell: (row) => (
        <span>
          {row?.project?.estatePrice
            ? Number(row.project.estatePrice).toLocaleString()
            : '-'}
        </span>
      ),
    },
    {
      name: 'تاريخ الإنشاء',
      width: "300px",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span>
          {row?.createdAt ? format(new Date(row.createdAt), 'dd MMMM, yyyy') : '-'}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'إجراء',
      selector: (row) => row.procedure,
      cell: (row) => (
        <div className="flex items-center justify-center gap-1 w-full">
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:text-blue-800 transition"
            title="عرض التفاصيل"
          >
            <GrFormView size={22} />
          </button>
          <button
            onClick={() => handleConvertToProject(row._id)}
            className="text-green-600 hover:text-green-800 transition"
            title="تحويل إلى مشروع"
          >
            <RiFileTransferLine size={22} />
          </button>
          {
            isAdmin || CanEdit ? <Link to={`/sharedProperty-edit/${row._id}`} className="hover:text-primary">
              <MdOutlineEditNote size={20} />
            </Link> : null
          }
          {(isAdmin || CanDelte) && (
            <button
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => deleteIteam(row._id)}
              title="حذف"
            >
              <AiTwotoneDelete size={22} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        حدث خطأ أثناء تحميل البيانات، يرجى المحاولة لاحقاً.
      </div>
    );
  }

  // ✅ تصنيف المرفقات
  const allAttachments = selectedProperty?.project?.imagesURLs || [];
  const imagesFiles = allAttachments.filter((f) => getFileType(f?.fileURL) === 'image');
  const videosFiles = allAttachments.filter((f) => getFileType(f?.fileURL) === 'video');
  const docsFiles = allAttachments.filter((f) => getFileType(f?.fileURL) === 'doc');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full flex justify-between items-center mb-6">
        <HeadPagestyle isAdmin={isAdmin} CanAdd={CanAdd} pageName="طلبات المشاريع" to="/SharedProperty/add" title="إضافة طلب" />
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-4 overflow-hidden">
        <CustomeTabel
          data={data?.data?.data || []}
          columns={columns}
          noDataMessage="لا توجد طلبات مشاريع حالياً"
        />
      </div>

      {/* مودال عرض التفاصيل */}
      {showViewModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl transition"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-3">
              تفاصيل طلب المشروع
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* بيانات العميل */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-600 mb-3">بيانات العميل</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">الاسم:</span> {selectedProperty?.client?.fullName || '-'}</p>
                  <p><span className="font-medium">البريد:</span> {selectedProperty?.client?.email || '-'}</p>
                  <p><span className="font-medium">الجوال:</span> {selectedProperty?.client?.phone || '-'}</p>
                  <p><span className="font-medium">الشركة:</span> {selectedProperty?.client?.company || '-'}</p>
                </div>
              </div>

              {/* بيانات المشروع */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-600 mb-3">بيانات المشروع</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">نوع العقار:</span> {selectedProperty?.project?.estateType || '-'}</p>
                  <p><span className="font-medium">المنطقة:</span> {selectedProperty?.project?.governoate || '-'}</p>
                  <p><span className="font-medium">المدينة:</span> {selectedProperty?.project?.city || '-'}</p>
                  <p><span className="font-medium">حالة العقار:</span> {selectedProperty?.project?.projectSatatus || '-'}</p>
                  <p><span className="font-medium">نوع العملية:</span> {selectedProperty?.project?.operationType || '-'}</p>
                </div>
              </div>

              {/* المساحات */}
              <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                <h3 className="text-lg font-semibold text-amber-600 mb-3">المساحات</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><span className="font-medium">المساحة الكلية:</span> {selectedProperty?.project?.areaMatter || '-'} م²</div>
                  <div><span className="font-medium">المساحة الداخلية:</span> {selectedProperty?.project?.internalArea || '-'} م²</div>
                  <div><span className="font-medium">المساحة الخارجية:</span> {selectedProperty?.project?.spaceOuteside || '-'} م²</div>
                  <div><span className="font-medium">نوع الخارجية:</span> {selectedProperty?.project?.typeOfSpaceoutside || '-'}</div>
                </div>
              </div>

              {/* البيانات المالية */}
              <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                <h3 className="text-lg font-semibold text-amber-600 mb-3">البيانات المالية</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><span className="font-medium">العمله:</span> {selectedProperty?.project?.pymentType || '-'}</div>
                  <div><span className="font-medium">السعر الإجمالي:</span> {selectedProperty?.project?.estatePrice ? Number(selectedProperty.project.estatePrice).toLocaleString() : '-'}</div>
                  <div><span className="font-medium">سعر المتر:</span> {selectedProperty?.project?.materPriec ? Number(selectedProperty.project.materPriec).toLocaleString() : '-'}</div>
                  <div><span className="font-medium">الدفعة الأولى:</span> {selectedProperty?.project?.installmentsFirstPyment ? Number(selectedProperty.project.installmentsFirstPyment).toLocaleString() : '-'}</div>
                  <div><span className="font-medium">تقسيط:</span> {selectedProperty?.project?.installments || '-'}</div>
                </div>
              </div>

              {/* تفاصيل إضافية */}
              <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                <h3 className="text-lg font-semibold text-amber-600 mb-3">تفاصيل إضافية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">رقم القطعة:</span> {selectedProperty?.project?.plotNumber || '-'}</div>
                  <div><span className="font-medium">رقم الحوض:</span> {selectedProperty?.project?.basinNumber || '-'}</div>
                </div>
                <div className="mt-3">
                  <span className="font-medium">وصف المشروع:</span>
                  <p className="text-gray-700 mt-1 bg-white p-3 rounded-lg border">
                    {selectedProperty?.project?.projectDetails || '-'}
                  </p>
                </div>
              </div>

              {/* =========================================== */}
              {/* ✅ قسم الصور - منفصل */}
              {/* =========================================== */}
              {imagesFiles.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                  <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                    <FaImage className="text-amber-500" /> صور المشروع
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                      {imagesFiles.length}
                    </span>
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {imagesFiles.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <a
                          href={img.fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative"
                        >
                          <img
                            src={img.fileURL}
                            alt={`صورة ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                            <FaEye className="h-6 w-6 text-white" />
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================== */}
              {/* ✅ قسم الفيديوهات - منفصل */}
              {/* =========================================== */}
              {videosFiles.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                  <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                    <FaVideo className="text-amber-500" /> فيديوهات المشروع
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                      {videosFiles.length}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {videosFiles.map((video, idx) => (
                      <div key={idx} className="relative group">
                        <video
                          src={video.fileURL}
                          controls
                          className="w-full h-48 object-cover rounded-lg border bg-black"
                        />
                        <a
                          href={video.fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-md shadow-md transition"
                          title="فتح في نافذة جديدة"
                        >
                          <FaEye size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================== */}
              {/* ✅ قسم المستندات والملفات - منفصل */}
              {/* =========================================== */}
              {docsFiles.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                  <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
                    <FaFile className="text-amber-500" /> مستندات وملفات المشروع
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                      {docsFiles.length}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {docsFiles.map((doc, idx) => {
                      const fileName = decodeURIComponent(
                        doc.fileURL.split('/').pop().split('?')[0]
                      );
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {getDocIcon(doc.fileURL)}
                            <span
                              className="text-sm text-slate-700 truncate"
                              title={fileName}
                            >
                              {fileName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={doc.fileURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-50 transition"
                              title="عرض"
                            >
                              <FaEye size={16} />
                            </a>
                            <a
                              href={doc.fileURL}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 p-1.5 rounded-md hover:bg-green-50 transition"
                              title="تحميل"
                            >
                              <FaDownload size={16} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* في حال لم يوجد أي مرفق */}
              {allAttachments.length === 0 && (
                <div className="bg-gray-50 p-4 rounded-xl md:col-span-2 text-center text-gray-500 text-sm">
                  لا توجد مرفقات لهذا الطلب
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition shadow-md"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedProperty;