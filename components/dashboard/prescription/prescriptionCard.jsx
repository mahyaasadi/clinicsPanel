import { useState, useEffect } from "react";
// import PrescriptionType from "components/dashboard/prescription/prescriptionType";
// import PrescriptionServiceType from "components/dashboard/prescription/prescriptionServiceType";
// import TaminSrvSearch from "components/dashboard/prescription/TaminSrvSearch";
import ExtraSmallLoader from "components/commonComponents/loading/extraSmallLoader";
import { Dropdown } from "primereact/dropdown";

const PrescriptionCard = ({ drugInstructionList, drugAmountList }) => {
  return (
    <>
      <div className="card presCard">
        <div className="card-body">
          <div className="prescript-header">
            <div className="prescript-title text-secondary">نسخه جدید</div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary border-radius font-13"
                // onClick={openFavModal}
              >
                نسخه های پرمصرف
              </button>

              <button
                className="btn border-radius visitBtn font-13"
                // onClick={() => registerEpresc(1)}
              >
                فقط ثبت ویزیت
              </button>

              <button
                className="btn btn-primary border-radius font-13"
                // onClick={openPinModal}
              >
                ثبت نسخه نهایی
              </button>
            </div>
          </div>

          <div className="card-body">
            <ul className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll">
              {/* {lists.map((item, index) => {
                return (
                  <PrescriptionType
                    key={index}
                    name={item.name}
                    img={item.img}
                    active={item.Active}
                    id={item.id}
                    changePrescId={changePrescId}
                  />
                );
              })} */}
            </ul>
            <hr />

            <form
              className="w-100 pt-2"
              // onSubmit={SearchTaminSrv}
            >
              <div className="input-group mb-3 inputServiceContainer">
                <input
                  type="hidden"
                  name="srvCode"
                  id="srvCode"
                  // value={editSrvData?.SrvCode}
                />

                <label className="lblAbs font-12">نام / کد خدمت یا دارو</label>
                <input
                  // onFocus={handleOnFocus}
                  // onBlur={handleOnBlur}
                  // onKeyUp={handleSearchKeyUp}
                  type="text"
                  autoComplete="off"
                  id="srvSearchInput"
                  name="srvSearchInput"
                  className="form-control rounded-right w-50 padding-right-2"
                  // value={editSrvData?.SrvName}
                />

                {/* paraClinic */}
                <select
                  className="form-select disNone"
                  id="ServiceSearchSelect"
                  // onChange={() =>
                  //   ChangeActiveServiceTypeID($("#ServiceSearchSelect").val())
                  // }
                >
                  {/* {ServiceList.map((item) => {
                    return (
                      <PrescriptionServiceType
                        key={item.srvType}
                        srvType={item.srvType}
                        srvTypeDes={item.srvTypeDes}
                        prescTypeId={item.prescTypeId}
                        Active={item.Active}
                      />
                    );
                  })} */}
                </select>

                {/* search buttons */}
                {/* <button
                  className="btn btn-primary rounded-left w-10 disNone"
                  id="BtnActiveSearch"
                  // onClick={ActiveSearch}
                  type="button"
                >
                  <i className="fe fe-close"></i>
                </button> */}
                <button
                  className="btn btn-primary rounded-left w-10"
                  id="BtnServiceSearch"
                >
                  {/* {isLoading ? (
                    <ExtraSmallLoader />
                  ) : ( */}
                  <i className="fe fe-search"></i>
                  {/* )} */}
                </button>
                <div className="col-12 SearchDiv" id="searchDiv">
                  {/* <TaminSrvSearch
                    data={TaminSrvSearchList}
                    favEprescItems={favEprescItems}
                    SelectSrvSearch={SelectSrvSearch}
                  /> */}
                </div>
              </div>

              {/* <div className="unsuccessfullSearch">
                <p>موردی یافت نشد!</p>
              </div> */}
            </form>

            <div className="d-flex align-items-center gap-1 media-flex-column flex-wrap row">
              <div className="col media-w-100">
                <label className="lblAbs margin-top-left font-12">تعداد</label>
                <div className="row">
                  <div className="col-auto">
                    <button
                      className="btn btn-primary btn-rounded"
                      onClick={() => QtyChange("+")}
                    >
                      <i className="fe fe-plus"></i>
                    </button>
                  </div>
                  <div className="col p-0">
                    <input
                      type="text"
                      className="form-control text-center rounded"
                      id="QtyInput"
                      name="QTY"
                      dir="ltr"
                      defaultValue="1"
                      // value={editSrvData?.Qty}
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      className="btn btn-primary btn-rounded"
                      onClick={() => QtyChange("-")}
                    >
                      <i className="fe fe-minus"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div id="drugInstruction" className="col media-mt-1">
                <label className="lblAbs font-12">زمان مصرف</label>
                <Dropdown
                  // value={SelectedInstruction}
                  // onChange={handleDrugInstructionSelect}
                  options={drugInstructionList}
                  optionLabel="label"
                  placeholder="انتخاب کنید"
                  filter
                  showClear
                />
              </div>

              <div id="drugAmount" className="col media-mt-1">
                <label className="lblAbs font-12">تعداد در وعده</label>
                <Dropdown
                  // value={SelectedAmount}
                  // onChange={handleDrugAmountSelect}
                  options={drugAmountList}
                  optionLabel="label"
                  placeholder="انتخاب کنید"
                  filter
                  showClear
                />
              </div>
            </div>

            <div className="d-flex align-items-center media-flex-column media-gap margin-top-1 justify-between">
              <div className="w-73 media-w-100">
                <label className="lblAbs font-12">توضیحات</label>
                <input
                  type="text"
                  className="form-control rounded padding-right-2"
                  id="eprscItemDescription"
                />
              </div>

              <div className="col-md-3 media-w-100">
                {/* {!srvEditMode ? ( */}
                <button
                  className="btn rounded w-100 addToListBtn font-12"
                  // onClick={FuAddToListItem}
                >
                  اضافه به لیست
                </button>
                {/* // ) : ( */}
                {/* <div className="d-flex gap-1">
                    <button
                      className="btn rounded w-100 addToListBtn font-12"
                      onClick={FuAddToListItem}
                    >
                      ثبت تغییرات
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark rounded w-100  font-12"
                      onClick={handleCancel}
                    >
                      انصراف
                    </button>
                  </div> */}
                {/* // )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionCard;