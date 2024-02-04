// import React, { useState, useEffect } from "react";
// import { Chart } from "primereact/chart";

// const PaymentChart = ({ data, labels }) => {
//   const [chartData, setChartData] = useState({});
//   const [chartOptions, setChartOptions] = useState({});

//   useEffect(() => {
//     const documentStyle = getComputedStyle(document.documentElement);

//     // Check if data array is empty
//     const isEmptyData = data.length === 0;
//     const defaultLabels = ["بدون داده"];
//     const defaultData = [1];
//     const defaultColor = "#999999";

//     const pieData = {
//       labels: isEmptyData ? defaultLabels : labels,
//       datasets: [
//         {
//           data: isEmptyData ? defaultData : data,
//           backgroundColor: isEmptyData
//             ? [defaultColor]
//             : ["#116A7B", "#e3cfb1", "#CD5C08"],
//           hoverBackgroundColor: isEmptyData
//             ? [defaultColor]
//             : ["#0d4f5c", "#a19889", "#b45309"],
//         },
//       ],
//     };

//     const options = {
//       responsive: true,
//       maintainAspectRatio: false,
//       cutout: "60%",
//       plugins: {
//         title: {
//           display: true,
//           text: "بررسی وضعیت پرداخت ها",
//           padding: {
//             top: 0,
//             bottom: 20,
//           },
//           font: {
//             size: 16,
//             family: "iranyekan",
//           },
//         },
//         legend: {
//           position: "bottom",
//           labels: {
//             font: {
//               size: 13,
//               family: "iranyekan",
//             },
//             usePointStyle: true,
//           },
//           padding: {
//             top: 20,
//             bottom: 0,
//           },
//         },
//       },
//     };

//     setChartData(pieData);
//     setChartOptions(options);
//   }, [labels, data]);

//   return (
//     <>
//       <div className="card flex justify-content-center p-4 mb-0">
//         <Chart
//           type="doughnut"
//           data={chartData}
//           options={chartOptions}
//           className="w-full"
//         />
//       </div>
//     </>
//   );
// };

// export default PaymentChart;

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const PaymentChart = ({ data, labels }) => {
  const [chartData, setChartData] = useState([]);

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const entry = chartData[index];
    console.log({ entry });
    const radius = innerRadius + (outerRadius - innerRadius) * 0.85;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy - 6.65 + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-center">
        {entry.value.toLocaleString()}
      </text>
    );
  };


  useEffect(() => {
    // Check if data array is empty
    const isEmptyData = data.length === 0;
    const defaultData = [{ name: "بدون داده", value: 1, fill: "#999999" }];
    const defaultColors = ["#116A7B", "#e3cfb1", "#CD5C08"];

    const pieData = isEmptyData
      ? defaultData
      : data.map((value, index) => ({
        name: labels[index] || `Category ${index + 1}`,
        value,
        fill: defaultColors[index] || "#999999",
      }));

    setChartData(pieData);
  }, [labels, data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            paddingTop: "20px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentChart;