import { Modal } from "react-bootstrap";
import { resizeImgFile } from "utils/resizeImgFile";
import FeatherIcon from "feather-icons-react";

const UploadAvatarModal = ({
  show,
  onHide,
  data,
  avatarIsLoading,
  openQRCodeModal,
  handleSubmit,
  handleCroppedImage,
  avatarSrc,
  setAvatarSrc,
  imageElement,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header>
        <Modal.Title>
          <p className="text-secondary fw-bold font-14">آپلود آواتار جدید</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={(e) => handleSubmit(e, handleCroppedImage)}>
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
                onChange={(e) => resizeImgFile(e, setAvatarSrc)}
                required
              />
            </div>
          </div>

          <div className="previewImgContainer">
            <img
              width="200"
              alt=""
              id="patientAvatar"
              className="d-block m-auto previewImg"
              src={
                data?.Avatar === avatarSrc
                  ? "https://irannobat.ir/images/Avatar/" + avatarSrc
                  : avatarSrc
              }
              ref={imageElement}
            ></img>
          </div>

          <div className="submit-section">
            <div className="d-flex flex-col-md justify-center gap-2">
              {!avatarIsLoading ? (
                <button
                  type="submit"
                  className="btn btn-primary rounded btn-save font-13"
                >
                  آپلود
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary rounded font-13 d-flex align-items-center justify-center gap-2"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                  در حال ثبت
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-primary rounded btn-save font-13"
                onClick={openQRCodeModal}
              >
                استفاده از گوشی همراه
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UploadAvatarModal;
