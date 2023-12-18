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
      <ul className="events shadow-sm p-0">
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
      </ul>
    </div>
  );
};

export default Day;
