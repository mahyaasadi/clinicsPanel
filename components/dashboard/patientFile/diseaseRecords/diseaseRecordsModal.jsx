import { useState } from "react";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert } from "class/AlertManage"
import SearchedDiseasesItems from "components/dashboard/patientFile/diseaseRecords/searchedDiseasesItems";

let ActiveDiseaseName,
  ActiveDiseaseID,
  ActiveDiseaseEngName,
  ActiveICDCode = null;

const DiseaseRecordModal = ({
  show,
  setShow,
  ClinicID,
  ActivePatientID,
  addDisease,
}) => {
  const [searchedDiseases, setSearchedDiseases] = useState([]);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);

  const onHide = () => {
    setShow(false);
    $(".diseaseSearchDiv").hide();
    setSearchedDiseases([]);
  };

  const _searchInDiseases = (e) => {
    e.preventDefault();
    setSearchIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    let url = `Disease/search/${formProps.diseaseSearchInput.toUpperCase()}`;

    let data = {
      ClinicID,
      PatientID: ActivePatientID,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          setSearchedDiseases(response.data);
          $("#DiseaseSearchDiv").show();
          setSearchIsLoading(false);
          $(".unsuccessfullSearch").hide();
        }

        if (response.data.length == 0) {
          $(".unsuccessfullSearch").show();
        } else {
          $(".unsuccessfullSearch").hide();
        }
      })
      .catch((err) => {
        console.log(err);
        setSearchIsLoading(false);
      });
  };

  const selectSearchedDisease = (name, engName, _id, icdCode) => {
    ActiveDiseaseName = name;
    ActiveDiseaseEngName = engName;
    ActiveDiseaseID = _id;
    ActiveICDCode = icdCode;

    $("#diseaseSearchInput").val(name);
    $("#BtnServiceSearch").hide();
    $("#BtnActiveSearch").show();
    $(".diseaseSearchDiv").hide();
    $("#diseaseSearchInput").prop("readonly", true);
  };

  const activeSearch = () => {
    ActiveDiseaseName = null;
    ActiveDiseaseEngName = null;
    ActiveDiseaseID = null;

    $("#diseaseSearchInput").val("");
    $("#BtnActiveSearch").hide();
    $("#diseaseSearchInput").prop("readonly", false);
    $("#BtnServiceSearch").show();
    $("#diseaseSearchInput").focus();
  };

  const handleSearchKeyUp = (e) => {
    let inputCount = $("#diseaseSearchInput").val().length;

    if (inputCount < 2) {
      $("#diseaseSearchInput").val() == "";
      $(".diseaseSearchDiv").hide();
      $(".unsuccessfullSearch").hide();
    }
  };

  const _addDiseaseItem = async (e) => {
    e.preventDefault();
    setSubmitIsLoading(true);

    let url = "Patient/addDisease";
    let data = {
      ClinicID,
      PatientID: ActivePatientID,
      DiseaseID: ActiveDiseaseID,
    };

    console.log({ data });

    axiosClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);

        addDisease(response.data);

        // Reset;
        activeSearch();
        onHide();
        setSubmitIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSubmitIsLoading(false);
        ErrorAlert("خطا", "افزودن سابقه با خطا مواجه گردید!");
      });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-0 text-secondary font-14 fw-bold">
              افزودن سابقه بیماری
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="diseaseModalBody">
          <form onSubmit={_searchInDiseases}>
            <div className="input-group">
              <label className="lblAbs font-12">جستجوی نام بیماری</label>
              <input
                type="text"
                name="diseaseSearchInput"
                id="diseaseSearchInput"
                required
                className="form-control rounded-right GetPatientInput w-50"
                onKeyUp={handleSearchKeyUp}
              />

              <button
                className="btn btn-primary rounded-left w-10 disNone"
                id="BtnActiveSearch"
                onClick={activeSearch}
                type="button"
              >
                <i className="fe fe-close"></i>
              </button>

              {!searchIsLoading ? (
                <button
                  className="btn btn-primary rounded-left w-10"
                  id="BtnServiceSearch"
                >
                  <i className="fe fe-search"></i>
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary rounded-left"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                </button>
              )}
            </div>
          </form>

          {searchedDiseases.length !== 0 && (
            <div id="DiseaseSearchDiv" className="diseaseSearchDiv">
              <SearchedDiseasesItems
                data={searchedDiseases}
                selectSearchedDisease={selectSearchedDisease}
              />
            </div>
          )}

          <div className="unsuccessfullSearch mt-2" id="unsuccessfullSearch">
            <p>موردی یافت نشد!</p>
          </div>

          <div className="submit-section diseaseSubmitBtn">
            {!submitIsLoading ? (
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
                onClick={_addDiseaseItem}
              >
                اضافه به لیست
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary rounded font-13"
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                در حال ثبت
              </button>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DiseaseRecordModal;
