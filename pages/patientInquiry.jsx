import Head from "next/head";
import { useRouter } from "next/router";
import { axiosClient } from "class/axiosConfig";

const PatientInquiry = () => {
  const router = useRouter();

  const _getPatientInfo = (e) => {
    e.preventDefault();
    setPatientStatIsLoading(true);

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      CenterID: ClinicID,
      NID: $("#patientNationalCode").val(),
    };

    // let NIDVal = $("#patientNationalCode").val();
    getActiveNID(NIDVal);

    axiosClient
      .post(url, data)
      .then((response) => {
        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
        } else {
          setPatientData(response.data.user);

          setTimeout(() => {
            openNewPatientOptionsModal();
          }, 100);
          getAllClinicsPatients();
        }
        onHide();
        setPatientStatIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  return (
    <div className="">
      <div className=""></div>
    </div>
  );
};

export default PatientInquiry;
