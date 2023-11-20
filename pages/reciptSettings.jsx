import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import ReciptSettingsForm from "components/dashboard/settings/recipt/reciptSettingsForm";

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
const ReciptSettings = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [reciptSettingsData, setReciptSettingsData] = useState([]);
  const [orientation, setOrientention] = useState({
    portrait: true,
    landscape: false,
  });
  const [hasQrCode, setHasQrCode] = useState({
    QRCode: true,
    noQRCode: false,
  });

  const onChangeOrientation = (e) => {
    const { name, value } = e.target;

    if (name === "portrait") {
      setOrientention({ portrait: true, landscape: false });
    }
    if (name === "landscape") {
      setOrientention({ portrait: false, landscape: true });
    }
  };

  const onChangeQRCode = (e) => {
    const { name, value } = e.target;

    if (name === "QRCode") {
      setHasQrCode({ QRCode: true, noQRCode: false });
    }
    if (name === "noQRCode") {
      setHasQrCode({ QRCode: false, noQRCode: true });
    }
  };

  const getReciptSettings = () => {
    setIsLoading(true);
    let url = `Clinic/getPrintSetting/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);

        setReciptSettingsData(response.data);
        setOrientention({
          portrait: response.data.Portrait,
          landscape: !response.data.Portrait,
        });
        setHasQrCode({
          QRCode: response.data.QRCode,
          noQRCode: !response.data.QRCode,
        });

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  const submitReciptSettings = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = `Clinic/setPrintSetting/${ClinicID}`;
    let data = {
      NumberOfCopy: parseInt(formProps.NumberOfCopy),
      Header: formProps.Header,
      Description: formProps.Description,
      AnsText: formProps.AnsText,
      Portrait: orientation.portrait,
      QRCode: hasQrCode.QRCode,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        console.log(response.data);
        setReciptSettingsData(response.data);
        SuccessAlert("موفق", "اطلاعات با موفقیت ذخیره گردید!");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ذخیره اطلاعات با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  useEffect(() => getReciptSettings(), []);

  return (
    <>
      <Head>
        <title>تنظیمات چاپ قبض</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <ReciptSettingsForm
              data={reciptSettingsData}
              orientation={orientation}
              onChangeOrientation={onChangeOrientation}
              hasQrCode={hasQrCode}
              onChangeQRCode={onChangeQRCode}
              onSubmit={submitReciptSettings}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ReciptSettings;
