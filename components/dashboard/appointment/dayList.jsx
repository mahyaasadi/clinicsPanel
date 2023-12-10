import Day from "./day";
let month = {
  "01": "فروردین",
  "02": "اردیبهشت",
  "03": "خرداد",
  "04": "تیر",
  "05": "مرداد",
  "06": "شهریور",
  "07": "مهر",
  "08": "آبان",
  "09": "آذر",
  10: "دی",
  11: "بهمن",
  12: "اسفند",
};
const DayList = ({
  data,
  Dates,
  openNewAppointmentModal,
  openEditAppointmentModal,
  deleteAppointment,
  depOpeningHour,
}) => {
  return (
    <>
      <table className="table w-auto">
        <thead className="bg-light sticky-top">
          <tr>
            {Dates.map((date, index) => {
              date = date.split("/");
              return (
                <th key={index}>
                  <div className="date">
                    <p className="date-num">{date[2]}</p>
                    <p className="date-day">{month[date[1]]}</p>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Dates.map((date, index) => {
              return (
                <td key={index} className="p-0">
                  <Day
                    date={date}
                    key={date}
                    appointment={data[date]}
                    openNewAppointmentModal={openNewAppointmentModal}
                    openEditAppointmentModal={openEditAppointmentModal}
                    deleteAppointment={deleteAppointment}
                    depOpeningHour={depOpeningHour}
                  />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DayList;
