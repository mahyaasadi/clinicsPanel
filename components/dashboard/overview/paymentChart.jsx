import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

const PaymentChart = ({ data, labels }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const pieData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["#116A7B", "#e3cfb1", "#CD5C08"],
          hoverBackgroundColor: ["#0d4f5c", "#a19889", "#b45309"],
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        title: {
          display: true,
          text: "بررسی وضعیت پرداخت ها",
          padding: {
            top: 0,
            bottom: 20,
          },
          font: {
            size: 16,
            family: "iranyekan",
          },
        },
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: 13,
              family: "iranyekan",
            },
            usePointStyle: true,
          },
          padding: {
            top: 20,
            bottom: 0,
          },
        },
      },
    };

    setChartData(pieData);
    setChartOptions(options);
  }, [labels, data]);

  return (
    <>
      <div className="card flex justify-content-center p-4 mb-0">
        <Chart
          type="doughnut"
          data={chartData}
          options={chartOptions}
          className="w-full"
        />
      </div>
    </>
  );
};

export default PaymentChart;