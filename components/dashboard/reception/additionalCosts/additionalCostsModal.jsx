import { useState } from "react";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import AddAdditionalCostModal from "components/dashboard/reception/additionalCosts/addAdditionalCostsModal";

const AdditionalCostsModal = ({ show, onHide, onSubmit }) => {
  const [showAddCostModal, setShowAddCostModal] = useState(false);
  const handleCloseAddCostModal = () => setShowAddCostModal(false);
  const openAddCostModal = () => setShowAddCostModal(true);

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">
              ثبت سایر هزینه ها
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="float-end">
            <button
              onClick={openAddCostModal}
              className="btn btn-primary btn-add font-14 media-font-12"
            >
              <i className="me-1">
                <FeatherIcon icon="plus-square" />
              </i>{" "}
              افزودن
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <AddAdditionalCostModal
        show={showAddCostModal}
        onHide={handleCloseAddCostModal}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AdditionalCostsModal;
