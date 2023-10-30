import { useState, useEffect } from "react";
import Head from "next/head";
import { getSession } from "lib/session";
import { axiosClient } from "class/axiosConfig.js";
import Loading from "components/commonComponents/loading/loading";
import PatientInfoCard from "components/dashboard/reception/patientInfoCard";
import ReceptionCard from "components/dashboard/reception/receptionCard";

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

let ClinicID,
  ActivePatientID = null;
let Services = [];
const Reception = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState([]);
  const [servicesSearchInput, setServicesSearchInput] = useState("");
  const [searchedServices, setSearchedServices] = useState([]);

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
  const setDepartmentsServices = (services) => (Services = services);

  const handleSearchService = (value) => {
    console.log(value);
    const filteredServices = Services.filter(
      (service) =>
        service.Name.includes(value) ||
        service.EngName.toLowerCase().includes(value.toLowerCase()) ||
        service.Code.includes(value)
    );

    console.log(filteredServices);
    setSearchedServices(filteredServices);
  };
  console.log({ searchedServices });

  //   useEffect(() => {
  //     console.log({ servicesSearchInput });
  //   }, [servicesSearchInput]);

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
                setDepartmentsServices={setDepartmentsServices}
                servicesSearchInput={servicesSearchInput}
                handleSearchService={handleSearchService}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reception;
