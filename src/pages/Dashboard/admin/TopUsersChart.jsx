import React from "react";
import ReactApexChart from "react-apexcharts";

const TopUsersChart = ({ topUsers }) => {
  if (!topUsers || topUsers.length === 0) return <p>No data available</p>;

  // Extract data for chart
  const names = topUsers.map((user) => user.userDetails.fullName);
  const images = topUsers.map((user) => user.userDetails.imageURL);
  const customersCount = topUsers.map((user) => user.totalCustomers);

  // Chart options
  const options = {
    chart: {
      type: "area",
      height: 400,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "70%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: names,
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        return `<div style="padding:10px; display:flex; align-items:center;">
          <img src="${images[dataPointIndex]}" style="width:30px; height:30px; border-radius:50%; margin-right:10px;" />
          <span>${names[dataPointIndex]}: ${series[seriesIndex][dataPointIndex]} عميل</span>
        </div>`;
      },
    },
  };

  const series = [{ name: "المجموع", data: customersCount }];

  return (
    <div className=" p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">أكثر الموظفين إضافه للعملاء</h2>
      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </div>
  );
};

export default TopUsersChart;
