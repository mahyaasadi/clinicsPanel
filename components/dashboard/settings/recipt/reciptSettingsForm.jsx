import RadioButton from "components/commonComponents/radioButton";

const ReciptSettingsForm = ({
  data,
  orientation,
  onChangeOrientation,
  hasQrCode,
  onChangeQRCode,
  onSubmit,
  isLoading,
}) => {
  return (
    <>
      <div className="card smsCardContainer">
        <div className="card-body">
          <div className="col-11 col-sm-9 col-md-8 col-lg-7 col-xl-6 smsCard">
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="form-group ">
                  <div className="smsPanelTitle">تنظیمات چاپ قبض</div>
                  <hr className="margin-bottom-3 seperatorLine" />

                  <div className="form-group">
                    <label className="lblAbs font-12">تعداد کپی از قبض</label>
                    <input
                      type="number"
                      className="form-control floating inputPadding rounded"
                      defaultValue={data.NumberOfCopy}
                      name="NumberOfCopy"
                      key={data.NumberOfCopy}
                    />
                  </div>

                  <div className="form-group">
                    <label className="lblAbs font-12">
                      متن قسمت بالا (Header)
                    </label>
                    <textarea
                      type="text"
                      className="form-control floating inputPadding rounded"
                      name="Header"
                      defaultValue={data.Header}
                      key={data.Header}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="lblAbs font-12">متن بدنه </label>
                    <textarea
                      type="text"
                      className="form-control floating inputPadding rounded"
                      rows="5"
                      name="Description"
                      defaultValue={data.Description}
                      key={data.Description}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="lblAbs font-12">متن پاسخ</label>
                    <textarea
                      type="text"
                      className="form-control floating inputPadding rounded"
                      name="AnsText"
                      defaultValue={data.AnsText}
                      key={data.AnsText}
                    ></textarea>
                  </div>

                  <hr />

                  <div className="form-group col text-secondary">
                    <p className="font-12">تنظیم جهت</p>
                    <RadioButton
                      name="portrait"
                      id="portrait"
                      value="true"
                      text="عمودی"
                      onChange={onChangeOrientation}
                      checked={orientation.portrait}
                    />

                    <RadioButton
                      name="landscape"
                      id="landscape"
                      value="false"
                      text="افقی"
                      onChange={onChangeOrientation}
                      checked={orientation.landscape}
                    />
                  </div>

                  <hr />

                  <div className="form-group col text-secondary">
                    <p className="font-12">QR Code</p>
                    <RadioButton
                      name="QRCode"
                      id="QRCode"
                      value="true"
                      text="دارد"
                      onChange={onChangeQRCode}
                      checked={hasQrCode.QRCode}
                    />

                    <RadioButton
                      name="noQRCode"
                      id="noQRCode"
                      value="false"
                      text="ندارد"
                      onChange={onChangeQRCode}
                      checked={hasQrCode.noQRCode}
                    />
                  </div>
                </div>

                <div className="row margint-3">
                  {!isLoading ? (
                    <button
                      type="submit"
                      className="btn btn-primary rounded col-md-6 col-12 font-13"
                    >
                      ثبت
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary rounded col-md-6 col-12 font-13"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm margin-left-4"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      در حال پردازش
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded col-md-6 col-12 font-13"
                  >
                    پیش نمایش
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReciptSettingsForm;
