import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { Chart } from "primereact/chart";

const MedicalParamsList = ({
  data,
  id,
  openMedicalParamModal,
  measurementData,
}) => {
  let chartData = {
    labels: [],
    datasets: [],
  };

  let paramName = "";
  if (data[id]) {
    paramName = data[id][0]?.Param?.Name;

    chartData.labels = data[id]?.map((item) => item?.Date);
    chartData.datasets.push({
      label: paramName,
      data: data[id]?.map((item) => item?.Value),
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
        labels: {},
      },
    },
  };

  if (data[id]) {
    chartData.labels = data[id]?.map((item) => item?.Date);
    chartData.datasets[0].data = data[id]?.map((item) => item?.Value);
  }

  return (
    <div className="card border-gray">
      <div className="card-body">
        <div className="card-header p-2 pt-0 mb-2">
          <div className="row align-items-center">
            <div className="col">
              <p className="fw-bold text-secondary font-13">
                نمودار {paramName}
              </p>
            </div>

            <div className="col d-flex justify-content-end">
              <button
                onClick={openMedicalParamModal}
                className="btn text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-0 formBtns"
              >
                <FeatherIcon icon="plus" />
                سابقه جدید
              </button>
            </div>
          </div>
        </div>

        <Chart type="line" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MedicalParamsList;
