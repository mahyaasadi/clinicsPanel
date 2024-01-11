import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert, WarningAlert } from "class/AlertManage";
import PatientInfoCard from "components/dashboard/patientInfo/patientInfoCard";
import PatientVerticalCard from "components/dashboard/patientInfo/patientVerticalCard";
import AddNewPatient from "components/dashboard/patientInfo/addNewPatient";
import PrescriptionCard from "components/dashboard/prescription/salamat/prescriptionCard";
import { generateSalamatPrescType } from "class/salamatPrescriptionData";
import { generateSalamatConsumptionOptions } from "class/salamatConsumptionOptions";
import { generateSalamatInstructionOptions } from "class/salamatInstructionOptions";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

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

// PrescTypeHeader
let ActivePrescTypeID = 1;
let ActivePrescName = "دارو";
let ActivePrescImg,
  ActiveSrvTypePrsc = null;
let ActiveSrvTypeID = 1;
let ActivePrescEngTitle = null;

// Services
let ActiveSrvName,
  ActiveSrvNationalNumber = null;

let ClinicID = null;
const SalamatPrescription = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const toast = useRef(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [salamatDataIsLoading, setSalamatDataIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);

  const [patientInfo, setPatientInfo] = useState([]);
  const [ActivePatientNID, setActivePatientNID] = useState(null);
  const [CitizenSessionId, setCitizenSessionId] = useState(null);
  const [SamadCode, setSamadCode] = useState(null);

  const [salamatHeaderList, setSalamatHeaderList] = useState([]);
  const [ActiveSrvShape, setActiveSrvShape] = useState(null);

  // Drug Tab Search
  const [prescSearchMode, setPrescSearchMode] = useState("DrugSearch");
  const [salamatSrvSearchList, setSalamatSrvSearchList] = useState([]);
  const [genericCodeOption, setGenericCodeOption] = useState(null);
  const [consumptionOptions, setConsumptionOptions] = useState([]);
  const [instructionOptions, setInstructionOptions] = useState([]);
  const [selectedConsumption, setSelectedConsumption] = useState(null);
  const [selectedConsumptionInstruction, setSelectedConsumptionInstruction] =
    useState([]);

  //------ Patient Info ------//
  const getPatientInfo = (e) => {
    e.preventDefault();
    setPatientStatIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    setActivePatientNID(formProps.nationalCode);

    let url = "BimehSalamat/GetPatientSession";
    let data = {
      CenterID: ClinicID,
      NID: formProps.nationalCode,
      SavePresc: 1,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        // console.log(response.data);
        $("#patientNID").prop("readonly", true);

        setCitizenSessionId(response.data.res.info.citizenSessionId);
        setPatientInfo(response.data.res.info);
        $("#patientInfoCard2").show("");

        if (response.data.res.info) {
          setTimeout(() => {
            showPatientMessages(response.data.res.info.message.snackMessage);
          }, 1000);
        }

        setTimeout(() => {
          setPatientStatIsLoading(false);
          $("#frmPatientInfoBtnSubmit").hide();
          $("#getPatientCloseBtn").show();
          $("#patientNID").focus();
        }, 200);
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  // Patient Toast Messages
  let patientToastMessages = [];
  const showPatientMessages = (patientMessages) => {
    for (let i = 0; i < patientMessages.length; i++) {
      const element = patientMessages[i];
      let obj = {
        severity:
          element.type === "S"
            ? "Success"
            : element.type === "I"
            ? "Info"
            : element.type === "E"
            ? "Error"
            : "Warning",
        summary:
          element.type === "S"
            ? "موفق!"
            : element.type === "I"
            ? "اطلاعات!"
            : element.type === "E"
            ? "خطا!"
            : "هشدار!",
        detail: element.text,
        life: 10000,
      };
      patientToastMessages.push(obj);
    }
    toast.current.show(patientToastMessages);
  };

  const getPatientActiveSearch = () => {
    $("#patientNID").val("");
    $("#getPatientCloseBtn").hide();
    $("#frmPatientInfoBtnSubmit").show();
    $("#patientNID").prop("readonly", false);
    $("#patientInfoCard2").hide();

    // ActivePatientID = null;
    setActivePatientNID(null);
  };

  // PrescTypesHeader Tab Change
  const changePrescTypeTab = (
    srvTypeID,
    prescImg,
    prescName,
    prescEngTitle,
    prescId
  ) => {
    ActiveSrvTypeID = srvTypeID;
    ActivePrescImg = prescImg;
    ActivePrescName = prescName;
    (ActivePrescEngTitle = prescEngTitle), (ActivePrescTypeID = prescId);

    if (prescId === 1) setPrescSearchMode("DrugSearch");
    else setPrescSearchMode("otherCategoriesSearch");

    $("#srvSearchInput").val("");
    $("#BtnServiceSearch").show();
    $("#BtnActiveSearch").hide();
    // $(".SearchDiv").hide();
    $("#srvSearchInput").prop("readonly", false);
  };

  // Salamat Data Classes
  const getSalamatDataClasses = () => {
    setSalamatDataIsLoading(true);
    let url = "/BimehSalamat/BimehSalamDataClass";

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
        setConsumptionOptions(
          generateSalamatConsumptionOptions(response.data.SalamatConsumption)
        );
        setInstructionOptions(
          generateSalamatInstructionOptions(
            response.data.SalamatConsumptionInstruction
          )
        );
        setSalamatHeaderList(
          generateSalamatPrescType(response.data.SalamatType)
        );
        setSalamatDataIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSalamatDataIsLoading(false);
      });
  };

  // Samad Code
  const generateSamadCode = () => {
    let url = "BimehSalamat/samadElectronicGenerate";

    let data = {
      SavePresc: 1,
      CenterID: ClinicID,
      CitizenSessionId,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        // console.log(response.data);
        setSamadCode(response.data.res?.info?.samadCode);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Active Search
  const activeSearch = () => {
    // ActiveSrvCode = null;
    $("#srvSearchInput").val("");
    $("#BtnActiveSearch").hide();
    $("#srvSearchInput").prop("readonly", false);
    $("#BtnServiceSearch").show();
    $("#srvSearchInput").focus();
  };

  // Search in Drugs Category
  const searchInDrugsCategory = (e) => {
    e.preventDefault();
    setSearchIsLoading(true);

    if (CitizenSessionId) {
      let formData = new FormData(e.target);
      const formProps = Object.fromEntries(formData);

      let url = "BimehSalamat/DrugSerach";
      let data = {
        SavePresc: 1,
        CenterID: ClinicID,
        CitizenSessionId,
        type: genericCodeOption ? "generic" : null,
        Text: formProps.srvSearchInput,
      };

      console.log({ data });

      axiosClient
        .post(url, data)
        .then((response) => {
          $(".unsuccessfullSearch").hide();
          $(".SearchDiv").show();

          if (response.data.res.resMessage === "عملیات با موفقیت انجام شد") {
            $(".unsuccessfullSearch").hide();

            console.log(response.data);
            setSalamatSrvSearchList(response.data.res?.info);
            setSearchIsLoading(false);
          } else {
            $(".unsuccessfullSearch").show();
          }
          setSearchIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setSearchIsLoading(false);
        });
    } else {
      WarningAlert("هشدار", "استعلام بیمار صورت نگرفته است!");
      setSearchIsLoading(false);
    }
  };

  const searchInGeneralCategories = (e) => {
    e.preventDefault();
    console.log("search in general");
  };

  const selectSearchedService = (srvName, srvShape, srvNationalNumber) => {
    ActiveSrvName = srvName;
    ActiveSrvNationalNumber = srvNationalNumber;

    setActiveSrvShape(srvShape);

    $("#srvSearchInput").val(srvName);
    $("#BtnServiceSearch").hide();
    $("#BtnActiveSearch").show();
    $(".SearchDiv").hide();
    $("#srvSearchInput").prop("readonly", true);
  };

  const FUAddToListItem = (e) => {
    e.preventDefault();

    let url = "BimehSalamat/SubscriptionCheckOrder";
    let prescData = {
      SavePresc: 1,
      bulkId: 0,
      CenterID: ClinicID,
      CitizenSessionId,
      SamadCode,
      PrescType: ActivePrescEngTitle,
      nationalNumber: ActiveSrvNationalNumber,
      QTY: $("#QtyInput").val(),
      description: $("#eprscItemDescription").val(),
      SrvShape: ActiveSrvShape,
      consumption: selectedConsumption.toString(),
      consumptionInstruction: selectedConsumptionInstruction,
      numberOfPeriod: null,
      otherServices: [],
    };

    console.log({ prescData });

    axiosClient
      .post(url, prescData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (CitizenSessionId) generateSamadCode();
  }, [CitizenSessionId]);

  useEffect(() => {
    getSalamatDataClasses();

    // reset
    setActivePatientNID(null);
    $("#patientNID").val("");
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>نسخه نویسی خدمات درمانی</title>
      </Head>
      <div className="page-wrapper" ref={toast}>
        <div className="content container-fluid">
          <Toast ref={toast} />
          <div className="row">
            <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-12">
              <PatientInfoCard
                ClinicID={ClinicID}
                data={patientInfo}
                setPatientInfo={setPatientInfo}
                getPatientInfo={getPatientInfo}
                ActivePatientNID={ActivePatientNID}
                getPatientActiveSearch={getPatientActiveSearch}
                patientStatIsLoading={patientStatIsLoading}
              />

              <PatientVerticalCard data={patientInfo} mode="salamatPresc" />
            </div>
            <div className="col-xxl-9 col-xl-8 col-lg-7 col-md-12">
              <PrescriptionCard
                setIsLoading={setIsLoading}
                searchIsLoading={searchIsLoading}
                isLoading={isLoading}
                salamatHeaderList={salamatHeaderList}
                changePrescTypeTab={changePrescTypeTab}
                activeSearch={activeSearch}
                salamatDataIsLoading={salamatDataIsLoading}
                prescSearchMode={prescSearchMode}
                searchInDrugsCategory={searchInDrugsCategory}
                searchInGeneralCategories={searchInGeneralCategories}
                salamatSrvSearchList={salamatSrvSearchList}
                selectSearchedService={selectSearchedService}
                FUAddToListItem={FUAddToListItem}
                setGenericCodeOption={setGenericCodeOption}
                consumptionOptions={consumptionOptions}
                instructionOptions={instructionOptions}
                selectedConsumption={selectedConsumption}
                setSelectedConsumption={setSelectedConsumption}
                selectedConsumptionInstruction={selectedConsumptionInstruction}
                setSelectedConsumptionInstruction={
                  setSelectedConsumptionInstruction
                }
                ActiveSrvShape={ActiveSrvShape}
              />
              {/* <PrescriptionCard
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
                registerEpresc={registerEpresc}
              /> */}

              <div className="prescList">
                {/* <AddToListItems data={prescriptionItemsData} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalamatPrescription;
