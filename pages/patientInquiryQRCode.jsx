import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { setPatientAvatarUrl } from "lib/session";
import { Skeleton } from "primereact/skeleton";
import QRCode from "react-qr-code";

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
  ClinicID = setPatientAvatarUrl(ClinicUser.ClinicID)

  setPatientAvatarUrl

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQrCodeUrl(`http://198.162.1.116:3000/patientInquiry?token=${ClinicID}`);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [ClinicID]);

  return (
    <>
      <Head>
        {/* <title>مدیریت سرویس ها</title> */}
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="card dir-rtl">
            <div className="card-header">
              hiii
            </div>
            <div className="card-body">
              <div className="d-flex justify-center align-items-center">
                {isLoading ? (
                  <div className="qrcodeSkeleton">
                    <Skeleton></Skeleton>
                  </div>
                ) : (
                  <QRCode
                    size={70}
                    style={{ height: "300px", maxWidth: "400px", width: "300px" }}
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
