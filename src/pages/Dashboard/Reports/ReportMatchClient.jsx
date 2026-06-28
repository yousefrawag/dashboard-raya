import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFile,
  FiCalendar,
  FiUsers,
  FiEye,
  FiTrash2,
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
} from "react-icons/fi";
import useQueryDelete from '../../../services/useQueryDelete';
import useQuerygetiteams from "../../../services/Querygetiteams";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";

const ReportMatchClient = () => {
  const navigate = useNavigate();
  const [hoveredReport, setHoveredReport] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, weekly, monthly, yearly

  // جلب جميع التقارير
  const {
    data: reportsData,
    isLoading,
    isError,
    refetch,
  } = useQuerygetiteams("reportsMatch", "reportsMatch");

  // حذف تقرير
  const { deleteIteam, isLoading: deleteLoading } = useQueryDelete(
    "reportsMatch",
    "reportsMatch"
  );

  // التعامل مع حالة التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  // التعامل مع الأخطاء
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
        <p className="text-red-600">حدث خطأ أثناء جلب التقارير</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

   const reports = Array.isArray(reportsData?.data) ? reportsData.data : [];

  // فلترة التقارير حسب النوع
  const filteredReports = filterType === "all" 
    ? reports 
    : reports.filter(report => report.type === filterType);

  // دالة حذف التقرير
  const handleDelete = async (reportId, reportName) => {
    if (window.confirm(`هل أنت متأكد من حذف التقرير "${reportName}"؟`)) {
      try {
        await deleteIteam(reportId);
        toast.success("تم حذف التقرير بنجاح");
        refetch(); // تحديث القائمة
      } catch (error) {
        toast.error("فشل حذف التقرير");
      }
    }
  };

  // دالة عرض التقرير
  const handleViewReport = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  // تنسيق التاريخ
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // الحصول على لون ونوع التقرير
  const getReportTypeInfo = (type) => {
    const types = {
      weekly: { label: "أسبوعي", color: "bg-blue-100 text-blue-700", icon: "📅" },
      monthly: { label: "شهري", color: "bg-purple-100 text-purple-700", icon: "📊" },
      yearly: { label: "سنوي", color: "bg-green-100 text-green-700", icon: "📈" },
    };
    return types[type] || types.weekly;
  };

  // إذا لم يوجد تقارير
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow border p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <FiFile className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-700">لا توجد تقارير</h3>
        <p className="text-gray-500 mt-2">
          سيتم إنشاء التقارير تلقائياً كل أسبوع وشهر وسنة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 التقارير الدورية</h1>
          <p className="text-gray-500 mt-1">
            إجمالي التقارير: <span className="font-bold text-purple-600">{reports.length}</span>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* فلتر نوع التقرير */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterType === "all"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType("weekly")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterType === "weekly"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              أسبوعي
            </button>
            <button
              onClick={() => setFilterType("monthly")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterType === "monthly"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setFilterType("yearly")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterType === "yearly"
                  ? "bg-white shadow text-green-600"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              سنوي
            </button>
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            تحديث
          </button>
        </div>
      </div>

      {/* عدد النتائج بعد الفلتر */}
      {filterType !== "all" && (
        <div className="text-sm text-gray-500">
          عرض {filteredReports.length} تقرير من نوع {getReportTypeInfo(filterType).label}
        </div>
      )}

      {/* GRID OF CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReports.map((report) => {
          const isHovered = hoveredReport === report._id;
          const typeInfo = getReportTypeInfo(report.type);
          const matchedCount = report.summary?.matchedCount || 0;
          const unmatchedCount = report.summary?.unmatchedCount || 0;
          const totalClients = report.summary?.totalCustomers || 0;
          const avgScore = report.summary?.avgScore || 0;

          return (
            <div
              key={report._id}
              className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredReport(report._id)}
              onMouseLeave={() => setHoveredReport(null)}
            >
              {/* خلفية ملونة في الأعلى حسب النوع */}
              <div
                className={`h-2 ${
                  report.type === "weekly"
                    ? "bg-blue-500"
                    : report.type === "monthly"
                    ? "bg-purple-500"
                    : "bg-green-500"
                }`}
              />

              <div className="p-5">
                {/* أيقونة الملف */}
                <div className="flex justify-between items-start">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      report.type === "weekly"
                        ? "bg-blue-50 text-blue-600"
                        : report.type === "monthly"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    <FiFile className="w-7 h-7" />
                  </div>

                  {/* نوع التقرير */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${typeInfo.color}`}
                  >
                    {typeInfo.icon} {typeInfo.label}
                  </span>
                </div>

                {/* اسم التقرير */}
                <h3 className="font-bold text-lg text-gray-800 mt-3 line-clamp-2">
                  {report.name || `تقرير ${typeInfo.label}`}
                </h3>

                {/* التاريخ */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <FiCalendar className="w-4 h-4 flex-shrink-0" />
                  <span>{formatDate(report.generatedAt || report.createdAt)}</span>
                </div>

                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{totalClients}</p>
                    <p className="text-xs text-gray-500">إجمالي العملاء</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{matchedCount}</p>
                    <p className="text-xs text-gray-500">مطابق</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{unmatchedCount}</p>
                    <p className="text-xs text-gray-500">غير مطابق</p>
                  </div>
                </div>

                {/* متوسط النقاط */}
                {avgScore > 0 && (
                  <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <span className="text-sm text-gray-600">متوسط النقاط</span>
                    <span className="font-bold text-purple-600">{avgScore}%</span>
                  </div>
                )}

                {/* أزرار الإجراءات (تظهر عند التمرير) */}
                <div
                  className={`mt-4 flex gap-2 transition-all duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={() => handleViewReport(report._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
                  >
                    <FiEye className="w-4 h-4" />
                    عرض
                  </button>
                  <button
                    onClick={() => handleDelete(report._id, report.name)}
                    className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* أزرار في وضع عدم التمرير (للجوال) */}
                <div className="mt-4 flex gap-2 lg:hidden">
                  <button
                    onClick={() => handleViewReport(report._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
                  >
                    <FiEye className="w-4 h-4" />
                    عرض
                  </button>
                  <button
                    onClick={() => handleDelete(report._id, report.name)}
                    className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* إذا كانت النتائج بعد الفلتر صفر */}
      {filteredReports.length === 0 && filterType !== "all" && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500">لا توجد تقارير من نوع {getReportTypeInfo(filterType).label}</p>
        </div>
      )}
    </div>
  );
};

export default ReportMatchClient;