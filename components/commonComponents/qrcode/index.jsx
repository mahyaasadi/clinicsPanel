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
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, url, token]);

  console.log({ qrCodeUrl });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="text-secondary fw-bold font-13">
            با اسکن کد زیر وارد لینک شده و عکس خود را آپلود نمایید
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="qrCodeModalBody">
        <div className="d-flex justify-center ">
          {isLoading ? (
            <div className="qrcodeSkeleton">
              <Skeleton></Skeleton>
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
