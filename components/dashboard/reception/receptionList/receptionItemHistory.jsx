import { Modal } from "react-bootstrap";

const ReceptionItemHistoryModal = ({ srv, show, onHide }) => {
  // console.log({ srv });
  const renderEditHistory = (historyArray) => {
    // console.log({ historyArray });
    return (
      <div>
        <ul>
          {historyArray?.EditHistory?.map((historyItem, index) => (
            // console.log({ historyItem }),
            <li key={index}>
              {historyItem?.EditDate}
              {historyItem?.EditTime}

              {/* Check if there is a nested EditHistory array */}
              {historyItem && renderEditHistory(historyItem)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">تاریخچه پذیرش</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>{renderEditHistory(srv || [])}</Modal.Body>
      </Modal>
    </>
  );
};

export default ReceptionItemHistoryModal;

