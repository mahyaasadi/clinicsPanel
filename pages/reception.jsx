import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { useRouter } from "next/router";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import PatientInfoCard from "@/components/dashboard/reception/patientInfo/patientInfoCard";
import ReceptionCard from "components/dashboard/reception/receptionCard";
import AddToListItems from "components/dashboard/reception/addToListItems";
import PrescInfo from "components/dashboard/reception/prescInfo";
import NewPatient from "components/dashboard/reception/patientInfo/addNewPatient";

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

let Services = [];
let ClinicID,
  ClinicUserID,
  ActiveSrvID,
  ActiveModalityID,
  ActivePatientID,
  ActivePatientNID,
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
  ActiveEditSrvID = null;

const Reception = ({ ClinicUser }) => {
  ClinicUserID = ClinicUser._id;
  ClinicID = ClinicUser.ClinicID;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [patientStatIsLoading, setPatientStatIsLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState([]);
  const [searchedServices, setSearchedServices] = useState([]);
  const [addedSrvItems, setAddedSrvItems] = useState([]);
  const [editSrvData, setEditSrvData] = useState([]);
  const [editSrvMode, setEditSrvMode] = useState(false);

  //----- Patients Info -----//
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
        if (response.data.error == "1") {
          $("#newPatientModal").modal("show");
        } else {
          ActivePatientID = response.data.user._id;
          ActiveInsuranceType = response.data.user.InsuranceType;
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
        SuccessAlert("موفق", "اطلاعات بیمار با موفقیت ثبت گردید!");
        if (response.data.errors) {
          ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت اطلاعات بیمار با خطا مواجه گردید!");
      });
  };

  //---- Departments Tab Change ----//
  let updatedServices = [];
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

    // updatedServices = Services.map((service) => ({
    //   ...service,
    //   ModalityID: modalityId,
    // }));
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

  const selectSearchedSrv = (
    _id,
    name,
    code,
    engName,
    price,
    ss,
    st,
    sa
    // modalityID
  ) => {
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
  const applyDiscount = (id, Discount) => {
    const updatedData = addedSrvItems.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          Discount: Discount,
        };
      }
      return item;
    });
    setAddedSrvItems(updatedData);
  };

  const removeDiscount = (id) => {
    const itemWithDiscount = addedSrvItems.find((x) => x._id === id);
    itemWithDiscount.Discount = 0;
    setAddedSrvItems([]);
    setTimeout(() => {
      setAddedSrvItems(addedSrvItems);
    }, 100);
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
        ActivePatientNID = response.data.Patient.NationalID;
        $("#patientInfoCard").show("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditService = (srvData) => {
    setEditSrvData(srvData);
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

    if (ActiveInsuranceType == "1") {
      ActiveSalamatShare = srvData.OC;
    } else if (ActiveInsuranceType == "2") {
      ActiveTaminShare = srvData.OC;
    } else {
      ActiveArteshShare = srvData.OC;
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
    addData.Discount = ActiveDiscountShare;

    // setAddedSrvItems([...addedSrvItems, addData]);

    // if (!editSrvMode) {
    //   if (ActiveSrvName == null || ActiveSrvCode == null) {
    //     ErrorAlert("خطا", "خدمتی انتخاب نشده است");
    //     return false;
    //   } else if (
    //     addedSrvItems.length > 0 &&
    //     addedSrvItems.find((x) => x._id === ActiveSrvID)
    //   ) {
    //     ErrorAlert("خطا", "سرویس تکراری می باشد!");
    //     return false;
    //   }
    // } else {
    //   updateItemCallback(addData, ActiveEditSrvID);
    //   setEditSrvMode(false);
    //   ActiveSrvCode = null;
    // }

    // // reset
    // $("#srvSearchInput").val("");
    // $("#QtyInput").val("1");
    // $("#BtnActiveSearch").hide();
    // $("#BtnServiceSearch").show();
    // $("#srvSearchInput").prop("readonly", false);

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
          return prevItems; // Return the previous state
        }
      } else {
        updateItemCallback(addData, ActiveEditSrvID);
        setEditSrvMode(false);
        ActiveSrvCode = null;
      }
      return [...prevItems, addData]; // Return the updated state
    });

    // reset
    $("#srvSearchInput").val("");
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
          SuccessAlert("موفق", "ثبت پذیرش با موفقیت انجام گردید!");
          setTimeout(() => {
            if (response.data.Register) {
              router.push("/receptionRecords");
            }
          }, 300);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          ErrorAlert("خطا", "ثبت پذیرش با خطا مواجه گردید!");
        });
    }
  };

  useEffect(() => {
    $("#BtnActiveSearch").hide();
  }, []);

  useEffect(() => {
    ReceptionObjectID = router.query.id;
    ReceptionID = router.query.receptionID;
    if (ReceptionObjectID) getOneReception();
  }, [router.query.id]);

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
                    applyDiscount={applyDiscount}
                    deleteService={deleteService}
                    removeDiscount={removeDiscount}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 col-md-12 prescInfoCard">
              <PrescInfo
                data={addedSrvItems}
                submitReceptionPrescript={submitReceptionPrescript}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        <NewPatient
          addNewPatient={addNewPatient}
          ClinicID={ClinicID}
          ActivePatientNID={ActivePatientNID}
        />
      </div>
    </>
  );
};

export default Reception;
