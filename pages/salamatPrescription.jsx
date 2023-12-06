import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import PatientInfoCard from "@/components/dashboard/patientInfo/patientInfoCard";
import AddNewPatient from "@/components/dashboard/patientInfo/addNewPatient";
import PrescriptionCard from "components/dashboard/prescription/salamat/prescriptionCard";
import { SalamatPrescType } from "class/salamatPrescriptionData";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);
  //   let DrugAmountList = await getDrugAmountList();
  //   let drugInstructionList = await getDrugInstructionsList();

  if (result) {
    const { ClinicUser } = result;
    return {
      props: {
        ClinicUser,
        // drugAmountList: DrugAmountList.data.res.data,
        // drugInstructionList: drugInstructionList.data.res.data,
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

// patientInfo
let ClinicID,
  ActivePatientNID,
  ActivePatientID,
  ActiveInsuranceType,
  ActiveInsuranceID = null;

// PrescTypeHeader
let ActivePrescTypeID = 1;
let ActivePrescName = "دارو";
let ActivePrescImg,
  ActiveSrvTypePrsc = null;
let ActiveSrvTypeID = 1;

const SalamatPrescription = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState([]);

  //------ Patient Info ------//
  const getPatientInfo = (e) => {
    e.preventDefault();
    setPatientStatIsLoading(true);

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
        console.log(response.data);
        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
        } else {
          ActivePatientID = response.data.user._id;
          ActiveInsuranceType = response.data.user.InsuranceType;
          ActiveInsuranceID = response.data.user.Insurance;
          setPatientInfo(response.data.user);
          $("#patientInfoCard").show("");
        }
        setPatientStatIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const addNewPatient = (props) => {
    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;

    axiosClient
      .post(url, data)
      .then((response) => {
        setPatientInfo(response.data);
        $("#newPatientModal").modal("hide");
        $("#patientInfoCard").show("");
        if (response.data === false) {
          ErrorAlert(
            "خطا",
            "بیمار با اطلاعات وارد شده, تحت پوشش این بیمه نمی باشد!"
          );
          return false;
        } else if (response.data.errors) {
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
          return false;
        } else {
          SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  // DepartmentsHeader Tab Change
  const changePrescTypeTab = (srvTypeID, prescImg, prescName, prescId) => {
    ActiveSrvTypeID = srvTypeID;
    ActivePrescImg = prescImg;
    ActivePrescName = prescName;
    ActivePrescTypeID = prescId;
  };

  const getSalamatPrescTypeID = () => {
    let url = "BimehSalamat/SalamatPrescTypeId";

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => getSalamatPrescTypeID(), []);

  return (
    <>
      <Head>
        <title>نسخه نویسی خدمات درمانی</title>
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
                patientStatIsLoading={patientStatIsLoading}
              />
            </div>
            <div className="col-xxl-9 col-xl-8 col-lg-7 col-md-12">
              <PrescriptionCard
                SalamatHeaderList={SalamatPrescType}
                changePrescTypeTab={changePrescTypeTab}
              />
              {/* <PrescriptionCard
                setIsLoading={setIsLoading}
                searchIsLoading={searchIsLoading}
                drugAmountList={drugAmountList}
                drugInstructionList={drugInstructionList}
                SelectedInstruction={SelectedInstruction}
                setSelectedInstruction={setSelectedInstruction}
                SelectedAmount={SelectedAmount}
                setSelectedAmount={setSelectedAmount}
                FUSelectInstruction={FUSelectInstruction}
                FUSelectDrugAmount={FUSelectDrugAmount}
                taminHeaderList={TaminPrescType}
                taminParaServicesList={TaminParaServicesTypeList}
                changePrescTypeTab={changePrescTypeTab}
                selectParaSrvType={selectParaSrvType}
                searchTaminSrv={searchTaminSrv}
                activeSearch={activeSearch}
                selectSearchedService={selectSearchedService}
                taminSrvSearchList={taminSrvSearchList}
                FuAddToListItem={FuAddToListItem}
                registerEpresc={registerEpresc}
              /> */}

              <div className="prescList">
                {/* <AddToListItems data={prescriptionItemsData} /> */}
              </div>
            </div>
          </div>
        </div>

        <AddNewPatient
          addNewPatient={addNewPatient}
          ClinicID={ClinicID}
          ActivePatientNID={ActivePatientNID}
        />
      </div>
    </>
  );
};

export default SalamatPrescription;
