import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { axiosClient } from "class/axiosConfig";
import { getSession } from "lib/session";
import { setPatientAvatarUrl } from "lib/session";
import { Skeleton } from "primereact/skeleton";
import FeatherIcon from "feather-icons-react";
import Loading from "components/commonComponents/loading/loading";

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
  const qrCodeRef = useRef(null);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [clinicData, setClinicData] = useState([]);

  const getOneClinic = () => {
    setIsLoading(true);
    let url = `Clinic/getOne/${ClinicUser.ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setClinicData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handlePrint = () => window.print();

  // const handleDownload = () => {
  //   const qrCodeElement = document.getElementById("qr-code");

  //   console.log({ qrCodeElement });
  //   html2canvas(qrCodeElement).then((canvas) => {
  //     const link = document.createElement("a");
  //     link.download = "qr-code.png";
  //     link.href = canvas.toDataURL();
  //     link.click();
  //   });
  // };

  // const handleDownload = () => {
  //   const qrCodeElement = document.getElementById("qr-code");

  //   if (!qrCodeElement) {
  //     console.error("QR Code element not found!");
  //     return;
  //   }

  //   // Adding a delay to ensure everything is rendered
  //   setTimeout(() => {
  //     html2canvas(qrCodeElement, {
  //       scale: 2, // Increases the output resolution
  //       logging: true, // Enables detailed logging for debugging
  //       useCORS: true, // Tries to load images using CORS (important for external images)
  //       allowTaint: true, // Allows tainting (careful with cross-origin images)
  //       scrollX: -window.scrollX, // Adjusts for any current page scrolling
  //       scrollY: -window.scrollY,
  //       windowWidth: document.documentElement.offsetWidth, // Captures the full element width
  //       windowHeight: document.documentElement.offsetHeight,
  //     }).then((canvas) => {
  //       const link = document.createElement("a");
  //       link.download = "qr-code.png";
  //       link.href = canvas.toDataURL("image/png");
  //       document.body.appendChild(link); // This line can help in certain browsers
  //       link.click();
  //       document.body.removeChild(link); // Clean up
  //     });
  //   }, 3000); // Adjust delay as needed
  // };

  const handleDownload = () => {
    if (qrCodeRef.current) {
      html2canvas(qrCodeRef.current, {
        useCORS: true, // loaded from another domain
        logging: true,
      })
        .then((canvas) => {
          const link = document.createElement("a");
          link.download = "qr-code.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        })
        .catch((err) => console.error("html2canvas error:", err));
    }
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

  useEffect(() => getOneClinic(), []);

  return (
    <>
      <Head>
        <title>کیوسک آنلاین</title>
      </Head>
      <div className="page-wrapper-qr">
        <div className="content container-fluid">
          {!isLoading ? (
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

                <div className="p-relative">
                  <img
                    src="/assets/img/clinicQrBanner.jpg"
                    alt="clinicQrBanner"
                    style={{ width: "100%", height: "auto" }}
                  />

                  <img
                    src={clinicData.Logo}
                    alt="clinicQrBanner"
                    className="BannerLogoContainer"
                  />
                  <div id="qr-code" ref={qrCodeRef}>
                    <QRCode
                      ref={qrCodeRef}
                      size={70}
                      className="qrCodeContainer"
                      value={qrCodeUrl}
                      viewBox={`0 0 100 100`}
                      fgColor={"#AC3C24"}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default PatientInquiryQRCode;
