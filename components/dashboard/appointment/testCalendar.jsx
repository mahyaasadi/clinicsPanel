import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-jalaali";
// import moment from "moment";
import "moment/locale/fa"; // Import Persian locale
import "react-big-calendar/lib/css/react-big-calendar.css";

// import jalaali from "moment-jalaali";
// jalaali.loadPersian();

import "react-big-calendar/lib/css/react-big-calendar.css";

moment.loadPersian({ dialect: "persian-modern" });

const localizer = momentLocalizer(moment);

const TestCalendar = ({ data }) => {
  console.log({ data });
  const events = [
    // {
    //   start: new Date(2023, 11, 15, 10, 0), // December 9, 2023, 10:00 AM
    //   end: new Date(2023, 11, 15, 12, 0), // December 9, 2023, 12:00 PM
    //   title: "Meeting with John",
    // },
    // {
    //   start: "2023-12-10T14:00:00", // December 10, 2023, 2:00 PM
    //   end: "2023-12-10T16:00:00", // December 10, 2023, 4:00 PM
    //   title: "Lunch with Mary",
    // },

    {
      start: moment("2023-12-15T10:00:00"), // December 15, 2023, 10:00 AM
      end: moment("2023-12-15T12:00:00"), // December 15, 2023, 12:00 PM
      title: "Meeting with John",
    },

    // {
    //   start: moment("1402-09-12", "jYYYY-jMM-jDD"),
    //   end: moment("1402-09-12", "jYYYY-jMM-jDD"),
    //   title: "Meeting with John",
    // },
    // {
    //   start: moment("2023-12-10T14:00:00", "YYYY-MM-DDTHH:mm:ss"), // December 10, 2023, 2:00 PM
    //   end: moment("2023-12-10T16:00:00", "YYYY-MM-DDTHH:mm:ss"), // December 10, 2023, 4:00 PM
    //   title: "Lunch with Mary",
    // },
  ];

  console.log({ events });

  return (
    <>
      <div className="">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          // Other calendar props
        />
      </div>
    </>
  );
};

export default TestCalendar;
