import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import { ErrorAlert } from "class/AlertManage";
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
  ActivePatientID,
  ActiveSrvName,
  ActiveSrvEngName,
  ActiveSrvCode,
  ActiveSrvPrice,
  ActiveSalamatShare,
  ActiveTaminShare,
  ActiveArteshShare,
  ActiveInsuranceType = null;

const Reception = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState([]);
  const [searchedServices, setSearchedServices] = useState([]);
  const [addedSrvItems, setAddedSrvItems] = useState([]);
  const [editSrvData, setEditSrvData] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [mode, setMode] = useState("");

  //get patient info
  const getPatientInfo = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    ActivePatientID = formProps.nationalCode;

    let url = "Patient/checkByNid";
    let data = {
      ClinicID,
      NID: formProps.nationalCode,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data.user);
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
  const handleDepTabChange = (services) => {
    Services = services;
    $("#searchDiv").hide();
    $("#srvSearchInput").val("");
    $(".unsuccessfullSearch").hide("");
  };

  const handleSearchService = (value) => {
    const filteredServices = Services.filter(
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

  const selectSearchedSrv = (name, code, engName, price, ss, st, sa) => {
    ActiveSrvName = name;
    ActiveSrvEngName = engName;
    ActiveSrvCode = code;
    ActiveSrvPrice = price;
    ActiveSalamatShare = ss;
    ActiveTaminShare = st;
    ActiveArteshShare = sa;

    $("#srvSearchInput").val(name);
    $("#searchDiv").hide();
  };

  // add item to list
  const FuAddToList = async (e) => {
    e.preventDefault();

    if (ActiveSrvName == null || ActiveSrvCode == null) {
      ErrorAlert("خطا", "خدمتی انتخاب نشده است");
      return false;
    } else {
      let addData = {
        Name: ActiveSrvName,
        EngName: ActiveSrvEngName,
        Code: ActiveSrvCode,
        Price: ActiveSrvPrice,
        SS: ActiveSalamatShare,
        ST: ActiveTaminShare,
        SA: ActiveArteshShare,
        Qty: $("#QtyInput").val(),
        Des: $("#ResPrescDescription").val(),
      };

      setAddedSrvItems([addData, ...addedSrvItems]);
      setSelectedDiscounts([null, ...selectedDiscounts]);

      // reset
      $("#srvSearchInput").val("");
      $("#QtyInput").val("1");
      ActiveSrvName = null;
      ActiveSrvCode = null;
    }
  };

  // edit service
  const handleEditService = (srvData) => {
    setEditSrvData(srvData);
    setMode("edit");
    ActiveSrvName = srvData.Name;
    ActiveSrvCode = srvData.Code;
    $("#QtyInput").val(srvData.Qty);
    // ActiveEditSrvCode = srvData.SrvCode;
  };

  return (
    <>
      <Head>
        <title>پذیرش</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="row receptionUpperSection">
              <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-12">
                <PatientInfoCard
                  data={patientInfo}
                  getPatientInfo={getPatientInfo}
                  ActivePatientID={ActivePatientID}
                />
              </div>
              <div className="col-xxl-9 col-xl-8 col-lg-7 col-12 ">
                <ReceptionCard
                  ClinicID={ClinicID}
                  handleDepTabChange={handleDepTabChange}
                  handleSearchService={handleSearchService}
                  searchedServices={searchedServices}
                  selectSearchedSrv={selectSearchedSrv}
                  FuAddToList={FuAddToList}
                  editSrvData={editSrvData}
                  mode={mode}
                />

                <div className="prescList">
                  <AddToListItems
                    data={addedSrvItems}
                    selectedDiscounts={selectedDiscounts}
                    setSelectedDiscounts={setSelectedDiscounts}
                    handleEditService={handleEditService}
                    ActiveInsuranceType={ActiveInsuranceType}
                    ClinicID={ClinicID}
                  />
                </div>
              </div>

            </div>
            <div className="mt-3 prescInfoCard">
              <PrescInfo
                data={addedSrvItems}
                ActiveInsuranceType={ActiveInsuranceType}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reception;
