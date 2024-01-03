import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, QuestionAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import FormPreviewInline from "components/dashboard/forms/formPreview";

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
  ClinicUserID,
  ActiveFormID,
  ActiveReceptionObjID,
  ActivePatientFormID,
  ActivePatientID = null;

const AttachFormToPatientFile = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [frmIsLoading, setFrmIsLoading] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [patientData, setPatientData] = useState([]);

  const getOneFormData = () => {
    setIsLoading(true);
    let url = `Form/getOne/${ActiveFormID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setSelectedFormData(JSON.parse(response.data.formData[0]));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const attachForm = (e) => {
    e.preventDefault();
    setFrmIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Form/addPatientForm";
    let data = {
      ClinicID,
      UserID: ClinicUserID,
      ReceptionObjID: ActiveReceptionObjID ? ActiveReceptionObjID : null,
      PatientID: ActivePatientID,
      FormID: ActiveFormID,
      Values: formProps,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        setFrmIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات فرم با خطا مواجه گردید!");
        setFrmIsLoading(false);
      });
  };

  const getOnePatientForm = () => {
    setIsLoading(true);
    let url = `Form/patientFormGetOne/${ActivePatientFormID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setSelectedFormData(JSON.parse(response.data.formData.formData[0]));
        setFormValues(response.data.Values);
        setPatientData(response.data.Patient);

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    ActiveFormID = router.query.FID;
    ActivePatientID = router.query.PID;
    ActivePatientFormID = router.query.PFID;

    if (ActiveFormID) getOneFormData();
    if (ActivePatientFormID) getOnePatientForm();
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>افزودن فرم به پرونده بیمار</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <form onSubmit={attachForm}>
              <div className="card p-4">
                <FormPreviewInline
                  data={selectedFormData}
                  formValues={formValues}
                  patientData={patientData}
                />

                <div className="submit-section">
                  {!frmIsLoading ? (
                    <button
                      type="submit"
                      className="btn btn-primary rounded btn-save font-13"
                    >
                      ثبت
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary rounded font-13"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      در حال ثبت
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default AttachFormToPatientFile;
