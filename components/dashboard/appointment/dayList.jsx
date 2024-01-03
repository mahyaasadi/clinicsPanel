import Day from "./day";
import JDate from "jalali-date";
import FeatherIcon from "feather-icons-react";
import { convertToFixedNumber } from "utils/convertToFixedNumber";

const jdate = new JDate();

const DayList = ({
  data,
  Dates,
  DatesDays,
  openNewAppointmentModal,
  openEditAppointmentModal,
  openDuplicateModal,
  deleteAppointment,
  depOpeningHour,
  Hours,
  displayNextFiveDays,
  displayLastFiveDays,
  monthName,
  yearValue,
  formattedCurrentDate,
  returnToToday,
  loadingState,
}) => {
  let todaysDate = String(jdate.getDate());
  if (todaysDate.length === 1) todaysDate = "0" + todaysDate.toString();

  return (
    <div className="appointmentTableContainer">
      <div className="d-flex justify-center ">
        <div className="d-flex gap-1">
          <button
            className="btn btn-outline-primary font-14 d-flex align-items-center justify-center gap-1 h-35 nextDaysBtn"
            onClick={displayLastFiveDays}
          >
            <FeatherIcon icon="chevron-right" />
            <p className="mb-0">قبلی</p>
          </button>
          <button
            className="btn btn-outline-primary font-14 d-flex align-items-center justify-center gap-1 h-35"
            onClick={returnToToday}
          >
            <p className="mb-0">امروز</p>
          </button>
        </div>

        <div className="col currentMonthContainer text-secondary fw-bold text-center">
          {monthName} {yearValue}
        </div>

        <button
          className="btn btn-outline-primary font-14 d-flex align-items-center justify-center gap-1 h-35 prevDaysBtn"
          onClick={displayNextFiveDays}
        >
          <p className="mb-1">بعدی</p>
          <FeatherIcon
            icon="chevron-left"
            style={{ height: "19px !important" }}
          />
        </button>
      </div>

      <div className="tContainer">
        <table className="table">
          <thead className="bg-light text-secondary">
            <tr>
              <th></th>
              {Dates.map(
                (date, index) => (
                  (date = date.split("/")),
                  (
                    <th key={index}>
                      <div className="date d-flex flex-col">
                        <div className="mb-1">{DatesDays[index]}</div>
                        <div className="d-flex align-items-center">
                          <p
                            className={`${
                              convertToFixedNumber(date[2]) === todaysDate
                                ? "todaysDate"
                                : ""
                            } date-num DateDayContainer`}
                          >
                            {convertToFixedNumber(date[2])}
                          </p>
                        </div>
                      </div>
                    </th>
                  )
                )
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <div className="timeline text-secondary font-13">{Hours}</div>
              </td>
              {Dates.map((date, index) => {
                const formattedDate = convertToFixedNumber(date);
                return (
                  <td key={index} className="p-0">
                    <Day
                      date={formattedDate}
                      formattedCurrentDate={formattedCurrentDate}
                      appointment={data[formattedDate]}
                      openNewAppointmentModal={openNewAppointmentModal}
                      openEditAppointmentModal={openEditAppointmentModal}
                      openDuplicateModal={openDuplicateModal}
                      deleteAppointment={deleteAppointment}
                      depOpeningHour={depOpeningHour}
                      loadingState={loadingState}
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DayList;
