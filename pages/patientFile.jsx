import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import FormsList from "components/dashboard/patientFile/formsList";
import FormOptionsModal from "components/dashboard/patientsArchives/formOptionsModal";
import PatientHorizontalCard from "components/dashboard/patientInfo/patientHorizontalCard";
import DiseaseRecordsList from "components/dashboard/patientFile/diseaseRecordsList";
import SurgeryRecordsList from "components/dashboard/patientFile/surgeryRecords/surgeryRecordsList";
import SurgeryRecordModal from "components/dashboard/patientFile/surgeryRecords/surgeryRecordModal";
import FamilyRecordsList from "components/dashboard/patientFile/familyRecordsList";
import AddictionRecordsList from "components/dashboard/patientFile/addictionRecordsList";
import FoodAllergyRecordsList from "components/dashboard/patientFile/foodAllergyRecordsList";
import MedicalAllergyRecordsList from "components/dashboard/patientFile/medicalAllergyRecordsList";
import PatientFormPreviewModal from "components/dashboard/forms/formPreview/patientFormPreviewModal";
import NotesList from "components/dashboard/patientFile/notes/notesList";

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
  const [patientSurgeryList, setPatientSurgeryList] = useState();

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
  const openAddFrmToPatientModal = () => setShowFormOptionsModal(true);

  // Get One Patient Data
  const getOnePatient = () => {
    setIsLoading(true);
    let url = `Patient/getOne/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientSurgeryList(response.data.SurgeryList);
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

  // Delete Patient's Form
  const deletePatientForm = async (id) => {
    let result = await QuestionAlert(
      "حذف فرم!",
      "آیا از حذف فرم اطمینان دارید؟"
    );

    if (result) {
      setIsLoading(true);
      let url = `Form/deletePatientForm/${id}`;
      let data = {
        UserID: ClinicUserID,
      };

      await axiosClient
        .delete(url, { data })
        .then((response) => {
          setPatientForms(patientFormData.filter((a) => a._id !== id));
          getPatientForms();
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          ErrorAlert("خطا", "حذف با خطا مواجه گردید!");
          setIsLoading(true);
        });
    }
  };

  // Surgery Records
  const [editPatientSurguryData, setEditPatientSurguryData] = useState([]);
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [surgeryModalMode, setSurgeryModalMode] = useState("add");
  // other options for surgeryType
  const [showOtherSurgeryType, setShowOtherSurgeryType] = useState(false);
  const [newDefaultSurgery, setNewDefaultSurgery] = useState("");

  const closeSurgeryModal = () => {
    setShowSurgeryModal(false);
    setNewDefaultSurgery("");
  };

  // Attach Surgery Record
  const openSurgeryModal = (data) => {
    setShowSurgeryModal(true);
    setSurgeryModalMode("add");
    setShowOtherSurgeryType(false);
    setNewDefaultSurgery("");
  };

  const attachSurgeryRecordToPatient = (addedSurgeryRecord) => {
    if (addedSurgeryRecord) {
      setPatientSurgeryList([...patientSurgeryList, addedSurgeryRecord]);
      setShowSurgeryModal(false);
      getOnePatient();
    }
  };

  // Edit Attached Surgery Record
  const openEditSurgeryModal = (data) => {
    setShowSurgeryModal(true);
    setSurgeryModalMode("edit");
    setEditPatientSurguryData(data);
    setShowOtherSurgeryType(false);
  };

  const editAttachedSurgeryRecord = (newArr, id) => {
    let index = patientSurgeryList.findIndex((x) => x._id === id);
    let g = patientSurgeryList[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else
      setPatientSurgeryList([
        ...patientSurgeryList.slice(0, index),
        g,
        ...patientSurgeryList.slice(index + 1),
      ]);

    setShowSurgeryModal(false);
  };

  // Remove Attach Surgery Record
  const removeAttachedSurgeryRecord = (SurgeryID) => {
    setIsLoading(true);
    if (SurgeryID) {
      setPatientSurgeryList(
        patientSurgeryList.filter((a) => a._id !== SurgeryID)
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    ActivePatientID = router.query.id;
    if (ActivePatientID) {
      getOnePatient();
      getPatientForms();
    }
    setShowOtherSurgeryType(false);
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
              <PatientHorizontalCard data={patientData} />

              <div className="mt-5 mb-2">
                <FormsList
                  data={patientForms}
                  openPatientFrmPreviewModal={openPatientFrmPreviewModal}
                  openAddFrmToPatientModal={openAddFrmToPatientModal}
                  deletePatientForm={deletePatientForm}
                />
              </div>

              <div className="row mb-2">
                <div className="col-12">
                  <NotesList />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-6 col-12">
                  <DiseaseRecordsList />
                </div>

                <div className="col-lg-6 col-12 mb-2">
                  <SurgeryRecordsList
                    ClinicID={ClinicID}
                    ClinicUserID={ClinicUserID}
                    ActivePatientID={ActivePatientID}
                    data={patientSurgeryList}
                    patientData={patientData}
                    openSurgeryModal={openSurgeryModal}
                    openEditSurgeryModal={openEditSurgeryModal}
                    removeAttachedSurgeryRecord={removeAttachedSurgeryRecord}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-6 col-12">
                  <FamilyRecordsList />
                </div>
                <div className="col-lg-6 col-12 mb-2">
                  <AddictionRecordsList />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-lg-6 col-12">
                  <FoodAllergyRecordsList />
                </div>
                <div className="col-lg-6 col-12 mb-2">
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
          ActivePatientID={ActivePatientID}
          data={editPatientSurguryData}
          attachSurgeryRecordToPatient={attachSurgeryRecordToPatient}
          editAttachedSurgeryRecord={editAttachedSurgeryRecord}
          showOtherSurgeryType={showOtherSurgeryType}
          setShowOtherSurgeryType={setShowOtherSurgeryType}
          newDefaultSurgery={newDefaultSurgery}
          setNewDefaultSurgery={setNewDefaultSurgery}
        />
      </div>
    </>
  );
};

export default PatientFile;
