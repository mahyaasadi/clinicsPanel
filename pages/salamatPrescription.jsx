import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { Toast } from "primereact/toast";
import { axiosClient } from "class/axiosConfig";
import SalamatPresctypes from "class/SalamatPrescType";
import { convertToFixedNumber } from "utils/convertToFixedNumber";
import { displayToastMessages } from "utils/toastMessageGenerator";
import { salamatPrescItemCreator } from "utils/salamatPrescItemCreator";
import { generateSalamatPrescType } from "class/salamatPrescriptionData";
import GetPinInput from "components/commonComponents/pinInput";
import PatientInfoCard from "components/dashboard/patientInfo/patientInfoCard";
import PrescriptionCard from "components/dashboard/prescription/salamat/prescriptionCard";
import { generateSalamatConsumptionOptions } from "class/salamatConsumptionOptions";
import { generateSalamatInstructionOptions } from "class/salamatInstructionOptions";
import SalamatAddToListItems from "components/dashboard/prescription/salamat/salamatAddToListItems";
import SalamatFavItemsModal from "components/dashboard/prescription/salamat/salamatFavItemsModal";
import PrescQuickAccessCard from "@/components/dashboard/prescription/favourites/prescQuickAccessCard";
import ApplyFavPrescModal from "components/dashboard/prescription/favourites/applyFavPrescModal";
import {
  ErrorAlert,
  WarningAlert,
  QuestionAlert,
  SuccessAlert,
  TimerAlert,
} from "class/AlertManage";

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

  // Search in Tabs
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

  // fav items
  const [favSalamatItems, setFavSalamatItems] = useState([]);
  const [favItemMode, setFavItemMode] = useState(false);
  const [showFavItemsModal, setShowFavItemsModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");

  // PinInput Modal
  const [showPinInputModal, setShowPinInputModal] = useState(false);
  const closePinInputModal = () => setShowPinInputModal(false);

  const getPinInputValue = (code) => {
    checkCPartyOtp(code);
  };

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
        if (response.data.isTwoStep) setShowPinInputModal(true);
        else {
          setCitizenSessionId(response.data.res.info?.citizenSessionId);
          setPatientInfo(response.data.res.info);

          $("#patientNID").prop("readonly", true);
          $("#patientInfoCard2").show();
          setTimeout(() => {
            displayToastMessages(
              response.data.res.info.message.snackMessage,
              toast,
              null
            );
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
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
        setActivePatientNID(null);
        $("#patientNID").val("");
        setPatientStatIsLoading(false);
        $("#patientNID").prop("readonly", false);
      });
  };

  // check CParty otp
  const checkCPartyOtp = async (otpCode) => {
    let url = "BimehSalamat/CpartyOtpCheck";
    setPatientStatIsLoading(true);

    if (otpCode) {
      setShowPinInputModal(false);

      let data = {
        CenterID: ClinicID,
        otp: otpCode,
        SavePresc: 1,
        PatientID:
          $("#patientNID").length !== 0
            ? convertToFixedNumber($("#patientNID").val())
            : ActivePatientNID,
      };

      console.log({ data });

      axiosClient
        .post(url, data)
        .then((response) => {
          console.log(response.data);
          setActivePatientNID($("#patientNID").val());

          setTimeout(() => {
            getPatientInfo();
          }, 1000);
          setPatientStatIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPatientStatIsLoading(false);
        });
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
          displayToastMessages([], toast, "کد سماد با موفقیت دریافت گردید.");
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
    $("#QtyInput").val("1");
    $("#eprscItemDescription").val("");
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

  // Fav Salamat Items
  const [favItemIsLoading, setFavItemIsLoading] = useState(false);

  const getFavSalamatItems = () => {
    setFavItemIsLoading(true);
    let url = `CenterFavEprsc/getSalamat/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setFavItemIsLoading(false);
        setFavSalamatItems(response.data);
      })
      .catch((err) => {
        console.log(err);
        setFavItemIsLoading(false);
      });
  };

  const selectFavSalamatItem = (selectedSrv) => {
    let url = "CenterFavEprsc/addSalamat";
    let data = {
      CenterID: ClinicID,
      prescItem: selectedSrv,
    };
    selectedSrv.favItemMode = true;

    if (
      favSalamatItems.length > 0 &&
      favSalamatItems.find(
        (x) => x.serviceNationalNumber === selectedSrv.serviceNationalNumber
      )
    ) {
      ErrorAlert("", "انتخاب سرویس تکراری امکان پذیر نمی باشد.");
      return false;
    } else {
      axiosClient
        .post(url, data)
        .then((response) => {
          setFavSalamatItems([...favSalamatItems, response.data]);
          SuccessAlert("موفق", "سرویس به لیست علاقه مندی ها اضافه گردید!");
        })
        .catch((err) => console.log(err));
    }
  };

  const removeFavItem = (srvNationalNumber) => {
    let url = `CenterFavEprsc/deleteSalamat/${ClinicID}/${srvNationalNumber}`;

    axiosClient
      .delete(url)
      .then((response) => {
        if (response.data.Status === "ok") {
          const removedFav = prescriptionItemsData.map((presc) => {
            if (presc.serviceNationalNumber === srvNationalNumber) {
              return { ...presc, favItemMode: false };
            }
            return presc;
          });

          setPrescriptionItemsData(removedFav);

          setFavSalamatItems(
            favSalamatItems.filter(
              (x) => x.serviceNationalNumber !== srvNationalNumber
            )
          );
        }
      })
      .catch((err) => console.log(err));
  };

  // Fav Presc
  const [showApplyFavPrescModal, setShowApplyFavPrescModal] = useState(false);
  const [favPrescData, setFavPrescData] = useState([]);
  const [editFavPrescData, setEditFavPrescData] = useState([]);
  const openApplyFavPrescModal = () => setShowApplyFavPrescModal(true);
  const closeApplyFavPrescModal = () => setShowApplyFavPrescModal(false);

  const getSalamatFavPrescs = () => {
    setFavItemIsLoading(true);
    let url = `CenterFavEprsc/getAll/${ClinicID}/${"Salamat"}`;

    axiosClient
      .get(url)
      .then((response) => {
        setFavItemIsLoading(false);
        setFavPrescData(response.data);
      })
      .catch((err) => {
        console.log(err);
        setFavItemIsLoading(false);
      });
  };

  const handleResetFavPresc = () => {
    existingCheckCodes = [];
    setEditFavPrescData([]);
    setSearchFromInput(true);
    setPrescriptionItemsData([]);
  };

  const handleAddFavPresc = async (favPresc) => {
    setIsLoading(false);

    if (ActivePatientNID) {
      await handleResetFavPresc();

      activeSearch();
      setPrescriptionItemsData([]);
      let newPrescriptionItemsData = [];
      let addedPrescItemData = {};
      setEditFavPrescData(favPresc);

      for (let i = 0; i < favPresc.Items[0].length; i++) {
        const element = favPresc.Items[0][i];

        let prescData = await salamatPrescItemCreator(
          1,
          ClinicID,
          SamadCode ? SamadCode : ActiveSamadCode,
          CitizenSessionId,
          element.prescTypeEngTitle,
          element.serviceNationalNumber,
          element.bulkId,
          element.shape,
          element.numberOfRequest,
          element.description,
          element.consumptionVal?.toString(),
          element.consumptionInstructionVal
            ? element.consumptionInstructionVal
            : null,
          element.numberOfPeriod ? element.numberOfPeriod : null,
          existingCheckCodes.length !== 0 ? existingCheckCodes : [],
          element.typeId,
          setIsLoading,
          favItemMode,
          true
        );

        addedPrescItemData = await FUAddToListItem(
          prescData,
          element.serviceInterfaceName
        );

        if (addedPrescItemData) {
          newPrescriptionItemsData.push(addedPrescItemData);
        }
      }

      // Update state after the loop with all accumulated data
      setPrescriptionItemsData(newPrescriptionItemsData);
    } else {
      ErrorAlert("", "استعلام بیمار گرفته نشده است!");
    }
  };

  const applyFavPresc = (favPresc) => {
    setFavPrescData([...favPrescData, favPresc]);
  };

  // Edit Fav Presc
  const editFavPresc = (id) => {
    let url = `CenterFavEprsc/update/${id}`;

    let data = {
      CenterID: ClinicID,
      Name: editFavPrescData.Name,
      Tamin: false,
      Salamat: true,
      prescItems: prescriptionItemsData,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        let findFavPresc = favPrescData.filter(
          (presc) => presc._id === response.data._id
        );

        findFavPresc.Items = response.data.Items;
        getSalamatFavPrescs();
        setTimeout(() => {
          SuccessAlert("", "ویرایش نسخه با موفقیت انجام گردید!");
        }, 200);

        handleResetFavPresc();
        activeSearch();
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ویرایش نسخه با خطا مواجه گردید!");
      });
  };

  const removeFavSalamatPresc = (id) => {
    let url = `CenterFavEprsc/delete/${id}`;

    axiosClient
      .delete(url)
      .then((response) => {
        setFavPrescData(favPrescData.filter((item) => item._id !== id));
        handleResetFavPresc();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Add Services To List
  const FUAddToListItem = async (_prescData, _name) => {
    setIsLoading(true);

    let url = "BimehSalamat/SubscriptionCheckOrder";
    let prescData = {};
    if (_prescData) {
      prescData = _prescData;
    } else {
      prescData = await salamatPrescItemCreator(
        1,
        ClinicID,
        SamadCode ? SamadCode : ActiveSamadCode,
        CitizenSessionId,
        ActivePrescEngTitle,
        ActiveSrvNationalNumber,
        ActivePrescTypeID === 10 ? 1 : 0,
        ActiveSrvShape,
        $("#QtyInput").val(),
        $("#eprscItemDescription").val(),
        selectedConsumption?.toString(),
        selectedConsumptionInstruction ? selectedConsumptionInstruction : null,
        selectedNOPeriod ? selectedNOPeriod.toString() : null,
        existingCheckCodes.length !== 0 ? existingCheckCodes : [],
        ActivePrescTypeID,
        setIsLoading,
        favItemMode
      );
    }

    let findConsumptionLbl = null;
    if (selectedConsumption) {
      findConsumptionLbl = consumptionOptions.find(
        (x) => x.value === selectedConsumption
      );
    } else {
      findConsumptionLbl = consumptionOptions.find(
        (x) => x.value.toString() === prescData.consumption
      );
    }

    let findInstructionLbl = null;
    if (selectedConsumptionInstruction) {
      findInstructionLbl = instructionOptions.find(
        (x) => x.value === selectedConsumptionInstruction
      );
    } else {
      findInstructionLbl = instructionOptions.find(
        (x) => x.value.toString() === prescData.consumptionInstruction
      );
    }

    try {
      const response = await axiosClient.post(url, prescData);
      if (response.data.res.info?.checkCode) {
        setIsLoading(false);

        let addedPrescItemData = {
          serviceInterfaceName: _name ? _name : $("#srvSearchInput").val(),
          numberOfRequest: prescData.QTY ? prescData.QTY : $("#QtyInput").val(),
          description: $("#eprscItemDescription").val(),
          consumption: findConsumptionLbl?.label
            ? findConsumptionLbl?.label
            : null,
          consumptionVal: findConsumptionLbl?.value
            ? findConsumptionLbl?.value
            : null,
          consumptionInstruction: findInstructionLbl?.label
            ? findInstructionLbl?.label
            : null,
          consumptionInstructionVal: findInstructionLbl?.value
            ? findInstructionLbl?.value
            : null,
          numberOfPeriod: selectedNOPeriod
            ? selectedNOPeriod
            : prescData.numberOfPeriod,
          snackMessages: response.data.res.info?.message?.snackMessage,
          infoMessages: response.data.res.info?.message?.infoMessage,
          checkCode: response.data.res.info?.checkCode,
          prescTypeImg: ActivePrescImg,
          typeId: prescData.typeId ? prescData.typeId : ActivePrescTypeID,
          prescTypeEngTitle: ActivePrescEngTitle
            ? ActivePrescEngTitle
            : prescData.PrescType,
          shape: ActiveSrvShape ? ActiveSrvShape : prescData.SrvShape,
          bulkId: ActivePrescTypeID
            ? ActivePrescTypeID === 10
              ? 1
              : 0
            : prescData.bulkId,
          serviceNationalNumber: ActiveSrvNationalNumber
            ? ActiveSrvNationalNumber
            : prescData.nationalNumber,
          favItemMode: favItemMode,
        };

        existingCheckCodes.push({
          checkCode: response.data.res.info?.checkCode,
        });

        if (editPrescSrvMode && !favItemMode) {
          console.log("111");
          updatePrescItem(
            addedPrescItemData.serviceInterfaceName,
            addedPrescItemData
          );
        } else if (!_prescData) {
          console.log("222");
          setPrescriptionItemsData([
            ...prescriptionItemsData,
            addedPrescItemData,
          ]);
        }

        // reset
        activeSearch();
        setIsLoading(false);
        setSearchFromInput(true);
        setFavItemMode(false);
        return addedPrescItemData;
      } else if (response.data.res.status === 409) {
        setIsLoading(false);
        WarningAlert("هشدار", "اطلاعات ورودی را دوباره بررسی نمایید!");
      } else {
        setIsLoading(false);
        ErrorAlert("خطا", "افزودن خدمت با خطا مواجه گردید!");
        displayToastMessages(
          response.data.res.info.message.snackMessage,
          toast,
          null
        );
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      if (err.response) {
        setIsLoading(false);
        ErrorAlert("خطا", err.response.data.resMessage);
      } else {
        setIsLoading(false);
        ErrorAlert("خطا", "افزودن خدمت با خطا مواجه گردید!");
      }
      return false;
    }
  };

  console.log({ existingCheckCodes, deletedCheckCodes });

  useEffect(() => {
    console.log({ prescriptionItemsData });
  }, [prescriptionItemsData]);

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
        deletedCheckCodes.push({
          checkCode: id,
        });
      }
    }
  };

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
          response.data.info.subscriptionInfos.map((x, index) => {
            response.data.info.subscriptionInfos[index].salamatPresc = 1;
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

  const handleEditService = (srvData, favItemMode) => {
    setFavItemMode(favItemMode);
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

    if (srvData?.salamatPresc) {
      deletedCheckCodes.push({ checkCode: srvData.checkCode });
    }

    existingCheckCodes = existingCheckCodes.filter(
      (a) => a.checkCode !== srvData.checkCode
    );

    if (favItemMode) {
      if (
        prescriptionItemsData.length > 0 &&
        prescriptionItemsData.find(
          (a) => a.serviceNationalNumber === ActiveSrvNationalNumber
        )
      ) {
        ErrorAlert("", "انتخاب سرویس تکراری امکان پذیر نمی باشد.");
        return false;
      } else {
        setTimeout(() => {
          $("#btnAddSalamatSrvItem").click();
          setEditPrescSrvMode(false);
        }, 200);
      }
    }
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
    // setRegisterIsLoading(true);

    let url = "BimehSalamat";
    let data = {
      SavePresc: 1,
      CenterID: ClinicID,
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

    console.log({ data });

    // axiosClient
    //   .post(url, data)
    //   .then((response) => {
    //     if (response.data.res.resCode === -8402) {
    //       ErrorAlert("خطا", response.data.res.resMessage);
    //       setRegisterIsLoading(false);
    //     }

    //     if (response.data.res.status === 400) {
    //       ErrorAlert("خطا", "ثبت اطلاعات نسخه با خطا مواجه گردید!");
    //       setRegisterIsLoading(false);
    //     }

    //     if (response.data.res.info) {
    //       setRegisterIsLoading(false);

    //       // toast messages
    //       let registerMessages = [];
    //       const infoMessageArray =
    //         response.data.res.info.message.infoMessage || [];
    //       const snackMessageArray =
    //         response.data.res.info.message.snackMessage || [];

    //       let sequenceNumberArray = [];
    //       let seqObj = {
    //         type: "S",
    //         text: "کد توالی نسخه : " + response.data.res.info.sequenceNumber,
    //       };
    //       sequenceNumberArray.push(seqObj);

    //       let trackNumberArray = [];
    //       let trackObj = {
    //         type: "S",
    //         text: "کد رهگیری نسخه : " + response.data.res.info.trackingCode,
    //       };
    //       trackNumberArray.push(trackObj);

    //       registerMessages.push(
    //         ...infoMessageArray,
    //         ...snackMessageArray,
    //         ...sequenceNumberArray,
    //         ...trackNumberArray
    //       );

    //       displayToastMessages(registerMessages, toast, null);

    //       const sequenceNumber = response.data.res.info.sequenceNumber || "";
    //       const trackingCode = response.data.res.info.trackingCode || "";

    //       if (trackingCode || sequenceNumber) {
    //         const seconds = 5;
    //         const timerInMillis = seconds * 1000;

    //         TimerAlert({
    //           title: `<div class="custom-title"> نسخه ${
    //             trackingCode ? "با کد رهگیری : " + trackingCode : ""
    //           }
    //           ${sequenceNumber ? "و کد توالی : " + sequenceNumber : ""}
    //           با موفقیت ثبت گردید!
    //           </div>`,
    //           html: `<div class="custom-content">در حال انتقال به صفحه نسخ خدمات در<b>${seconds}</b> ثانیه</div>`,
    //           timer: timerInMillis,
    //           timerProgressBar: true,
    //           cancelButton: {
    //             text: "انصراف",
    //           },
    //           onConfirm: () => {
    //             router.push("/salamatPrescRecords");
    //           },
    //         });

    //         ActiveSamadCode = null;
    //         existingCheckCodes = [];
    //         deletedCheckCodes = [];
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     ErrorAlert("خطا", "ثبت اطلاعات نسخه با خطا مواجه گردید!");
    //     setRegisterIsLoading(false);
    //   });
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

    getFavSalamatItems();
    getSalamatFavPrescs();

    existingCheckCodes = [];
    deletedCheckCodes = [];
  }, [router.isReady]);

  useEffect(() => {
    if (
      CitizenSessionId &&
      editPrescMode &&
      router.query.directPresc !== "true"
    ) {
      getPrescBySamadCode(CitizenSessionId);
    }

    if (CitizenSessionId && router.query.directPresc == "true")
      generateSamadCode();
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
          <div className="dir-rtl">
            <Toast ref={toast} position="top-left" />
          </div>
          <div className="row dir-rtl">
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

              <PrescQuickAccessCard
                isLoading={isLoading}
                quickAccessMode={"salamat"}
                data={favSalamatItems}
                handleEditService={handleEditService}
                patientInfo={patientInfo}
                ClinicID={ClinicID}
                ActivePatientNID={ActivePatientNID}
                setPatientInfo={setPatientInfo}
                salamatHeaderList={salamatHeaderList}
                favItemIsLoading={favItemIsLoading}
                openApplyFavPrescModal={openApplyFavPrescModal}
                favPrescData={favPrescData}
                handleAddFavPresc={handleAddFavPresc}
                editFavPrescData={editFavPrescData}
                handleReset={handleResetFavPresc}
                removeFavPresc={removeFavSalamatPresc}
                editFavPresc={editFavPresc}
              />
            </div>

            <div className="col-xxl-9 col-xl-8 col-lg-7 col-md-12">
              <PrescriptionCard
                isLoading={isLoading}
                registerIsLoading={registerIsLoading}
                searchIsLoading={searchIsLoading}
                salamatDataIsLoading={salamatDataIsLoading}
                setSearchIsLoading={setSearchIsLoading}
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
                  data={prescriptionItemsData}
                  prescDataIsLoading={prescDataIsLoading}
                  salamatHeaderList={salamatHeaderList}
                  editPrescMode={editPrescMode}
                  consumptionOptions={consumptionOptions}
                  handleEditService={handleEditService}
                  deleteService={deleteService}
                  selectFavSalamatItem={selectFavSalamatItem}
                  removeFavItem={removeFavItem}
                />
              </div>
            </div>
          </div>
        </div>

        <ApplyFavPrescModal
          show={showApplyFavPrescModal}
          onHide={closeApplyFavPrescModal}
          ClinicID={ClinicID}
          prescMode="Salamat"
          prescriptionItemsData={prescriptionItemsData}
          applyFavPresc={applyFavPresc}
        />

        <GetPinInput
          show={showPinInputModal}
          onHide={closePinInputModal}
          getPinInputValue={getPinInputValue}
        />
      </div>
    </>
  );
};

export default SalamatPrescription;
