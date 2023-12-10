import FeatherIcon from "feather-icons-react";

const Event = ({
  data,
  openEditAppointmentModal,
  deleteAppointment,
  depOpeningHour,
}) => {
  console.log({ data });
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
  console.log({ calculatedEndTime });

  return (
    <>
      <div
        onDoubleClick={() => openEditAppointmentModal(data)}
        className={`event shadow start-${calculatedStartTime.replace(
          ":",
          "-"
        )} end-${calculatedEndTime.replace(":", "-")}`}
      >
        <div className="d-flex gap-1 justify-end align-items-center">
          <button
            className="btn btn-sm p-0"
            onClick={() => openEditAppointmentModal(data)}
          >
            <FeatherIcon icon="edit-3" style={{ width: "15px" }} />
          </button>
          <button
            className="btn btn-sm p-0"
            onClick={() => deleteAppointment(data._id, data.Date)}
          >
            <FeatherIcon icon="trash" style={{ width: "15px" }} />
          </button>
        </div>

        <div className="title d-flex flex-wrap align-items-center gap-2">
          <FeatherIcon icon="user" style={{ width: "15px" }} />{" "}
          {data.Patient.Name}
        </div>
        <div className="time d-flex align-items-center gap-2">
          {" "}
          <FeatherIcon icon="clock" style={{ width: "15px" }} /> {data.ST} تا{" "}
          {data.ET}
        </div>
      </div>
    </>
  );
};

export default Event;
