import { Dropdown } from "primereact/dropdown";
import PrescriptionTypeHeader from "./prescriptionTypeHeader";
import { Skeleton } from "primereact/skeleton";
// import ParaServicesDropdown from "./paraServicesDropdown";
import SalamatSearchedServices from "components/dashboard/prescription/salamat/salamatSearchedServices";

const PrescriptionCard = ({
  setIsLoading,
  searchIsLoading,
  salamatDataIsLoading,
  salamatHeaderList,
  changePrescTypeTab,
  activeSearch,
  prescSearchMode,
  searchInDrugsCategory,
  searchInGeneralCategories,
  salamatSrvSearchList,
  selectSearchedService,
  //   drugInstructionList,
  //   drugAmountList,
  //   SelectedInstruction,
  //   setSelectedInstruction,
  //   SelectedAmount,
  //   setSelectedAmount,
  //   FUSelectInstruction,
  //   FUSelectDrugAmount,
  //   taminParaServicesList,
  //   selectParaSrvType,
  //   searchTaminSrv,
  //   FuAddToListItem,
  //   registerEpresc,
}) => {
  function QtyChange(ac) {
    let qty = $("#QtyInput").val();
    qty = parseInt(qty);
    if (ac == "+") {
      qty = qty + 1;
    } else {
      if (qty != 1) {
        qty = qty - 1;
      }
    }
    $("#QtyInput").val(qty);
  }

  //   const handleDrugAmountSelect = (e) => {
  //     setSelectedAmount(e.value);
  //     FUSelectDrugAmount(e.value);
  //   };

  //   const handleDrugInstructionSelect = (e) => {
  //     setSelectedInstruction(e.value);
  //     FUSelectInstruction(e.value);
  //   };

  // // Search Recommendation
  // const handleSearchKeyUp = () => {
  //   setIsLoading(true);
  //   let inputCount = $("#srvSearchInput").val().length;

  //   if (inputCount > 2) {
  //     setTimeout(() => {
  //       $("#BtnServiceSearch").click();
  //     }, 100);
  //     setIsLoading(false);
  //   } else {
  //     $("#srvSearchInput").val() == "";
  //     $(".SearchDiv").hide();
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
      <div className="card presCard shadow">
        <div className="card-body">
          <div className="prescript-header">
            <div className="fw-bold text-secondary">نسخه جدید</div>
            <div className="d-flex gap-2">
              {/* <button
                className="btn btn-outline-primary border-radius font-13"
                // onClick={openFavModal}
              >
                نسخه های پرمصرف
              </button> */}

              <button
                className="btn border-radius visitBtn font-13"
                // onClick={() => registerEpresc(1)}
              >
                فقط ثبت ویزیت
              </button>

              <button
                className="btn btn-primary border-radius font-13"
                // onClick={() => registerEpresc(0)}
              >
                ثبت نسخه نهایی
              </button>
            </div>
          </div>

          <div className="card-body">
            {!salamatDataIsLoading ? (
              <>
                <ul className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll">
                  {salamatHeaderList?.map((item, index) => (
                    <PrescriptionTypeHeader
                      key={index}
                      index={index}
                      item={item}
                      changePrescTypeTab={changePrescTypeTab}
                    />
                  ))}
                </ul>
                <hr />
              </>
            ) : (
              <div className="SalamatPrscHeader">
                <Skeleton>
                  <ul className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll"></ul>
                </Skeleton>
              </div>
            )}

            <form
              className="w-100 pt-2"
              onSubmit={
                prescSearchMode === "DrugSearch"
                  ? searchInDrugsCategory
                  : searchInGeneralCategories
              }
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
                  type="text"
                  autoComplete="off"
                  id="srvSearchInput"
                  name="srvSearchInput"
                  className="form-control rounded-right w-50 padding-right-2"
                  // onFocus={handleOnFocus}
                  // onBlur={handleOnBlur}
                  // onKeyUp={handleSearchKeyUp}
                  // value={editSrvData?.SrvName}
                />

                {/* paraClinic */}
                <select
                  className="form-select disNone font-14 text-secondary"
                  id="ServiceSearchSelect"
                  //   onChange={() =>
                  //     selectParaSrvType($("#ServiceSearchSelect").val())
                  //   }
                >
                  {/* {taminParaServicesList.map((paraSrvItem, index) => (
                    <ParaServicesDropdown
                      key={index}
                      paraSrvItem={paraSrvItem}
                    />
                  ))} */}
                </select>

                {/* search buttons */}
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
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                  </button>
                )}

                <div className="col-12 SearchDiv" id="searchDiv">
                  <SalamatSearchedServices
                    data={salamatSrvSearchList}
                    selectSearchedService={selectSearchedService}
                  />
                </div>
              </div>

              {/* <div className="unsuccessfullSearch" id="unsuccessfullSearch">
                <p>موردی یافت نشد!</p>
              </div> */}
            </form>

            <div className="d-flex align-items-center gap-1 media-flex-column flex-wrap row">
              <div className="col media-w-100">
                <label className="lblAbs margin-top-left font-12">تعداد</label>
                <div className="row">
                  <div className="col-auto">
                    <button
                      className="btn btn-outline-primary"
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
                      className="btn btn-outline-primary"
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
                  // options={drugInstructionList}
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
                  // options={drugAmountList}
                  optionLabel="label"
                  placeholder="انتخاب کنید"
                  filter
                  showClear
                />
              </div>
            </div>

            <div className="d-flex align-items-center media-flex-column media-gap mt-3 justify-between">
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
                  //   onClick={FuAddToListItem}
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
