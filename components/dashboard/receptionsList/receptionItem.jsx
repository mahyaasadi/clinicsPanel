import { useState } from "react";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import ReceptionItemInfoModal from "./receptionItemInfo";
import ReceptionItemHistoryModal from "./receptionItemHistory";
import { whitePlainBg } from "components/commonComponents/imagepath";

const ReceptionItem = ({
  srv,
  deleteReception,
  openAppointmentModal,
  openFrmOptionsModal,
}) => {
  console.log({ srv });
  const router = useRouter();

  // ReceptionItem Info and History Modals
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleCloseHistoryModal = () => setShowHistoryModal(false);

  const handleEditBtnClick = () => {
    router.push({
      pathname: "/reception",
      query: { id: srv._id, receptionID: srv.ReceptionID },
    });
  };

  const items = [
    {
      label: "فرم جدید",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-18"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
      ),
      command: () => openFrmOptionsModal(srv),
    },
    {
      label: "تاریخچه پذیرش",
      icon: <FeatherIcon icon="clock" size="20" />,
      command: () => setShowHistoryModal(true),
    },
    {
      label: "جزيیات پذیرش",
      icon: <FeatherIcon icon="info" size="20" />,
      command: () => setShowInfoModal(true),
    },
    {
      label: "حذف",
      icon: <FeatherIcon icon="trash" size="20" />,
      command: () => deleteReception(srv._id),
    },
  ];

  return (
    <>
      <div className="col-sm-6 col-lg-4 col-xxl-3 mt-3">
        <div className="card shadow h-100 patientCard receptionHeader">
          <div className=" card-header align-items-center">
            <div className="d-flex justify-between">
              {srv?.Modality?.Icon ? (
                <img
                  src={srv?.Modality?.Icon}
                  alt="modalityIcon"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <Image
                  src={whitePlainBg}
                  alt="modalityIcon"
                  width="25"
                  height="25"
                />
              )}

              <div className="d-flex gap-1">
                <button
                  type="button"
                  data-pr-position="top"
                  className="btn btn-outline-primary editBtn receptBtnPadding"
                  onClick={handleEditBtnClick}
                >
                  <FeatherIcon
                    icon="edit-3"
                    className="prescItembtns"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <Tooltip target=".editBtn">ویرایش</Tooltip>
                </button>

                <button
                  type="button"
                  data-pr-position="left"
                  className="btn btn-outline-primary editBtn receptBtnPadding appointment"
                  onClick={() =>
                    openAppointmentModal(srv?.Patient, srv?.Modality)
                  }
                >
                  <FeatherIcon
                    icon="calendar"
                    className="prescItembtns"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <Tooltip target=".appointment">نوبت دهی</Tooltip>
                </button>

                <div>
                  <Tooltip
                    target=".speeddial-bottom-right .p-speeddial-action"
                    position="top"
                  />
                  <SpeedDial
                    model={items}
                    className="speeddial-bottom-right"
                    direction="left"
                    style={{ top: "15px", left: "50px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div dir="rtl" className="card-body pt-2 text-secondary">
            <div className="d-flex gap-4 align-items-center mt-2">
              <div className="align-items-center d-flex flex-col gap-2">
                <img
                  src={
                    "https://irannobat.ir/images/Avatar/" + srv?.Patient.Avatar
                  }
                  alt="patientAvatar"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "10px",
                  }}
                  onError={({ currentTarget }) => {
                    srv?.Patient?.Gender === "F" || srv?.Patient.Gender === "M"
                      ? (currentTarget.src = `assets/img/avatar-${srv?.Patient?.Gender}-pic.png`)
                      : (currentTarget.src = `assets/img/avatar-O-pic.png`);
                  }}
                />
                <div className="font-13 fw-bold mb-2">{srv?.ReceptionID}</div>
              </div>

              <div className="font-13">
                <div className="d-flex gap-2 fw-bold align-items-center col-10 flex-wrap">
                  <div className="font-12">{srv?.Modality?.Name}</div>
                </div>

                <div className="d-flex gap-2 mt-2 flex-wrap">
                  <FeatherIcon icon="calendar" className="prescItembtns" />
                  <div>{srv?.Date}</div>
                  <div>,</div>
                  <div>{srv?.Time}</div>
                </div>

                <p className="mb-1 d-flex gap-2 flex-wrap">
                  <FeatherIcon icon="user" className="prescItembtns" />
                  {srv?.Patient?.Name}
                </p>

                <div className="d-flex gap-2 mb-1 align-items-center">
                  <div className="w-16 m-0 d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-100 m-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                      />
                    </svg>
                  </div>

                  {srv?.Patient.NationalID}
                </div>
              </div>
            </div>

            <div className="col-12 font-12 d-flex flex-wrap gap-2 mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-16 marginR-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                />
              </svg>

              {srv?.Items?.map((item, index) => (
                <span key={index}>
                  {item.Name}
                  {item.Des ? " (" + item.Des + ")" : ""}
                  {" | "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReceptionItemInfoModal
        srv={srv}
        show={showInfoModal}
        onHide={handleCloseInfoModal}
      />
      <ReceptionItemHistoryModal
        srv={srv}
        show={showHistoryModal}
        onHide={handleCloseHistoryModal}
      />
    </>
  );
};

export default ReceptionItem;

