import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert, SuccessAlert, TimerAlert } from "class/AlertManage";
import PatientInfoCard from "components/dashboard/patientInfo/patientInfoCard";
import ReceptionCard from "components/dashboard/reception/receptionCard";
import AddToListItems from "components/dashboard/reception/addToListItems";
import PrescInfo from "components/dashboard/reception/prescInfo";
import NewPatient from "components/dashboard/patientInfo/addNewPatient";
import CashDeskActions from "components/dashboard/cashDesk/actionsModal";

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

let additionalCostCode = 100000;
let Services = [];
let ClinicID,
  ClinicUserID,
  ActiveSrvID,
  ActiveModalityID,
  ActivePatientID,
  ActiveInsuranceType,
  ActiveSrvName,
  ActiveSrvEngName,
  ActiveSrvCode,
  ActiveSrvPrice,
  ActiveSalamatShare,
  ActiveTaminShare,
  ActiveArteshShare,
  ActiveDiscountShare,
  ReceptionObjectID,
  ReceptionID,
  ActiveEditSrvID,
  ActiveReceptionID = null;

const Reception = ({ ClinicUser }) => {
  ClinicUserID = ClinicUser._id;
  ClinicID = ClinicUser.ClinicID;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [addPatientIsLoading, setAddPatientIsLoading] = useState(false);

  const [patientInfo, setPatientInfo] = useState([]);
  const [ActivePatientNID, setActivePatientNID] = useState("");
  const [searchedServices, setSearchedServices] = useState([]);
  const [addedSrvItems, setAddedSrvItems] = useState([]);
  const [editSrvData, setEditSrvData] = useState([]);
  const [editSrvMode, setEditSrvMode] = useState(false);
  const [editAdditionalCostMode, setEditAdditionalCostMode] = useState(false);

  // patient Birthday
  const [birthYear, setBirthYear] = useState("");
  const [showBirthDigitsAlert, setShowBirthDigitsAlert] = useState(false);

  // Discounts
  const [discountCost, setDiscountCost] = useState({});
  const [selectedDiscount, setSelectedDiscount] = useState({});

  // AdditionalCosts
  const [showAdditionalCostsModal, setShowAdditionalCostsModal] =
    useState(false);
  const [additionalCost, setAdditionalCost] = useState(0);

  const openAdditionalCostsModal = (Add) => {
    if (Add) {
      setAdditionalCost(0);
      setEditSrvData([]);
    }
    setShowAdditionalCostsModal(true);
  };

  const handleCloseAdditionalCostsModal = () => {
    setShowAdditionalCostsModal(false);
    setEditAdditionalCostMode(false);
    setAdditionalCost(0);
  };

  //----- Patients Info -----//
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
        $("#patientNID").prop("readonly", true);

        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
        } else {
          ActivePatientID = response.data.user._id;
          ActiveInsuranceType = response.data.user.InsuranceType;
          setPatientInfo(response.data.user);
          $("#patientInfoCard").show("");
          $(".pendingPaitentContainer").hide();
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

  const getPatientActiveSearch = () => {
    $("#patientNID").val("");
    $("#getPatientCloseBtn").hide();
    $("#frmPatientInfoBtnSubmit").show();
    $("#patientNID").prop("readonly", false);
    $("#patientInfoCard").hide();

    ActivePatientID = null;
    setActivePatientNID(null);

    if (router.query.PNID) {
      router.push("/reception");
    }
  };

  const handleShowPendingPatients = () => {
    if (!ActivePatientNID) {
      $(".pendingPaitentContainer").toggle();
    }
  };

  const handlePendingPatientClick = (patient) => {
    ActivePatientID = patient._id;
    setActivePatientNID(patient.NationalID);
    ActiveInsuranceType = patient.InsuranceType;

    $("#patientNID").val(ActivePatientNID);
    $("#patientNID").prop("readonly", true);
    $("#frmPatientInfoBtnSubmit").hide();
    $("#getPatientCloseBtn").show();
    $("#patientInfoCard").show("");
    $(".pendingPaitentContainer").hide();
    setPatientInfo(patient);
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
          setPatientInfo(response.data);
          $("#newPatientModal").modal("hide");
          $("#patientInfoCard").show("");
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

  //---- Departments Tab Change ----//
  const handleDepTabChange = (services, modalityId) => {
    Services = services;
    ActiveModalityID = modalityId;

    $("#searchDiv").hide();
    $("#srvSearchInput").val("");
    $("#srvSearchInput").focus();
    $(".unsuccessfullSearch").hide("");
    $("#BtnActiveSearch").hide();
    $("#BtnServiceSearch").show();
    $("#srvSearchInput").prop("readonly", false);
  };

  //----- Search Through Services -----//
  const handleSearchService = (value) => {
    const filteredServices = Services.filter(
      (service) =>
        service.Name.includes(value) ||
        service.EngName.toLowerCase().includes(value) ||
        service.Code.includes(value)
    );

    setSearchedServices(filteredServices);

    if (value.length === 0) {
      $("#searchDiv").hide();
      $(".unsuccessfullSearch").hide("");
    } else {
      $("#searchDiv").show();
      filteredServices?.length === 0
        ? $(".unsuccessfullSearch").show("")
        : $(".unsuccessfullSearch").hide("");
    }
  };

  const selectSearchedSrv = (_id, name, code, engName, price, ss, st, sa) => {
    ActiveSrvID = _id;
    ActiveSrvName = name;
    ActiveSrvEngName = engName;
    ActiveSrvCode = code;
    ActiveSrvPrice = price;
    ActiveSalamatShare = ss;
    ActiveTaminShare = st;
    ActiveArteshShare = sa;

    $("#srvSearchInput").val(name);
    $("#BtnServiceSearch").hide();
    $("#BtnActiveSearch").show();
    $("#searchDiv").hide();
    $("#srvSearchInput").prop("readonly", true);
  };

  const activeSearch = () => {
    // ActiveSrvCode = null;
    $("#srvSearchInput").val("");
    $("#BtnActiveSearch").hide();
    $("#srvSearchInput").prop("readonly", false);
    $("#BtnServiceSearch").show();
    $("#srvSearchInput").focus();
  };

  //----- Discount -----//
  const openDiscountModal = () => {
    $("#manualDiscountModal").modal("show");
  };

  // add discounts from discountsOptions
  const applyDiscount = (id, Discount) => {
    setSelectedDiscount(Discount);

    const updatedData = addedSrvItems.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          Discount: Discount ? Discount : 0,
        };
      }
      return item;
    });

    setAddedSrvItems(updatedData);
    $("#manualDiscountModal").modal("hide");
  };

  // submit manual discount
  let SelectDiscountPercent = "";
  let ActiveSrvItemID = null;

  const FUSelectDiscountPercent = (id, Percent) => {
    SelectDiscountPercent = Percent;
    ActiveSrvItemID = id;
  };

  const submitManualDiscount = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let manualDiscount = {
      Des: formProps.receptionDiscountDes,
      Percent: formProps.receptionDiscountOptions === "1" ? true : false,
      Value: formProps.receptionDiscountValue,
    };

    applyDiscount(ActiveSrvItemID, manualDiscount);

    // setSelectedDiscount(null);
    // e.target.reset();
  };

  // remove discount from receptionItem
  const removeDiscount = (id) => {
    const itemWithDiscount = addedSrvItems.find((x) => x._id === id);
    itemWithDiscount.Discount = 0;
    setAddedSrvItems([]);
    setTimeout(() => {
      setAddedSrvItems(addedSrvItems);
    }, 100);
  };

  //---- Additional Costs ----//
  const submitAdditionalCosts = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let data = {
      _id: (additionalCostCode++).toString(),
      Code: additionalCostCode++,
      Name: formProps.additionalSrvName,
      Qty: formProps.additionalSrvQty,
      Price: additionalCost,

      OC: 0,
      Discount: 0,
      ModalityID: ActiveModalityID,
    };

    e.target.reset();
    setAdditionalCost(0);
    setAddedSrvItems([...addedSrvItems, data]);
    handleCloseAdditionalCostsModal();
  };

  // edit additionalCost item
  const editAdditionalCost = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let data = {
      _id: formProps.additionalSrvID,
      Code: formProps.additionalSrvCode,
      Name: formProps.additionalSrvName,
      Qty: formProps.additionalSrvQty,
      Price: additionalCost
        ? additionalCost
        : formProps.additionalSrvCost !== 0
          ? parseInt(formProps.additionalSrvCost.replaceAll(/,/g, ""))
          : 0,
      OC: 0,
      Discount: 0,
      ModalityID: ActiveModalityID,
    };

    updateAdditionalCostItem(formProps.additionalSrvID, data);
    handleCloseAdditionalCostsModal();
    e.target.reset();
    setEditAdditionalCostMode(false);
  };

  const updateAdditionalCostItem = (id, newArr) => {
    let index = addedSrvItems.findIndex((x) => x._id === id);
    let g = addedSrvItems[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else {
      setTimeout(() => {
        setAddedSrvItems([
          ...addedSrvItems.slice(0, index),
          g,
          ...addedSrvItems.slice(index + 1),
        ]);
      }, 5);
    }
  };

  //----- Edit Service -----//
  const getOneReception = () => {
    let url = `ClinicReception/getOne/${ReceptionObjectID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setPatientInfo(response.data.Patient);
        setAddedSrvItems(response.data.Items);

        ActivePatientID = response.data.Patient._id;
        ActiveInsuranceType = response.data.Patient.InsuranceType;

        const newActivePatientNID = response.data.Patient.NationalID;
        setActivePatientNID(newActivePatientNID);
        $("#patientInfoCard").show("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditService = (srvData) => {
    setEditSrvData(srvData);

    if (parseInt(srvData.Code) >= 100000) {
      openAdditionalCostsModal();
      setEditAdditionalCostMode(true);
    } else {
      setEditSrvMode(true);

      ActiveSrvName = srvData.Name;
      ActiveSrvCode = srvData.Code;
      ActiveEditSrvID = srvData._id;
      ActiveSrvPrice = srvData.Price;
      ActiveSrvID = srvData._id;
      ActiveSrvEngName = srvData.EngName;
      ActiveDiscountShare = srvData.Discount;

      $("#srvSearchInput").val(srvData.Name);
      $("#QtyInput").val(srvData.Qty);
      $("#ResPrescDescription").val(srvData.Des);

      if (ActiveInsuranceType == "1") {
        ActiveSalamatShare = srvData.OC;
      } else if (ActiveInsuranceType == "2") {
        ActiveTaminShare = srvData.OC;
      } else {
        ActiveArteshShare = srvData.OC;
      }
    }
  };

  const updateSrvItem = (id, newArr) => {
    let index = addedSrvItems.findIndex((x) => x._id === id);
    let g = addedSrvItems[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else {
      setTimeout(() => {
        setAddedSrvItems([
          ...addedSrvItems.slice(0, index),
          g,
          ...addedSrvItems.slice(index + 1),
        ]);
      }, 5);
    }
  };

  const updateItemCallback = (updatedItem, id) => {
    setAddedSrvItems(addedSrvItems.filter((item) => item._id !== id));
    updateSrvItem(id, updatedItem);
  };

  //----- Delete Service ------//
  const deleteService = (id) => {
    setAddedSrvItems(addedSrvItems.filter((a) => a._id !== id));
  };

  //---- Add an Item to List ----//
  const FuAddToList = async (e) => {
    e.preventDefault();

    let addData = {
      _id: ActiveSrvID,
      Name: ActiveSrvName,
      EngName: ActiveSrvEngName,
      Code: ActiveSrvCode,
      Price: ActiveSrvPrice,
      Qty: $("#QtyInput").val(),
      Des: $("#ResPrescDescription").val(),
      ModalityID: ActiveModalityID,
    };

    if (ActiveInsuranceType === "1") {
      addData.OC = ActiveSalamatShare;
    } else if (ActiveInsuranceType === "2") {
      addData.OC = ActiveTaminShare;
    } else if (ActiveInsuranceType === "3") {
      addData.OC = ActiveArteshShare;
    } else {
      addData.OC = 0;
    }
    addData.Discount = ActiveDiscountShare ? ActiveDiscountShare : 0;

    setAddedSrvItems((prevItems) => {
      if (!editSrvMode) {
        if (ActiveSrvName == null || ActiveSrvCode == null) {
          ErrorAlert("خطا", "خدمتی انتخاب نشده است");
          return prevItems; // Return the previous state
        } else if (
          prevItems.length > 0 &&
          prevItems.find((x) => x._id === ActiveSrvID)
        ) {
          ErrorAlert("خطا", "سرویس تکراری می باشد!");
          return prevItems;
        }
      } else {
        // Check if the ModalityID is different when in edit mode
        // if (addData.ModalityID !== editSrvData.ModalityID) {
        //   ErrorAlert("خطا", " افزودن سرویس از مدالیت متفاوت وجود ندارد!");
        //   return prevItems;
        // }

        updateItemCallback(addData, ActiveEditSrvID);
        setEditSrvMode(false);
        ActiveSrvCode = null;
      }
      return [...prevItems, addData];
    });

    // reset
    $("#srvSearchInput").val("");
    $("#ResPrescDescription").val("");
    $("#QtyInput").val("1");
    $("#BtnActiveSearch").hide();
    $("#BtnServiceSearch").show();
    $("#srvSearchInput").prop("readonly", false);
  };

  //------ Submit Reception ------//
  const submitReceptionPrescript = (
    totalQty,
    totalPrice,
    totalOC,
    totalPC,
    totalDiscount
  ) => {
    setIsLoading(true);
    let url = "ClinicReception/addEdit";

    let dataToSubmit = {};
    let data = {
      ClinicID,
      UserID: ClinicUserID,
      PatientID: ActivePatientID,
      receptionItems: addedSrvItems,
      Calculated: [
        {
          TotalQty: totalQty,
          TotalPrice: totalPrice,
          TotalOC: totalOC,
          TotalPC: totalPC,
          TotalDiscount: totalDiscount,
        },
      ],
    };

    ReceptionObjectID
      ? (dataToSubmit = {
        ...data,
        ReceptionID,
        ReceptionObjectID,
      })
      : (dataToSubmit = data);

    console.log({ dataToSubmit });

    if (!ActivePatientID) {
      ErrorAlert("خطا", "اطلاعات بیمار را وارد نمایید!");
      setIsLoading(false);
    } else if (addedSrvItems.length === 0) {
      ErrorAlert("خطا", "خدمتی به لیست اضافه نشده است!");
      setIsLoading(false);
    } else {
      axiosClient
        .post(url, dataToSubmit)
        .then((response) => {
          console.log(response.data);

          setIsLoading(false);

          if (response.data.length === 1) {
            SuccessAlert("موفق", "ثبت پذیرش با موفقیت انجام گردید!");

            setTimeout(() => {
              openActionModal(response.data[0]._id, response.data[0]);
            }, 400);
          } else {
            const seconds = 3;
            const timerInMillis = seconds * 1000;

            TimerAlert({
              title: "ثبت پذیرش با موفقیت انجام گردید!",
              html: `<div class="custom-content">در حال انتقال به صفحه صندوق در<b>${seconds}</b> ثانیه</div>`,
              timer: timerInMillis,
              timerProgressBar: true,
              cancelButton: {
                text: "انصراف",
              },
              onConfirm: () => {
                router.push("/cashDesk");
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          ErrorAlert("خطا", "ثبت پذیرش با خطا مواجه گردید!");
        });
    }
  };

  //-----  cashDesk  -----//
  const [showActionModal, setShowActionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [actionModalData, setActionModalData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  const openActionModal = (receptionID, data) => {
    setShowActionModal(true);
    ActiveReceptionID = receptionID;
    setActionModalData(data);
    setPaymentData(data?.CashDesk);
  };

  const handleCloseActionsModal = () => {
    setShowActionModal(false);

    const seconds = 3;
    const timerInMillis = seconds * 1000;

    TimerAlert({
      title: "در حال تنظیم مجدد صفحه پذیرش!",
      html: `<div class="custom-content">این عملیات <b>${seconds}</b> ثانیه طول می‌کشد</div>`,
      timer: timerInMillis,
      timerProgressBar: true,
      cancelButton: {
        text: "انصراف",
      },
      onConfirm: () => {
        router.reload();
      },
    });
  };

  const ApplyCashDeskActions = (data) => {
    if (data) {
      setPaymentData(data.CashDesk);
      setShowPaymentModal(false);
    }
  };

  useEffect(() => {
    $("#BtnActiveSearch").hide();
    $("#getPatientCloseBtn").hide();
    setShowBirthDigitsAlert(false);
  }, []);

  useEffect(() => {
    ReceptionObjectID = router.query.id;
    ReceptionID = router.query.receptionID;
    if (ReceptionObjectID) getOneReception();

    if (router.query.PNID) {
      setActivePatientNID(router.query.PNID);
      setTimeout(() => {
        $("#patientNID").val(router.query.PNID);
        $("#frmPatientInfoBtnSubmit").click();
      }, 300);
    } else {
      // reset
      ActivePatientID = null;
      setActivePatientNID(null);
      $("#patientNID").val("");
    }
  }, [router.isReady]);

  useEffect(() => {
    $("#patientNID").val(ActivePatientNID);
  }, [ActivePatientNID]);

  return (
    <>
      <Head>
        <title>پذیرش</title>
      </Head>
      <div className="page-wrapper reception-wrapper">
        <div className="content container-fluid pb-0">
          <div className="row">
            <div className="row receptionUpperSection justify-between paddingL-0">
              <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-12">
                <PatientInfoCard
                  data={patientInfo}
                  setPatientInfo={setPatientInfo}
                  getPatientInfo={getPatientInfo}
                  ActivePatientNID={ActivePatientNID}
                  ClinicID={ClinicID}
                  patientStatIsLoading={patientStatIsLoading}
                  getPatientActiveSearch={getPatientActiveSearch}
                  handlePendingPatientClick={handlePendingPatientClick}
                  handleShowPendingPatients={handleShowPendingPatients}
                />
              </div>
              <div className="col-xxl-9 col-xl-8 col-lg-7 col-md-12 paddingL-0">
                <ReceptionCard
                  ClinicID={ClinicID}
                  handleDepTabChange={handleDepTabChange}
                  handleSearchService={handleSearchService}
                  searchedServices={searchedServices}
                  selectSearchedSrv={selectSearchedSrv}
                  FuAddToList={FuAddToList}
                  editSrvData={editSrvData}
                  setEditSrvData={setEditSrvData}
                  editSrvMode={editSrvMode}
                  setEditSrvMode={setEditSrvMode}
                  activeSearch={activeSearch}
                />

                <div className="prescList">
                  <AddToListItems
                    data={addedSrvItems}
                    ClinicID={ClinicID}
                    handleEditService={handleEditService}
                    deleteService={deleteService}
                    removeDiscount={removeDiscount}
                    openDiscountModal={openDiscountModal}
                    applyDiscount={applyDiscount}
                    discountCost={discountCost}
                    setDiscountCost={setDiscountCost}
                    selectedDiscount={selectedDiscount}
                    FUSelectDiscountPercent={FUSelectDiscountPercent}
                    submitManualDiscount={submitManualDiscount}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 prescInfoCard">
              <PrescInfo
                data={addedSrvItems}
                mode={editAdditionalCostMode}
                submitReceptionPrescript={submitReceptionPrescript}
                isLoading={isLoading}
                show={showAdditionalCostsModal}
                onHide={handleCloseAdditionalCostsModal}
                openAdditionalCostsModal={openAdditionalCostsModal}
                submitAdditionalCosts={submitAdditionalCosts}
                editAdditionalCost={editAdditionalCost}
                additionalCost={additionalCost}
                setAdditionalCost={setAdditionalCost}
                editSrvData={editSrvData}
              />
            </div>
          </div>
        </div>

        <NewPatient
          addNewPatient={addNewPatient}
          ClinicID={ClinicID}
          ActivePatientNID={ActivePatientNID}
          birthYear={birthYear}
          setBirthYear={setBirthYear}
          showBirthDigitsAlert={showBirthDigitsAlert}
          setShowBirthDigitsAlert={setShowBirthDigitsAlert}
          addPatientIsLoading={addPatientIsLoading}
        />

        <CashDeskActions
          ClinicID={ClinicID}
          ClinicUserID={ClinicUserID}
          ActiveReceptionID={ActiveReceptionID}
          show={showActionModal}
          onHide={handleCloseActionsModal}
          data={actionModalData}
          paymentData={paymentData}
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
          ApplyCashDeskActions={ApplyCashDeskActions}
        />
      </div>
    </>
  );
};

export default Reception;
