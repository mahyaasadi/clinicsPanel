import Event from "./event";
import { Skeleton } from "primereact/skeleton";

const Day = ({
  date,
  appointment,
  openEditAppointmentModal,
  openNewAppointmentModal,
  openDuplicateModal,
  deleteAppointment,
  depOpeningHour,
  formattedCurrentDate,
  loadingState,
  openFrmOptionsModal,
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
        {loadingState ? (
          <Skeleton>
            <div className=""></div>
          </Skeleton>
        ) : (
          appointment?.map((event) => {
            return (
              <Event
                key={event._id}
                data={event}
                depOpeningHour={depOpeningHour}
                openEditAppointmentModal={openEditAppointmentModal}
                openDuplicateModal={openDuplicateModal}
                deleteAppointment={deleteAppointment}
                onDoubleClick={() => openEditAppointmentModal(event)}
                openFrmOptionsModal={openFrmOptionsModal}
              />
            );
          })
        )}
      </ul>
    </div>
  );
};

export default Day;
