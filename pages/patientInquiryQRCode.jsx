import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { setPatientAvatarUrl } from "lib/session";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { Skeleton } from "primereact/skeleton";
import FeatherIcon from "feather-icons-react";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setQrCodeUrl(
        `https://clinic.irannobat.ir/patientInquiry?token=${ClinicID}`
      );
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [ClinicID]);

  return (
    <>
      <Head>
        <title>کیوسک آنلاین</title>
      </Head>
      <div className="page-wrapper-qr">
        <div className="content container-fluid">
          <div className="card">
            <div className="card-header d-flex gap-1">
              <div className="printBtn">
                <button
                  onClick={() => handlePrint()}
                  className="btn btn-outline-primary"
                >
                  <FeatherIcon icon="printer" />
                </button>
              </div>

              <div className="downloadBtn">
                <button
                  onClick={handleDownload}
                  className="btn btn-outline-primary"
                >
                  <FeatherIcon icon="download" />
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* <div className="showPrint d-flex justify-center align-items-center">
                <div className="text-center my-5 fw-bold font-17"></div>
                {isLoading ? (
                  <div className="qrcodeSkeleton d-flex justify-center">
                    <Skeleton></Skeleton>
                  </div>
                ) : (
                  <div className="d-flex justify-center p-0" id="qr-code">
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
                  </div>
                )}
              </div> */}

              <div className="p-relative" id="qr-code">
                <img
                  src="/assets/img/clinicQrBanner.jpg"
                  alt="clinicQrBanner"
                  style={{ width: '100%', height: 'auto' }}
                />

                {isLoading ? (
                  <div className="qrcodeSkeleton d-flex justify-center">
                    <Skeleton></Skeleton>
                  </div>
                ) : (

                  <QRCode
                    size={70}
                    style={{
                      height: 'auto',
                      width: "230px",
                      maxWidth: '20%',
                      position: "absolute", bottom: "8%", right: "16%"
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