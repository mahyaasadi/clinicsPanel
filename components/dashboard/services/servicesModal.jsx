import Image from "next/image";
import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";

const DepartmentsModal = ({
  mode = "add", // Default is 'add'
  onSubmit,
  data = {},
  isLoading,
  show,
  onHide,
}) => {
  const modalTitle = mode === "edit" ? "ویرایش اطلاعات" : "اضافه کردن سرویس";
  const submitText = mode === "edit" ? "ثبت تغییرات" : "ثبت";

  //   const displayPreview = (e) => {
  //     var urlCreator = window.URL || window.webkitURL;
  //     if (e.target.files.length !== 0) {
  //       var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
  //       $("#clinicIconPreview").attr("src", imageUrl);
  //     }
  //   };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">{modalTitle}</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          {/* {mode === "edit" && (
            <input type="hidden" name="departmentID" value={data._id} />
          )} */}

          <div className="form-group">
            <label className="lblAbs font-12">
              نام <span className="text-danger">*</span>
            </label>
            <div className="col p-0">
              <input
                className="form-control floating inputPadding rounded"
                type="text"
                name="departmentName"
                defaultValue={mode == "edit" ? data.Name : ""}
                key={data.Name}
                required
              />
            </div>
          </div>

          {/* <div className="form-group">
            <label className="lblAbs font-12">
              نام تخصصی <span className="text-danger">*</span>
            </label>
            <div className="col p-0">
              <input
                className="form-control floating inputPadding rounded"
                type="text"
                name="departmentEngName"
                defaultValue={mode == "edit" ? data.EngName : ""}
                key={data.EngName}
                required
              />
            </div>
          </div>

          <input type="hidden" value={data.Icon} name="currentIcon" />
          <div className="change-photo-btn">
            <div>
              <i>
                <FeatherIcon icon="upload" />
              </i>
              <p>آپلود تصویر</p>
            </div>
            <input
              type="file"
              className="upload"
              id="clinicIcon"
              name="clinicIcon"
              onChange={displayPreview}
            />
          </div>

          <div className="previewImgContainer">
            <img
              src={mode == "edit" ? data.Icon : ""}
              alt=""
              width="200"
              id="clinicIconPreview"
              className="d-block m-auto previewImg"
            ></img>
          </div> */}

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
