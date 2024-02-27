import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
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
  ClinicID = ClinicUser.ClinicID;

  return (
    <div className="">
      <div className="">
        {/* <QRCode
              size={150}
              style={{ height: "50%", maxWidth: "100%", width: "50%" }}
              value={qrCodeUrl}
              viewBox={`0 0 150 150`}
              fgColor={"#633512"}
            /> */}
      </div>
    </div>
  );
};

export default PatientInquiryQRCode;
