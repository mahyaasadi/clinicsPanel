import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { Toast } from "primereact/toast";
import { axiosClient } from "class/axiosConfig";
import { convertToFixedNumber } from "utils/convertToFixedNumber";
import { ErrorAlert, SuccessAlert, WarningAlert } from "class/AlertManage";
import PatientInfoCard from "components/dashboard/patientInfo/patientInfoCard";
import PatientVerticalCard from "components/dashboard/patientInfo/patientVerticalCard";
import PrescriptionCard from "components/dashboard/prescription/salamat/prescriptionCard";
import { generateSalamatPrescType } from "class/salamatPrescriptionData";
import { generateSalamatConsumptionOptions } from "class/salamatConsumptionOptions";
import { generateSalamatInstructionOptions } from "class/salamatInstructionOptions";
import SalamatAddToListItems from "components/dashboard/prescription/salamat/salamatAddToListItems";

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);
  if (result) {
    const { ClinicUser } = result;
    return {
      props: {
        ClinicUser,
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
// let ActivePrescTypeID = 1;
let ActiveSrvTypeID = 1;
let ActivePrescName = "دارو";
let ActivePrescImg,
  ActivePrescEngTitle = null;

// Services
let ActiveSrvName,
  ActiveSrvNationalNumber = null;
let existingCheckCodes = [];

let ClinicID = null;
const SalamatPrescription = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const toast = useRef(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [salamatDataIsLoading, setSalamatDataIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);

  const [patientInfo, setPatientInfo] = useState([]);
  const [ActivePatientNID, setActivePatientNID] = useState(null);
  const [CitizenSessionId, setCitizenSessionId] = useState(null);
  const [SamadCode, setSamadCode] = useState(null);

  // Drug Tab Search
  // const [prescSearchMode, setPrescSearchMode] = useState("DrugSearch");
  const [searchFromInput, setSearchFromInput] = useState(true);
  const [genericCodeOption, setGenericCodeOption] = useState(null);
  const [consumptionOptions, setConsumptionOptions] = useState([]);
  const [instructionOptions, setInstructionOptions] = useState([]);
  const [selectedConsumption, setSelectedConsumption] = useState(null);
  const [selectedConsumptionInstruction, setSelectedConsumptionInstruction] =
    useState(null);
  const [selectedNOPeriod, setSelectedNOPeriod] = useState(null);

  const [salamatHeaderList, setSalamatHeaderList] = useState([]);
  const [ActiveSrvShape, setActiveSrvShape] = useState(null);
  const [ActivePrescTypeID, setActivePrescTypeID] = useState(1);
  const [salamatSrvSearchList, setSalamatSrvSearchList] = useState([]);
  const [prescriptionItemsData, setPrescriptionItemsData] = useState([]);

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
      NID: convertToFixedNumber(formProps.nationalCode),
      SavePresc: 1,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        // console.log(response.data);
        $("#patientNID").prop("readonly", true);

        setCitizenSessionId(response.data.res.info.citizenSessionId);
        setPatientInfo(response.data.res.info);
        $("#patientInfoCard2").show();

        if (response.data.res.info) {
          setTimeout(() => {
            showPatientMessages(response.data.res.info.message.snackMessage);
          }, 1000);
        } else {
          ErrorAlert("خطا", "اطلاعات وارد شده را دوباره بررسی نمایید!");
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
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
        setActivePatientNID(null);
        $("#patientNID").val("");
        setPatientStatIsLoading(false);
        $("#patientNID").prop("readonly", false);
      });
  };

  // Patient Toast Messages
  let patientToastMessages = [];
  const showPatientMessages = (patientMessages) => {
    // if (patientMessages.length !== 0) {
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

    setActivePatientNID(null);
  };

  // Samad Code
  const generateSamadCode = () => {
    let url = "BimehSalamat/samadElectronicGenerate";

    let data = {
      SavePresc: 1,
      CenterID: ClinicID,
      CitizenSessionId,
    };

    let samadMessage = [];
    axiosClient
      .post(url, data)
      .then((response) => {
        setSamadCode(response.data.res?.info?.samadCode);

        if (response.data.res?.info?.samadCode) {
          let msObj = {
            severity: "Success",
            summary: "موفق!",
            detail: "کد سماد با موفقیت دریافت گردید.",
            life: 10000,
          };
          samadMessage.push(msObj);
          toast.current.show(samadMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        let msObj = {
          severity: "Error",
          summary: "خطا!",
          detail: "دریافت کد سماد با خطا مواجه گردید.",
          life: 10000,
        };
        samadMessage.push(msObj);
        toast.current.show(samadMessage);
      });
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
    ActivePrescEngTitle = prescEngTitle;

    setActivePrescTypeID(prescId);
    activeSearch();
    setSearchFromInput(true);
  };

  // Salamat Data Classes
  const getSalamatDataClasses = () => {
    setSalamatDataIsLoading(true);
    let url = "/BimehSalamat/BimehSalamDataClass";

    axiosClient
      .get(url)
      .then((response) => {
        // console.log(response.data);
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

  // Active Search
  const activeSearch = () => {
    setSearchFromInput(!searchFromInput);
    ActiveSrvName = null;

    $("#srvSearchInput").val("");
    $("#srvSearchInput").prop("readonly", false);
    $("#srvSearchInput").focus();
    $("#BtnActiveSearch").hide();
    setSearchIsLoading(false);
    setTimeout(() => {
      $("#BtnServiceSearch").show();
    }, 100);

    // testing
    setSelectedConsumption(null);
    setSelectedConsumptionInstruction(null);
    setSelectedNOPeriod(null)
  };

  // Search in Drugs Category
  const searchInSalamatServices = (e) => {
    e.preventDefault();
    setSearchIsLoading(true);
    setSearchFromInput(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "";
    if (ActivePrescTypeID !== 1 && ActivePrescTypeID !== 10) {
      url = "BimehSalamat/ServiceSerach";
    } else if (ActivePrescTypeID === 1) {
      url = "BimehSalamat/DrugSerach";
    } else {
      url = "BimehSalamat/CombinationDrugSerach";
    }

    let data = {
      SavePresc: 1,
      CenterID: ClinicID,
      CitizenSessionId,
      type: genericCodeOption ? "generic" : null,
      TypeID: ActivePrescTypeID,
      Text: formProps.srvSearchInput,
    };

    if (CitizenSessionId) {
      if (searchFromInput) {
        axiosClient
          .post(url, data)
          .then((response) => {
            console.log(response.data);

            if (response.data.res.resMessage === "عملیات با موفقیت انجام شد") {
              $(".unsuccessfullSearch").hide();
              $(".SearchDiv").show();
            } else {
              $(".unsuccessfullSearch").show();
            }
            // $(".unsuccessfullSearch").hide();
            setSalamatSrvSearchList(response.data.res?.info);
            setSearchIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setSearchIsLoading(false);
            setSearchFromInput(false);
          });
      } else {
        setSearchFromInput(false);
      }
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

    setSearchFromInput(false);
    setActiveSrvShape(srvShape);

    $("#srvSearchInput").val(srvName);
    $("#BtnServiceSearch").hide();
    setSearchIsLoading(false);
    $("#BtnActiveSearch").show();
    $(".SearchDiv").hide();
    $("#srvSearchInput").prop("readonly", true);
  };

  const FUAddToListItem = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let url = "BimehSalamat/SubscriptionCheckOrder";
    let prescData = {
      SavePresc: 1,
      bulkId: ActivePrescTypeID === 10 ? 1 : 0,
      CenterID: ClinicID,
      CitizenSessionId,
      SamadCode,
      PrescType: ActivePrescEngTitle,
      nationalNumber: ActiveSrvNationalNumber,
      QTY: $("#QtyInput").val(),
      description: $("#eprscItemDescription").val(),
      SrvShape: ActiveSrvShape,
      consumption: selectedConsumption?.toString(),
      consumptionInstruction: selectedConsumptionInstruction
        ? selectedConsumptionInstruction
        : null,
      numberOfPeriod: selectedNOPeriod ? selectedNOPeriod.toString() : null,
      otherServices: existingCheckCodes.length !== 0 ? existingCheckCodes : [],
    };

    let findConsumptionLbl = consumptionOptions.find(
      (x) => x.value === selectedConsumption
    );

    let findInstructionLbl = instructionOptions.find(
      (x) => x.value === selectedConsumptionInstruction
    );

    if (
      (ActivePrescTypeID === 1 || ActivePrescTypeID === 10) &&
      !selectedConsumptionInstruction &&
      !selectedNOPeriod
    ) {
      ErrorAlert("خطا", "لطفا دستور مصرف را انتخاب نمایید!");
    } else if (
      (ActivePrescTypeID === 1 || ActivePrescTypeID === 10) &&
      !selectedConsumption
    ) {
      ErrorAlert("خطا", "لطفا زمان مصرف را انتخاب نمایید!");
    } else {
      console.log({ prescData });

      axiosClient
        .post(url, prescData)
        .then((response) => {
          console.log(response.data);

          if (response.data.res.info?.checkCode) {
            let addedPrescItemData = {
              name: $("#srvSearchInput").val(),
              QTY: $("#QtyInput").val(),
              description: $("#eprscItemDescription").val(),
              consumption: findConsumptionLbl?.label,
              consumptionInstruction: findInstructionLbl?.label,
              numberOfPeriod: selectedNOPeriod,
              snackMessages: response.data.res.info?.message?.snackMessage,
              infoMessages: response.data.res.info?.message?.infoMessage,
              checkCode: response.data.res.info?.checkCode,
            };

            existingCheckCodes.push({
              checkCode: response.data.res.info?.checkCode,
            });

            setPrescriptionItemsData([
              ...prescriptionItemsData,
              addedPrescItemData,
            ]);

            // reset
            $("#srvSearchInput").val("");
            ActiveSrvName = null;
            $("#QtyInput").val("1");
            $("#eprscItemDescription").val("");
            setSelectedConsumption(null);
            setSelectedConsumptionInstruction(null);
            setSelectedNOPeriod(null);
            activeSearch();
          } else if (response.data.res.status === 409) {
            WarningAlert("هشدار", "اطلاعات ورودی را دوباره بررسی نمایید!");
          } else {
            ErrorAlert("خطا", "افزودن خدمت با خطا مواجه گردید!");
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          ErrorAlert("خطا", "افزودن خدمت با خطا مواجه گردید!");
        });
    }
  };

  const registerSalamatEprsc = () => {
    let url = "BimehSalamat/PrescriptionSave";
    let data = {
      CenterID: ClinicID,
      SavePresc: 1,
      SamadCode,
      CitizenSessionId,
      otherServices: existingCheckCodes,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        // if (response.data.) {
        // toast message for messages;
        // without lifeTime
        // }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات نسخه با خطا مواجه گردید!");
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
    $(".unsuccessfullSearch").hide();
  }, [router.isReady]);

  useEffect(() => {
    if (!ActivePatientNID) {
      $("#patientInfoCard2").hide();
      // showPatientMessages([]);
    }
  }, [ActivePatientNID]);

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
                isLoading={isLoading}
                searchIsLoading={searchIsLoading}
                salamatDataIsLoading={salamatDataIsLoading}
                salamatHeaderList={salamatHeaderList}
                changePrescTypeTab={changePrescTypeTab}
                activeSearch={activeSearch}
                // prescSearchMode={prescSearchMode}
                ActivePrescTypeID={ActivePrescTypeID}
                onSubmit={searchInSalamatServices}
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
                selectedNOPeriod={selectedNOPeriod}
                setSelectedNOPeriod={setSelectedNOPeriod}
                ActiveSrvShape={ActiveSrvShape}
                registerSalamatEprsc={registerSalamatEprsc}
              />

              <div className="prescList">
                <SalamatAddToListItems data={prescriptionItemsData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalamatPrescription;
