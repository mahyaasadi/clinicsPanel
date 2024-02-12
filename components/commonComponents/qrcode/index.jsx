import { Modal } from "react-bootstrap";

const QRCodeGeneratorModal = ({ show, onHide, url, token }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="text-secondary fw-bold font-14"></p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-center">
          <img
            src={`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=http://192.168.1.116:3000/${url}?token=${token}&choe=UTF-8`}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default QRCodeGeneratorModal;

{
  /* <img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=http://192.168.1.116:3000/changePatientAvatar?token=eyJhbGciOiJIUzI1NiJ9.NjVjNzIxNWI1NDNjODFmZDY0ZWU3ZmUwOzY1MzYzMjY1ZTQ0YjZmMTU2YjA4NGZkNQ.TNq8Si82W4g8k5WLiXzkh90xfJyKh7pp0Z6XXTvUbU4&choe=UTF-8" /> */
}
