import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Skeleton } from "primereact/skeleton";

const QRCodeGeneratorModal = ({ show, onHide, url, token }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setQrCodeUrl(
          `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=https://clinic.irannobat.ir/${url}?token=${token}&choe=UTF-8`
        );
        setIsLoading(false);
      }, 3000); // set loading time to 2 seconds

      return () => clearTimeout(timer);
    }
  }, [show, url, token]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="qrCodeModalBody">
        <div className="d-flex justify-center ">
          {isLoading ? (
            <div className="qrcodeSkeleton">
              <Skeleton>
                <img />
              </Skeleton>
            </div>
          ) : (
            <img src={qrCodeUrl} />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default QRCodeGeneratorModal;

{
  /* <img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=http://192.168.1.116:3000/changePatientAvatar?token=eyJhbGciOiJIUzI1NiJ9.NjVjNzIxNWI1NDNjODFmZDY0ZWU3ZmUwOzY1MzYzMjY1ZTQ0YjZmMTU2YjA4NGZkNQ.TNq8Si82W4g8k5WLiXzkh90xfJyKh7pp0Z6XXTvUbU4&choe=UTF-8" /> */
}
