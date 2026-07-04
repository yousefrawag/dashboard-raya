import React, { useState, useMemo } from 'react';
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
  FiBarChart2,
  FiFilter,
  FiRefreshCw,
  FiLayers,
  FiFileText,
  FiX,
} from 'react-icons/fi';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import Loader from '../../../components/common/Loader';
import * as XLSX from 'xlsx';
import Chart from 'react-apexcharts';

// ============================================================
// دوال مساعدة (مشتركة)
// ============================================================
const formatNumber = (num) => {
  if (!num) return '0';
  return Number(num).toLocaleString("en-US");
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

// ============================================================
// مكون عرض العميل المطابق (بطاقة)
// ============================================================
const MatchedClientCard = ({ client, onViewProfile }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden hover:shadow-lg transition-shadow duration-300">
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

      {expanded && (
        <div className="border-t p-4 bg-gray-50/50 space-y-4">
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

// ============================================================
// مكون العميل غير المطابق
// ============================================================
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

      <div className="mt-2">
        {client.unmatchedReasons?.map((reason, idx) => (
          <span key={idx} className="inline-block text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full m-0.5">
            {reason}
          </span>
        ))}
      </div>

      {expanded && (
        <div className="mt-4 border-t pt-4 space-y-4">
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

// ============================================================
// مكون المودال لعرض العملاء (معدل مع زر تحميل Excel)
// ============================================================
const ClientsModal = ({ isOpen, onClose, title, customers, onViewProfile }) => {
  if (!isOpen) return null;

  const exportModalToExcel = () => {
    if (!customers || customers.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const rows = customers.map((client) => ({
      'اسم العميل': client.customerName || 'غير محدد',
      'الدفعة الأولى': formatNumber(client.firstPayment || client.matchedProperty?.downPayment || client.closestMatch?.property?.downPayment || 0),
      'القسط الشهري': formatNumber(client.monthlyInstallment || client.matchedProperty?.monthlyInstallment || client.closestMatch?.property?.monthlyInstallment || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'العملاء');
    XLSX.writeFile(workbook, `العملاء_${title.replace(/\s/g, '_')}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <div className="flex items-center gap-2">
            {customers?.length > 0 && (
              <button
                onClick={exportModalToExcel}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
              >
                <FiDownload className="w-4 h-4" />
                تحميل Excel
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              <FiX />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {customers?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا يوجد عملاء</p>
          ) : (
            <div className="space-y-2">
              {customers?.map((client) => (
                <div
                  key={client.customerId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => onViewProfile(client.customerId)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-800">{client.customerName || 'غير محدد'}</span>
                  </div>
                  <div className="text-sm text-gray-500 flex gap-3">
                    <span>دفعة: {formatNumber(client.firstPayment || client.matchedProperty?.downPayment || client.closestMatch?.property?.downPayment || 0)}</span>
                    <span>قسط: {formatNumber(client.monthlyInstallment || client.matchedProperty?.monthlyInstallment || client.closestMatch?.property?.monthlyInstallment || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// المكون الرئيسي للصفحة
// ============================================================
const GetReportMatchByid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCustomers, setModalCustomers] = useState([]);
  const [expandedCombination, setExpandedCombination] = useState(null);

  const [crossFilters, setCrossFilters] = useState({
    propertyType: 'all',
    requireType: 'all',
    location: 'all',
    region: 'all',
    paymentRange: 'all',
  });

  // جلب البيانات
  const { data, isError, isLoading, refetch } = useQuerygetSpacficIteam("reportsMatch", "reportsMatch", id);

  // استخراج البيانات مع قيم افتراضية
  const report = data?.data || {};
  const summary = report.summary || {};
  const matchedCustomers = report.matchedCustomers || [];
  const shortlistUnmatched = report.shortlistUnmatched || [];
  const analytics = report.analytics || {};

  // تحليلات بديلة من البيانات الموجودة
  const byPropertyType = analytics.byPropertyType || [];
  const byLocation = analytics.byLocation || [];
  const byFinancial = analytics.byFinancialAbility || [];
  const byRequireType = analytics.byRequireType || [];

  // التحليلات المتقاطعة (مع بيانات العملاء الكاملة)
  const crossData = analytics.crossTabulation || [];

  // دمج العملاء للمطابقين وغير المطابقين (لا يستخدم للتوليفات)
  const allClients = useMemo(
    () => [...matchedCustomers, ...shortlistUnmatched],
    [matchedCustomers, shortlistUnmatched]
  );

  // استخراج القيم الفريدة من crossData
  const propertyTypes = useMemo(
    () => [...new Set(crossData.map(item => item.require).filter(Boolean))],
    [crossData]
  );
  const requireTypes = useMemo(
    () => [...new Set(crossData.map(item => item.requireType).filter(Boolean))],
    [crossData]
  );
  const locations = useMemo(
    () => [...new Set(crossData.map(item => item.location).filter(Boolean))],
    [crossData]
  );
  const regions = useMemo(
    () => [...new Set(crossData.map(item => item.region).filter(Boolean))],
    [crossData]
  );
  const paymentRanges = useMemo(
    () => [...new Set(crossData.map(item => item.paymentRange).filter(Boolean))],
    [crossData]
  );

  // تصفية التوليفات المتقاطعة حسب الفلتر
  const filteredCrossData = useMemo(() => {
    return crossData.filter(item => {
      if (crossFilters.propertyType !== 'all' && item.require !== crossFilters.propertyType) return false;
      if (crossFilters.requireType !== 'all' && item.requireType !== crossFilters.requireType) return false;
      if (crossFilters.location !== 'all' && item.location !== crossFilters.location) return false;
      if (crossFilters.region !== 'all' && item.region !== crossFilters.region) return false;
      if (crossFilters.paymentRange !== 'all' && item.paymentRange !== crossFilters.paymentRange) return false;
      return true;
    });
  }, [crossData, crossFilters]);

  // ============================================================
  // الرسوم البيانية الأساسية (لحالة عدم وجود crossTabulation)
  // ============================================================

  // 1. رسم بياني حسب نوع العقار
  const chartPropertyOptions = {
    chart: {
      type: 'bar',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const item = byPropertyType[config.dataPointIndex];
          if (item && item.customers?.length) {
            setModalTitle(`العملاء الذين يطلبون ${item.name}`);
            setModalCustomers(item.customers);
            setModalOpen(true);
          }
        }
      }
    },
    xaxis: { categories: byPropertyType.map(item => item.name) },
    colors: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5fd'],
    plotOptions: { bar: { columnWidth: '50%' } },
    dataLabels: { enabled: false },
    title: { text: 'عدد العملاء حسب نوع العقار', align: 'center' },
  };
  const chartPropertySeries = [{ name: 'عدد العملاء', data: byPropertyType.map(item => item.count) }];

  // 2. رسم بياني حسب الموقع
  const chartLocationOptions = {
    chart: {
      type: 'bar',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const item = byLocation[config.dataPointIndex];
          if (item && item.customers?.length) {
            setModalTitle(`العملاء في ${item.name}`);
            setModalCustomers(item.customers);
            setModalOpen(true);
          }
        }
      }
    },
    xaxis: { categories: byLocation.map(item => item.name) },
    colors: ['#34d399', '#6ee7b7', '#a7f3d0', '#86efac', '#4ade80'],
    plotOptions: { bar: { columnWidth: '50%' } },
    dataLabels: { enabled: false },
    title: { text: 'عدد العملاء حسب الموقع', align: 'center' },
  };
  const chartLocationSeries = [{ name: 'عدد العملاء', data: byLocation.map(item => item.count) }];

  // 3. رسم بياني حسب القدرة المالية
  const chartFinancialOptions = {
    chart: {
      type: 'bar',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const item = byFinancial[config.dataPointIndex];
          if (item && item.customers?.length) {
            setModalTitle(`العملاء ذوو دفعة ${item.range}`);
            setModalCustomers(item.customers);
            setModalOpen(true);
          }
        }
      }
    },
    xaxis: { categories: byFinancial.map(item => item.range) },
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'],
    plotOptions: { bar: { columnWidth: '50%' } },
    dataLabels: { enabled: false },
    title: { text: 'عدد العملاء حسب نطاق الدفعة الأولى', align: 'center' },
  };
  const chartFinancialSeries = [{ name: 'عدد العملاء', data: byFinancial.map(item => item.count) }];

  // ============================================================
  // الرسوم البيانية المتقاطعة (عند وجود crossTabulation)
  // ============================================================

  // الرسم البياني الأول: نوع العقار × التابع
  const chart1Data = useMemo(() => {
    const grouped = {};
    filteredCrossData.forEach(item => {
      if (!grouped[item.require]) grouped[item.require] = {};
      if (!grouped[item.require][item.requireType]) {
        grouped[item.require][item.requireType] = { count: 0, customers: [] };
      }
      grouped[item.require][item.requireType].count += item.count;
      grouped[item.require][item.requireType].customers = [
        ...grouped[item.require][item.requireType].customers,
        ...(item.customers || []),
      ];
    });
    return grouped;
  }, [filteredCrossData]);

  const chart1Categories = Object.keys(chart1Data);
  const subTypesSet = new Set();
  Object.values(chart1Data).forEach(obj => Object.keys(obj).forEach(st => subTypesSet.add(st)));
  const subTypes = Array.from(subTypesSet);

  const chart1Series = useMemo(() => {
    return subTypes.map(st => ({
      name: st,
      data: chart1Categories.map(cat => chart1Data[cat]?.[st]?.count || 0),
      customers: chart1Categories.map(cat => chart1Data[cat]?.[st]?.customers || []),
    }));
  }, [chart1Data, chart1Categories, subTypes]);

  const chart1Options = {
    chart: {
      type: 'bar',
      stacked: true,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const seriesIndex = config.seriesIndex;
          const dataPointIndex = config.dataPointIndex;
          const category = chart1Categories[dataPointIndex];
          const subType = subTypes[seriesIndex];
          const customers = chart1Data[category]?.[subType]?.customers || [];
          if (customers.length) {
            setModalTitle(`العملاء (${category} - ${subType})`);
            setModalCustomers(customers);
            setModalOpen(true);
          }
        }
      }
    },
    xaxis: { categories: chart1Categories },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    colors: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5fd'],
    legend: { position: 'bottom' },
    title: { text: 'عدد العملاء حسب نوع العقار والتابع', align: 'center' },
  };
  const chart1SeriesData = chart1Series.map(s => ({ name: s.name, data: s.data }));

  // الرسم البياني الثاني: الموقع × المنطقة
  const chart2Data = useMemo(() => {
    const grouped = {};
    filteredCrossData.forEach(item => {
      if (!grouped[item.location]) grouped[item.location] = {};
      if (!grouped[item.location][item.region]) {
        grouped[item.location][item.region] = { count: 0, customers: [] };
      }
      grouped[item.location][item.region].count += item.count;
      grouped[item.location][item.region].customers = [
        ...grouped[item.location][item.region].customers,
        ...(item.customers || []),
      ];
    });
    return grouped;
  }, [filteredCrossData]);

  const chart2Categories = Object.keys(chart2Data);
  const regionSet = new Set();
  Object.values(chart2Data).forEach(obj => Object.keys(obj).forEach(r => regionSet.add(r)));
  const regionsList = Array.from(regionSet);

  const chart2Series = useMemo(() => {
    return regionsList.map(region => ({
      name: region,
      data: chart2Categories.map(cat => chart2Data[cat]?.[region]?.count || 0),
      customers: chart2Categories.map(cat => chart2Data[cat]?.[region]?.customers || []),
    }));
  }, [chart2Data, chart2Categories, regionsList]);

  const chart2Options = {
    chart: {
      type: 'bar',
      stacked: true,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const seriesIndex = config.seriesIndex;
          const dataPointIndex = config.dataPointIndex;
          const category = chart2Categories[dataPointIndex];
          const region = regionsList[seriesIndex];
          const customers = chart2Data[category]?.[region]?.customers || [];
          if (customers.length) {
            setModalTitle(`العملاء (${category} - ${region})`);
            setModalCustomers(customers);
            setModalOpen(true);
          }
        }
      }
    },
    xaxis: { categories: chart2Categories },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    colors: ['#34d399', '#6ee7b7', '#a7f3d0', '#86efac', '#4ade80'],
    legend: { position: 'bottom' },
    title: { text: 'عدد العملاء حسب الموقع والمنطقة', align: 'center' },
  };
  const chart2SeriesData = chart2Series.map(s => ({ name: s.name, data: s.data }));

  // الرسم البياني الثالث: نطاق الدفعة × نوع العقار
  const chart3Data = useMemo(() => {
    const grouped = {};
    filteredCrossData.forEach(item => {
      if (!grouped[item.paymentRange]) grouped[item.paymentRange] = {};
      if (!grouped[item.paymentRange][item.require]) {
        grouped[item.paymentRange][item.require] = { count: 0, customers: [] };
      }
      grouped[item.paymentRange][item.require].count += item.count;
      grouped[item.paymentRange][item.require].customers = [
        ...grouped[item.paymentRange][item.require].customers,
        ...(item.customers || []),
      ];
    });
    return grouped;
  }, [filteredCrossData]);

  const chart3Categories = Object.keys(chart3Data);
  const propertyTypesSet = new Set();
  Object.values(chart3Data).forEach(obj => Object.keys(obj).forEach(p => propertyTypesSet.add(p)));
  const propertyTypesList = Array.from(propertyTypesSet);

  const chart3Series = useMemo(() => {
    return propertyTypesList.map(pt => ({
      name: pt,
      data: chart3Categories.map(cat => chart3Data[cat]?.[pt]?.count || 0),
      customers: chart3Categories.map(cat => chart3Data[cat]?.[pt]?.customers || []),
    }));
  }, [chart3Data, chart3Categories, propertyTypesList]);

  const chart3Options = {
    chart: {
      type: 'bar',
      stacked: true,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const seriesIndex = config.seriesIndex;
          const dataPointIndex = config.dataPointIndex;
          const category = chart3Categories[dataPointIndex];
          const pt = propertyTypesList[seriesIndex];
          const customers = chart3Data[category]?.[pt]?.customers || [];
          if (customers.length) {
            setModalTitle(`العملاء (دفعة ${category} - ${pt})`);
            setModalCustomers(customers);
            setModalOpen(true);
          }
        }
      }
    },
    xaxis: { categories: chart3Categories },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'],
    legend: { position: 'bottom' },
    title: { text: 'عدد العملاء حسب نطاق الدفعة الأولى ونوع العقار', align: 'center' },
  };
  const chart3SeriesData = chart3Series.map(s => ({ name: s.name, data: s.data }));

  // ============================================================
  // دوال معالجة الأحداث
  // ============================================================
  const handleViewProfile = (customerId) => {
    if (customerId) {
      window.open(`/cutomers/${customerId}`, '_blank');
    }
  };

  // تصدير العملاء من التوليفة إلى Excel
  const exportCombinationToExcel = (item, idx) => {
    const clients = item.customers || [];
    if (clients.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const rows = clients.map((client) => ({
      'اسم العميل': client.customerName || 'غير محدد',
      'الدفعة الأولى': formatNumber(client.firstPayment || 0),
      'القسط الشهري': formatNumber(client.monthlyInstallment || 0),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'العملاء');
    XLSX.writeFile(workbook, `توليفة_${idx + 1}_${item.require}_${item.location}.xlsx`);
  };

  // تصدير العملاء إلى Excel حسب التبويب النشط
  const exportToExcel = () => {
    let clients = [];
    let fileName = '';

    if (activeTab === 'matched') {
      clients = matchedCustomers;
      fileName = 'المتطابقين';
    } else if (activeTab === 'unmatched') {
      clients = shortlistUnmatched;
      fileName = 'غير_المتطابقين';
    } else if (activeTab === 'combinations') {
      const allCustomers = [];
      sortedCrossData.forEach(item => {
        (item.customers || []).forEach(c => {
          allCustomers.push({
            ...c,
            combination: `${item.require} - ${item.requireType} - ${item.location} - ${item.region} - ${item.paymentRange}`,
          });
        });
      });
      clients = allCustomers;
      fileName = 'جميع_العملاء_من_التوليفات';
    } else {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    if (clients.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const rows = clients.map((client) => {
      const base = {
        'اسم العميل': client.customerName || 'غير محدد',
        'المعرف': client.customerId || '-',
      };
      if (activeTab === 'combinations') {
        return {
          ...base,
          'التوليفة': client.combination || '-',
          'الدفعة الأولى': formatNumber(client.firstPayment || 0),
          'القسط الشهري': formatNumber(client.monthlyInstallment || 0),
        };
      }
      if (activeTab === 'matched') {
        const locReason = client.reasons?.find(r => r.field === 'location');
        const typeReason = client.reasons?.find(r => r.field === 'propertyType');
        const firstReason = client.reasons?.find(r => r.field === 'firstPayment');
        const monthlyReason = client.reasons?.find(r => r.field === 'monthly');
        return {
          ...base,
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
      }
      if (activeTab === 'unmatched') {
        const req = client.customerRequirements?.[0] || {};
        const closest = client.closestMatch;
        return {
          ...base,
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
      return base;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${report.name}_${fileName}.xlsx`);
  };

  // ============================================================
  // حالة التحميل والخطأ
  // ============================================================
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
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const shortlistCount = shortlistUnmatched.length;

  // ترتيب التوليفات تنازلياً حسب عدد العملاء
  const sortedCrossData = [...filteredCrossData].sort((a, b) => b.count - a.count);

  // ============================================================
  // عرض الصفحة
  // ============================================================
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
              <FiFileText className="w-4 h-4" />
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
        <div className="mt-3 text-sm text-gray-500 bg-blue-50 rounded-xl p-2 flex items-center gap-2">
          <FiInfo className="text-blue-600" />
          <span>عدد غير المطابقين في القائمة المختصرة: {shortlistCount} عميل (الأقرب للتطابق)</span>
        </div>
      </div>

      {/* تبويبات */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-bold transition-colors ${
            activeTab === 'analytics'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiBarChart2 className="inline ml-1" /> تحليلات
        </button>
        <button
          onClick={() => setActiveTab('combinations')}
          className={`px-6 py-3 font-bold transition-colors ${
            activeTab === 'combinations'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiLayers className="inline ml-1" /> التوليفات ({crossData.length})
        </button>
        <button
          onClick={() => setActiveTab('matched')}
          className={`px-6 py-3 font-bold transition-colors ${
            activeTab === 'matched'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          المتطابقين ({matchedCustomers.length})
        </button>
        <button
          onClick={() => setActiveTab('unmatched')}
          className={`px-6 py-3 font-bold transition-colors ${
            activeTab === 'unmatched'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          غير المتطابقين (قائمة مختصرة - {shortlistCount})
        </button>
      </div>

      {/* ============================================================ */}
      {/* تبويب التحليلات */}
      {/* ============================================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {crossData.length > 0 ? (
            // ✅ وجود crossTabulation: عرض التحليلات المتقاطعة
            <>
              {/* فلتر متقدم */}
              <div className="bg-white rounded-3xl shadow border p-6">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <FiFilter className="text-purple-600" />
                  فلتر التحليلات المتقاطعة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">نوع العقار</label>
                    <select
                      className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300"
                      value={crossFilters.propertyType}
                      onChange={(e) => setCrossFilters({...crossFilters, propertyType: e.target.value})}
                    >
                      <option value="all">الكل</option>
                      {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">التابع</label>
                    <select
                      className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300"
                      value={crossFilters.requireType}
                      onChange={(e) => setCrossFilters({...crossFilters, requireType: e.target.value})}
                    >
                      <option value="all">الكل</option>
                      {requireTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">الموقع</label>
                    <select
                      className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300"
                      value={crossFilters.location}
                      onChange={(e) => setCrossFilters({...crossFilters, location: e.target.value})}
                    >
                      <option value="all">الكل</option>
                      {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">المنطقة</label>
                    <select
                      className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300"
                      value={crossFilters.region}
                      onChange={(e) => setCrossFilters({...crossFilters, region: e.target.value})}
                    >
                      <option value="all">الكل</option>
                      {regions.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">نطاق الدفعة</label>
                    <select
                      className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300"
                      value={crossFilters.paymentRange}
                      onChange={(e) => setCrossFilters({...crossFilters, paymentRange: e.target.value})}
                    >
                      <option value="all">الكل</option>
                      {paymentRanges.map(range => <option key={range} value={range}>{range}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setCrossFilters({
                      propertyType: 'all',
                      requireType: 'all',
                      location: 'all',
                      region: 'all',
                      paymentRange: 'all',
                    })}
                    className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                  >
                    إعادة تعيين
                  </button>
                  <span className="text-sm text-gray-500 flex items-center">
                    عدد التوليفات الظاهرة: <strong className="text-purple-600 mr-1">{filteredCrossData.length}</strong>
                  </span>
                </div>
              </div>

              {/* الرسوم البيانية المتقاطعة */}
              {filteredCrossData.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-8 text-center">
                  <p className="text-gray-500">لا توجد توليفات تطابق الفلتر المحدد</p>
                  <button
                    onClick={() => setCrossFilters({
                      propertyType: 'all',
                      requireType: 'all',
                      location: 'all',
                      region: 'all',
                      paymentRange: 'all',
                    })}
                    className="mt-3 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200"
                  >
                    إعادة تعيين الفلتر
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white rounded-3xl shadow border p-4">
                    <Chart options={chart1Options} series={chart1SeriesData} type="bar" height={350} />
                    <p className="text-xs text-gray-400 text-center mt-2">اضغط على أي عمود لعرض العملاء</p>
                  </div>
                  <div className="bg-white rounded-3xl shadow border p-4">
                    <Chart options={chart2Options} series={chart2SeriesData} type="bar" height={350} />
                    <p className="text-xs text-gray-400 text-center mt-2">اضغط على أي عمود لعرض العملاء</p>
                  </div>
                  <div className="bg-white rounded-3xl shadow border p-4">
                    <Chart options={chart3Options} series={chart3SeriesData} type="bar" height={350} />
                    <p className="text-xs text-gray-400 text-center mt-2">اضغط على أي عمود لعرض العملاء</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-4 text-center">
                <p className="text-yellow-700">⚠️ التحليلات المتقاطعة غير متوفرة حالياً.</p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 flex items-center gap-2 mx-auto"
                >
                  <FiRefreshCw className="w-4 h-4" /> إعادة تحميل التقرير
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {byPropertyType.length > 0 && (
                  <div className="bg-white rounded-3xl shadow border p-4">
                    <Chart options={chartPropertyOptions} series={chartPropertySeries} type="bar" height={280} />
                    <p className="text-xs text-gray-400 text-center mt-2">اضغط على أي عمود لعرض العملاء</p>
                  </div>
                )}
                {byLocation.length > 0 && (
                  <div className="bg-white rounded-3xl shadow border p-4">
                    <Chart options={chartLocationOptions} series={chartLocationSeries} type="bar" height={280} />
                    <p className="text-xs text-gray-400 text-center mt-2">اضغط على أي عمود لعرض العملاء</p>
                  </div>
                )}
                {byFinancial.length > 0 && (
                  <div className="bg-white rounded-3xl shadow border p-4 md:col-span-2">
                    <Chart options={chartFinancialOptions} series={chartFinancialSeries} type="bar" height={280} />
                    <p className="text-xs text-gray-400 text-center mt-2">اضغط على أي عمود لعرض العملاء</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* تبويب التوليفات */}
      {/* ============================================================ */}
      {activeTab === 'combinations' && (
        <div className="space-y-4">
          {crossData.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8 text-center">
              <p className="text-yellow-700">⚠️ لا توجد توليفات متاحة في هذا التقرير.</p>
            </div>
          ) : sortedCrossData.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <p className="text-gray-500">لا توجد توليفات تطابق الفلتر المحدد</p>
            </div>
          ) : (
            sortedCrossData.map((item, idx) => {
              const clients = item.customers || [];
              const isExpanded = expandedCombination === idx;

              return (
                <div key={idx} className="bg-white rounded-2xl shadow border overflow-hidden transition-all hover:shadow-md">
                  <div
                    className="p-4 cursor-pointer flex flex-wrap justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedCombination(isExpanded ? null : idx)}
                  >
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-bold text-purple-600">{item.require}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-gray-700">{item.requireType}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-blue-600">{item.location}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-gray-700">{item.region}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-green-600">{item.paymentRange}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {clients.length} {clients.length === 1 ? 'عميل' : 'عملاء'}
                      </span>
                      <div className="flex items-center gap-2">
                        {clients.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportCombinationToExcel(item, idx);
                            }}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="تحميل Excel"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                        )}
                        <span className="text-gray-400">{isExpanded ? <FiChevronUp /> : <FiChevronDown />}</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t p-4 bg-gray-50/50">
                      <div className="space-y-2">
                        {clients.length === 0 ? (
                          <p className="text-gray-400 text-sm">لا يوجد عملاء</p>
                        ) : (
                          clients.map(client => (
                            <div
                              key={client.customerId}
                              className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                              onClick={() => handleViewProfile(client.customerId)}
                            >
                              <div className="flex items-center gap-3">
                                <FiUser className="text-purple-600" />
                                <span className="font-medium text-gray-800">{client.customerName}</span>
                              </div>
                              <div className="text-sm text-gray-500 flex gap-3">
                                <span>دفعة: {formatNumber(client.firstPayment || 0)}</span>
                                <span>قسط: {formatNumber(client.monthlyInstallment || 0)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          {crossData.length > 0 && (
            <div className="text-sm text-gray-500 text-center pt-2">
              إجمالي عدد التوليفات: {sortedCrossData.length} | إجمالي العملاء المشمولين:{' '}
              {sortedCrossData.reduce((sum, item) => sum + (item.customers?.length || 0), 0)}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* تبويب المتطابقين */}
      {/* ============================================================ */}
      {activeTab === 'matched' && (
        <div className="space-y-3">
          {matchedCustomers.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <p className="text-gray-500">لا يوجد عملاء مطابقين</p>
            </div>
          ) : (
            matchedCustomers.map((client, idx) => (
              <MatchedClientCard
                key={client.customerId || idx}
                client={client}
                onViewProfile={handleViewProfile}
              />
            ))
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* تبويب غير المتطابقين */}
      {/* ============================================================ */}
      {activeTab === 'unmatched' && (
        <div className="space-y-3">
          {shortlistUnmatched.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <p className="text-gray-500">لا يوجد عملاء غير مطابقين</p>
            </div>
          ) : (
            shortlistUnmatched.map((client, idx) => (
              <UnmatchedClientCard
                key={client.customerId || idx}
                client={client}
                onViewProfile={handleViewProfile}
              />
            ))
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* مودال عرض العملاء */}
      {/* ============================================================ */}
      <ClientsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        customers={modalCustomers}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
};

export default GetReportMatchByid;