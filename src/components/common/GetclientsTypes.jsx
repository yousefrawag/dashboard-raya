import React from "react";
import Chart from "react-apexcharts";

const GetclientsTypes = ({ data, params, setparams }) => {
  // Process data to get status counts
  const projectStatus = data?.reduce((acc, item) => {
    const status = item?.clientStatus;
    if (!acc[status]) {
      acc[status] = { status: status, count: 0 };
    }
    acc[status].count += 1;
    return acc;
  }, {});

  const labels = Object.keys(projectStatus);
  const series = labels.map((status) => projectStatus[status].count);

  const colors = [
    "#FF4560", "#008FFB", "#00E396", "#FEB019", "#775DD0",
  ];

  const chartOptions = {
    chart: {
      type: "donut",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedStatus = labels[config.dataPointIndex];
          setparams((prev) => ({
            ...prev,
            field: "clientStatus",
            searchTerm: selectedStatus,
          }));
        },
      },
    },
    labels: labels,
    colors: colors.slice(0, labels.length),
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };

  return (
    <div className="flex items-center flex-col">
      <span className="text-lg font-bold mb-2">أنواع العملاء</span>
      <Chart options={chartOptions} series={series} type="donut" width="380" />
    </div>
  );
};

export default GetclientsTypes;
