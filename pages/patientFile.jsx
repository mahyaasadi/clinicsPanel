import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import FormsList from "components/dashboard/patientFile/formsList";
import FormOptionsModal from "components/dashboard/patientsArchives/formOptionsModal";
import PatientCard from "components/dashboard/patientFile/PatientCard";
import DiseaseRecordsList from "components/dashboard/patientFile/diseaseRecordsList";
import SurgeryRecordsList from "components/dashboard/patientFile/surgeryRecords/surgeryRecordsList";
import SurgeryRecordModal from "components/dashboard/patientFile/surgeryRecords/surgeryRecordModal";
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
  ActivePatientID,
  ClinicUserID = null;
const PatientFile = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

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
    setShowPrevModal(true);
    setPatientFormData(JSON.parse(PFData.formData.formData[0]));
    setPatientFormValues(PFData.Values);
  };

  // Patient Add New Form
  const [showFormOptionsModal, setShowFormOptionsModal] = useState(false);
  const handleCloseFrmOptionsModal = () => setShowFormOptionsModal(false);
  const openAddFrmToPatientModal = (data) => setShowFormOptionsModal(true);

  // Get One Patient Data
  const getOnePatient = () => {
    setIsLoading(true);
    let url = `Patient/getOne/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  // Get One Patient's Forms
  const getPatientForms = () => {
    let url = `Form/patientFormGetByUserID/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientForms(response.data);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  // Surgery Records
  const [surguryList, setSurgeryList] = useState([]);
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [surgeryModalMode, setSurgeryModalMode] = useState("add");
  const closeSurgeryModal = () => setShowSurgeryModal(false);
  const openSurgeryModal = () => setShowSurgeryModal(true);
  const openEditSurgeryModal = () => setSurgeryModalMode("edit");

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
                  openAddFrmToPatientModal={openAddFrmToPatientModal}
                />
              </div>

              <div className="row mb-2">
                <div className="col-md-6 col-12">
                  <DiseaseRecordsList />
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <SurgeryRecordsList
                    // data={}
                    openSurgeryModal={openSurgeryModal}
                    openEditSurgeryModal={openEditSurgeryModal}
                  />
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

        <FormOptionsModal
          show={showFormOptionsModal}
          onHide={handleCloseFrmOptionsModal}
          ClinicID={ClinicID}
          ClinicUserID={ClinicUserID}
          ActivePatientID={ActivePatientID}
        />

        <SurgeryRecordModal
          mode={surgeryModalMode}
          show={showSurgeryModal}
          onHide={closeSurgeryModal}
        />
      </div>
    </>
  );
};

export default PatientFile;
