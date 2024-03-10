import { useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import PrescriptionTypeHeader from "./prescriptionTypeHeader";
import ParaServicesDropdown from "./paraServicesDropdown";
import TaminSearchedServices from "components/dashboard/prescription/tamin/taminSearchedServices";

const PrescriptionCard = ({
  setSearchIsLoading,
  searchIsLoading,
  visitRegIsLoading,
  saveRegIsLoading,
  drugInstructionList,
  drugAmountList,
  SelectedInstruction,
  setSelectedInstruction,
  SelectedAmount,
  setSelectedAmount,
  FUSelectInstruction,
  FUSelectDrugAmount,
  taminHeaderList,
  taminParaServicesList,
  taminSrvSearchList,
  changePrescTypeTab,
  selectParaSrvType,
  selectSearchedService,
  activeSearch,
  searchTaminSrv,
  FuAddToListItem,
  registerEpresc,
  editSrvMode,
  setEditSrvMode,
  editSrvData,
  setEditSrvData,
  ActivePrescHeadID,
  setShowPinModal,
  setSearchFromInput,
  // openFavModal,
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

  const handleDrugAmountSelect = (e) => {
    setSelectedAmount(e.value);
    FUSelectDrugAmount(e.value);
  };

  const handleDrugInstructionSelect = (e) => {
    setSelectedInstruction(e.value);
    FUSelectInstruction(e.value);
  };

  const editDrugInstructionData = drugInstructionList.find(
    (x) => x.label == editSrvData.DrugInstruction
  );

  const editDrugAmountData = drugAmountList.find(
    (x) => x.label == editSrvData.TimesADay
  );

  function delay(callback, ms) {
    var timer = 0;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }

  // Search Recommendation
  useEffect(() => {
    $("#srvSearchInput").on(
      "keyup input",
      delay(function () {
        setSearchIsLoading(true);
        let inputCount = $("#srvSearchInput").val().length;

        if (inputCount > 2) {
          $("#BtnServiceSearch").click();
          setSearchIsLoading(false);
        } else {
          $(".SearchDiv").hide();
          $(".unsuccessfullSearch").hide();
          setSearchIsLoading(false);
        }
      }, 200)
    );
  }, []);

  const handleCancel = () => {
    setEditSrvMode(false);
    setEditSrvData([]);

    setSelectedInstruction(editDrugInstructionData?.value);
    setSelectedAmount(editDrugAmountData?.value);
    $("#srvSearchInput").val(editSrvData?.SrvName);
    $("#QtyInput").val("1");
    setSearchFromInput(true);
  };

  useEffect(() => {
    if (editDrugInstructionData && editDrugAmountData) {
      FUSelectDrugAmount(editDrugAmountData.label);
      FUSelectInstruction(editDrugInstructionData.label);
      handleCancel();
      $("#QtyInput").val(editSrvData.Qty);
      $("#eprscItemDescription").val(editSrvData.description);
      setEditSrvMode(true);
    }
  }, [editDrugAmountData, editDrugInstructionData]);

  return (
    <>
      <div className="card presCard">
        <div className="card-body">
          <div className="prescript-header">
            <div className="fw-bold text-secondary">نسخه جدید</div>
            <div className="d-flex gap-2">
              {!visitRegIsLoading ? (
                <button
                  className="btn border-radius visitBtn font-13"
                  onClick={() => registerEpresc(1)}
                >
                  ثبت ویزیت
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

              {!saveRegIsLoading ? (
                <button
                  className="btn btn-primary border-radius font-13"
                  onClick={() =>
                    ActivePrescHeadID
                      ? setShowPinModal(true)
                      : registerEpresc(0)
                  }
                >
                  ثبت نسخه نهایی
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
              {taminHeaderList.map((item, index) => (
                <PrescriptionTypeHeader
                  key={index}
                  item={item}
                  changePrescTypeTab={changePrescTypeTab}
                />
              ))}
            </ul>
            <hr />

            <form className="w-100 pt-2" onSubmit={searchTaminSrv}>
              <div className="input-group mb-3 inputServiceContainer">
                <input
                  type="hidden"
                  name="srvCode"
                  id="srvCode"
                  value={editSrvData?.SrvCode}
                />

                <label className="lblAbs font-12">نام / کد خدمت یا دارو</label>
                <input
                  type="text"
                  autoComplete="off"
                  id="srvSearchInput"
                  name="srvSearchInput"
                  className="form-control rounded-right w-50 padding-right-2"
                  value={editSrvData?.SrvName}
                />

                {/* paraClinic */}
                <select
                  className="form-select disNone font-14 text-secondary"
                  id="ServiceSearchSelect"
                  onChange={() =>
                    selectParaSrvType($("#ServiceSearchSelect").val())
                  }
                >
                  {taminParaServicesList.map((paraSrvItem, index) => (
                    <ParaServicesDropdown
                      key={index}
                      paraSrvItem={paraSrvItem}
                    />
                  ))}
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
                  <TaminSearchedServices
                    data={taminSrvSearchList}
                    selectSearchedService={selectSearchedService}
                  />
                </div>
              </div>

              <div className="unsuccessfullSearch" id="unsuccessfullSearch">
                <p>موردی یافت نشد!</p>
              </div>
            </form>

            <div className="align-items-center gap-1 media-flex-column row">
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
                      value={editSrvData?.Qty}
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
                  value={SelectedInstruction}
                  onChange={handleDrugInstructionSelect}
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
                  value={SelectedAmount}
                  onChange={handleDrugAmountSelect}
                  options={drugAmountList}
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
                  className="form-control rounded padding-right-2 height-40"
                  id="eprscItemDescription"
                />
              </div>

              <div className="col-md-3 media-w-100">
                {!editSrvMode ? (
                  <button
                    className="btn rounded w-100 addToListBtn font-12"
                    onClick={FuAddToListItem}
                  >
                    اضافه به لیست
                  </button>
                ) : (
                  <div className="d-flex gap-1">
                    <button
                      id="btnAddSrvItem"
                      className="btn rounded w-100 addToListBtn font-12"
                      onClick={FuAddToListItem}
                    >
                      ثبت تغییرات
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary rounded w-100 font-12"
                      onClick={handleCancel}
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
    </>
  );
};

export default PrescriptionCard;
