import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiPercent,
  FiDownload,
  FiArrowLeft,
  FiInfo,
} from 'react-icons/fi';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import Loader from '../../../components/common/Loader';
import * as XLSX from 'xlsx';

// دوال مساعدة (مشتركة)
const formatNumber = (num) => {
  if (!num) return '0';
  return Number(num).toLocaleString('ar-EG');
};

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600 bg-green-100';
  if (score >= 80) return 'text-blue-600 bg-blue-100';
  if (score >= 70) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

const getFieldIcon = (field) => {
  const icons = {
    location: <FiMapPin className="w-4 h-4" />,
    propertyType: <FiHome className="w-4 h-4" />,
    firstPayment: <FiDollarSign className="w-4 h-4" />,
    monthly: <FiCalendar className="w-4 h-4" />,
  };
  return icons[field] || <FiTrendingUp className="w-4 h-4" />;
};

const getFieldLabel = (field) => {
  const labels = {
    location: 'الموقع والمنطقة',
    propertyType: 'نوع العقار',
    firstPayment: 'الدفعة الأولى',
    monthly: 'القسط الشهري',
  };
  return labels[field] || field;
};

// مكون عرض العميل المطابق (بطاقة)
const MatchedClientCard = ({ client, onViewProfile }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* رأس البطاقة */}
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{client.customerName}</h4>
              <p className="text-xs text-gray-500">نقاط: {client.score}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(client.score)}`}>
              {client.score}%
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              {expanded ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        </div>

        {/* شارات سريعة */}
        <div className="flex flex-wrap gap-2 mt-2">
          {client.reasons?.map((r, idx) => {
            if (r.field === 'location' && r.score === 30)
              return <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">📍 موقع متطابق</span>;
            if (r.field === 'propertyType' && r.score >= 25)
              return <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🏠 نوع متطابق</span>;
            if (r.field === 'firstPayment' && r.matchPercent >= 80)
              return <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">💰 دفعة {r.matchPercent}%</span>;
            if (r.field === 'monthly' && r.matchPercent >= 80)
              return <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">📅 قسط {r.matchPercent}%</span>;
            return null;
          })}
        </div>
      </div>

      {/* تفاصيل موسعة */}
      {expanded && (
        <div className="border-t p-4 bg-gray-50/50 space-y-4">
          {/* الوحدة المطابقة */}
          <div>
            <h5 className="font-bold text-sm text-gray-700 mb-2">🏢 الوحدة المطابقة</h5>
            <div className="grid grid-cols-2 gap-2 text-sm bg-white rounded-xl p-3 shadow-sm">
              <p><span className="text-gray-500">المشروع:</span> {client.matchedProperty?.projectName || '-'}</p>
              <p><span className="text-gray-500">النوع:</span> {client.matchedProperty?.floorType || '-'} - {client.matchedProperty?.floorTypeFlow || '-'}</p>
              <p><span className="text-gray-500">الحالة:</span> {client.matchedProperty?.propertyStatus || '-'}</p>
              <p><span className="text-gray-500">السعر:</span> {formatNumber(client.matchedProperty?.price)}</p>
              <p><span className="text-gray-500">الدفعة الأولى:</span> {formatNumber(client.matchedProperty?.downPayment)}</p>
              <p><span className="text-gray-500">القسط:</span> {formatNumber(client.matchedProperty?.monthlyInstallment)}</p>
            </div>
          </div>

          {/* أسباب الترشيح */}
          <div>
            <h5 className="font-bold text-sm text-gray-700 mb-2">📊 أسباب الترشيح</h5>
            <div className="space-y-2">
              {client.reasons?.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white rounded-xl p-2 shadow-sm">
                  <div className="text-purple-600 mt-0.5">{getFieldIcon(reason.field)}</div>
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{getFieldLabel(reason.field)}</span>
                      {reason.score && <span className="text-purple-600 font-bold">{reason.score}/30</span>}
                      {reason.matchPercent && <span className="text-purple-600 font-bold">{reason.matchPercent}%</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>العميل: {reason.customerValue || '-'}</span> | <span>الوحدة: {reason.propertyValue || '-'}</span>
                    </div>
                    {reason.matchedVia && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-block mt-1">
                        {reason.matchedVia === 'Exact Match' ? 'مطابقة تامة' : reason.matchedVia === 'Related Match' ? 'مطابقة قريبة' : 'مطابقة جزئية'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onViewProfile(client.customerId)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
          >
            <FiUser className="w-4 h-4" /> عرض الملف الشخصي <FiExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// ✅ مكون محدث للعميل غير المطابق (يعرض متطلبات العميل وأقرب وحدة)
const UnmatchedClientCard = ({ client, onViewProfile }) => {
  const [expanded, setExpanded] = useState(false);
  const closest = client.closestMatch;

  return (
    <div className="bg-white rounded-2xl shadow border p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FiXCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{client.customerName}</h4>
            <p className="text-xs text-gray-500">أعلى نقاط: {client.score || 0}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">غير مطابق</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
      </div>

      {/* أسباب عدم التطابق الموجزة */}
      <div className="mt-2">
        {client.unmatchedReasons?.map((reason, idx) => (
          <span key={idx} className="inline-block text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full m-0.5">
            {reason}
          </span>
        ))}
      </div>

      {/* تفاصيل موسعة */}
      {expanded && (
        <div className="mt-4 border-t pt-4 space-y-4">
          {/* متطلبات العميل */}
          <div>
            <h5 className="font-bold text-sm text-gray-700 mb-2">📋 متطلبات العميل</h5>
            {client.customerRequirements?.length > 0 ? (
              client.customerRequirements.map((req, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
                  <p><span className="text-gray-500">الموقع:</span> {req.rquireLocation || '-'}</p>
                  <p><span className="text-gray-500">المنطقة:</span> {req.requireRegion || '-'}</p>
                  <p><span className="text-gray-500">نوع العقار:</span> {req.require || '-'}</p>
                  <p><span className="text-gray-500">التابع:</span> {req.requireType || '-'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">لا توجد متطلبات مسجلة</p>
            )}
          </div>

          {/* أقرب وحدة مطابقة (جزئياً) */}
          {closest ? (
            <div>
              <h5 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2">
                🏢 أقرب وحدة متاحة (نسبة تطابق {closest.score}%)
              </h5>
              <div className="bg-blue-50 rounded-xl p-3 text-sm space-y-1">
                <p><span className="text-gray-500">المشروع:</span> {closest.property?.projectName || '-'}</p>
                <p><span className="text-gray-500">نوع العقار:</span> {closest.property?.floorType || '-'} - {closest.property?.floorTypeFlow || '-'}</p>
                <p><span className="text-gray-500">السعر:</span> {formatNumber(closest.property?.price)}</p>
                <p><span className="text-gray-500">الدفعة الأولى:</span> {formatNumber(closest.property?.downPayment)}</p>
                <p><span className="text-gray-500">القسط الشهري:</span> {formatNumber(closest.property?.monthlyInstallment)}</p>
                {closest.reasons?.map((r, idx) => (
                  <div key={idx} className="mt-2 text-xs bg-white rounded-lg p-2">
                    <span className="font-medium">{getFieldLabel(r.field)}</span>
                    {r.score ? `: ${r.score}/30` : `: ${r.matchPercent}%`}
                    {r.matchedVia && <span className="mr-2 text-blue-600">({r.matchedVia === 'Exact Match' ? 'مطابق' : r.matchedVia === 'Related Match' ? 'قريب' : 'جزئي'})</span>}
                    <div className="text-gray-500 text-xs">
                      <span>العميل: {r.customerValue || '-'}</span> | <span>الوحدة: {r.propertyValue || '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">لا توجد وحدات متاحة حالياً للتطابق</p>
          )}

          <button
            onClick={() => onViewProfile(client.customerId)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
          >
            <FiUser /> عرض الملف الشخصي <FiExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// المكون الرئيسي للصفحة
const GetReportMatchByid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matched');

  const { data, isError, isLoading } = useQuerygetSpacficIteam("reportsMatch", "reportsMatch", id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
        <p className="text-red-600">حدث خطأ أثناء جلب التقرير</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const report = data.data;
  // ✅ استخدم shortlistUnmatched بدلاً من unmatchedCustomers
  const { summary, matchedCustomers = [], shortlistUnmatched = [] } = report;

  // توجيه لصفحة العميل
  const handleViewProfile = (customerId) => {
    if (customerId) {
      window.open(`/cutomers/${customerId}`, '_blank');
    }
  };

  // تصدير Excel
  const exportToExcel = () => {
    const clients = activeTab === 'matched' ? matchedCustomers : shortlistUnmatched;
    if (clients.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const rows = clients.map((client) => {
      if (activeTab === 'matched') {
        const locReason = client.reasons?.find(r => r.field === 'location');
        const typeReason = client.reasons?.find(r => r.field === 'propertyType');
        const firstReason = client.reasons?.find(r => r.field === 'firstPayment');
        const monthlyReason = client.reasons?.find(r => r.field === 'monthly');
        return {
          'اسم العميل': client.customerName,
          'نسبة المطابقة': `${client.score}%`,
          'المشروع': client.matchedProperty?.projectName || '-',
          'نوع العقار': `${client.matchedProperty?.floorType || '-'} - ${client.matchedProperty?.floorTypeFlow || '-'}`,
          'السعر': formatNumber(client.matchedProperty?.price),
          'الدفعة الأولى': formatNumber(client.matchedProperty?.downPayment),
          'القسط الشهري': formatNumber(client.matchedProperty?.monthlyInstallment),
          'نقاط الموقع': locReason?.score || 0,
          'نقاط النوع': typeReason?.score || 0,
          'نسبة الدفعة الأولى': firstReason?.matchPercent ? `${firstReason.matchPercent}%` : '-',
          'نسبة القسط الشهري': monthlyReason?.matchPercent ? `${monthlyReason.matchPercent}%` : '-',
        };
      } else {
        // ✅ غير المطابقين مع تفاصيل أكثر
        const req = client.customerRequirements?.[0] || {};
        const closest = client.closestMatch;
        return {
          'اسم العميل': client.customerName,
          'أعلى نقاط': `${client.score || 0}%`,
          'الموقع المطلوب': req.rquireLocation || '-',
          'المنطقة المطلوبة': req.requireRegion || '-',
          'نوع العقار المطلوب': req.require || '-',
          'التابع المطلوب': req.requireType || '-',
          'أقرب مشروع': closest?.property?.projectName || '-',
          'أقرب نوع عقار': closest?.property?.floorType ? `${closest.property.floorType} - ${closest.property.floorTypeFlow}` : '-',
          'نسبة التطابق لأقرب وحدة': closest?.score ? `${closest.score}%` : '-',
          'أسباب عدم التطابق': client.unmatchedReasons?.join('، ') || 'غير محدد',
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab === 'matched' ? 'المتطابقين' : 'غير المتطابقين');
    XLSX.writeFile(workbook, `${report.name}_${activeTab}.xlsx`);
  };

  return (
    <div className="space-y-6 p-4">
      {/* زر الرجوع */}
      <button
        onClick={() => navigate('/reportMatch')}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        العودة إلى التقارير
      </button>

      {/* رأس التقرير */}
      <div className="bg-white rounded-3xl shadow border p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{report.name}</h1>
            <p className="text-gray-500 mt-1">
              {report.type === 'weekly' ? 'أسبوعي' : report.type === 'monthly' ? 'شهري' : 'سنوي'} | 
              تم الإنشاء: {new Date(report.generatedAt || report.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              الفترة: {new Date(report.startDate).toLocaleDateString('ar-EG')} - {new Date(report.endDate).toLocaleDateString('ar-EG')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              تحميل Excel
            </button>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{summary?.totalCustomers || 0}</p>
            <p className="text-sm text-gray-500">إجمالي العملاء</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary?.matchedCount || 0}</p>
            <p className="text-sm text-gray-500">مطابقين</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summary?.unmatchedCount || 0}</p>
            <p className="text-sm text-gray-500">غير مطابقين (إجمالي)</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{summary?.avgScore || 0}%</p>
            <p className="text-sm text-gray-500">متوسط النقاط</p>
          </div>
        </div>
        {/* إضافة ملاحظة عن القائمة المختصرة */}
        <div className="mt-3 text-sm text-gray-500 bg-blue-50 rounded-xl p-2 flex items-center gap-2">
          <FiInfo className="text-blue-600" />
          <span>عدد غير المطابقين في القائمة المختصرة: {shortlistUnmatched.length} عميل (الأقرب للتطابق)</span>
        </div>
      </div>

      {/* تبويبات */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('matched')}
          className={`px-6 py-3 font-bold transition-colors relative ${
            activeTab === 'matched'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          المتطابقين ({matchedCustomers.length})
        </button>
        <button
          onClick={() => setActiveTab('unmatched')}
          className={`px-6 py-3 font-bold transition-colors relative ${
            activeTab === 'unmatched'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          غير المتطابقين (قائمة مختصرة - {shortlistUnmatched.length})
        </button>
      </div>

      {/* قائمة العملاء */}
      <div className="space-y-3">
        {activeTab === 'matched' && (
          matchedCustomers.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <p className="text-gray-500">لا يوجد عملاء مطابقين في هذا التقرير</p>
            </div>
          ) : (
            matchedCustomers.map((client, idx) => (
              <MatchedClientCard
                key={client.customerId || idx}
                client={client}
                onViewProfile={handleViewProfile}
              />
            ))
          )
        )}

        {activeTab === 'unmatched' && (
          shortlistUnmatched.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <p className="text-gray-500">لا يوجد عملاء غير مطابقين في القائمة المختصرة</p>
            </div>
          ) : (
            shortlistUnmatched.map((client, idx) => (
              <UnmatchedClientCard
                key={client.customerId || idx}
                client={client}
                onViewProfile={handleViewProfile}
              />
            ))
          )
        )}
      </div>
    </div>
  );
};

export default GetReportMatchByid;