import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { setPatientAvatarUrl } from "lib/session";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);

  if (result) {
    const { ClinicUser } = result;
    return { props: { ClinicUser } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
};

let ClinicID = null;
const PatientInquiryQRCode = ({ ClinicUser }) => {
  ClinicID = setPatientAvatarUrl(ClinicUser.ClinicID);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQrCodeUrl(
        `http://192.168.1.116:3000/patientInquiry?token=${ClinicID}`
      );
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [ClinicID]);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const qrCodeElement = document.getElementById("qr-code");
    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <>
      <Head>{/* <title>مدیریت سرویس ها</title> */}</Head>
      <div className="page-wrapper-qr">
        <div className="content container-fluid">
          <div className="card dir-rtl">
            <div className="card-header d-flex gap-1 justify-end">
              {/* <p className="text-secondary fw-bold font-13">
                با اسکن کد زیر وارد لینک شده و استعلام اطلاعات خود را از طریق کد
                ملی دریافت نمایید
              </p> */}

              <button
                onClick={() => handlePrint()}
                className="btn btn-outline-primary printBtn"
              >
                <FeatherIcon icon="printer" />
              </button>
              <button
                onClick={handleDownload}
                className="btn btn-outline-primary downloadBtn"
              >
                <FeatherIcon icon="download" />
              </button>
            </div>

            <div className="card-body" id="qr-code">
              <div className="d-flex justify-center align-items-center showPrint">
                {isLoading ? (
                  <div className="qrcodeSkeleton">
                    <Skeleton></Skeleton>
                  </div>
                ) : (
                  <QRCode
                    size={70}
                    style={{
                      height: "300px",
                      maxWidth: "400px",
                      width: "300px",
                    }}
                    value={qrCodeUrl}
                    viewBox={`0 0 100 100`}
                    fgColor={"#633512"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientInquiryQRCode;
