import Head from "next/head";
import { useRouter } from "next/router";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { getPatientAvatarUrl } from "lib/session";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";

const PatientInquiry = () => {
  const router = useRouter();

  let ClinicID = getPatientAvatarUrl(router.query.token);

  const _getPatientInfo = (e) => {
    e.preventDefault();
    // setPatientStatIsLoading(true);

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      CenterID: router.query.token,
      NID: $("#patientNationalCode").val(),
    };

    console.log({ data });

    // axiosClient
    //   .post(url, data)
    //   .then((response) => {
    //     if (response.data.error == "1") {
    //       $("#newPatientModal").modal("show");
    //     } else {
    //       setPatientData(response.data.user);

    //       setTimeout(() => {
    //         openNewPatientOptionsModal();
    //       }, 100);
    //       getAllClinicsPatients();
    //     }
    //     onHide();
    //     setPatientStatIsLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setPatientStatIsLoading(false);
    //     ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
    //   });
  };

  return (
    <>
      {/* <Head>
        <title></title>
      </Head> */}
      <div className="">
        <form>
          <div className="form-group">
            <label className="lblAbs">NID</label>
            <input type="text" className="inputPadding" />
          </div>
        </form>
      </div>
    </>
  );
};

export default PatientInquiry;
