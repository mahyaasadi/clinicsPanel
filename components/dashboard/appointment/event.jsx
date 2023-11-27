const Event = ({ data }) => {
  return (
    <>
      <div
        class={`event shadow start-${data.ST.replace(
          ":",
          "-"
        )} end-${data.ET.replace(":", "-")}`}
      >
        <p className="action-btn">
          <i className="fe fe-edit"></i>
          <i className="fe fe-trash"></i>
        </p>
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
