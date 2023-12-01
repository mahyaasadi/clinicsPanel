import Event from "../event";

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

const Day = ({ date, appointment, openEditAppointmentModal }) => {
  date = date.split("/");
  return (
    <div
      className="day"
    >
      <div className="date">
        <p className="date-num">{date[2]}</p>
        <p className="date-day">{month[date[1]]}</p>
      </div>

      <div className="events shadow">
        {appointment?.map((event) => {
          return <Event key={event._id} data={event} openEditAppointmentModal={openEditAppointmentModal} />;
        })}
      </div>
    </div>
  );
};

export default Day;
