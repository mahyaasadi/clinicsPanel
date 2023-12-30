import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";

const PendingPatients = ({
  ClinicID,
  item,
  DeletePendingPatient,
  openAppointmentModal,
}) => {
  const router = useRouter();

  const handleEditPendingPatient = (item) => {
    router.push({
      pathname: "/editPatientsInfo",
      query: { id: item?._id },
    });
  };

  const handleReceptionBtn = (PNID) => {
    router.push({
      pathname: "/reception",
      query: { PNID: PNID },
    });
  }

  const btnItems = [
    {
      label: "تکمیل پرونده",
      icon: <FeatherIcon icon="edit-2" size="16" />,
      command: () => handleEditPendingPatient(item),
    },
    {
      label: "ثبت پذیرش",
      icon: <FeatherIcon icon="clipboard" size="20" />,
      command: () => handleReceptionBtn(item.NationalID),
    },
    {
      label: "نوبت دهی",
      icon: <FeatherIcon icon="calendar" size="20" />,
      command: () => openAppointmentModal(item._id),
    },
    {
      label: "حذف",
      icon: <FeatherIcon icon="trash" size="20" />,
      command: () => _deletePendingPatient(item._id),
    },
  ];

  const _deletePendingPatient = async (id) => {
    let result = await QuestionAlert("حذف بیمار!", "آیا از حذف اطمینان دارید؟");

    if (result) {
      let url = `Patient/deletePendingPatient`;
      let data = {
        CenterID: ClinicID,
        PatientID: id,
      };

      await axiosClient
        .delete(url, { data })
        .then((response) => {
          DeletePendingPatient(id);
        })
        .catch((error) => {
          console.log(error);
          ErrorAlert("خطا", "حذف بیمار با خطا مواجه گردید!");
        });
    }
  };

  return (
    <>
      <div className="card col-12 mb-2 pendPatientCard">
        <div className="pendingPatientSD card-header d-flex gap-1">
          <div>
            <Tooltip
              target=".speeddial-bottom-right .p-speeddial-action"
              position="bottom"
            />
            <SpeedDial
              model={btnItems}
              direction="left"
              className="speeddial-bottom-right w-100"
              buttonClassName="p-button-danger"
              style={{
                top: "5px",
                right: "-7px",
                justifyContent: "flex-start !important",
              }}
            />
          </div>
        </div>

        <div className="p-2">
          <div className="d-flex justify-between font-13  text-secondary fw-bold">
            <div className="d-flex align-items-center gap-3">
              <div>
                <img
                  src={"https://irannobat.ir/images/" + item?.Avatar}
                  alt="patientAvatar"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "10px",
                  }}
                  onError={({ currentTarget }) => {
                    item?.Gender === "F" || item?.Gender === "M"
                      ? (currentTarget.src = `assets/img/avatar-${item?.Gender}-pic.png`)
                      : (currentTarget.src = `assets/img/avatar-O-pic.png`);
                  }}
                />
              </div>

              <div>
                <p className="mb-1">{item?.Name}</p>
                <div className="d-flex gap-2 align-items-center">
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

                  {item?.NationalID}
                </div>

                <div className="d-flex gap-2 align-items-center">
                  <FeatherIcon icon="smartphone" style={{ width: "16px" }} />
                  <p id="PatientTel">{item?.Tel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingPatients;
