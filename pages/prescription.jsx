import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import PatientInfoCard from "components/dashboard/reception/patientInfo/patientInfoCard";
import PrescriptionCard from "components/dashboard/prescription/prescriptionCard";
// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   QueryClient,
//   QueryClientProvider,
// } from "react-query";

const getDrugInstructionsList = async () => {
  let url = "TaminEprsc/DrugInstruction";
  return await axiosClient.post(url);
};

const getDrugAmountList = async () => {
  let url = "TaminEprsc/DrugAmount";
  let result = await axiosClient.post(url);
  return result;
};

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);
  let DrugAmountList = await getDrugAmountList();
  let drugInstructionList = await getDrugInstructionsList();

  if (result) {
    const { ClinicUser } = result;
    return {
      props: {
        ClinicUser,
        drugAmountList: DrugAmountList.data.res.data,
        drugInstructionList: drugInstructionList.data.res.data,
      },
    };
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
  ActivePatientNID,
  ActivePatientID,
  ActiveInsuranceType = null;

const Prescription = ({ ClinicUser, drugAmountList, drugInstructionList }) => {
  ClinicID = ClinicUser.ClinicID;
  console.log({ drugAmountList, drugInstructionList });

  const [isLoading, setIsLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState([]);

  // Drug Instruction and Amount List
  let selectInstructionData = [];
  for (let i = 0; i < drugInstructionList.length; i++) {
    const item = drugInstructionList[i];
    let obj = {
      value: item.drugInstId,
      label: item.drugInstConcept,
    };
    selectInstructionData.push(obj);
  }
  drugInstructionList = selectInstructionData;

  selectInstructionData = [];
  for (let i = 0; i < drugAmountList.length; i++) {
    const item = drugAmountList[i];
    let obj = {
      value: item.drugAmntId,
      label: item.drugAmntConcept,
    };
    selectInstructionData.push(obj);
  }
  drugAmountList = selectInstructionData;
  selectInstructionData = null;

  //----- Patient Info -----//
  const getPatientInfo = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    ActivePatientNID = formProps.nationalCode;

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      NID: formProps.nationalCode,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        // if (response.data.error == "1") {
        //   $("#newPatientModal").modal("show");
        // } else {
        ActivePatientID = response.data.user._id;
        ActiveInsuranceType = response.data.user.InsuranceType;
        setPatientInfo(response.data.user);
        $("#patientInfoCard").show("");
        // }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>نسخه نویسی</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-12">
              <PatientInfoCard
                ClinicID={ClinicID}
                data={patientInfo}
                setPatientInfo={setPatientInfo}
                getPatientInfo={getPatientInfo}
                ActivePatientNID={ActivePatientNID}
              />
            </div>
            <div className="col-xxl-9 col-xl-8 col-lg-7 col-md-12 paddingL-0">
              <PrescriptionCard
                drugAmountList={drugAmountList}
                drugInstructionList={drugInstructionList}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescription;
