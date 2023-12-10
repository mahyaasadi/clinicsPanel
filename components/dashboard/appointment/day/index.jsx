import Event from "../event";

const Day = ({
  date,
  appointment,
  openEditAppointmentModal,
  openNewAppointmentModal,
  deleteAppointment,
  depOpeningHour,
}) => {
  return (
    <div
      className="day"
      // onDoubleClick={() => openNewAppointmentModal(date)}
    >
      <div className="events shadow-sm">
        {appointment?.map((event) => {
          return (
            <Event
              key={event._id}
              data={event}
              depOpeningHour={depOpeningHour}
              openEditAppointmentModal={openEditAppointmentModal}
              deleteAppointment={deleteAppointment}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Day;
