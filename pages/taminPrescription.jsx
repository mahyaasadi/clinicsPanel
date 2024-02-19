import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { taminPrescItemCreator } from "utils/taminPrescItemCreator";
import PatientInfoCard from "@/components/dashboard/patientInfo/patientInfoCard";
import PatientVerticalCard from "components/dashboard/patientInfo/patientVerticalCard";
import AddNewPatient from "@/components/dashboard/patientInfo/addNewPatient";
import PrescriptionCard from "components/dashboard/prescription/tamin/prescriptionCard";
import AddToListItems from "components/dashboard/prescription/tamin/addToListItems";
import TaminFavItemsModal from "components/dashboard/prescription/tamin/taminFavItemsModal";
import GetPinInput from "components/commonComponents/pinInput";
import {
  TaminPrescType,
  TaminParaServicesTypeList,
} from "class/taminPrescriptionData";
import {
  ErrorAlert,
  SuccessAlert,
  WarningAlert,
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

  // Loaders
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [visitRegIsLoading, setVisitRegIsLoading] = useState(false);
  const [saveRegIsLoading, setSaveRegIsLoading] = useState(false);
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

  const [prescDataIsLoading, setPrescDataIsLoading] = useState(false);

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
        });
    }
  };

  const activeSearch = () => {
    setSearchFromInput(!searchFromInput);

    ActiveSrvCode = null;
    $("#srvSearchInput").val("");
    $("#BtnActiveSearch").hide();
    $("#srvSearchInput").prop("readonly", false);
    $("#BtnServiceSearch").show();
    $("#srvSearchInput").focus();
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

  // Fav Tamin Items
  const [showFavItemsModal, setShowFavItemsModal] = useState(false);
  const [favTaminItems, setFavTaminItems] = useState([]);
  const openFavModal = () => setShowFavItemsModal(true);
  const handleCloseFavItemsModal = () => setShowFavItemsModal(false);

  const getFavTaminItems = () => {
    let url = `FavEprscItem/getTamin/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setFavTaminItems(response.data);
      })
      .catch((err) => console.log(err));
  };

  const selectFavTaminItem = async (selectedSrv) => {
    let url = "FavEprscItem/addTamin";
    selectedSrv.paraCode = ActiveParaCode;

    console.log({ selectedSrv, favTaminItems });

    let data = {
      CenterID: ClinicID,
      prescItem: selectedSrv,
    };

    if (
      favTaminItems.length > 0 &&
      favTaminItems.find(
        (x) => x.SrvCode === selectedSrv.SrvCode
      )
    ) {
      ErrorAlert("خطا", "سرویس انتخابی تکراری می باشد");
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

  const removeFavItem = (srvcode) => {
    let url = `/CenterFavEprsc/deleteTamin/${ClinicID}/${srvcode}`;

    axiosClient
      .delete(url)
      .then((response) => {
        setFavTaminItems(favTaminItems.filter((x) => x.SrvCode !== srvcode));
      })
      .catch((err) => console.log(err));
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
  };

  const handleEditService = (srvData, favItemMode) => {
    setEditSrvMode(true);
    setSearchFromInput(true);
    setEditSrvData(srvData);

    ActiveSrvCode = srvData.SrvCode;
    ActiveSrvName = srvData.SrvName;
    ActiveEditSrvCode = srvData.SrvCode;

    ActivePrescTypeID = srvData.prescId;
    ActivePrescImg = srvData.Img;

    if (favItemMode) {
      setTimeout(() => {
        $("#btnAddSrvItem").click();
        $("#srvSearchInput").val("");
      }, 200);
    }
  };

  // Delete Service
  const DeleteService = (id, prescId, prescItems) => {
    addPrescriptionitems = addPrescriptionitems.filter(
      (a) => a.srvId.srvCode !== id
    );

    if (prescItems) updateItem(id, prescItems);
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
      $("#eprscItemDescription").val()
    );

    if (!editSrvMode) {
      if (
        addPrescriptionitems.length > 0 &&
        addPrescriptionitems.find(
          ({ srvId }) => srvId.srvCode === ActiveSrvCode
        )
      ) {
        ErrorAlert("خطا", "سرویس انتخابی تکراری می باشد");
        return false;
      }
    } else {
      DeleteService(ActiveEditSrvCode, ActivePrescTypeID, prescItems);
      setEditSrvMode(false);
      ActiveSrvCode = null;
    }

    if (prescData) {
      let visitPrescData = {
        Name: ActiveSrvName,
        Code: ActiveSrvCode,
      };

      addPrescriptionitems.push(prescData);
      visitPrescriptionData.push(visitPrescData);
      setPrescriptionItemsData([...prescriptionItemsData, prescItems]);
      activeSearch();
    }

    setSearchFromInput(true);
  };

  // Registeration
  const registerEpresc = async (visit, otpCode) => {
    let url = "TaminEprsc/PrescriptionAdd";
    let data = {
      CenterID: ClinicID,
      NID: ActiveNID,
      PMN: patientInfo.Tel,
      Comment: $("#eprscItemDescription").val(),
      PatientID: ActivePatientID,
    };

    if (visit === 1) {
      setVisitRegIsLoading(true);
      data = {
        ...data,
        PTI: 3,
        note: [],
        SrvNames: [],
        prescTypeName: "ویزیت",
      };
      axiosClient
        .post(url, data)
        .then((response) => {
          setVisitRegIsLoading(false);
          if (response.data.res.trackingCode !== null) {
            const seconds = 5;
            const timerInMillis = seconds * 1000;
            TimerAlert({
              title: `ویزیت با کد رهگیری ${response.data.res.trackingCode} با موفقیت ثبت گردید!`,
              html: `<div class="custom-content">در حال انتقال به لیست نسخ تامین اجتماعی در ${seconds} ثانیه</div>`,
              timer: timerInMillis,
              timerProgressBar: true,
              cancelButton: {
                text: "انصراف",
              },
              onConfirm: () => {
                router.push("/taminPrescRecords");
              },
            });
          } else if (response.data.res.error_Msg == "نسخه تکراری است") {
            WarningAlert("هشدار", "نسخه ثبت شده تکراری می باشد!");
          } else if (ActiveNID === undefined) {
            WarningAlert("هشدار", "کد ملی وارد شده معتبر نمی باشد");
          }
        })
        .catch((err) => {
          console.log(err);
          ErrorAlert("خطا", "ثبت ویزیت با خطا مواجه گردید!");
          setVisitRegIsLoading(false);
        });
    } else {
      setSaveRegIsLoading(true);

      data = {
        ...data,
        PTI: ActivePrescTypeID,
        note: addPrescriptionitems,
        SrvNames: visitPrescriptionData,
        prescTypeName: ActivePrescName,
      };

      // EditMode
      // if (ActivePrescHeadID) {
      //   //   // Wait for the pin input
      //   //   await new Promise((resolve) => {
      //   //     const checkPinInterval = setInterval(() => {
      //   //       if (otpCode) {
      //   //         clearInterval(checkPinInterval);
      //   //         resolve();
      //   //       }
      //   //     }, 500);
      //   //   });

      //   if (otpCode) {
      //     url = "TaminEprsc/PrescriptionEdit";
      //     let dataToSend = {
      //       ...data,
      //       PrID: ActivePrescID,
      //       headerID: ActivePrescHeadID,
      //       otpCode: otpCode,
      //     };

      //     console.log({ dataToSend });
      //     setShowPinModal(false);
      //   }
      // }

      axiosClient
        .post(url, data)
        .then(async (response) => {
          setSaveRegIsLoading(false);

          if (response.data.res.trackingCode !== null) {
            const seconds = 5;
            const timerInMillis = seconds * 1000;

            TimerAlert({
              title: `نسخه با کد رهگیری ${response.data.res.trackingCode} با موفقیت ثبت گردید!`,
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
          } else if (response.data.res.error_Code !== null) {
            ErrorAlert("خطا!", response.data.res.error_Msg);
          } else if (response.data.res == null) {
            ErrorAlert("خطا", "سرور در حال حاضر در دسترس نمی باشد!");
          }
        })
        .catch((err) => {
          console.log(err);
          setSaveRegIsLoading(false);
          ErrorAlert("خطا", "ثبت نسخه با خطا مواجه گردید!");
        });
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
    $("#patientNID").val("");
  }, []);

  return (
    <>
      <Head>
        <title>نسخه نویسی تامین اجتماعی</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
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

              <PatientVerticalCard
                data={patientInfo}
                ClinicID={ClinicID}
                ActivePatientNID={ActivePatientNID}
                setPatientInfo={setPatientInfo}
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
                editSrvMode={editSrvMode}
                setEditSrvMode={setEditSrvMode}
                editSrvData={editSrvData}
                setEditSrvData={setEditSrvData}
                ActivePrescHeadID={ActivePrescHeadID}
                setShowPinModal={setShowPinModal}
                openFavModal={openFavModal}
                setSearchFromInput={setSearchFromInput}
              />

              <div className="prescList">
                <AddToListItems
                  data={prescriptionItemsData}
                  DeleteService={DeleteService}
                  handleEditService={handleEditService}
                  setPrescriptionItemsData={setPrescriptionItemsData}
                  prescDataIsLoading={prescDataIsLoading}
                  selectFavTaminItem={selectFavTaminItem}
                />
              </div>
            </div>
          </div>
        </div>

        <TaminFavItemsModal
          data={favTaminItems}
          show={showFavItemsModal}
          onHide={handleCloseFavItemsModal}
          handleEditService={handleEditService}
          removeFavItem={removeFavItem}
        />

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
      </div>
    </>
  );
};

export default TaminPrescription;
