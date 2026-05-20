import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

// ترتيب الحالات مع تباعد واضح للحركة
const STATUS_SCORE = {
  "عدم الاتصال": 1,
  "تم التواصل": 2.5,
  "غير محتمل": 4,
  "محتمل": 5.5,
  "قيد التفاوض (على السعر / الشروط)": 7,
  "VIP": 8.5,
  "VIP+": 10,
  "اشترى": 11.5,
};

// ألوان محسنة مع تدرج منطقي
const STATUS_COLORS = {
  "عدم الاتصال": "#EF4444",          // أحمر ساطع - بداية ضعيفة
  "تم التواصل": "#F97316",           // برتقالي
  "غير محتمل": "#F59E0B",            // كهرماني
  "محتمل": "#EAB308",               // أصفر
  "قيد التفاوض (على السعر / الشروط)": "#3B82F6", // أزرق
  "VIP": "#10B981",                  // أخضر زمردي
  "VIP+": "#059669",                // أخضر غامق
  "اشترى": "#8B5CF6",              // بنفسجي - تميز الصفقة
};

// ترتيب الحالات للتسميات
const STATUS_ORDER = [
  "عدم الاتصال",
  "تم التواصل", 
  "غير محتمل",
  "محتمل",
  "قيد التفاوض (على السعر / الشروط)",
  "VIP",
  "VIP+",
  "اشترى"
];

const CustomerStatusTimeline = ({ customer }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  // تجهيز البيانات مع تحسينات
  const { series, timelineData, statusDistribution } = useMemo(() => {
    const sortedData = customer?.SectionFollow
      ?.map(f => ({
        ...f,
        CustomerDealsatuts: f.CustomerDealsatuts?.trim()
      }))
      ?.filter(f => f.CustomerDealsatuts && STATUS_SCORE[f.CustomerDealsatuts])
      ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];

    const chartData = sortedData.map(f => ({
      x: new Date(f.createdAt),
      y: STATUS_SCORE[f.CustomerDealsatuts],
      status: f.CustomerDealsatuts,
      note: f.details || "لا توجد ملاحظات",
      createdAt: f.createdAt,
      fillColor: STATUS_COLORS[f.CustomerDealsatuts],
    }));

    // توزيع الحالات
    const distribution = sortedData.reduce((acc, f) => {
      acc[f.CustomerDealsatuts] = (acc[f.CustomerDealsatuts] || 0) + 1;
      return acc;
    }, {});

    return {
      series: [{
        name: "تطور حالة العميل",
        type: "line",
        data: chartData,
      }],
      timelineData: chartData,
      statusDistribution: distribution
    };
  }, [customer]);

  // الحالة الحالية
  const lastStatus = timelineData[timelineData.length - 1]?.status || "-";
  const currentColor = STATUS_COLORS[lastStatus] || "#6B7280";

  // خيارات الرسم البياني المحسنة
  const options = useMemo(() => ({
    chart: {
      type: "line",
      toolbar: { 
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          pan: true,
        }
      },
      zoom: { enabled: true },
      background: '#FFFFFF',
      events: {
        markerClick: (event, chartContext, { seriesIndex, dataPointIndex }) => {
          setSelectedPoint(timelineData[dataPointIndex]);
        }
      }
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ['#6B7280'],
      dashArray: 0,
    },
    markers: {
      size: 8,
      hover: {
        size: 12,
      },
      strokeWidth: 2,
      strokeColors: "#FFFFFF",
      colors: timelineData.map(p => p.fillColor),
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 5,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: true }
      }
    },
    xaxis: {
      type: "datetime",
      title: { 
        text: "تاريخ المتابعة",
        style: { fontSize: "14px", fontWeight: "600", color: "#374151" }
      },
      labels: {
        style: { fontSize: "12px", colors: "#6B7280" },
        format: 'dd MMM yyyy',
      },
      axisBorder: { show: true, color: '#E5E7EB' },
      axisTicks: { show: true, color: '#E5E7EB' },
    },
    yaxis: {
      min: 0,
      max: 13,
      tickAmount: 8,
      labels: {
        formatter: (val) => {
          const status = Object.entries(STATUS_SCORE).find(
            ([_, score]) => Math.abs(score - val) < 0.7
          )?.[0] || "";
          return status.length > 15 ? status.substring(0, 12) + "..." : status;
        },
        style: { fontSize: "11px", fontWeight: "500", colors: "#4B5563" },
        offsetX: 10,
      },
      axisBorder: { show: true, color: '#E5E7EB' },
      axisTicks: { show: true, color: '#E5E7EB' },
      title: { 
        text: "مسار التطور", 
        style: { fontSize: "14px", fontWeight: "600", color: "#374151" },
        rotate: -90,
        offsetX: -10,
        offsetY: 0
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ dataPointIndex }) => {
        const point = timelineData[dataPointIndex];
        if (!point) return '<div></div>';
        
        return `
          <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-right: 4px solid ${point.fillColor}">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: ${point.fillColor};"></div>
              <span style="font-weight: bold; color: #111827;">${point.status}</span>
            </div>
            <div style="color: #6B7280; font-size: 12px; margin-bottom: 4px;">
              📅 ${new Date(point.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="color: #374151; font-size: 13px; margin-top: 8px; max-width: 250px;">
              <span style="font-weight: 500;">ملاحظة:</span> ${point.note}
            </div>
          </div>
        `;
      },
    },
    dataLabels: {
      enabled: false, // إيقاف التسميات المزدحمة
    },
    annotations: {
      yaxis: STATUS_ORDER.map((status, index) => ({
        y: STATUS_SCORE[status],
        borderColor: STATUS_COLORS[status],
        label: {
          borderColor: STATUS_COLORS[status],
          style: {
            color: '#FFFFFF',
            background: STATUS_COLORS[status],
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '12px',
          },
          text: status,
          position: 'left',
          offsetX: -20,
        },
      })),
    },
  }), [timelineData]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* الهيدر مع الحالة الحالية */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-2xl">📊</span> 
            رحلة العميل
          </h3>
          <p className="text-sm text-gray-500">
            تتبع تطور حالة العميل عبر المتابعات
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            إجمالي المتابعات: 
            <span className="font-bold mr-1 text-gray-900">{timelineData.length}</span>
          </div>
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm"
            style={{ background: `${currentColor}15` }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: currentColor }}></span>
            <span className="font-medium text-gray-700">الحالة الحالية:</span>
            <span className="font-bold" style={{ color: currentColor }}>{lastStatus}</span>
          </div>
        </div>
      </div>

      {/* لوحة الألوان - شرح الحالات */}
      <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: STATUS_COLORS[status] }}
            ></div>
            <span className="text-xs text-gray-700 font-medium truncate" title={status}>
              {status}
            </span>
            {statusDistribution[status] && (
              <span className="text-xs bg-white px-1.5 py-0.5 rounded-full text-gray-600">
                {statusDistribution[status]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* الرسم البياني */}
      <div className="bg-white rounded-xl p-2">
        <Chart 
          options={options} 
          series={series} 
          type="line" 
          height={450} 
        />
      </div>

      {/* تفاصيل النقطة المحددة */}
      {selectedPoint && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedPoint.fillColor }}
              ></div>
              <div>
                <span className="font-bold text-gray-900">{selectedPoint.status}</span>
                <span className="text-sm text-gray-600 mr-3">
                  - {new Date(selectedPoint.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-gray-700 bg-white p-3 rounded-lg">
            {selectedPoint.note}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerStatusTimeline;