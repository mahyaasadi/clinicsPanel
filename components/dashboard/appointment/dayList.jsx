import Day from "./day";

const DayList = ({
  data,
  Dates,
  openEditAppointmentModal,
  deleteAppointment,
}) => {
  return (
    <>
      {Dates.map((date, index) => {
        return (
          <Day
            date={date}
            key={date}
            appointment={data[date]}
            openEditAppointmentModal={openEditAppointmentModal}
            deleteAppointment={deleteAppointment}
          />
        );
      })}
    </>
  );
};

export default DayList;
