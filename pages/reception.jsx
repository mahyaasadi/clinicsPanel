import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { useRouter } from "next/router";
import { ErrorAlert, SuccessAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import PatientInfoCard from "components/dashboard/reception/patientInfoCard";
import ReceptionCard from "components/dashboard/reception/receptionCard";
import AddToListItems from "components/dashboard/reception/addToListItems";
import PrescInfo from "components/dashboard/reception/prescInfo";

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
  ReceptionObjectID,
  ReceptionID,
  ActiveEditSrvID = null;

const Reception = ({ ClinicUser }) => {
  ClinicUserID = ClinicUser._id;
  ClinicID = ClinicUser.ClinicID;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState([]);
  const [searchedServices, setSearchedServices] = useState([]);
  const [addedSrvItems, setAddedSrvItems] = useState([]);
  const [editSrvData, setEditSrvData] = useState([]);
  const [editSrvMode, setEditSrvMode] = useState(false);

  //get patient info
  const getPatientInfo = (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        setIsLoading(false);
        ActivePatientID = response.data.user._id;
        ActiveInsuranceType = response.data.user.InsuranceType;
        setPatientInfo(response.data.user);
        $("#patientInfoCard").show("");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // Search DepServices
  const handleDepTabChange = (services, modalityId) => {
    Services = services;
    ActiveModalityID = modalityId;

    // $("#searchDiv").hide();
    // $("#srvSearchInput").val("");
    // $(".unsuccessfulSearch").hide("");

    const updatedServices = Services.map((service) => ({
      ...service,
      ModalityID: modalityId,
    }));

    return updatedServices;
  };

  const updatedServicesArray = handleDepTabChange(Services, ActiveModalityID);

  const handleSearchService = (value) => {
    const filteredServices = updatedServicesArray.filter(
      (service) =>
        service.Name.includes(value) ||
        service.EngName.toLowerCase().includes(value.toLowerCase()) ||
        service.Code.includes(value)
    );

    setSearchedServices(filteredServices);
    let searchInput = $("#srvSearchInput").val();
    searchInput.length == 0 ? $("#searchDiv").hide() : $("#searchDiv").show();

    filteredServices.length == 0
      ? $(".unsuccessfullSearch").show("")
      : $(".unsuccessfullSearch").hide("");
  };

  const selectSearchedSrv = (
    _id,
    name,
    code,
    engName,
    price,
    ss,
    st,
    sa,
    modalityID
  ) => {
    ActiveSrvID = _id;
    ActiveSrvName = name;
    ActiveSrvEngName = engName;
    ActiveSrvCode = code;
    ActiveSrvPrice = price;
    ActiveSalamatShare = ss;
    ActiveTaminShare = st;
    ActiveArteshShare = sa;
    ActiveModalityID = modalityID;

    $("#srvSearchInput").val(name);
    $("#searchDiv").hide();
  };

  // add item to list
  const FuAddToList = async (e) => {
    e.preventDefault();

    if (!editSrvMode) {
      if (ActiveSrvName == null || ActiveSrvCode == null) {
        ErrorAlert("خطا", "خدمتی انتخاب نشده است");
        return false;
      } else if (
        addedSrvItems.length > 0 &&
        addedSrvItems.find((x) => x._id === ActiveSrvID)
      ) {
        ErrorAlert("خطا", "سرویس تکراری می باشد!");
      }
    }

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

    if (editSrvMode) updateItemCallback(addData, ActiveEditSrvID);

    setAddedSrvItems([...addedSrvItems, addData]);

    // reset
    $("#srvSearchInput").val("");
    $("#QtyInput").val("1");
    ActiveSrvName = null;
    ActiveSrvCode = null;
  };

  const submitReceptionPrescript = () => {
    let url = "ClinicReception/addEdit";

    let dataToSubmit = {};
    let data = {
      ClinicID,
      UserID: ClinicUserID,
      PatientID: ActivePatientID,
      receptionItems: addedSrvItems,
    };

    ReceptionObjectID
      ? (dataToSubmit = {
          ...data,
          ReceptionID,
          ReceptionObjectID,
        })
      : (dataToSubmit = data);

    console.log({ dataToSubmit });

    axiosClient
      .post(url, dataToSubmit)
      .then((response) => {
        console.log(response.data);
        SuccessAlert("موفق", "ثبت پذیرش با موفقیت انجام گردید!");
        setTimeout(() => {
          if (response.data.Register) {
            router.push("/receptionRecords");
          }
        }, 300);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ثبت پذیرش با خطا مواجه گردید!");
      });
  };

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

  // edit service
  const handleEditService = (srvData) => {
    setEditSrvData(srvData);
    setEditSrvMode(true);

    ActiveSrvName = srvData.Name;
    ActiveSrvCode = srvData.Code;
    ActiveEditSrvID = srvData._id;
    ActiveSrvPrice = srvData.Price;
    ActiveSrvID = srvData._id;
    ActiveSrvEngName = srvData.EngName;
    $("#QtyInput").val(srvData.Qty);
  };

  const getOneReception = () => {
    let url = `ClinicReception/getOne/${ReceptionObjectID}`;

    axiosClient
      .get(url)
      .then((response) => {
        console.log(response.data);
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
    const updatedItems = addedSrvItems.filter((item) => item._id !== id);

    // setAddedSrvItems([]);
    // setTimeout(() => {
    //   setAddedSrvItems([...updatedItems, updatedItem]);
    // }, 80);

    updateSrvItem(id, updatedItem);
  };

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
        <div className="content container-fluid">
          <div className="row">
            <div className="row receptionUpperSection justify-between paddingL-0">
              <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-12">
                <PatientInfoCard
                  data={patientInfo}
                  getPatientInfo={getPatientInfo}
                  ActivePatientNID={ActivePatientNID}
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
                  editSrvMode={editSrvMode}
                  setEditSrvData={setEditSrvData}
                  setEditSrvMode={setEditSrvMode}
                />

                <div className="prescList">
                  <AddToListItems
                    data={addedSrvItems}
                    ClinicID={ClinicID}
                    handleEditService={handleEditService}
                    applyDiscount={applyDiscount}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 col-md-12">
              <PrescInfo
                data={addedSrvItems}
                submitReceptionPrescript={submitReceptionPrescript}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reception;
