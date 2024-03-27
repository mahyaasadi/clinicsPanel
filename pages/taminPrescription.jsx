import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { Toast } from "primereact/toast";
import { displayToastMessages } from "utils/toastMessageGenerator";
import { taminPrescItemCreator } from "utils/taminPrescItemCreator";
import GetPinInput from "components/commonComponents/pinInput";
import PatientInfoCard from "@/components/dashboard/patientInfo/patientInfoCard";
import AddNewPatient from "@/components/dashboard/patientInfo/addNewPatient";
import PrescriptionCard from "components/dashboard/prescription/tamin/prescriptionCard";
import AddToListItems from "components/dashboard/prescription/tamin/addToListItems";
import PrescQuickAccessCard from "@/components/dashboard/prescription/favourites/prescQuickAccessCard";
import ApplyFavPrescModal from "@/components/dashboard/prescription/favourites/applyFavPrescModal";
import {
  ErrorAlert,
  SuccessAlert,
  WarningAlert,
  QuestionAlert,
  TimerAlert,
} from "class/AlertManage";

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

// PrescTypeHeader
let ActivePrescTypeID = 1;
let ActivePrescName = "دارو";
let ActivePrescImg,
  ActiveSrvTypePrsc = null;
let ActiveSrvTypeID = "01";

// PatientInfo
let ClinicID,
  ActivePatientID,
  ActiveNID,
  ActiveInsuranceType,
  ActiveInsuranceID = null;

// Services
let ActiveSrvCode,
  ActiveSrvName,
  ActiveParaCode,
  ActiveEditSrvCode = null;

// PrescInfo
let ActivePrescHeadID,
  ActivePrescID = null;

