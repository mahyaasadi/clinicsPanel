import Image from "next/image";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { convertToLocaleString } from "utils/convertToLocaleString";

const DepartmentsModal = ({
  mode = "add",
  onSubmit,
  data = {},
  isLoading,
  show,
  onHide,
  serviceCost,
  setServiceCost,
}) => {
  // console.log({ mode, serviceCost });

  const modalTitle = mode === "edit" ? "ویرایش اطلاعات" : "اضافه کردن سرویس";
  const submitText = mode === "edit" ? "ثبت تغییرات" : "ثبت";

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">{modalTitle}</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          {mode === "edit" && (
            <input type="hidden" name="serviceID" value={data._id} />
          )}
          <div className="row">
            <div className="form-group col">
              <label className="lblAbs font-12">
                نام خدمت <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control floating inputPadding rounded"
                required
                name="serviceName"
                defaultValue={mode == "edit" ? data.Name : ""}
                key={data.Name}
              />
            </div>

            <div className="form-group col">
              <label className="lblAbs font-12">نام تخصصی خدمت</label>
              <input
                type="text"
                className="form-control floating inputPadding rounded"
                name="serviceEngName"
                defaultValue={mode == "edit" ? data.EngName : ""}
                key={data.EngName}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-6 col-12">
              <label className="lblAbs font-12">کد داخلی</label>
              <input
                type="text"
                className="form-control floating inputPadding rounded"
                name="internalCode"
                defaultValue={mode == "edit" ? data.Code : ""}
                key={data.Code}
              />
            </div>

            <div className="form-group col-md-6 col-12">
              <label className="lblAbs font-12">هزینه خدمت (ریال)</label>
              <input
                type="text"
                dir="ltr"
                className="form-control floating inputPadding rounded"
                name="servicePrice"
                // value={
                //   serviceCost !== 0
                //     ? serviceCost.toLocaleString()
                //     : data?.Price?.toLocaleString()
                // }
                defaultValue={mode == "edit" ? data.Price : ""}
                // onChange={(e) => convertToLocaleString(e, setServiceCost)}
                key={data.Price}
              />
            </div>
          </div>

          <div className="row media-flex-col">
            <div className="col">
              <div className="form-group">
                <label className="lblAbs font-12">سهم تامین</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded"
                  name="taminShare"
                  key={data.ST}
                  defaultValue={mode == "edit" ? data.ST : 0}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label className="lblAbs font-12">سهم سلامت</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded"
                  name="salamatShare"
                  key={data.SS}
                  defaultValue={mode == "edit" ? data.SS : 0}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group ">
                <label className="lblAbs font-12">سهم ارتش</label>
                <input
                  type="text"
                  dir="ltr"
                  className="form-control floating inputPadding rounded"
                  name="arteshShare"
                  key={data.SA}
                  defaultValue={mode == "edit" ? data.SA : 0}
                />
              </div>
            </div>
          </div>

          <div className="submit-section">
            {!isLoading ? (
              <button
                type="submit"
                className="btn btn-primary rounded btn-save font-13"
              >
                {submitText}
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

export default DepartmentsModal;
