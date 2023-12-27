import Event from "./event";

const Day = ({
  date,
  appointment,
  openEditAppointmentModal,
  openNewAppointmentModal,
  openDuplicateModal,
  deleteAppointment,
  depOpeningHour,
  formattedCurrentDate,
}) => {
  const formattedDefDate = date.replace(/(\d+)\/(\d+)\/(\d+)/, "$1/$2/$3");

  const handleColumnDoubleClick = () => {
    if (formattedDefDate < formattedCurrentDate) {
      return; // Do nothing if the condition is met
    }

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
