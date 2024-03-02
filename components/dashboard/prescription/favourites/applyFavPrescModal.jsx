import { useState } from "react";
import { Modal } from "react-bootstrap";
import { axiosClient } from "class/axiosConfig";
import { ErrorAlert, WarningAlert } from "class/AlertManage";

const ApplyFavPrescModal = ({
  show,
  onHide,
  prescMode,
  ClinicID,
  prescriptionItemsData,
  favPrescItemsData,
  applyFavPresc,
}) => {
  // console.log({ prescMode });
  const [isLoading, setIsLoading] = useState(false);

  const _applyFavPresc = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let url = "CenterFavEprsc/add";
    let data = {
      CenterID: ClinicID,
      Name: formProps.prescName,
      Tamin: prescMode == "Tamin" ? true : false,
      Salamat: prescMode == "Salamat" ? true : false,
      prescItems: favPrescItemsData ? favPrescItemsData : prescriptionItemsData,
      prescItems: favPrescItemsData
        ? favPrescItemsData
        : prescriptionItemsData.map((item) => {
            //  remove unwanted properties
            const { checkCode, infoMessages, snackMessages, ...rest } = item;
            return rest;
          }),
    };

    console.log({ data });

    if (prescriptionItemsData.length == 0) {
      WarningAlert("", "خدمتی در نسخه ثبت نشده است!");
      setIsLoading(false);
    } else {
      axiosClient
        .post(url, data)
        .then((response) => {
          applyFavPresc(response.data);
          onHide();
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          ErrorAlert("خطا", "افزودن نسخه با خطا مواجه گردید!");
        });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="text-secondary fw-bold font-14">ثبت نسخه پرمصرف</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={_applyFavPresc}>
          <div className="form-group">
            <label className="lblAbs font-12">
              عنوان نسخه <span className="text-danger">*</span>
            </label>
            <div className="col p-0">
              <input
                className="form-control floating inputPadding rounded"
                type="text"
                name="prescName"
                required
              />
            </div>
          </div>

          <div className="submit-section">
            {!isLoading ? (
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                ثبت
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
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyFavPrescModal;
