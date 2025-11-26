import React from "react";
import Chart from "react-apexcharts";

const GetprojectTypesChart = ({ data , setParams }) => {
  // Process data to get status counts
  const projectStatus = data?.data?.data?.reduce((acc, item) => {
    const status = item?.estateType    ;
  
    
    if (!acc[status]) {
      acc[status] = { status: status, count: 0 };
    }
    acc[status].count += 1;
    return acc;
  }, {});


  // Extract labels and values
  const labels = Object.keys(projectStatus);
  const series = labels.map((status) => projectStatus[status].count);

  // Assign colors dynamically
  const colors = [
    "#FF4560", // Red
    "#008FFB", // Blue
    "#00E396", // Green
    "#FEB019", // Yellow
    "#775DD0", // Purple
  ];

  // ApexCharts options
  const chartOptions = {
    chart: {
      type: "donut",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedStatus = labels[config.dataPointIndex];
          setParams((prev) => ({
            ...prev,
            field: "estateType",
            searchTerm: selectedStatus,
          }));
        },
      },
    },
    labels: labels,
    colors: colors.slice(0, labels.length), // Limit colors to available labels
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
    },
  };

  return (
    <div className="flex items-center flex-col">
      <span className="text-lg font-bold mb-2">أنواع المشاريع</span>
      <Chart options={chartOptions} series={series} type="donut" width="380" />
    </div>
  );
};

export default GetprojectTypesChart;
