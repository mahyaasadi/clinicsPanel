import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import FormsList from "components/dashboard/patientFile/formsList";
import PatientCard from "components/dashboard/patientFile/PatientCard";
import DiseaseRecordsList from "components/dashboard/patientFile/diseaseRecordsList";
import SurguryRecordsList from "components/dashboard/patientFile/surguryRecordsList";
import FamilyRecordsList from "components/dashboard/patientFile/familyRecordsList";
import AddictionRecordsList from "components/dashboard/patientFile/addictionRecordsList";
import FoodAllergyRecordsList from "components/dashboard/patientFile/foodAllergyRecordsList";
import MedicalAllergyRecordsList from "components/dashboard/patientFile/medicalAllergyRecordsList";
import PatientFormPreviewModal from "components/dashboard/patientFile/patientFormPreviewModal";

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

let ClinicID,
  ActivePatientID = null;
const PatientFile = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [patientForms, setPatientForms] = useState([]);

  // Patient Form Preview Modal
  const [showPrevModal, setShowPrevModal] = useState(false);
  const [patientFormData, setPatientFormData] = useState([]);
  const [patientFormValues, setPatientFormValues] = useState({});

  const closePatientFrmPreviewModal = () => setShowPrevModal(false);
  const openPatientFrmPreviewModal = (PFData) => {
    console.log({ PFData });
    setShowPrevModal(true);
    setPatientFormData(JSON.parse(PFData.formData.formData[0]));
    setPatientFormValues(PFData.Values);
  };

  const getOnePatient = () => {
    setIsLoading(true);
    let url = `Patient/getOne/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);
        setPatientData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getPatientForms = () => {
    let url = `Form/patientFormGetByUserID/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);
        setPatientForms(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // // Get One PatientForm
  // const getOnePatientForm = () => {
  //   setIsLoading(true);
  //   let url = `Form/patientFormGetOne/${ActivePatientID}`;

  //   axiosClient
  //     .get(url)
  //     .then((response) => {
  //       console.log(response.data);
  //       // setSelectedFormData(JSON.parse(response.data.formData.formData[0]));
  //       // setFormValues(response.data.Values);
  //       // setPatientData(response.data.Patient);

  //       // ActiveFormName = response.data.formData.Name;
  //       // ActivePatientID = response.data.Patient._id;
  //       // ActiveFormID = response.data.formData._id;

  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       ErrorAlert("خطا", "دریافت اطلاعات فرم با خطا مواجه گردید!");
  //       setIsLoading(false);
  //     });
  // };

  let InsuranceType,
    GenderType = null;
  if (patientData) {
    switch (patientData.Insurance) {
      case "1":
        InsuranceType = "سلامت ایرانیان";
        break;
      case "2":
        InsuranceType = "تامین اجتماعی";
        break;
      case "3":
        InsuranceType = "نیروهای مسلح";
        break;
      case "4":
        InsuranceType = "آزاد";
      default:
        break;
    }

    switch (patientData.Gender) {
      case "M":
        GenderType = "مرد";
        break;
      case "F":
        GenderType = "زن";
        break;
      case "O":
        GenderType = "دیگر";
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    ActivePatientID = router.query.id;
    if (ActivePatientID) {
      getOnePatient();
      getPatientForms();
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>پرونده بیمار</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="card-body p-4">
              <PatientCard data={patientData} />

              <div className="mt-5 mb-2">
                <FormsList
                  data={patientForms}
                  openPatientFrmPreviewModal={openPatientFrmPreviewModal}
                />
              </div>

              <div className="row mb-2">
                <div className="col-md-6 col-12">
                  <DiseaseRecordsList />
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <SurguryRecordsList />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-6 col-12">
                  <FamilyRecordsList />
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <AddictionRecordsList />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-6 col-12">
                  <FoodAllergyRecordsList />
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <MedicalAllergyRecordsList />
                </div>
              </div>
            </div>
          </div>
        )}

        <PatientFormPreviewModal
          show={showPrevModal}
          onHide={closePatientFrmPreviewModal}
          data={patientFormData}
          formValues={patientFormValues}
        />
      </div>
    </>
  );
};

export default PatientFile;
