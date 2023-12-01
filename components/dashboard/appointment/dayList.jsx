import Day from "./day";

const DayList = ({ data, Dates, openEditAppointmentModal }) => {
  return (
    <>
      {Dates.map((date, index) => {
        return (
          <Day date={date} key={date} index={index} appointment={data[date]} openEditAppointmentModal={openEditAppointmentModal} />
        );
      })}
    </>
  );
};

export default DayList;