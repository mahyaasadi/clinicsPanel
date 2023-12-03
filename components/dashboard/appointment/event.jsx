import FeatherIcon from "feather-icons-react";

const Event = ({ data, openEditAppointmentModal, deleteAppointment }) => {
  // console.log("event", data);
  return (
    <>
      <div
        className={`event shadow start-${data.ST.replace(
          ":",
          "-"
        )} end-${data.ET.replace(":", "-")}`}
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
