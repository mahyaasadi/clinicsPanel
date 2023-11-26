import { Modal } from "react-bootstrap";

const ReceptionItemHistoryModal = ({ srv, show, onHide }) => {
  const renderEditHistory = (historyArray) => {
    // console.log({ historyArray });
    return (
      <div>
        <ul>
          {historyArray?.EditHistory?.map(
            (historyItem, index) => (
              console.log({ historyItem }),
              (
                <li key={index}>
                  <div className="card">
                    <div className="card-body">
                      {historyItem.EditHistory.length != 0
                        ? historyItem?.EditHistory?.Items?.Name
                        : historyItem.Items.Name}
                      {historyItem?.EditDate} {""}
                      {historyItem?.EditTime}{" "}
                    </div>
                  </div>
                  {/* Check if there is a nested EditHistory array */}
                  {historyItem && renderEditHistory(historyItem)}
                </li>
              )
            )
          )}
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

