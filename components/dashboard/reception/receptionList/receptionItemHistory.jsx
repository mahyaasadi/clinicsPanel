import { Modal } from "react-bootstrap"

const ReceptionItemHistoryModal = ({ srv, show, onHide }) => {

    const renderEditHistory = (historyArray) => {
        console.log({ historyArray });
        // console.log(historyArray?.EditHistory?.EditDate);
        return (
            <div>
                <ul>
                    {historyArray?.map((historyItem, index) => (
                        <li key={index}>
                            {historyItem?.EditHistory?.EditDate}

                            {/* Check if there is a nested EditHistory array */}
                            {historyItem.EditHistory && historyItem.EditHistory.length !== 0 && (
                                renderEditHistory(historyItem.EditHistory)
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p className="mb-0 text-secondary font-14 fw-bold">
                            تاریخچه پذیرش
                        </p>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {renderEditHistory(srv.EditHistory || [])}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ReceptionItemHistoryModal