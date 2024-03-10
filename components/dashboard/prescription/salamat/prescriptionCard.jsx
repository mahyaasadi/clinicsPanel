import { useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import PrescriptionTypeHeader from "./prescriptionTypeHeader";
import SalamatSearchedServices from "components/dashboard/prescription/salamat/salamatSearchedServices";

const PrescriptionCard = ({
  isLoading,
  searchIsLoading,
  salamatDataIsLoading,
  registerIsLoading,
  CancelEdit,
  salamatHeaderList,
  changePrescTypeTab,
  activeSearch,
  ActivePrescTypeID,
  onSubmit,
  salamatSrvSearchList,
  selectSearchedService,
  FUAddToListItem,
  setGenericCodeOption,
  consumptionOptions,
  instructionOptions,
  selectedConsumption,
  setSelectedConsumption,
  selectedConsumptionInstruction,
  setSelectedConsumptionInstruction,
  selectedNOPeriod,
  setSelectedNOPeriod,
  ActiveSrvShape,
  registerSalamatEprsc,
  editPrescSrvMode,
  setEditPrescSrvMode,
  editSrvData,
  setEditSrvData,
  prescriptionItemsData,
  ActiveSamadCode,
  setSearchIsLoading,
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

  const handleSearchKeyUp = (e) => {
    let inputCount = $("#srvSearchInput").val().length;

    if (inputCount > 2) {
      setTimeout(() => {
        $("#BtnServiceSearch").click();
      }, 900);
    } else {
      $("#srvSearchInput").val() == "";
      $(".SearchDiv").hide();
      $(".unsuccessfullSearch").hide();
    }
  };

  // Search Recommendation
  // function delay(callback, ms) {
  //   var timer = 0;
  //   return function () {
  //     var context = this,
  //       args = arguments;
  //     clearTimeout(timer);
  //     timer = setTimeout(function () {
  //       callback.apply(context, args);
  //     }, ms || 0);
  //   };
  // }

  // useEffect(() => {
  //   $("#srvSearchInput").on(
  //     "keyup input",
  //     delay(function () {
  //       // setSearchIsLoading(true);
  //       let inputCount = $("#srvSearchInput").val().length;

  //       if (inputCount > 2) {
  //         $("#BtnServiceSearch").click();
  //         // setSearchIsLoading(false);
  //       } else {
  //         $(".SearchDiv").hide();
  //         $(".unsuccessfullSearch").hide();
  //         // setSearchIsLoading(false);
  //       }
  //     }, 200)
  //   );
  // }, []);

  let defaultConsumptionOptions = [];
  for (let i = 1; i <= 14; i++) {
    defaultConsumptionOptions.push({ label: i, value: i });
  }

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;

    if (ActiveSrvShape === "S" || ActiveSrvShape === "A") {
      setSelectedConsumptionInstruction(selectedValue);
      setSelectedNOPeriod(null);
    } else {
      setSelectedNOPeriod(selectedValue);
      setSelectedConsumptionInstruction(null);
    }
  };

  const handleCancelEdit = (srvData) => {
    setEditPrescSrvMode(false);
    setEditSrvData([]);
    CancelEdit(srvData);

    setSelectedConsumption(null);
    setSelectedConsumptionInstruction(null);
    setSelectedNOPeriod(null);
    $("#srvSearchInput").val("");
    $("#QtyInput").val("1");
    $("#eprscItemDescription").val("");
    $("#srvSearchInput").prop("readonly", false);
  };

  return (
    <>
      {!salamatDataIsLoading ? (
        <div className="card presCard shadow">
          <div className="card-body">
            <div className="prescript-header">
              <div className="fw-bold text-secondary">نسخه جدید</div>
              <div className="d-flex gap-2">
                {!registerIsLoading ? (
                  <button
                    className="btn btn-primary border-radius font-13"
                    onClick={() => registerSalamatEprsc()}
                  >
                    {prescriptionItemsData.length !== 0 || ActiveSamadCode
                      ? "ثبت نسخه نهایی"
                      : "ثبت ویزیت"}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary border-radius px-40"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                  </button>
                )}
              </div>
            </div>

            <div className="card-body">
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

              <hr className="mt-1" />
              <form className="w-100 pt-2" onSubmit={onSubmit}>
                {ActivePrescTypeID === 1 && (
                  <div className="">
                    <div className="mb-4 d-flex align-items-center">
                      <label
                        id="drugGenericOptionLbl"
                        className="custom_check drugGenericOptionLbl mb-0"
                      >
                        جستجو بر اساس کد Generic
                        <input
                          type="checkbox"
                          name="drugGenericOption"
                          id="drugGenericOption"
                          value="generic"
                          className="checkbox-input frmCheckbox"
                          onChange={(e) =>
                            setGenericCodeOption(e.target.checked)
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                  </div>
                )}

                <div className="input-group mb-3 inputServiceContainer">
                  <input
                    type="hidden"
                    name="srvCode"
                    id="srvCode"
                    value={editSrvData?.checkCode}
                  />

                  <label className="lblAbs font-12">
                    نام / کد خدمت یا دارو
                  </label>
                  <input
                    type="text"
                    id="srvSearchInput"
                    name="srvSearchInput"
                    className="form-control rounded-right w-50 padding-right-2"
                    onKeyUp={handleSearchKeyUp}
                  />

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

                <div className="unsuccessfullSearch" id="unsuccessfullSearch">
                  <p>موردی یافت نشد!</p>
                </div>
              </form>

              <div className="d-flex align-items-center gap-1 media-flex-column flex-wrap row">
                <div className="col media-w-100">
                  <label className="lblAbs margin-top-left font-12">
                    تعداد
                  </label>
                  <div className="row">
                    <div className="col-auto d-flex align-items-center">
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
                      />
                    </div>
                    <div className="col-auto d-flex align-items-center">
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
                    id="drugConsumption"
                    value={selectedConsumption}
                    onChange={(e) => setSelectedConsumption(e.target.value)}
                    options={consumptionOptions}
                    optionLabel="label"
                    placeholder="انتخاب کنید"
                    filter
                    showClear
                  />
                </div>

                <div id="drugAmount" className="col media-mt-1">
                  <label className="lblAbs font-12">
                    دستور مصرف / تعداد در وعده
                  </label>
                  <Dropdown
                    value={
                      selectedConsumptionInstruction
                        ? selectedConsumptionInstruction
                        : selectedNOPeriod
                    }
                    onChange={handleDropdownChange}
                    options={
                      ActiveSrvShape === "S" || ActiveSrvShape === "A"
                        ? instructionOptions
                        : defaultConsumptionOptions
                    }
                    optionLabel="label"
                    placeholder="انتخاب کنید"
                    filter
                    showClear
                  />
                </div>
              </div>

              <div className="d-flex align-items-center media-flex-column media-gap mt-3 justify-between">
                <div className="w-74 media-w-100">
                  <label className="lblAbs font-12">توضیحات</label>
                  <input
                    type="text"
                    className="form-control rounded padding-right-2"
                    id="eprscItemDescription"
                  />
                </div>

                <div className="col-md-3 media-w-100">
                  {!editPrescSrvMode ? (
                    !isLoading ? (
                      <button
                        className="btn rounded w-100 addToListBtn font-12"
                        onClick={() => FUAddToListItem()}
                      >
                        اضافه به لیست
                      </button>
                    ) : (
                      <button
                        className="btn rounded w-100 addToListBtn d-flex align-items-center justify-center"
                        disabled
                      >
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                      </button>
                    )
                  ) : (
                    <div className="d-flex gap-1">
                      {!isLoading ? (
                        <button
                          className="btn rounded w-100 addToListBtn font-12"
                          id="btnAddSalamatSrvItem"
                          onClick={() => FUAddToListItem()}
                        >
                          ثبت تغییرات
                        </button>
                      ) : (
                        <button
                          className="btn rounded w-100 addToListBtn d-flex align-items-center justify-center"
                          disabled
                        >
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-primary rounded w-100  font-12"
                        onClick={() => handleCancelEdit(editSrvData)}
                      >
                        انصراف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="SalamatPrscHeader">
          <Skeleton>
            <ul className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll"></ul>
          </Skeleton>
        </div>
      )}
    </>
  );
};

export default PrescriptionCard;
