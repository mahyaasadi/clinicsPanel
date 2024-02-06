import { Modal } from "react-bootstrap";
import PinInput from "react-pin-input";

const GetPinInput = ({ show, onHide, getPinInputValue }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            کد ارسال شده را وارد نمایید
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
          <div dir="ltr">
            <PinInput
              length={6}
              initialValue=""
              type="numeric"
              inputMode="numeric"
              focus="true"
              // secret
              // secretDelay={800}
              // onChange={(value, index) => {}}
              onComplete={(value, index) => getPinInputValue(value)}
              autoSelect={true}
              regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              inputFocusStyle={{ borderColor: "blue" }}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default GetPinInput;
