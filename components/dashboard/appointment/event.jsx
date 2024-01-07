import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const Event = ({
  data,
  openEditAppointmentModal,
  openDuplicateModal,
  deleteAppointment,
  depOpeningHour,
  onDoubleClick,
  openFrmOptionsModal,
}) => {
  function subtractHoursFromTime(timeString, hoursToSubtract) {
    const defaultTime = timeString.split(":");
    const hour = defaultTime[0];
    const minute = defaultTime[1];

    let calculatedTime = hour - hoursToSubtract;
    if (calculatedTime < 10) calculatedTime = "0" + calculatedTime;

    const formattedTime = (calculatedTime + ":" + minute).toString();
    return formattedTime;
  }

  const calculatedStartTime = subtractHoursFromTime(data.ST, depOpeningHour);
  const calculatedEndTime = subtractHoursFromTime(data.ET, depOpeningHour);

  const handleDoubleClick = (event) => {
    event.stopPropagation(); // Stop the event from reaching the parent (Day) component
    onDoubleClick();
  };

  const handleOpenEditModal = (event) => {
    event.stopPropagation();
    openEditAppointmentModal(data);
  };

  const handleOpenDuplicateModal = (event) => {
    event.stopPropagation();
    openDuplicateModal(data);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    deleteAppointment(data._id, data.Date);
  };

  const handleOpenFrmOptionModal = (event) => {
    event.stopPropagation();
    openFrmOptionsModal(data);
  };

  return (
    <>
      <li
        onClick={handleDoubleClick}
        className={`event shadow start-${calculatedStartTime.replace(
          ":",
          "-"
        )} end-${calculatedEndTime.replace(":", "-")}`}
      >
        <div className="d-flex gap-2 justify-between">
          <div>
            <div className="title d-flex flex-wrap align-items-center gap-2">
              <FeatherIcon icon="user" style={{ width: "15px" }} />{" "}
              {data.Patient.Name}
            </div>
            <div className="time d-flex align-items-center gap-2">
              {" "}
              <FeatherIcon icon="clock" style={{ width: "15px" }} /> {data.ST}{" "}
              تا {data.ET}
            </div>
          </div>

          {/* <hr
            style={{
              background: "#B45309",
              marginTop: "1px",
              marginBottom: "2px",
            }}
          /> */}

          <div className="d-flex flex-col gap-1 align-items-center">
            <button
              className="btn btn-sm p-0 eventBtns editButton appointButton editAppointBtn d-flex justify-end"
              onClick={handleOpenEditModal}
              data-pr-position="left"
            >
              <FeatherIcon icon="edit-2" style={{ width: "14px" }} />
              <Tooltip target=".editAppointBtn">ویرایش</Tooltip>
            </button>
            <button
              className="btn btn-sm p-0 eventBtns editButton appointButton copyAppointBtn d-flex justify-end"
              onClick={handleOpenDuplicateModal}
              data-pr-position="left"
            >
              <FeatherIcon icon="copy" style={{ width: "15px" }} />
              <Tooltip target=".copyAppointBtn">کپی</Tooltip>
            </button>

            <button
              className="btn btn-sm p-0 eventBtns editButton appointButton newFormBtn d-flex justify-end"
              onClick={handleOpenFrmOptionModal}
              data-pr-position="left"
            >
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
              <Tooltip target=".newFormBtn">فرم جدید</Tooltip>
            </button>
            <button
              className="btn btn-sm p-0 eventBtns appointButton trashButton d-flex justify-end"
              onClick={handleDelete}
              data-pr-position="left"
            >
              <FeatherIcon icon="trash" style={{ width: "15px" }} />
              <Tooltip target=".trashButton">حذف</Tooltip>
            </button>
          </div>
        </div>
      </li>
    </>
  );
};

export default Event;
