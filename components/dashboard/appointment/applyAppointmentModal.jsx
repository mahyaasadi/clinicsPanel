import { useState } from "react";
import { Modal } from "react-bootstrap";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { faIR } from 'date-fns/locale';
import "public/assets/css/appointment.css"

registerLocale('faIR', faIR); // Register the Farsi locale

const ApplyAppointmentModal = ({
  show,
  onHide,
  addAppointment,
  setAppointmentDate,
}) => {
  // let HOption = [];
  // for (let i = 0; i < 24; i++) {
  //   HOption.push(<option>{i}</option>);
  // }

  // let MOption = [];
  // for (let i = 0; i < 60; i = i + 15) {
  //   MOption.push(<option>{i}</option>);
  // }

  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  const handleStartTimeChange = (time) => {
    setSelectedStartTime(time);
    const pureSTimeValue = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    console.log({ pureSTimeValue });
  };

  const handleEndTimeChange = (time) => {
    setSelectedEndTime(time);
    const pureETimeValue = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    console.log({ pureETimeValue });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">ثبت نوبت</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={addAppointment}>
            <div className="form-group">
              <SingleDatePicker setDate={setAppointmentDate} label="تاریخ" />
            </div>
            <div className="row">

              {/* <select name="" class="form-control" id="">
              {HOption}
            </select>
            :
            <select name="" class="form-control" id="">
              {MOption}
            </select> */}

              <div className="col-6">
                {/* <label htmlFor="timeInput">Select Time:</label>
              <input
                type="time"
                id="timeInput"
                name="timeInput"
                value={selectedTime}
                onChange={handleTimeChange}
                step="900" // 900 seconds = 15 minutes
              /> */}
                <label className="lblAbs font-12">ساعت شروع</label>
                <DatePicker
                  selected={selectedStartTime}
                  onChange={handleStartTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  timeCaption="انتخاب کنید"
                  locale="faIR"
                />
              </div>

              <div className="col-6">
                <label className="lblAbs font-12">ساعت پایان</label>
                <DatePicker
                  selected={selectedEndTime}
                  onChange={handleEndTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  timeCaption="انتخاب کنید"
                  locale="faIR"
                />
              </div>
            </div>

            <div className="submit-section">
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                ثبت
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ApplyAppointmentModal;
