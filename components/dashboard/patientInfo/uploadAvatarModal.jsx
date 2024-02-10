import { Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";

const UploadAvatarModal = ({
  show,
  onHide,
  changePatientAvatar,
  data,
  avatarIsLoading,
}) => {
  const displayNewAvatar = (e) => {
    var urlCreator = window.URL || window.webkitURL;
    if (e.target.files.length !== 0) {
      var imageUrl = urlCreator.createObjectURL(e.target.files[0]);
      $("#patientAvatar").attr("src", imageUrl);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header>
        <Modal.Title>
          <p className="text-secondary fw-bold font-14">آپلود آواتار جدید</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={changePatientAvatar}>
          <div className="form-group">
            <div className="change-photo-btn mt-4">
              <div>
                <i>
                  <FeatherIcon icon="upload" />
                </i>
                <p>آپلود آواتار جدید</p>
              </div>
              <input
                type="file"
                className="upload"
                name="editPatientAvatar"
                onChange={displayNewAvatar}
                required
              />
            </div>
          </div>

          <div className="previewImgContainer">
            <img
              src={"https://irannobat.ir/images/Avatar/" + data?.Avatar}
              width="200"
              alt="patientAvatar"
              id="patientAvatar"
              className="d-block m-auto previewImg"
            ></img>
          </div>

          <div className="submit-section">
            {!avatarIsLoading ? (
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

export default UploadAvatarModal;
