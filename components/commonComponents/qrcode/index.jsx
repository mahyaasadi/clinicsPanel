import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Skeleton } from "primereact/skeleton";
import QRCode from "react-qr-code";

const QRCodeGeneratorModal = ({ show, onHide, url, token }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        // setQrCodeUrl(
        //   `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=https://clinic.irannobat.ir/${url}?token=${token}&choe=UTF-8`
        // );

        setQrCodeUrl(`https://clinic.irannobat.ir/${url}?token=${token}`);
        // setQrCodeUrl(`http://192.168.1.116:3000/${url}?token=${token}`);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, url, token]);

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
        <div className="d-flex justify-center align-items-center">
          {isLoading ? (
            <div className="qrcodeSkeleton">
              <Skeleton></Skeleton>
            </div>
          ) : (
            // <img src={qrCodeUrl} />
            <QRCode
              size={150}
              style={{ height: "50%", maxWidth: "100%", width: "50%" }}
              value={qrCodeUrl}
              viewBox={`0 0 150 150`}
              fgColor={"#633512"}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default QRCodeGeneratorModal;
