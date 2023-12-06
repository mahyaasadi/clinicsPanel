import Head from "next/head";
import { useState, useEffect } from "react";
import { getSession } from "lib/session";
import FeatherIcon from "feather-icons-react";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, QuestionAlert } from "class/AlertManage";
import Loading from "components/commonComponents/loading/loading";
import InsuranceModal from "components/dashboard/settings/insurances/insuranceModal";
import InsuranceListTable from "components/dashboard/settings/insurances/insuranceListTable";

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
  ActiveInsuranceID = null;
const InsuranceSettings = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;

  const [isLoading, setIsLoading] = useState(true);
  const [insuranceData, setInsuranceData] = useState([]);
  const [insuranceOrgData, setInsuranceOrgData] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [editInsuranceData, setEditInsuranceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedInsuranceID, setSelectedInsuranceID] = useState(null);
  const [selectedInsuranceName, setSelectedInsuranceName] = useState(null);

  const handleCloseModal = () => setShowModal(false);

  const FUSelectInsurance = (insurance) => {
    console.log({ insurance });
    setSelectedInsuranceID(insurance.value);
    setSelectedInsuranceName(insurance.label);
  };

  // Get All ClinicInsurances
  const getClinicInsurances = () => {
    setIsLoading(true);
    let url = `Clinic//getClinicInsurance/${ClinicID}`;

    axiosClient
      .get(url)
      .then((response) => {
        setInsuranceData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // Get InsurancesOrg Options
  const getInsuranceOrgData = () => {
    setIsLoading(true);

    let url = "Clinic/getInsuranceOrg";

    axiosClient
      .get(url)
      .then((response) => {
        setInsuranceOrgData(response.data);
        let insuranceOptionsArr = [];
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          let obj = {
            value: item.id,
            label: item.Name,
          };
          insuranceOptionsArr.push(obj);
        }
        setInsuranceOptions(insuranceOptionsArr);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "خطا در دریافت اطلاعات!");
        setIsLoading(false);
      });
  };

  // Add Insurance
  const openAddModal = () => {
    setShowModal(true);
    setModalMode("add");
  };

  const addInsurance = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "Clinic/addInsurance";
    let data = {
      ClinicID,
      IID: selectedInsuranceID,
      IName: selectedInsuranceName,
      IUName: formProps.insuranceUserName,
      IPass: formProps.insurancePassword,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setInsuranceData([...insuranceData, response.data]);

        e.target.reset();
        setShowModal(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "افزودن بیمه با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  // Edit Insurance
  const openEditModal = (data) => {
    setShowModal(true);
    setModalMode("edit");
    setEditInsuranceData(data);
    ActiveInsuranceID = data._id;
  };

  const editInsurance = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    const activeInsuranceID = formProps.insuranceType
      ? formProps.insuranceType
      : selectedInsuranceID;

    const activeInsuranceName = insuranceData.find(
      (x) => x.IID === activeInsuranceID
    );

    let url = "Clinic/EditInsurance";
    let data = {
      ClinicID,
      InsuranceID: ActiveInsuranceID,
      IID: formProps.insuranceType,
      IName: activeInsuranceName?.IName
        ? activeInsuranceName?.IName
        : selectedInsuranceName,
      IUName: formProps.insuranceUserName,
      IPass: formProps.insurancePassword,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        updateItem(ActiveInsuranceID, response.data);
        setShowModal(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        ErrorAlert("خطا", "ویرایش اطلاعات  با خطا مواجه گردید!");
        setIsLoading(false);
      });
  };

  const updateItem = (id, newArr) => {
    let index = insuranceData.findIndex((x) => x._id === id);
    let g = insuranceData[index];
    g = newArr;

    if (index === -1) {
      console.log("no match");
    } else
      setInsuranceData([
        ...insuranceData.slice(0, index),
        g,
        ...insuranceData.slice(index + 1),
      ]);
  };

  // Delete Insurance
  const deleteInsurance = async (id) => {
    let result = await QuestionAlert(
      "حذف بیمه!",
      "آیا از حذف بیمه اطمینان دارید؟"
    );

    if (result) {
      setIsLoading(true);
      let url = "Clinic/DeleteInsurance";
      let data = {
        ClinicID,
        InsuranceID: id,
      };

      await axiosClient
        .delete(url, { data })
        .then(function () {
          setInsuranceData(insuranceData.filter((a) => a._id !== id));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          ErrorAlert("خطا", "حذف بیمه با خطا مواجه گردید!");
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    getInsuranceOrgData(), getClinicInsurances();
  }, []);

  return (
    <>
      <Head>
        <title>تنظیمات بیمه</title>
      </Head>
      <div className="page-wrapper">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-md-12 d-flex justify-content-end">
                  <button
                    onClick={openAddModal}
                    className="btn btn-primary btn-add font-14 media-font-12"
                  >
                    <i className="me-1">
                      <FeatherIcon icon="plus-square" />
                    </i>{" "}
                    اضافه کردن
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header border-bottom-0">
                    <div className="row align-items-center">
                      <div className="col">
                        <p className="card-title text-secondary font-14">
                          لیست بیمه ها
                        </p>
                      </div>
                    </div>
                  </div>

                  <InsuranceListTable
                    data={insuranceData}
                    openEditModal={openEditModal}
                    deleteInsurance={deleteInsurance}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <InsuranceModal
          mode={modalMode}
          show={showModal}
          onHide={handleCloseModal}
          data={editInsuranceData}
          isLoading={isLoading}
          insuranceOptions={insuranceOptions}
          FUSelectInsurance={FUSelectInsurance}
          onSubmit={modalMode === "add" ? addInsurance : editInsurance}
        />
      </div>
    </>
  );
};

export default InsuranceSettings;