let addPrescriptionitems = [];
let visitPrescriptionData = [];
const TaminPrescription = ({
  ClinicUser,
  drugAmountList,
  drugInstructionList,
}) => {
  ClinicID = ClinicUser.ClinicID;
  const router = useRouter();
  const toast = useRef(null);

  // Loaders
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [visitRegIsLoading, setVisitRegIsLoading] = useState(false);
  const [saveRegIsLoading, setSaveRegIsLoading] = useState(false);
  const [prescDataIsLoading, setPrescDataIsLoading] = useState(false);
  const [searchFromInput, setSearchFromInput] = useState(true);

  const [patientInfo, setPatientInfo] = useState([]);
  const [ActivePatientNID, setActivePatientNID] = useState(null);

  const [SelectedInstruction, setSelectedInstruction] = useState(null);
  const [SelectedInstructionLbl, setSelectedInstructionLbl] = useState(null);
  const [SelectedAmount, setSelectedAmount] = useState(null);
  const [SelectedAmountLbl, setSelectedAmountLbl] = useState(null);

  const [taminSrvSearchList, setTaminSrvSearchList] = useState([]);
  const [prescriptionItemsData, setPrescriptionItemsData] = useState([]);

  // New Patient
  const [birthYear, setBirthYear] = useState("");
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);
  const [addPatientIsLoading, setAddPatientIsLoading] = useState(false);

  const [editSrvMode, setEditSrvMode] = useState(false);
  const [editSrvData, setEditSrvData] = useState([]);

  const [favPrescItemsData, setFavPrescItemsData] = useState([]);
  let array1 = [];

  //------ Patient Info ------//
  const getPatientInfo = (e) => {
    {
      e && e.preventDefault();
    }
    setPatientStatIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    setActivePatientNID(formProps.nationalCode);

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      CenterID: ClinicID,
      NID: formProps.nationalCode,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        $("#patientNID").prop("readonly", true);

        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
          $("#patientInfoCard2").hide("");
        } else {
          ActivePatientID = response.data.user._id;
          ActiveNID = response.data.user.NationalID;
          ActiveInsuranceType = response.data.user.InsuranceType;
          ActiveInsuranceID = response.data.user.Insurance;
          setPatientInfo(response.data.user);
          $("#patientInfoCard2").show("");
        }

        setTimeout(() => {
          setPatientStatIsLoading(false);
          $("#frmPatientInfoBtnSubmit").hide();
          $("#getPatientCloseBtn").show();
          $("#patientNID").focus();
        }, 200);
        setPatientStatIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setPatientStatIsLoading(false);
        ErrorAlert("خطا", "دریافت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  const getPatientActiveSearch = () => {
    $("#patientNID").val("");
    $("#getPatientCloseBtn").hide();
    $("#frmPatientInfoBtnSubmit").show();
    $("#patientNID").prop("readonly", false);
    $("#patientInfoCard2").hide();

    setActivePatientNID(null);
  };

  const addNewPatient = (props) => {
    setAddPatientIsLoading(true);

    let url = "Patient/addPatient";
    let data = props;
    data.CenterID = ClinicID;
    data.Clinic = true;

    axiosClient
      .post(url, data)
      .then((response) => {
        setPatientInfo(response.data);

        if (response.data === false) {
          ErrorAlert(
            "خطا",
            "بیمار با اطلاعات وارد شده, تحت پوشش این بیمه نمی باشد!"
          );
          setAddPatientIsLoading(false);
          return false;
        } else if (response.data.errors) {
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
          setAddPatientIsLoading(false);
          return false;
        } else {
          SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
          $("#patientInfoCard2").show("");
          $("#newPatientModal").modal("hide");
        }
        setAddPatientIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAddPatientIsLoading(false);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  //---- Drug Instruction and Amount ----//
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
  let accordingToInst = {
    label: "طبق دستور-",
    value: 170,
  };

  let ifNeededInst = {
    label: "در صورت نياز-",
    value: 171,
  };

  selectInstructionData.push(accordingToInst);
  selectInstructionData.push(ifNeededInst);

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

  const FUSelectInstruction = (instruction) => {
    const findInsLbl = drugInstructionList.find((x) => x.value == instruction);
    setSelectedInstructionLbl(findInsLbl ? findInsLbl.label : instruction);
    setSelectedInstruction(instruction);
  };

  const FUSelectDrugAmount = (amount) => {
    const findAmntLbl = drugAmountList.find((x) => x.value == amount);
    setSelectedAmountLbl(findAmntLbl ? findAmntLbl.label : amount);
    setSelectedAmount(amount);
  };

  //---- PrescriptionType Header Tab Change ----//
  const changePrescTypeTab = (srvTypeID, prescImg, prescName, prescId) => {
    ActiveSrvTypeID = srvTypeID;
    ActivePrescImg = prescImg;
    ActivePrescName = prescName;
    ActivePrescTypeID = prescId;

    setSearchFromInput(true);
    activeSearch();
  };

  //---- ParaServices Dropdown ----//
  const selectParaSrvType = (id) => (ActiveSrvTypeID = id);

  //--- Search In Tamin Services ---//
  const searchTaminSrv = (e) => {
    e.preventDefault();
    setSearchFromInput(true);

    if (ActiveSrvCode == null || editSrvMode || searchFromInput) {
      setSearchIsLoading(true);

      let formData = new FormData(e.target);
      const formProps = Object.fromEntries(formData);

      let data = {
        Text: formProps.srvSearchInput.toUpperCase(),
        srvType: ActiveSrvTypeID,
      };

      axiosClient
        .post("TaminServices/SearchSrv", data)
        .then((response) => {
          setTaminSrvSearchList(response.data);
          setSearchIsLoading(false);

          $(".SearchDiv").show();
          $(".unsuccessfullSearch").hide();

          if (response.data.length === 0) {
            $(".unsuccessfullSearch").show();
          } else {
            $(".unsuccessfullSearch").hide();
          }
        })
        .catch((err) => {
          console.log(err);
          setSearchIsLoading(false);
          setSearchFromInput(false);
          ErrorAlert("", "جستجوی خدمات در حال حاضر امکان پذیر نمی باشد!");
        });
    }
  };

  const activeSearch = () => {
    setSearchFromInput(!searchFromInput);

    console.log("object");

    ActiveSrvCode = null;
    ActiveSrvName = null;

    $("#srvSearchInput").val("");
    $("#srvSearchInput").focus();
    $("#srvSearchInput").prop("readonly", false);
    $("#BtnActiveSearch").hide();
    $("#BtnServiceSearch").show();
    $("#QtyInput").val("1");
    setSelectedAmount(null);
    setSelectedAmountLbl(null);
    setSelectedInstruction(null);
    setSelectedInstructionLbl(null);
    $("#eprscItemDescription").val("");
  };

  const selectSearchedService = (name, srvCode, type, paraTarefCode) => {
    setSearchFromInput(false);

    ActiveSrvName = name;
    ActiveSrvCode = srvCode;
    ActiveSrvTypePrsc = type;
    ActiveParaCode = paraTarefCode;

    $("#srvSearchInput").val(name);
    $("#BtnServiceSearch").hide();
    $("#BtnActiveSearch").show();
    $(".SearchDiv").hide();
    $("#srvSearchInput").prop("readonly", true);
  };

  //--- Fav Tamin Items ---//
  const [favTaminItems, setFavTaminItems] = useState([]);
  const [favItemIsLoading, setFavItemIsLoading] = useState(false);

  const getFavTaminItems = () => {
    setFavItemIsLoading(true);
    let url = `FavEprscItem/getTamin/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setFavTaminItems(response.data);
        setFavItemIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFavItemIsLoading(false);
      });
  };

  const selectFavTaminItem = async (selectedSrv) => {
    let url = "FavEprscItem/addTamin";
    selectedSrv.paraCode = ActiveParaCode;
    selectedSrv.favItemMode = true;

    let data = {
      CenterID: ClinicID,
      prescItem: selectedSrv,
    };

    if (
      favTaminItems.length > 0 &&
      favTaminItems.find((x) => x.SrvCode === selectedSrv.SrvCode)
    ) {
      ErrorAlert("", "انتخاب سرویس تکراری امکان پذیر نمی باشد.");
      return false;
    } else {
      axiosClient
        .post(url, data)
        .then((response) => {
          setFavTaminItems([...favTaminItems, response.data]);
          SuccessAlert("موفق", "سرویس به لیست علاقه مندی ها اضافه گردید!");
        })
        .catch((err) => console.log(err));
    }
  };

  const removeFavItem = async (srvcode) => {
    let result = await QuestionAlert(
      "",
      "آیا از حذف خدمت از خدمات پرمصرف اطمینان دارید؟"
    );

    if (result) {
      let url = `/CenterFavEprsc/deleteTamin/${ClinicID}/${srvcode}`;

      axiosClient
        .delete(url)
        .then((response) => {
          if (response.data.Status === "ok") {
            const removedFav = prescriptionItemsData.map((presc) => {
              if (presc.SrvCode === srvcode) {
                return { ...presc, favItemMode: false };
              }
              return presc;
            });

            setPrescriptionItemsData(removedFav);

            setFavTaminItems(
              favTaminItems.filter((x) => x.SrvCode !== srvcode)
            );
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //--- Fav Prescription ---//
  const [showApplyFavPrescModal, setShowApplyFavPrescModal] = useState(false);
  const [favPrescData, setFavPrescData] = useState([]);
  const [editFavPrescData, setEditFavPrescData] = useState([]);
  const openApplyFavPrescModal = () => setShowApplyFavPrescModal(true);
  const closeApplyFavPrescModal = () => setShowApplyFavPrescModal(false);

  const getTaminFavPrescs = () => {
    setFavItemIsLoading(true);
    let url = `CenterFavEprsc/getAll/${ClinicID}/${"Tamin"}`;

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

  const applyFavPresc = (favPresc) => {
    setFavPrescData([...favPrescData, favPresc]);
  };

  const handleAddFavPresc = async (favPresc) => {
    activeSearch();
    setEditFavPrescData(favPresc);

    let arr2 = [];
    array1 = [];
    addPrescriptionitems = [];
    visitPrescriptionData = [];

    for (let i = 0; i < favPresc.Items[0].length; i++) {
      const item = favPresc.Items[0][i];

      ActivePrescImg = item.Img;

      let { prescData, prescItems } = await taminPrescItemCreator(
        item.prescId,
        item.drugInstruction?.drugInstId
          ? item.drugInstruction?.drugInstId
          : null,
        item.timesAday?.drugAmntId ? item.timesAday?.drugAmntId : null,
        item.SrvCode,
        item.SrvName,
        item.Qty,
        item.Img,
        item.DrugInstruction,
        item.TimesADay,
        item.PrescType,
        item.srvId?.srvType.srvType,
        item.srvId.parTarefGrp?.parGrpCode,
        item.description
      );

      const visitData = {
        Name: item.SrvName,
        Code: item.SrvCode,
      };

      if (prescData) {
        addPrescriptionitems.push(prescData);
        arr2.push(prescItems);
        visitPrescriptionData.push(visitData);
        const combinedObject = { ...prescData, ...prescItems };
        array1.push(combinedObject);
      }
    }

    setTimeout(() => {
      setFavPrescItemsData(array1);
      setPrescriptionItemsData(arr2);
    }, 200);
  };

  const removeFavPresc = (id) => {
    let url = `CenterFavEprsc/delete/${id}`;

    axiosClient
      .delete(url)
      .then((response) => {
        setFavPrescData(favPrescData.filter((item) => item._id !== id));
        handleReset();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReset = () => {
    setFavPrescItemsData([]);
    setEditFavPrescData([]);
    setPrescriptionItemsData([]);
  };

  // Edit Fav Presc
  const editFavPresc = (id) => {
    let url = `CenterFavEprsc/update/${id}`;

    let data = {
      CenterID: ClinicID,
      Name: editFavPrescData.Name,
      Tamin: true,
      Salamat: false,
      prescItems: favPrescItemsData,
    };

    axiosClient
      .put(url, data)
      .then((response) => {
        let updatePresc = favPrescData.find((x) => x._id === response.data._id);
        updatePresc.Items = response.data.Items;
        getTaminFavPrescs();

        setTimeout(() => {
          SuccessAlert("", "ویرایش نسخه با موفقیت انجام گردید!");
        }, 200);
        handleReset();
        activeSearch();
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ویرایش نسخه با خطا مواجه گردید!");
      });
  };

  // Edit Service
  const updateItem = (id, newArr) => {
    setSearchFromInput(true);

    let index = prescriptionItemsData.findIndex((x) => x.SrvCode === id);
    let g = prescriptionItemsData[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else {
      setTimeout(() => {
        setPrescriptionItemsData([
          ...prescriptionItemsData.slice(0, index),
          g,
          ...prescriptionItemsData.slice(index + 1),
        ]);
      }, 5);
    }

    if (favPrescItemsData.length !== 0) {
      let index2 = favPrescItemsData.findIndex((x) => x.SrvCode === id);

      if (index2 === -1) {
        console.log("No match found for ID:", id);
        return;
      } else {
        let updatedItemsData = [...favPrescItemsData];
        updatedItemsData[index2] = newArr;
        setFavPrescItemsData(updatedItemsData);
      }
    }
  };

  const [favItemMode, setFavItemMode] = useState(false);

  const handleEditService = (srvData, favItemMode) => {
    setFavItemMode(favItemMode);
    setEditSrvMode(true);
    setSearchFromInput(true);
    setEditSrvData(srvData);

    ActiveSrvCode = srvData.SrvCode;
    ActiveSrvName = srvData.SrvName;
    ActiveEditSrvCode = srvData.SrvCode;

    let _Activetype = ActivePrescTypeID;
    let _ActivePrescImg = ActivePrescImg;
    let _ActivePrescTypeID = ActivePrescTypeID;
    let _ActivePrescName = ActivePrescName;

    ActivePrescTypeID = srvData.prescId;
    ActivePrescImg = srvData.Img;
    ActivePrescName = srvData.PrescType;

    if (favItemMode) {
      switch (srvData.prescId) {
        case 1:
          ActiveSrvTypePrsc = "01";
          break;
        case 2:
          ActiveSrvTypePrsc = "02";
          break;
        case 5:
          ActiveSrvTypePrsc = "17";
          break;
        default:
          break;
      }

      setTimeout(() => {
        if (
          !editSrvMode &&
          prescriptionItemsData.length > 0 &&
          prescriptionItemsData.find((a) => a.SrvCode === ActiveSrvCode)
        ) {
          ErrorAlert("", "انتخاب سرویس تکراری امکان پذیر نمی باشد.");
          return false;
        } else {
          setEditSrvData([]);
          $("#btnAddSrvItem").click();
          ActivePrescTypeID = _Activetype;
          ActivePrescImg = _ActivePrescImg;
          ActivePrescTypeID = _ActivePrescTypeID;
          ActivePrescName = _ActivePrescName;
        }
      }, 200);
    }
  };

  // Delete Service
  const DeleteService = (id, prescItems, combinedObject) => {
    addPrescriptionitems = addPrescriptionitems.filter(
      (a) => a.srvId.srvCode !== id
    );

    visitPrescriptionData = visitPrescriptionData.filter((x) => x.Code !== id);
    setPrescriptionItemsData(
      prescriptionItemsData.filter((a) => a.SrvCode !== id)
    );

    if (!favItemMode && prescItems !== 1 && combinedObject) {
      updateItem(id, prescItems);
    }
  };

  // pinInput modal
  const [showPinModal, setShowPinModal] = useState(false);
  const closePinModal = () => setShowPinModal(false);

  const getPinInputValue = (code) => {
    if (ActivePrescHeadID && code) registerEpresc(0, code);
  };

  const getEditPrescData = async (obj) => {
    let arr = [];
    for (let i = 0; i < obj.data.length; i++) {
      const presc = obj.data[i];
      let drugAmntId = presc.drugAmntId;
      let drugAmntLbl = drugAmountList.find((o) => o.value === drugAmntId);

      if (drugAmntLbl) drugAmntLbl = drugAmntLbl.label;

      let drugInstId = presc.drugInstId;
      let InstructionLbl = drugInstructionList.find(
        (o) => o.value === drugInstId
      );

      if (InstructionLbl) InstructionLbl = InstructionLbl.label;

      let { prescData, prescItems } = await taminPrescItemCreator(
        presc.srvId.srvType.prescTypeId,
        drugInstId,
        drugAmntId,
        presc.srvId.srvCode,
        presc.srvId.srvName,
        presc.srvQty,
        "",
        InstructionLbl,
        drugAmntLbl,
        presc.srvId.srvType.srvTypeDes,
        presc.srvId.srvType.srvType,
        presc.srvId.parTarefGrp?.parGrpCode
      );

      if (prescData) {
        addPrescriptionitems.push(prescData);
        arr.push(prescItems);
      }
    }
    setPrescriptionItemsData(arr);
  };

  // get prescription data by headId to edit
  const getOneEprscData = () => {
    setPrescDataIsLoading(true);

    let url = "TaminEprsc/GetEpresc";
    let data = {
      CenterID: ClinicID,
      headerID: ActivePrescHeadID,
    };

    if (ActivePrescHeadID) {
      axiosClient
        .post(url, data)
        .then((response) => {
          getEditPrescData(response.data);
          setPrescDataIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setPrescDataIsLoading(false);
        });
    }
  };

  // Add TaminSrvItem to the List
  const FuAddToListItem = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    let { prescData, prescItems } = await taminPrescItemCreator(
      ActivePrescTypeID,
      SelectedInstruction,
      SelectedAmount,
      ActiveSrvCode,
      ActiveSrvName,
      $("#QtyInput").val(),
      ActivePrescImg,
      SelectedInstructionLbl,
      SelectedAmountLbl,
      ActivePrescName,
      ActiveSrvTypePrsc,
      ActiveParaCode,
      $("#eprscItemDescription").val(),
      favItemMode
    );

    const combinedObject = { ...prescData, ...prescItems };

    if (!editSrvMode) {
      if (
        (addPrescriptionitems.length > 0 &&
          addPrescriptionitems.find(
            ({ srvId }) => srvId.srvCode === ActiveSrvCode
          )) ||
        (prescriptionItemsData.length > 0 &&
          prescriptionItemsData.find((a) => a.SrvCode === ActiveSrvCode))
      ) {
        ErrorAlert("", "انتخاب سرویس تکراری امکان پذیر نمی باشد.");
        return false;
      }
    } else {
      if (!prescItems.favItemMode)
        DeleteService(ActiveEditSrvCode, prescItems, combinedObject);
      setEditSrvMode(false);
      // ActiveSrvCode = null;
    }

    if (prescData) {
      let visitPrescData = {
        Name: ActiveSrvName,
        Code: ActiveSrvCode,
      };

      // if (!ActiveEditSrvCode) {
      // favPresc
      const combinedObject = { ...prescData, ...prescItems };
      setFavPrescItemsData([...favPrescItemsData, combinedObject]);
      // }

      addPrescriptionitems.push(prescData);
      visitPrescriptionData.push(visitPrescData);
      setPrescriptionItemsData([...prescriptionItemsData, prescItems]);
    }

    activeSearch();
    setSearchFromInput(true);
    setFavItemMode(false);
  };

  // Registeration
  const registerEpresc = async (visit, otpCode) => {
    let url =
      otpCode && ActivePrescHeadID
        ? "TaminEprsc/PrescriptionEdit"
        : "TaminEprsc/PrescriptionAdd";

    let isVisit = visit === 1;
    let isLoadingFunction = isVisit
      ? setVisitRegIsLoading
      : setSaveRegIsLoading;

    let data = {
      CenterID: ClinicID,
      NID: ActiveNID,
      PMN: patientInfo.Tel,
      Comment: $("#eprscItemDescription").val(),
      PatientID: ActivePatientID,
      PTI: isVisit ? 3 : ActivePrescTypeID,
      note: isVisit ? [] : addPrescriptionitems,
      SrvNames: isVisit ? [] : visitPrescriptionData,
      prescTypeName: isVisit ? "ویزیت" : ActivePrescName,
    };

    isLoadingFunction(true);

    if (!ActivePatientID) {
      WarningAlert("", "استعلام بیمار صورت نگرفته است!");
      isLoadingFunction(false);
      return;
    }

    // Edit Mode
    if (!isVisit && ActivePrescHeadID) {
      // Wait for the pin input if not a visit and editing is enabled
      await new Promise((resolve) => {
        const checkPinInterval = setInterval(() => {
          if (otpCode) {
            clearInterval(checkPinInterval);
            resolve();
          }
        }, 500);
      });

      if (otpCode) {
        data = {
          ...data,
          PrID: ActivePrescID,
          headerID: ActivePrescHeadID,
          otpCode: otpCode,
        };
        setShowPinModal(false);
      }
    }

    try {
      const response = await axiosClient.post(url, data);
      handleRegisterResponse(response, isVisit);
    } catch (err) {
      console.log(err);
      ErrorAlert(
        "خطا",
        `ثبت ${isVisit ? "ویزیت" : "نسخه"} با خطا مواجه گردید!`
      );
    } finally {
      isLoadingFunction(false);
    }
  };

  const handleRegisterResponse = (response, isVisit) => {
    if (response.data[0].data.data.result.trackingCode) {
      let title, trackingCode;

      if (isVisit) {
        trackingCode = response.data[0].data.data.result.trackingCode;
        title = `ویزیت با کد رهگیری ${trackingCode} با موفقیت ثبت گردید!`;
      } else {
        let trackingCodes = [];
        for (let i = 0; i < response.data.length; i++) {
          const element = response.data[i];
          trackingCodes.push(element.data.data.result.trackingCode);
        }
        trackingCodes = [...new Set(trackingCodes)];
        trackingCode = trackingCodes[0];

        title = `نسخه با کد رهگیری ${trackingCode} با موفقیت ثبت گردید!`;
      }

      displayToastMessages([], toast, title);

      const seconds = 5;
      const timerInMillis = seconds * 1000;

      TimerAlert({
        title: title,
        html: `<div class="custom-content">در حال انتقال به صفحه نسخ تامین اجتماعی در ${seconds} ثانیه</div>`,
        timer: timerInMillis,
        timerProgressBar: true,
        cancelButton: {
          text: "انصراف",
        },
        onConfirm: () => {
          router.push("/taminPrescRecords");
        },
      });
    } else if (response.data[0].data.data.result.error_Msg) {
      if (response.data[0].data.data.result.error_Msg == "نسخه تکراری است") {
        WarningAlert("هشدار", "نسخه ثبت شده تکراری می باشد!");
      } else {
        ErrorAlert("خطا!", response.data[0].data.data.result.error_Msg);
      }

      if (ActiveNID === undefined) {
        WarningAlert("هشدار", "کد ملی وارد شده معتبر نمی باشد");
      }
    } else {
      ErrorAlert("خطا", "سرور در حال حاضر در دسترس نمی باشد!");
    }
  };

  useEffect(() => {
    ActivePrescHeadID = router.query.headID;
    ActivePrescID = router.query.prId;
    ActiveNID = router.query.pid;

    if (ActivePrescHeadID) getOneEprscData();

    setTimeout(() => {
      if (ActiveNID) {
        $("#patientNID").val(router.query.pid);
        $("#frmPatientInfoBtnSubmit").click();
      }
    }, 1000);
  }, [router.query]);

  useEffect(() => {
    setShowBirthDigitsAlert(false);
    getFavTaminItems();
    getTaminFavPrescs();
    $("#patientNID").val("");
  }, []);

  return (
    <>
      <Head>
        <title>نسخه نویسی تامین اجتماعی</title>
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
                quickAccessMode={"tamin"}
                data={favTaminItems}
                favItemIsLoading={favItemIsLoading}
                handleEditService={handleEditService}
                removeFavItem={removeFavItem}
                patientInfo={patientInfo}
                ClinicID={ClinicID}
                ActivePatientNID={ActivePatientNID}
                setPatientInfo={setPatientInfo}
                openApplyFavPrescModal={openApplyFavPrescModal}
                favPrescData={favPrescData}
                setFavPrescItemsData={setFavPrescItemsData}
                handleAddFavPresc={handleAddFavPresc}
                removeFavPresc={removeFavPresc}
                editFavPrescData={editFavPrescData}
                handleReset={handleReset}
                editFavPresc={editFavPresc}
              />
            </div>

            <div className="col-xxl-9 col-xl-8 col-lg-7 col-md-12">
              <PrescriptionCard
                setSearchIsLoading={setSearchIsLoading}
                searchIsLoading={searchIsLoading}
                visitRegIsLoading={visitRegIsLoading}
                saveRegIsLoading={saveRegIsLoading}
                drugAmountList={drugAmountList}
                drugInstructionList={drugInstructionList}
                SelectedInstruction={SelectedInstruction}
                setSelectedInstruction={setSelectedInstruction}
                SelectedAmount={SelectedAmount}
                setSelectedAmount={setSelectedAmount}
                FUSelectInstruction={FUSelectInstruction}
                FUSelectDrugAmount={FUSelectDrugAmount}
                changePrescTypeTab={changePrescTypeTab}
                selectParaSrvType={selectParaSrvType}
                searchTaminSrv={searchTaminSrv}
                activeSearch={activeSearch}
                selectSearchedService={selectSearchedService}
                taminSrvSearchList={taminSrvSearchList}
                FuAddToListItem={FuAddToListItem}
                registerEpresc={registerEpresc}
                editSrvMode={editSrvMode}
                setEditSrvMode={setEditSrvMode}
                editSrvData={editSrvData}
                setEditSrvData={setEditSrvData}
                ActivePrescHeadID={ActivePrescHeadID}
                setShowPinModal={setShowPinModal}
                setSearchFromInput={setSearchFromInput}
                ActivePrescTypeID={ActivePrescTypeID}
              />

              <div className="prescList">
                <AddToListItems
                  data={prescriptionItemsData}
                  DeleteService={DeleteService}
                  handleEditService={handleEditService}
                  setPrescriptionItemsData={setPrescriptionItemsData}
                  setFavPrescItemsData={setFavPrescItemsData}
                  favPrescItemsData={favPrescItemsData}
                  prescDataIsLoading={prescDataIsLoading}
                  selectFavTaminItem={selectFavTaminItem}
                  removeFavItem={removeFavItem}
                  ActivePrescImg={ActivePrescImg}
                />
              </div>
            </div>
          </div>
        </div>

        {ActivePrescHeadID && showPinModal && (
          <GetPinInput
            show={showPinModal}
            onHide={closePinModal}
            getPinInputValue={getPinInputValue}
          />
        )}

        <AddNewPatient
          ClinicID={ClinicID}
          addNewPatient={addNewPatient}
          ActivePatientNID={ActivePatientNID}
          birthYear={birthYear}
          setBirthYear={setBirthYear}
          showBirthDigitsAlert={showBirthDigitsAlert}
          setShowBirthDigitsAlert={setShowBirthDigitsAlert}
          addPatientIsLoading={addPatientIsLoading}
        />

        <ApplyFavPrescModal
          show={showApplyFavPrescModal}
          onHide={closeApplyFavPrescModal}
          ClinicID={ClinicID}
          prescMode="Tamin"
          prescriptionItemsData={prescriptionItemsData}
          favPrescItemsData={favPrescItemsData}
          applyFavPresc={applyFavPresc}
        />
      </div>
    </>
  );
};

export default TaminPrescription;
