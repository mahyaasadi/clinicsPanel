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
  ActiveArteshShare = null;

const Reception = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState([]);
  const [searchedServices, setSearchedServices] = useState([]);
  const [addedSrvItems, setAddedSrvItems] = useState([]);

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
    $(".unsuccessfullSearch").hide("");

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
      };

      setAddedSrvItems([addData, ...addedSrvItems]);

      // reset
      $("#srvSearchInput").val("");
      $("#QtyInput").val("1");
      ActiveSrvName = null;
      ActiveSrvCode = null;
    }
  };

  useEffect(() => $(".unsuccessfullSearch").hide(""), []);

  return (
    <>
      <Head>
        <title>پذیرش</title>
      </Head>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-12">
              <PatientInfoCard
                data={patientInfo}
                getPatientInfo={getPatientInfo}
                ActivePatientID={ActivePatientID}
              />
            </div>
            <div className="col-xxl-9 col-xl-8 col-lg-6 col-12">
              <ReceptionCard
                ClinicID={ClinicID}
                handleDepTabChange={handleDepTabChange}
                handleSearchService={handleSearchService}
                searchedServices={searchedServices}
                selectSearchedSrv={selectSearchedSrv}
                FuAddToList={FuAddToList}
              />

              <div className="prescList">
                <AddToListItems data={addedSrvItems} />
              </div>
            </div>
          </div>
          <div className="col-12 mt-4">
            <PrescInfo data={addedSrvItems} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Reception;
