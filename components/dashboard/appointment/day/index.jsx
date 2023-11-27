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

const Day = ({ date, appointment }) => {
  console.log(appointment);
  date = date.split("/");
  return (
    <>
      <div class="day">
        <div class="date">
          <p class="date-num">{date[2]}</p>
          <p class="date-day">{month[date[1]]}</p>
        </div>

        <div class="events shadow">
          {appointment?.map((event) => {
            return <Event key={event._id} data={event} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Day;
