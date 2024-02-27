import { Chart } from "primereact/chart";

const MedicalParamsChart = ({ data, id }) => {
  let chartData = {
    labels: [],
    datasets: [],
  };

  let paramName = "";
  if (data) {
    paramName = data[0]?.Param?.Name;

    chartData.labels = data?.map((item) => item?.Date);
    chartData.datasets.push({
      label: paramName,
      data: data?.map((item) => item?.Value),
      fill: false,
      borderColor: "#b45309",
      tension: 0.4,
    });
  }

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          fontFamily: "iranyekan",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          fontFamily: "iranyekan",
        },
      },
      y: {
        ticks: {
          fontFamily: "iranyekan",
        },
      },
    },
  };

  if (data) {
    chartData.labels = data?.map((item) => item?.Date);
    chartData.datasets[0].data = data?.map((item) => item?.Value);
  }

  return (
    <div>
      <Chart type="line" data={chartData} options={options} />
    </div>
  );
};

export default MedicalParamsChart;
