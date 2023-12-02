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
        <div className="d-flex float-left">
          <button
            className="btn"
            onClick={() => openEditAppointmentModal(data)}
          >
            <FeatherIcon icon="edit-3" style={{ width: "15px" }} />
          </button>
          <button
            className="btn"
            onClick={() => deleteAppointment(data._id, data.Date)}
          >
            <FeatherIcon icon="trash" style={{ width: "15px" }} />
          </button>
        </div>
        <p className="title">
          {" "}
          <i className="fe fe-user"></i> {data.Patient.Name}
        </p>
        <p className="time">
          {" "}
          <i className="fe fe-clock"></i> {data.ST} تا {data.ET}
        </p>
      </div>
    </>
  );
};

export default Event;
