import React, { useMemo } from "react";
import Chart from "react-apexcharts";

const GetReportTypes = ({ data }) => {

  const { categories, series } = useMemo(() => {
    const map = {};
    const allTypes = new Set();

    data?.forEach((item) => {
      // تحويل التاريخ بصيغة بسيطة
      const d = new Date(item.createdAt);
      const date = d.toISOString().split("T")[0]; // YYYY-MM-DD

      const type = item.ReportType;
      allTypes.add(type);

      if (!map[date]) map[date] = {};
      if (!map[date][type]) map[date][type] = 0;

      map[date][type] += 1;
    });

    const sortedDates = Object.keys(map).sort();

    const finalSeries = Array.from(allTypes).map((type) => ({
      name: type,
      data: sortedDates.map((date) => map[date][type] || 0),
    }));

    return {
      categories: sortedDates,
      series: finalSeries,
    };
  }, [data]);

  const chartOptions = {
    chart: {
      type: "area",
      stacked: true,     // 👈 شكل احترافي
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories,
      title: { text: "التاريخ" },
    },
    yaxis: {
      title: { text: "عدد التقارير" },
    },
    legend: {
      position: "top",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  return (
    <div className=" w-full">
      <span className="text-lg font-bold mb-2">
        أنواع التقارير حسب التاريخ
      </span>

      <Chart
        options={chartOptions}
        series={series}
        type="area"   // أو "line"
        height={360}
        width="100%"
      />
    </div>
  );
};

export default GetReportTypes;
