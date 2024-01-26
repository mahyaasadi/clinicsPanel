import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { Toast } from "primereact/toast";
import { axiosClient } from "class/axiosConfig";
import { convertToFixedNumber } from "utils/convertToFixedNumber";
import {
  ErrorAlert,
  WarningAlert,
  QuestionAlert,
  SuccessAlert,
} from "class/AlertManage";
import SalamatPresctypes from "class/SalamatPrescType";
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
let ActivePrescImg,
  ActivePrescEngTitle = null;

// Services
let ActiveSrvName,
  ActiveSrvNationalNumber,
  ActiveSamadCode,
  ActiveCheckCode = null;
let existingCheckCodes = [];
let deletedCheckCodes = [];

let ClinicID = null;
const SalamatPrescription = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const toast = useRef(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [salamatDataIsLoading, setSalamatDataIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [registerIsLoading, setRegisterIsLoading] = useState(false);
  const [prescDataIsLoading, setPrescDataIsLoading] = useState(false);

  const [patientInfo, setPatientInfo] = useState([]);
  const [ActivePatientNID, setActivePatientNID] = useState(null);
  const [CitizenSessionId, setCitizenSessionId] = useState(null);
  const [SamadCode, setSamadCode] = useState(null);

  // Searchdes in Tabs
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

  // edit Mode
  const [editPrescMode, setEditPrescMode] = useState(false);
  const [editPrescSrvMode, setEditPrescSrvMode] = useState(false);
  const [editSrvData, setEditSrvData] = useState([]);

  //------ Patient Info ------//
  const getPatientInfo = (e) => {
    e && e.preventDefault();
    setPatientStatIsLoading(true);

    setActivePatientNID($("#patientNID").val());

    let url = "BimehSalamat/GetPatientSession";
    let data = {
      CenterID: ClinicID,
      NID:
        $("#patientNID").length !== 0
          ? convertToFixedNumber($("#patientNID").val())
          : ActivePatientNID,
      SavePresc: 1,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        $("#patientNID").prop("readonly", true);

        setCitizenSessionId(response.data.res.info?.citizenSessionId);
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
    if (patientMessages && patientMessages.length !== 0) {
      if (patientMessages.length !== 0) {
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
            life: 5000,
          };
          patientToastMessages.push(obj);
        }
        toast.current.show(patientToastMessages);
      }
    }
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
            life: 8000,
          };
          samadMessage.push(msObj);
          toast.current.show(samadMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "دریافت کد سماد با خطا مواجه گردید!");
      });
  };

  // PrescTypesHeader Tab Change
  const changePrescTypeTab = (prescImg, prescEngTitle, prescId) => {
    ActivePrescImg = prescImg;
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

    setSelectedConsumption(null);
    setSelectedConsumptionInstruction(null);
    setSelectedNOPeriod(null);
  };

  // Search Through Services
  const searchInSalamatServices = (e) => {
    e.preventDefault();
    setSearchIsLoading(true);
    setSearchFromInput(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "BimehSalamat";
    if (ActivePrescTypeID !== 1 && ActivePrescTypeID !== 10) {
      url += "/ServiceSerach";
    } else if (ActivePrescTypeID === 1) {
      url += "/DrugSerach";
    } else {
      url += "/CombinationDrugSerach";
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
            if (response.data.res.info) {
              $(".unsuccessfullSearch").hide();
              $(".SearchDiv").show();
            } else {
              $(".unsuccessfullSearch").show();
            }
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

  const selectSearchedService = (srvName, srvShape, srvNationalNumber) => {
    ActiveSrvName = srvName;
    ActiveSrvNationalNumber = srvNationalNumber;
    setActiveSrvShape(srvShape);
    $("#srvSearchInput").val(srvName);

    setSearchFromInput(false);
    setSearchIsLoading(false);

    $("#BtnServiceSearch").hide();
    $("#BtnActiveSearch").show();
    $(".SearchDiv").hide();
    $("#srvSearchInput").prop("readonly", true);
  };

  // Add Services To List
  const FUAddToListItem = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let url = "BimehSalamat/SubscriptionCheckOrder";
    let prescData = {
      SavePresc: 1,
      CenterID: ClinicID,
      SamadCode: SamadCode ? SamadCode : ActiveSamadCode,
      CitizenSessionId,
      PrescType: ActivePrescEngTitle,
      nationalNumber: ActiveSrvNationalNumber,
      bulkId: ActivePrescTypeID === 10 ? 1 : 0,
      SrvShape: ActiveSrvShape,
      QTY: $("#QtyInput").val(),
      description: $("#eprscItemDescription").val(),
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
      setIsLoading(false);
    } else if (
      (ActivePrescTypeID === 1 || ActivePrescTypeID === 10) &&
      !selectedConsumption
    ) {
      ErrorAlert("خطا", "لطفا زمان مصرف را انتخاب نمایید!");
      setIsLoading(false);
    } else {
      axiosClient
        .post(url, prescData)
        .then((response) => {
          if (response.data.res.info?.checkCode) {
            let addedPrescItemData = {
              serviceInterfaceName: $("#srvSearchInput").val(),
              numberOfRequest: $("#QtyInput").val(),
              description: $("#eprscItemDescription").val(),
              consumption: findConsumptionLbl?.label,
              consumptionVal: findConsumptionLbl?.value,
              consumptionInstruction: findInstructionLbl?.label,
              consumptionInstructionVal: findInstructionLbl?.value,
              numberOfPeriod: selectedNOPeriod,
              snackMessages: response.data.res.info?.message?.snackMessage,
              infoMessages: response.data.res.info?.message?.infoMessage,
              checkCode: response.data.res.info?.checkCode,
              prescTypeImg: ActivePrescImg,
              typeId: ActivePrescTypeID,
              prescTypeEngTitle: ActivePrescEngTitle,
              shape: ActiveSrvShape,
              bulkId: ActivePrescTypeID === 10 ? 1 : 0,
              serviceNationalNumber: ActiveSrvNationalNumber,
            };

            existingCheckCodes.push({
              checkCode: response.data.res.info?.checkCode,
            });

            if (editPrescSrvMode) {
              updatePrescItem(
                addedPrescItemData.serviceInterfaceName,
                addedPrescItemData
              );
            } else {
              setPrescriptionItemsData([
                ...prescriptionItemsData,
                addedPrescItemData,
              ]);
            }

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
          setSearchFromInput(true);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          if (err.response) {
            ErrorAlert(
              "ویرایش امکان پذیر نمی باشد!",
              err.response.data.resMessage
            );
          } else {
            ErrorAlert("خطا", "افزودن خدمت با خطا مواجه گردید!");
          }
        });
    }
  };

  // Delete Service
  const deleteService = async (id, flag) => {
    let result = await QuestionAlert("حذف سرویس!", "آیا از حذف اطمینان دارید؟");

    if (result) {
      setPrescriptionItemsData(
        prescriptionItemsData.filter((a) => a.checkCode !== id)
      );

      const index = existingCheckCodes.indexOf(id);
      existingCheckCodes.splice(index, 1);

      if (flag) {
        console.log({ flag });
        deletedCheckCodes.push({
          checkCode: id,
        });
      }
    }
  };

  // console.log({ deletedCheckCodes, existingCheckCodes, prescriptionItemsData });

  // Edit PrescriptionItems
  const getPrescBySamadCode = (CitizenSessionId) => {
    setEditPrescMode(true);

    if (CitizenSessionId) {
      setPrescDataIsLoading(true);

      let url = "BimehSalamat/PrescriptionFetchSamad";
      let data = {
        SavePresc: 1,
        CenterID: ClinicID,
        SamadCode: ActiveSamadCode,
        CitizenSessionId,
      };

      axiosClient
        .post(url, data)
        .then((response) => {
          // console.log(response.data);
          response.data.info.subscriptionInfos.map((x, index) => {
            {
              response.data.info.subscriptionInfos[index].salamatPresc = 1;
              // index !== 0 &&
              //   existingCheckCodes.push({
              //     checkCode: x.checkCode,
              //   });
            }
          });
          setPrescriptionItemsData(response.data.info.subscriptionInfos);
          setPrescDataIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPrescDataIsLoading(false);
        });
    } else {
      setPrescDataIsLoading(false);
    }
  };

  const handleEditService = (srvData) => {
    setEditSrvData(srvData);
    setEditPrescSrvMode(true);
    setSearchFromInput(true);
    $("#srvSearchInput").prop("readonly", true);

    setActivePrescTypeID(srvData.typeId);
    setActiveSrvShape(srvData.shape);
    ActiveSrvName = srvData.serviceInterfaceName;
    ActiveSrvNationalNumber = srvData.serviceNationalNumber;
    ActiveCheckCode = srvData.checkCode;
    ActivePrescEngTitle = SalamatPresctypes[srvData.typeId];
    $("#srvSearchInput").val(srvData.serviceInterfaceName);
    $("#QtyInput").val(srvData.numberOfRequest);
    $("#eprscItemDescription").val(srvData.description);

    // dropdowns
    setSelectedNOPeriod(srvData.numberOfPeriod);

    setSelectedConsumption(
      parseInt(
        srvData.consumptionSNOMEDCode
          ? srvData.consumptionSNOMEDCode
          : srvData.consumptionVal
      )
    );

    if (srvData.consumptionInstructionVal) {
      setSelectedConsumptionInstruction(srvData.consumptionInstructionVal);
    } else if (
      srvData.consumptionInstruction ||
      (srvData.consumptionInstruction && srvData.numberOfPeriod)
    ) {
      setSelectedNOPeriod(null);
      setSelectedConsumptionInstruction(srvData.consumptionInstruction);
    } else {
      setSelectedConsumptionInstruction(null);
    }

    // setSelectedConsumptionInstruction(
    //   editPrescSrvMode && srvData.consumptionInstruction
    //     ? srvData.consumptionInstruction
    //      // : srvData.consumptionInstructionVal
    //       // ? srvData.consumptionInstructionVal

    // );

    if (srvData?.salamatPresc) {
      deletedCheckCodes.push({ checkCode: srvData.checkCode });
    }

    existingCheckCodes = existingCheckCodes.filter(
      (a) => a.checkCode !== srvData.checkCode
    );
  };

  const updatePrescItem = (id, newArr) => {
    setSearchFromInput(true);

    let index = prescriptionItemsData.findIndex(
      (x) => x.serviceInterfaceName === id
    );
    let g = prescriptionItemsData[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else {
      setPrescriptionItemsData([
        ...prescriptionItemsData.slice(0, index),
        g,
        ...prescriptionItemsData.slice(index + 1),
      ]);
    }

    setEditPrescSrvMode(false);
  };

  // Final Register Or Visit
  const registerSalamatEprsc = () => {
    setRegisterIsLoading(true);

    let url = "BimehSalamat";
    let data = {
      CenterID: ClinicID,
      SavePresc: 1,
      SamadCode: SamadCode ? SamadCode : ActiveSamadCode,
      CitizenSessionId,
      otherServices: existingCheckCodes,
    };

    if (ActiveSamadCode) {
      url += "/PrescriptionUpdate";
      data.deleteSubscriptions = deletedCheckCodes;
    } else {
      url += "/PrescriptionSave";
    }

    console.log({ url, data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        if (response.data.res.resCode === -8402) {
          ErrorAlert("خطا", response.data.res.resMessage);
          setRegisterIsLoading(false);
        }

        if (response.data.res.info) {
          setRegisterIsLoading(false);

          let registerMessages = [];
          const infoMessageArray =
            response.data.res.info.message.infoMessage || [];
          const snackMessageArray =
            response.data.res.info.message.snackMessage || [];
          const sequenceNumber = response.data.res.info.sequenceNumber || "";
          const trackingCode = response.data.res.info.trackingCode || "";

          registerMessages.push(
            ...infoMessageArray.map((message) => ({
              severity: "Info",
              summary: "اطلاعات!",
              detail: message.text,
              sticky: true,
            }))
          );

          registerMessages.push(
            ...snackMessageArray.map((message) => ({
              severity:
                message.type === "I"
                  ? "Info"
                  : message.type === "E"
                    ? "Error"
                    : message.type === "W"
                      ? "Warning"
                      : "Success",
              summary:
                message.type === "I"
                  ? "اطلاعات!"
                  : message.type === "E"
                    ? "خطا!"
                    : message.type === "W"
                      ? "هشدار!"
                      : "موفق!",
              detail: message.text,
              sticky: true,
            }))
          );

          if (trackingCode || sequenceNumber) {
            SuccessAlert(
              "ثبت نسخه با موفقیت انجام گردید!",
              `${trackingCode ? "کد پیگیری نسخه : " + trackingCode : ""} \n  ${sequenceNumber ? "کد توالی نسخه : " + sequenceNumber : ""
              }`
            );
            ActiveSamadCode = null;
            existingCheckCodes = [];
            deletedCheckCodes = [];
          }

          if (response.data.res.status === 400) {
            ErrorAlert("خطا", "ثبت اطلاعات نسخه با خطا مواجه گردید!");
            setRegisterIsLoading(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات نسخه با خطا مواجه گردید!");
        setRegisterIsLoading(false);
      });
  };

  const CancelEdit = (srvData) => {
    deletedCheckCodes = deletedCheckCodes.filter(
      (a) => a.checkCode !== ActiveCheckCode
    );
  };

  useEffect(() => {
    if (CitizenSessionId && editPrescMode === false) generateSamadCode();
  }, [CitizenSessionId]);

  useEffect(() => {
    getSalamatDataClasses();
    $(".unsuccessfullSearch").hide();

    if (router.query.PID || router.query.SC) {
      ActiveSamadCode = router.query.SC;
      setEditPrescMode(true);
      setActivePatientNID(router.query.PID);
      $("#patientNID").val(router.query.PID);
      getPatientInfo();
    } else {
      // reset
      setActivePatientNID(null);
      $("#patientNID").val("");
    }

    existingCheckCodes = [];
    deletedCheckCodes = [];
  }, [router.isReady]);

  useEffect(() => {
    if (CitizenSessionId && editPrescMode)
      getPrescBySamadCode(CitizenSessionId);
  }, [router.isReady, CitizenSessionId]);

  useEffect(() => {
    if (!ActivePatientNID) $("#patientInfoCard2").hide();
  }, [ActivePatientNID]);

  return (
    <>
      <Head>
        <title>نسخه نویسی خدمات درمانی</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Toast ref={toast} position="top-left" />

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
                registerIsLoading={registerIsLoading}
                searchIsLoading={searchIsLoading}
                salamatDataIsLoading={salamatDataIsLoading}
                CancelEdit={CancelEdit}
                salamatHeaderList={salamatHeaderList}
                changePrescTypeTab={changePrescTypeTab}
                activeSearch={activeSearch}
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
                editPrescSrvMode={editPrescSrvMode}
                setEditPrescSrvMode={setEditPrescSrvMode}
                editSrvData={editSrvData}
                setEditSrvData={setEditSrvData}
                prescriptionItemsData={prescriptionItemsData}
                ActiveSamadCode={ActiveSamadCode}
              />

              <div className="prescList">
                <SalamatAddToListItems
                  prescDataIsLoading={prescDataIsLoading}
                  data={prescriptionItemsData}
                  salamatHeaderList={salamatHeaderList}
                  editPrescMode={editPrescMode}
                  consumptionOptions={consumptionOptions}
                  handleEditService={handleEditService}
                  deleteService={deleteService}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalamatPrescription;
