import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { Chart } from "primereact/chart";
import { Tooltip } from "primereact/tooltip"
import { axiosClient } from "@/class/axiosConfig";
import MedParamsList from "./medParamsList";

const MedicalParamsChartCard = ({
  data,
  id,
  openMedicalParamModal,
  removeAttachedMedicalParam,
}) => {
  // console.log({ data });

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
        labels: {},
      },
    },
  };

  if (data) {
    chartData.labels = data?.map((item) => item?.Date);
    chartData.datasets[0].data = data?.map((item) => item?.Value);
  }

  const _removeMedParam = async (id) => {
    let url = `MedicalDetails/delete/${id}`

    await axiosClient
      .delete(url, { data })
      .then((response) => {
        console.log(response.data);
        removeAttachedMedicalParam(id);
      })
      .catch((err) => {
        console.log(err);
        // ErrorAlert("خطا", "حذف با خطا مواجه گردید!");
      });
  };

  const [showMedParamsListModal, setShowMedParamsListModal] = useState(false);
  const openMedParamsListModal = () => setShowMedParamsListModal(true);
  const closeMedParamsListModal = () => setShowMedParamsListModal(false);

  return (
    <>
      <div className="card border-gray">
        <div className="card-body">
          <div className="card-header p-2 pt-0 mb-2">
            <div className="row align-items-center">
              <div className="col">
                <p className="fw-bold text-secondary font-13">
                  نمودار {paramName}
                </p>
              </div>

              <div className="col d-flex gap-1 justify-content-end">
                <button
                  onClick={openMedParamsListModal}
                  data-pr-position="right"
                  className="btn btn-outline-secondary text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-1 formBtns editParamBtn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-19"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                    />
                  </svg>

                  <Tooltip target=".editParamBtn">ویرایش اطلاعات نمودار</Tooltip>
                </button>

                <button
                  onClick={() => openMedicalParamModal(id)}
                  data-pr-position="left"
                  className="btn btn-outline-secondary text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-1 formBtns newParamRecord"
                >
                  <FeatherIcon icon="plus" />
                  <Tooltip target=".newParamRecord">سابقه جدید</Tooltip>
                </button>
              </div>
            </div>
          </div>

          <Chart type="line" data={chartData} options={options} />
        </div>
      </div>

      <MedParamsList show={showMedParamsListModal} onHide={closeMedParamsListModal} paramName={paramName} data={data} _removeMedParam={_removeMedParam} />
    </>
  );
};

export default MedicalParamsChartCard;
