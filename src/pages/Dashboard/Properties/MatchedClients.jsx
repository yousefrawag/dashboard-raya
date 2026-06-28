import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";
import {
  FiUser,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiPercent,
  FiDownload, // ✅ أضفنا أيقونة التحميل
} from 'react-icons/fi';

const MatchedClients = ({ MatchedClientsdata, matchLoading }) => {
  const navigate = useNavigate();
  const [expandedClient, setExpandedClient] = useState(null);
  const [sortBy, setSortBy] = useState('score');

  // التحقق من وجود البيانات
  if (matchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>جاري التحميل ...</span>
      </div>
    );
  }

  const clients = MatchedClientsdata?.data || [];
  const totalMatched = MatchedClientsdata?.totalMatched || 0;

  // ترتيب العملاء حسب الاختيار
  const sortedClients = [...clients].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'name') return a.customerName.localeCompare(b.customerName);
    if (sortBy === 'payment') {
      const aDiff = Math.abs(a.matchedProperty.downPayment - a.reasons.find(r => r.field === 'firstPayment')?.customerValue || 0);
      const bDiff = Math.abs(b.matchedProperty.downPayment - b.reasons.find(r => r.field === 'firstPayment')?.customerValue || 0);
      return aDiff - bDiff;
    }
    return 0;
  });

  // توجيه إلى صفحة العميل (تصحيح المسار)
  const handleClientClick = (customerId) => {
    if (customerId) {
      window.open(`/cutomers/${customerId}`, '_blank'); // تم تصحيح الإملاء
    }
  };

  // الحصول على لون الـ Score
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // الحصول على أيقونة الحقل
  const getFieldIcon = (field) => {
    const icons = {
      location: <FiMapPin className="w-4 h-4" />,
      propertyType: <FiHome className="w-4 h-4" />,
      firstPayment: <FiDollarSign className="w-4 h-4" />,
      monthly: <FiCalendar className="w-4 h-4" />,
    };
    return icons[field] || <FiTrendingUp className="w-4 h-4" />;
  };

  // الحصول على اسم الحقل بالعربي
  const getFieldLabel = (field) => {
    const labels = {
      location: 'الموقع والمنطقة',
      propertyType: 'نوع العقار',
      firstPayment: 'الدفعة الأولى',
      monthly: 'القسط الشهري',
    };
    return labels[field] || field;
  };

  // تنسيق الأرقام
  const formatNumber = (num) => {
    return Number(num).toLocaleString('ar-EG');
  };

  // ✅ دالة تصدير Excel
  const exportToExcel = () => {
    if (sortedClients.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const rows = sortedClients.map((client) => {
      const locationReason = client.reasons.find(r => r.field === 'location');
      const typeReason = client.reasons.find(r => r.field === 'propertyType');
      const firstPaymentReason = client.reasons.find(r => r.field === 'firstPayment');
      const monthlyReason = client.reasons.find(r => r.field === 'monthly');

      return {
        'اسم العميل': client.customerName,
        'نسبة المطابقة': `${client.score}%`,
        'المشروع': client.matchedProperty.projectName,
        'نوع العقار': `${client.matchedProperty.floorType} - ${client.matchedProperty.floorTypeFlow}`,
        'الحالة': client.matchedProperty.propertyStatus,
        'السعر': formatNumber(client.matchedProperty.price),
        'الدفعة الأولى': formatNumber(client.matchedProperty.downPayment),
        'القسط الشهري': formatNumber(client.matchedProperty.monthlyInstallment),
        'الموقع (العميل)': locationReason?.customerValue || 'N/A',
        'الموقع (الوحدة)': locationReason?.propertyValue || 'N/A',
        'نقاط الموقع': locationReason?.score || 0,
        'نوع العقار (العميل)': typeReason?.customerValue || 'N/A',
        'نوع العقار (الوحدة)': typeReason?.propertyValue || 'N/A',
        'نقاط النوع': typeReason?.score || 0,
        'الدفعة الأولى (العميل)': firstPaymentReason?.customerValue || 'N/A',
        'الدفعة الأولى (الوحدة)': firstPaymentReason?.propertyValue || 'N/A',
        'نسبة الدفعة الأولى': firstPaymentReason?.matchPercent ? `${firstPaymentReason.matchPercent}%` : 'N/A',
        'القسط الشهري (العميل)': monthlyReason?.customerValue || 'N/A',
        'القسط الشهري (الوحدة)': monthlyReason?.propertyValue || 'N/A',
        'نسبة القسط الشهري': monthlyReason?.matchPercent ? `${monthlyReason.matchPercent}%` : 'N/A',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 25 }, { wch: 12 }, { wch: 30 }, { wch: 25 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 25 },
      { wch: 12 }, { wch: 25 }, { wch: 25 }, { wch: 12 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'العملاء المطابقين');
    XLSX.writeFile(workbook, `العملاء_المطابقين_${new Date().toLocaleDateString('ar-EG')}.xlsx`);
  };

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow border p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <FiUser className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-700">لا يوجد عملاء مطابقين</h3>
        <p className="text-gray-500 mt-2">لم نجد عملاء مناسبين لهذه الوحدة حالياً</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER WITH STATS */}
      <div className="bg-white rounded-3xl shadow border p-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              العملاء المطابقين
            </h2>
            <p className="text-gray-500 mt-1">
              {totalMatched} عميل مناسب من إجمالي العملاء
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {/* ✅ زر تحميل Excel */}
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              تحميل Excel
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-purple-300 outline-none"
            >
              <option value="score">ترتيب حسب النقاط</option>
              <option value="name">ترتيب حسب الاسم</option>
              <option value="payment">أقرب دفعة أولى</option>
            </select>
          </div>
        </div>
      </div>

      {/* CLIENTS LIST */}
      <div className="space-y-4">
        {sortedClients.map((client, index) => {
          const isExpanded = expandedClient === client.customerId;
          const firstPaymentReason = client.reasons.find(r => r.field === 'firstPayment');
          const monthlyReason = client.reasons.find(r => r.field === 'monthly');
          const locationReason = client.reasons.find(r => r.field === 'location');
          const typeReason = client.reasons.find(r => r.field === 'propertyType');

          return (
            <div
              key={client.customerId || index}
              className="bg-white rounded-3xl shadow border overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* CLIENT CARD HEADER */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => handleClientClick(client.customerId)}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* العميل */}
                  <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <FiUser className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 hover:text-purple-600 transition-colors">
                        {client.customerName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiExternalLink className="w-3 h-3" />
                        اضغط لعرض الملف الشخصي
                      </p>
                    </div>
                  </div>

                  {/* SCORE */}
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-2xl font-bold ${getScoreColor(client.score)}`}>
                      <span className="text-2xl">{client.score}</span>
                      <span className="text-sm mr-1">%</span>
                    </div>

                    {/* زر التوسيع */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedClient(isExpanded ? null : client.customerId);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isExpanded ? (
                        <FiChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUMMARY BADGES */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {/* الموقع */}
                  {locationReason && locationReason.score === 30 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      <FiCheckCircle className="w-4 h-4" />
                      الموقع متطابق
                    </span>
                  )}

                  {/* النوع */}
                  {typeReason && typeReason.score >= 20 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      <FiCheckCircle className="w-4 h-4" />
                      {typeReason.matchedVia === 'Exact Match' ? 'نوع متطابق' : 'نوع قريب'}
                    </span>
                  )}

                  {/* الدفعة الأولى */}
                  {firstPaymentReason && firstPaymentReason.matchPercent >= 80 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      <FiPercent className="w-4 h-4" />
                      دفعة أولى {formatNumber(firstPaymentReason.matchPercent)}%
                    </span>
                  )}

                  {/* القسط الشهري */}
                  {monthlyReason && monthlyReason.matchPercent >= 80 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                      <FiPercent className="w-4 h-4" />
                      قسط شهري {monthlyReason.matchPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* معلومات الوحدة المطابقة */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FiHome className="text-purple-600" />
                        الوحدة المطابقة
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">المشروع:</span> {client.matchedProperty.projectName}</p>
                        <p><span className="text-gray-500">نوع العقار:</span> {client.matchedProperty.floorType} - {client.matchedProperty.floorTypeFlow}</p>
                        <p><span className="text-gray-500">الحالة:</span> {client.matchedProperty.propertyStatus}</p>
                        <p><span className="text-gray-500">السعر:</span> {formatNumber(client.matchedProperty.price)} </p>
                        <p><span className="text-gray-500">الدفعة الأولى:</span> {formatNumber(client.matchedProperty.downPayment)} </p>
                        <p><span className="text-gray-500">القسط الشهري:</span> {formatNumber(client.matchedProperty.monthlyInstallment)} </p>
                      </div>
                    </div>

                    {/* أسباب الترشيح بالتفصيل */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FiTrendingUp className="text-green-600" />
                        أسباب الترشيح
                      </h4>
                      <div className="space-y-3">
                        {client.reasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-xl">
                            <div className="mt-1 text-purple-600">
                              {getFieldIcon(reason.field)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700 text-sm">
                                  {getFieldLabel(reason.field)}
                                </span>
                                {reason.score && (
                                  <span className="text-xs font-bold text-purple-600">
                                    {reason.score}/30
                                  </span>
                                )}
                                {reason.matchPercent && (
                                  <span className="text-xs font-bold text-purple-600">
                                    {reason.matchPercent}%
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <div className="text-xs">
                                  <span className="text-gray-500">العميل:</span>
                                  <span className="text-gray-700 mr-1">{reason.customerValue}</span>
                                </div>
                                <div className="text-xs">
                                  <span className="text-gray-500">الوحدة:</span>
                                  <span className="text-gray-700 mr-1">{reason.propertyValue}</span>
                                </div>
                              </div>
                              {reason.matchedVia && (
                                <div className="mt-1">
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                    {reason.matchedVia}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* زر عرض الملف الشخصي */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleClientClick(client.customerId)}
                      className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <FiUser className="w-4 h-4" />
                      عرض الملف الشخصي
                      <FiExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchedClients;