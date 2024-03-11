import { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import PinInput from "react-pin-input";

const GetPinInput = ({ show, onHide, getPinInputValue }) => {
  const [pinInputRef, setPinInputRef] = useState(null);

  const handlePinInputRef = (ref) => {
    if (ref) {
      setPinInputRef(ref);
      ref.focus();
    }
  };

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
              ref={handlePinInputRef}
              onComplete={(value, index) => getPinInputValue(value)}
              autoSelect={true}
              regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              inputFocusStyle={{ borderColor: "#b45309" }}
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
