import { Modal } from "react-bootstrap";
import SingleDatePicker from "components/commonComponents/datepicker/singleDatePicker";

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

  return (
    <>
      <Modal show={show} onHide={onHide} centered className="custom-modal">
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
            {/* <select name="" class="form-control" id="">
              {HOption}
            </select>
            :
            <select name="" class="form-control" id="">
              {MOption}
            </select> */}

            {/* timepicker */}
            <input id="TimePicker" type="hidden" />
            <input id="TimePicker2" type="hidden" />

            <div class="container-fluid">
              <div class="time mt-1">
                <label className="lblAbs font-12">ساعت شروع</label>
                <div class="selected form-control rounded">
                  <span class="time-btn" id="hours">
                    12
                  </span>
                  :
                  <span class="time-btn" id="minutes">
                    00
                  </span>
                </div>
                <div id="time-picker" class="p-4" className="hourSelector">
                  <div class="row pb-2">
                    <div class="col-2">
                      <span class="item">00</span>
                    </div>
                    <div class="col-2">
                      <span class="item">01</span>
                    </div>
                    <div class="col-2">
                      <span class="item">02</span>
                    </div>
                    <div class="col-2">
                      <span class="item">03</span>
                    </div>
                    <div class="col-2">
                      <span class="item">04</span>
                    </div>
                    <div class="col-2">
                      <span class="item">05</span>
                    </div>
                  </div>
                  <div class="row pb-2">
                    <div class="col-2">
                      <span class="item">06</span>
                    </div>
                    <div class="col-2">
                      <span class="item">07</span>
                    </div>
                    <div class="col-2">
                      <span class="item">08</span>
                    </div>
                    <div class="col-2">
                      <span class="item">09</span>
                    </div>
                    <div class="col-2">
                      <span class="item">10</span>
                    </div>
                    <div class="col-2">
                      <span class="item">11</span>
                    </div>
                  </div>
                  <div class="row pb-2">
                    <div class="col-2">
                      <span class="item active">12</span>
                    </div>
                    <div class="col-2">
                      <span class="item">13</span>
                    </div>
                    <div class="col-2">
                      <span class="item">14</span>
                    </div>
                    <div class="col-2">
                      <span class="item">15</span>
                    </div>
                    <div class="col-2">
                      <span class="item">16</span>
                    </div>
                    <div class="col-2">
                      <span class="item">17</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <span class="item">18</span>
                    </div>
                    <div class="col-2">
                      <span class="item">19</span>
                    </div>
                    <div class="col-2">
                      <span class="item">20</span>
                    </div>
                    <div class="col-2">
                      <span class="item">21</span>
                    </div>
                    <div class="col-2">
                      <span class="item">22</span>
                    </div>
                    <div class="col-2">
                      <span class="item">23</span>
                    </div>
                  </div>
                </div>
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
