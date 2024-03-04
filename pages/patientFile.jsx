import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { Tooltip } from "primereact/tooltip";
import FeatherIcon from "feather-icons-react";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import FormsList from "@/components/dashboard/patientsArchives/patientFile/formsList";
import FormOptionsModal from "components/dashboard/patientsArchives/formOptionsModal";
import PatientHorizontalCard from "components/dashboard/patientInfo/patientHorizontalCard";
import DiseaseRecordsList from "@/components/dashboard/patientsArchives/patientFile/diseaseRecords/diseaseRecordsList";
import DiseaseRecordsModal from "@/components/dashboard/patientsArchives/patientFile/diseaseRecords/diseaseRecordsModal";
import SurgeryRecordsList from "@/components/dashboard/patientsArchives/patientFile/surgeryRecords/surgeryRecordsList";
import SurgeryRecordModal from "@/components/dashboard/patientsArchives/patientFile/surgeryRecords/surgeryRecordModal";
import FamilyRecordsList from "@/components/dashboard/patientsArchives/patientFile/familyRecordsList";
import AddictionRecordsList from "@/components/dashboard/patientsArchives/patientFile/addictionRecordsList";
import FoodAllergyRecordsList from "@/components/dashboard/patientsArchives/patientFile/foodAllergyRecordsList";
import MedicalAllergyRecordsList from "@/components/dashboard/patientsArchives/patientFile/medicalAllergyRecordsList";
import MedicalParamsChart from "components/dashboard/patientsArchives/patientFile/medicalParams/medicalParamsChart";
import MedicalParamsModal from "components/dashboard/patientsArchives/patientFile/medicalParams/medicalParamsModal";
import NotesList from "components/dashboard/patientsArchives/patientFile/notes/notesList";
import AttachNoteModal from "components/dashboard/patientsArchives/patientFile/notes/attachNoteModal";
import ImgRecordsList from "components/dashboard/patientsArchives/patientFile/imgFiles/imgRecordsList";
import AttachImgFileModal from "components/dashboard/patientsArchives/patientFile/imgFiles/attachImgFileModal";
import PatientFormPreviewModal from "components/dashboard/forms/formPreview/patientFormPreviewModal";
import MedParamsList from "components/dashboard/patientsArchives/patientFile/medicalParams/medParamsList";

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

  //----- Patient Form Preview Modal
  const [showPrevModal, setShowPrevModal] = useState(false);
  const [patientFormData, setPatientFormData] = useState([]);
  const [patientFormValues, setPatientFormValues] = useState({});

  const closePatientFrmPreviewModal = () => setShowPrevModal(false);
  const openPatientFrmPreviewModal = (PFData) => {
    setShowPrevModal(true);
    // setPatientFormData(JSON.parse(PFData.formData.formData[0]));
    setPatientFormData(PFData);
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
        setPatientNotesData(response.data.Notes);
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

  //----- Patient Notes Modal
  const [showNoteCreatorModal, setShowNoteCreatorModal] = useState(false);
  const [patientNotesData, setPatientNotesData] = useState([]);
  const openNoteCreatorModal = () => setShowNoteCreatorModal(true);
  const closeNoteCreatorModal = () => setShowNoteCreatorModal(false);

  const AddNote = (submittedNote) => {
    setPatientNotesData([...patientNotesData, submittedNote]);
    getOnePatient();
    SuccessAlert(
      "موفق",
      `یادداشت با موفقیت به پرونده ${patientData.Name} اضافه گردید`
    );

    setTimeout(() => {
      setShowNoteCreatorModal(false);
    }, 200);
  };

  const RemoveNote = (selectedNoteID) => {
    setPatientNotesData(
      patientNotesData.filter((x) => x._id !== selectedNoteID)
    );
    getOnePatient();
  };

  // diseaseRecords
  const [showDiseaseRecordsModal, setShowDiseaseRecordsModal] = useState(false);
  const openDiseaseRecordsModal = () => setShowDiseaseRecordsModal(true);
  const [patientDiseases, setPatientDiseases] = useState([]);

  const getPatientDiseaseRecords = () => {
    let url = `Patient/getDisease/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientDiseases(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addDisease = (addedDisease) => {
    setPatientDiseases([...patientDiseases, addedDisease]);
    getPatientDiseaseRecords();
  };

  const removeDiseaseItem = (id) => {
    setPatientDiseases(patientDiseases.filter((x) => x._id !== id));
  };

  // imgFiles
  const [patientImgFiles, setPatientImgFiles] = useState([]);
  const [showAttachImgModal, setShowAttachImgFile] = useState(false);
  const openAttachImgFilesModal = () => setShowAttachImgFile(true);

  const getPatientImgAttachments = () => {
    setIsLoading(true);
    let url = `Patient/getAttachments/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientImgFiles(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const removePatientImgFile = async (id) => {
    let result = await QuestionAlert("", "آیا از حذف تصویر اطمینان دارید؟");

    if (result) {
      let url = "Patient/deleteAttachment";
      let data = {
        AttachmentID: id,
      };

      axiosClient
        .delete(url, { data })
        .then((response) => {
          setPatientImgFiles(patientImgFiles.filter((x) => x._id !== id));
          getPatientImgAttachments();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // attach imgFile
  const AttachImgFile = (uploadedFile) => {
    setPatientImgFiles([...patientImgFiles, uploadedFile]);
    getPatientImgAttachments();
  };

  // medical params
  const [patientMedicalParams, setPatientMedicalParams] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [showMedicalParamModal, setShowMedicalParamModal] = useState(false);
  const [medModalMode, setMedModalMode] = useState("add");
  const [medModalAddMode, setMedModalAddMode] = useState(false);
  const [selectedParam, setSelectedParam] = useState(null);
  const [selectedParamId, setSelectedParamId] = useState(null);

  const handleCloseMedicalParamModal = () => setShowMedicalParamModal(false);
  const openMedicalParamModal = (id, addMode) => {
    setMedModalMode("add");
    setMedModalAddMode(addMode);
    setShowMedicalParamModal(true);
    setSelectedParamId(id);
  };

  // Get All Measurements
  const getMeasurementData = () => {
    let url = `MedicalParms/getByCenter/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setMeasurementData(response.data);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  const [showMedParamsListModal, setShowMedParamsListModal] = useState(false);
  const [editMedParamData, setEditMedParamData] = useState([]);

  const closeMedParamsListModal = () => setShowMedParamsListModal(false);
  const openMedParamsListModal = (paramName, data, removeMedParam) => {
    setSelectedParam({ paramName, data, removeMedParam });
    setShowMedParamsListModal(true);
  };

  const openEditMedParamModal = (editData) => {
    setEditMedParamData(editData);
    setMedModalMode("edit");
    setShowMedicalParamModal(true);
  };

  const getPatientMedicalParams = () => {
    let url = `MedicalDetails/getAll/${ActivePatientID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientMedicalParams(response.data);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
      });
  };

  const attachMedicalParam = (addedMedParam) => {
    if (patientMedicalParams.hasOwnProperty(addedMedParam.Param)) {
      // If it exists, directly push to the existing array
      patientMedicalParams[addedMedParam.Param].push(addedMedParam);
    } else {
      // If it doesn't exist, create a new key-value pair with the new ParamID as the key
      patientMedicalParams[addedMedParam.Param] = [addedMedParam];
    }

    getPatientMedicalParams();
  };

  const editAttachedMedParam = (updatedMedParam) => {
    const index = selectedParam.data.findIndex(
      (item) => item._id === updatedMedParam._id
    );

    if (index !== -1) {
      const newData = [...selectedParam.data];
      newData[index] = updatedMedParam;

      setSelectedParam((prevState) => ({
        ...prevState,
        data: newData,
      }));

      getPatientMedicalParams();
    }
  };

  const removeAttachedMedicalParam = (id) => {
    const updatedData = selectedParam.data.filter((item) => item._id !== id);

    setSelectedParam((prevState) => ({
      ...prevState,
      data: updatedData,
    }));

    getPatientMedicalParams();
  };

  useEffect(() => {
    ActivePatientID = router.query.id;
    if (ActivePatientID) {
      getOnePatient();
      getPatientForms();
      getPatientDiseaseRecords();
      getMeasurementData();
      getPatientMedicalParams();
      getPatientImgAttachments();
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
            <div className="card-body p-4 dir-rtl">
              {/* <div className="d-flex justify-between">
                <div className="row row-col col-1">
                  <div className="w-100">
                    <button className="btn btn-outline-primary h-100 w-100">
                      a
                    </button>
                  </div>
                  <div className="">
                    <button className="btn btn-outline-primary h-100 w-100">
                      b
                    </button>
                  </div>

                  <div className="">
                    <button className="btn btn-outline-primary h-100 w-100">
                      c
                    </button>
                  </div>
                </div>

                <div className="col-11"> */}
              <PatientHorizontalCard
                data={patientData}
                ClinicUserID={ClinicUserID}
                getOnePatient={getOnePatient}
                avatarEditMode={true}
                generalEditMode={true}
              />
              {/* </div>
              </div> */}

              <div className="mt-4">
                <ul className="nav nav-tabs nav-justified nav-tabs-bottom navTabBorder-b fw-bold font-14">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#bottom-tab1"
                      data-bs-toggle="tab"
                    >
                      اطلاعات تکمیلی
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#bottom-tab2"
                      data-bs-toggle="tab"
                    >
                      تصاویر
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#bottom-tab3"
                      data-bs-toggle="tab"
                    >
                      یادداشت های دستی
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#bottom-tab4"
                      data-bs-toggle="tab"
                    >
                      فرم ها
                    </a>
                  </li> */}
                </ul>

                <div className="tab-content">
                  <div className="tab-pane show active" id="bottom-tab1">
                    <div className="row">
                      {measurementData.map((measure, index) => {
                        const id = measure._id;
                        const medicalData = patientMedicalParams[id];

                        // Only render the card if medicalData exists for the current measurement
                        if (medicalData) {
                          return (
                            <div
                              className="col-lg-4 col-sm-6 col-12"
                              key={index}
                            >
                              <div className="card border-gray">
                                <div className="card-header text-secondary font-13 fw-bold d-flex align-items-cenetr">
                                  <div>نمودار {measure.Name}</div>
                                  <div className="col d-flex gap-1 justify-content-end">
                                    <button
                                      onClick={() =>
                                        openMedParamsListModal(
                                          measure.Name,
                                          medicalData
                                        )
                                      }
                                      data-pr-position="right"
                                      className="btn btn-outline-secondary text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-1 formBtns editParamBtn"
                                    >
                                      <FeatherIcon icon="table" />
                                      <Tooltip target=".editParamBtn">
                                        ویرایش اطلاعات نمودار
                                      </Tooltip>
                                    </button>
                                    <button
                                      onClick={() =>
                                        openMedicalParamModal(id, false)
                                      }
                                      data-pr-position="left"
                                      className="btn btn-outline-secondary text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-1 formBtns newParamRecord"
                                    >
                                      <FeatherIcon icon="plus" />
                                      <Tooltip target=".newParamRecord">
                                        سابقه جدید
                                      </Tooltip>
                                    </button>
                                  </div>
                                </div>
                                <div className="card-body">
                                  <MedicalParamsChart
                                    id={id}
                                    data={medicalData}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null; // Skip rendering if no medicalData exists for the current measurement
                      })}

                      <div className="col-md-4">
                        <div
                          className="dashedBorder-card text-secondary btn w-100"
                          onClick={() => openMedicalParamModal(null, true)}
                        >
                          <div className="card-body h-100">
                            <div className="d-flex align-items-center justify-center plusIcon">
                              <FeatherIcon icon="plus" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* {Object.keys(patientMedicalParams).map((id) => (
                        <div className="col-md-4 col-12" key={id}>
                          <div className="card">
                            <div className="card-body">
                              <MedicalParamsChart
                                id={id}
                                data={patientMedicalParams[id]}
                              />
                            </div>
                          </div>
                        </div>
                      ))} */}

                      {/* <div className="col-md-4">
                        <div
                          className="dashedBorder-card text-secondary btn w-100"
                          onClick={() => console.log("object")}
                        >
                          <div className="card-body h-100">
                            <div className="d-flex align-items-center justify-center plusIcon">
                              <FeatherIcon icon="plus" />
                            </div>
                          </div>
                        </div>
                      </div> */}

                      {/* {measurementData.map((measure, index) => {
                        const id = measure._id;
                        const medicalData = patientMedicalParams[id];

                        return (
                          <div className="col-lg-4 col-sm-6 col-12" key={index}>
                            <div className="card border-gray">
                              <div className="card-header text-secondary font-13 fw-bold d-flex align-items-cenetr">
                                <div>نمودار {measure.Name}</div>
                                <div className="col d-flex gap-1 justify-content-end">
                                  <button
                                    onClick={() =>
                                      openMedParamsListModal(
                                        measure.Name,
                                        medicalData
                                      )
                                    }
                                    data-pr-position="right"
                                    className="btn btn-outline-secondary text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-1 formBtns editParamBtn"
                                  >
                                    <FeatherIcon icon="table" />
                                    <Tooltip target=".editParamBtn">
                                      ویرایش اطلاعات نمودار
                                    </Tooltip>
                                  </button>

                                  <button
                                    onClick={() => openMedicalParamModal(id)}
                                    data-pr-position="left"
                                    className="btn btn-outline-secondary text-secondary font-12 d-flex align-items-center gap-1 fw-bold p-1 formBtns newParamRecord"
                                  >
                                    <FeatherIcon icon="plus" />
                                    <Tooltip target=".newParamRecord">
                                      سابقه جدید
                                    </Tooltip>
                                  </button>
                                </div>
                              </div>

                              <div className="card-body">
                                {medicalData ? (
                                  <MedicalParamsChart
                                    id={id}
                                    data={medicalData}
                                  />
                                ) : (
                                  <p className="text-center font-12 text-secondary">
                                    داده ای ثبت نشده است.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })} */}
                    </div>

                    <div>
                      <FormsList
                        data={patientForms}
                        openPatientFrmPreviewModal={openPatientFrmPreviewModal}
                        openAddFrmToPatientModal={openAddFrmToPatientModal}
                        deletePatientForm={deletePatientForm}
                      />
                    </div>

                    <div className="row mb-2">
                      <div className="col-lg-6 col-12">
                        <DiseaseRecordsList
                          data={patientDiseases}
                          openDiseaseRecordsModal={openDiseaseRecordsModal}
                          removeDiseaseItem={removeDiseaseItem}
                          setIsLoading={setIsLoading}
                        />
                      </div>

                      <div className="col-lg-6 col-12 mb-2">
                        <SurgeryRecordsList
                          ClinicID={ClinicID}
                          ClinicUserID={ClinicUserID}
                          ActivePatientID={ActivePatientID}
                          data={patientSurgeryList}
                          openSurgeryModal={openSurgeryModal}
                          openEditSurgeryModal={openEditSurgeryModal}
                          removeAttachedSurgeryRecord={
                            removeAttachedSurgeryRecord
                          }
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

                  <div className="tab-pane" id="bottom-tab2">
                    <div className="row mb-2">
                      <div className="col-12">
                        <ImgRecordsList
                          openAttachImgFilesModal={openAttachImgFilesModal}
                          data={patientImgFiles}
                          removePatientImgFile={removePatientImgFile}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tab-pane" id="bottom-tab3">
                    <div className="row mb-2">
                      <div className="col-12">
                        <NotesList
                          openNoteCreatorModal={openNoteCreatorModal}
                          patientNotesData={patientNotesData}
                          RemoveNote={RemoveNote}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="tab-pane" id="bottom-tab4">
                    <div>
                      <FormsList
                        data={patientForms}
                        openPatientFrmPreviewModal={openPatientFrmPreviewModal}
                        openAddFrmToPatientModal={openAddFrmToPatientModal}
                        deletePatientForm={deletePatientForm}
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        )}

        <PatientFormPreviewModal
          patientData={patientData}
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

        <DiseaseRecordsModal
          ClinicID={ClinicID}
          show={showDiseaseRecordsModal}
          setShow={setShowDiseaseRecordsModal}
          ActivePatientID={ActivePatientID}
          addDisease={addDisease}
        />

        <AttachNoteModal
          show={showNoteCreatorModal}
          onHide={closeNoteCreatorModal}
          ClinicID={ClinicID}
          ActivePatientID={ActivePatientID}
          AddNote={AddNote}
        />

        <AttachImgFileModal
          show={showAttachImgModal}
          setShowModal={setShowAttachImgFile}
          ActivePatientID={ActivePatientID}
          ClinicID={ClinicID}
          AttachImgFile={AttachImgFile}
        />

        <MedicalParamsModal
          show={showMedicalParamModal}
          onHide={handleCloseMedicalParamModal}
          mode={medModalMode}
          medModalAddMode={medModalAddMode}
          ClinicID={ClinicID}
          data={editMedParamData}
          ActivePatientID={ActivePatientID}
          selectedParamId={selectedParamId}
          setSelectedParamId={setSelectedParamId}
          measurementData={measurementData}
          attachMedicalParam={attachMedicalParam}
          editAttachedMedParam={editAttachedMedParam}
        />

        <MedParamsList
          show={showMedParamsListModal}
          onHide={closeMedParamsListModal}
          paramName={selectedParam?.paramName}
          data={selectedParam?.data}
          ActivePatientID={ActivePatientID}
          removeAttachedMedicalParam={removeAttachedMedicalParam}
          openEditMedParamModal={openEditMedParamModal}
        />
      </div>
    </>
  );
};

export default PatientFile;
