
import FeatherIcon from "feather-icons-react";

const Event = ({ data, openEditAppointmentModal }) => {
  return (
    <>
      <div
        class={`event shadow start-${data.ST.replace(
          ":",
          "-"
        )} end-${data.ET.replace(":", "-")}`}
      >
        <div className="d-flex float-left">
          <button className="btn" onClick={() => openEditAppointmentModal(data)}>
            <FeatherIcon icon="edit-3" style={{ width: "15px" }} />
          </button>
          <button className="btn">
            <FeatherIcon icon="trash" style={{ width: "15px" }} />
          </button>
        </div>
        <p class="title">
          {" "}
          <i className="fe fe-user"></i> {data.Patient.Name}
        </p>
        <p class="time">
          {" "}
          <i className="fe fe-clock"></i> {data.ST} تا {data.ET}
        </p>
      </div>
    </>
  );
};

export default Event;
