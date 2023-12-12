import Event from "./event";

const Day = ({
  date,
  appointment,
  openEditAppointmentModal,
  openNewAppointmentModal,
  openDuplicateModal,
  deleteAppointment,
  depOpeningHour,
}) => {
  const handleColumnDoubleClick = () => {
    openNewAppointmentModal(date);
  };

  return (
    <div className="day" onDoubleClick={handleColumnDoubleClick}>
      <div className="events shadow-sm">
        {appointment?.map((event) => {
          return (
            <Event
              key={event._id}
              data={event}
              depOpeningHour={depOpeningHour}
              openEditAppointmentModal={openEditAppointmentModal}
              openDuplicateModal={openDuplicateModal}
              deleteAppointment={deleteAppointment}
              onDoubleClick={() => openEditAppointmentModal(event)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Day;
