import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, SuccessAlert, TimerAlert } from "class/AlertManage";
import PatientInfoCard from "@/components/dashboard/patientInfo/patientInfoCard";
import PatientVerticalCard from "components/dashboard/patientInfo/patientVerticalCard";
import AddNewPatient from "@/components/dashboard/patientInfo/addNewPatient";
import PrescriptionCard from "components/dashboard/prescription/tamin/prescriptionCard";
import AddToListItems from "components/dashboard/prescription/tamin/addToListItems";
import {
  TaminPrescType,
  TaminParaServicesTypeList,
} from "class/taminPrescriptionData";

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
  ActiveParaCode = null;

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
  const [isLoading, setIsLoading] = useState(true);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [visitRegIsLoading, setVisitRegIsLoading] = useState(false);
  const [saveRegIsLoading, setSaveRegIsLoading] = useState(false);

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

  //------ Patient Info ------//
  const getPatientInfo = (e) => {
    e.preventDefault();
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
        console.log(response.data.user);
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

    axiosClient
      .post(url, data)
      .then((response) => {
        setPatientInfo(response.data);
        $("#newPatientModal").modal("hide");
        $("#patientInfoCard2").show("");
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
  };

  //---- ParaServices Dropdown ----//
  const selectParaSrvType = (id) => (ActiveSrvTypeID = id);

  //--- Search In Tamin Services ---//
  const searchTaminSrv = (e) => {
    e.preventDefault();

    if (ActiveSrvCode == null) {
      setSearchIsLoading(true);

      let formData = new FormData(e.target);
      const formProps = Object.fromEntries(formData);

      let data = {
        Text: formProps.srvSearchInput.toUpperCase(),
        srvType: ActiveSrvTypeID,
      };

      console.log({ data });

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
        });
    }
  };

  const activeSearch = () => {
    ActiveSrvCode = null;
    $("#srvSearchInput").val("");
    $("#BtnActiveSearch").hide();
    $("#srvSearchInput").prop("readonly", false);
    $("#BtnServiceSearch").show();
    $("#srvSearchInput").focus();
  };

  const selectSearchedService = (name, srvCode, type, paraTarefCode) => {
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

  // create prescItem
  const prescItemCreator = async (
    prescId,
    Instruction,
    Amount,
    SrvCode,
    SrvName,
    Qty,
    PrscImg,
    InstructionLbl,
    AmountLbl,
    PrscName,
    SrvTypePrsc,
    ParaCode
  ) => {
    if (prescId == 1 && Instruction == null) {
      ErrorAlert("خطا", "در اقلام دارویی زمان مصرف باید انتخاب گردد");
      return false;
    } else if (prescId == 1 && Amount == null) {
      ErrorAlert("خطا", "در اقلام دارویی  تعداد در وعده باید انتخاب گردد");
      return false;
    } else {
      if (SrvCode == null || SrvName == null) {
        ErrorAlert("خطا", "خدمتی انتخاب نشده است");
        return false;
      } else {
        let prescItems = {
          SrvName: SrvName,
          SrvCode: SrvCode,
          Img: PrscImg,
          Qty: $("#QtyInput").val(),
          DrugInstruction: InstructionLbl,
          TimesADay: AmountLbl,
          PrescType: PrscName,
          prescId,
        };

        let prescData = null;
        if (prescId == 1) {
          prescData = {
            srvId: {
              srvType: {
                srvType: SrvTypePrsc,
              },
              srvCode: SrvCode,
            },
            srvQty: parseInt($("#QtyInput").val()),
            timesAday: {
              drugAmntId: Amount,
            },
            repeat: null,
            drugInstruction: {
              drugInstId: Instruction,
            },
            dose: "",
          };
        } else {
          let parTarefGrp = null;
          if (ParaCode === undefined) {
            parTarefGrp = null;
          } else {
            parTarefGrp = {
              parGrpCode: ParaCode,
            };
          }

          prescData = {
            srvId: {
              srvType: {
                srvType: SrvTypePrsc,
              },
              srvCode: SrvCode,
              parTarefGrp: parTarefGrp,
            },
            srvQty: parseInt($("#QtyInput").val()),
          };
        }

        if (
          addPrescriptionitems.length > 0 &&
          addPrescriptionitems.find(({ srvId }) => srvId.srvCode === SrvCode)
        ) {
          ErrorAlert("خطا", "سرویس انتخابی تکراری می باشد");
          return false;
        }
        return { prescData, prescItems };
      }
    }
  };

  // Add TaminSrvItem to the List
  const FuAddToListItem = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    let { prescData, prescItems } = await prescItemCreator(
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
      ActiveParaCode
    );

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

    // Reset
    $("#QtyInput").val("1");
    setSelectedAmount(null);
    setSelectedAmountLbl(null);
    setSelectedInstruction(null);
    setSelectedInstructionLbl(null);
  };

  // Registeration
  const registerEpresc = async (visit) => {
    if (visit === 1) {
      setVisitRegIsLoading(true);
      let url = "TaminEprsc/PrescriptionAdd";
      let data = {
        CenterID: ClinicID,
        NID: ActiveNID,
        PMN: patientInfo.Tel,
        PTI: 3,
        Comment: $("#eprscItemDescription").val(),
        note: [],
        SrvNames: [],
        prescTypeName: "ویزیت",
        PatientID: ActivePatientID,
      };

      console.log({ data });

      axiosClient
        .post(url, data)
        .then((response) => {
          console.log(response.data);
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

      let url = "TaminEprsc/PrescriptionAdd";
      let data = {
        CenterID: ClinicID,
        NID: ActiveNID,
        PMN: patientInfo.Tel,
        PTI: ActivePrescTypeID,
        Comment: $("#eprscItemDescription").val(),
        note: addPrescriptionitems,
        SrvNames: visitPrescriptionData,
        prescTypeName: ActivePrescName,
        PatientID: ActivePatientID,
      };

      console.log({ data });

      axiosClient
        .post(url, data)
        .then(async (response) => {
          console.log(response.data);
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

  // useEffect(() => {
  //   console.log({ prescriptionItemsData });
  // }, [prescriptionItemsData]);

  useEffect(() => {
    setShowBirthDigitsAlert(false);
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
                setIsLoading={setIsLoading}
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
              />

              <div className="prescList">
                <AddToListItems data={prescriptionItemsData} />
              </div>
            </div>
          </div>
        </div>

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
