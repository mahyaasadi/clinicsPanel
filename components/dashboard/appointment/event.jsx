import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";

const Event = ({
  data,
  openEditAppointmentModal,
  openDuplicateModal,
  deleteAppointment,
  depOpeningHour,
  onDoubleClick,
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

  return (
    <>
      <div
        onClick={handleDoubleClick}
        className={`event shadow start-${calculatedStartTime.replace(
          ":",
          "-"
        )} end-${calculatedEndTime.replace(":", "-")}`}
      >
        <div className="d-flex gap-1 justify-between">
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

          <div className="d-flex flex-col gap-1 align-items-center">
            <button
              className="btn btn-sm p-0 eventBtns editButton editAppointBtn d-flex justify-end"
              onClick={handleOpenEditModal}
              data-pr-position="left"
            >
              <FeatherIcon icon="edit-2" style={{ width: "14px" }} />
              <Tooltip target=".editAppointBtn">ویرایش</Tooltip>
            </button>
            <button
              className="btn btn-sm p-0 eventBtns editButton copyAppointBtn d-flex justify-end"
              onClick={handleOpenDuplicateModal}
              data-pr-position="left"
            >
              <FeatherIcon icon="copy" style={{ width: "15px" }} />
              <Tooltip target=".copyAppointBtn">کپی</Tooltip>
            </button>
            <button
              className="btn btn-sm p-0 eventBtns trashButton d-flex justify-end"
              onClick={handleDelete}
              data-pr-position="left"
            >
              <FeatherIcon icon="trash" style={{ width: "15px" }} />
              <Tooltip target=".trashButton">حذف</Tooltip>

            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;
