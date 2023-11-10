import { useEffect } from "react";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import SearchedServiceItems from "components/dashboard/reception/searchedSrvItems";
import Loading from "components/commonComponents/loading/loading";
import DepartmentsHeader from "./departmentsHeader";
import { Skeleton } from "primereact/skeleton";

const ReceptionCard = ({
  ClinicID,
  handleDepTabChange,
  handleSearchService,
  searchedServices,
  selectSearchedSrv,
  FuAddToList,
  editSrvData,
  setEditSrvData,
  editSrvMode,
  setEditSrvMode,
}) => {
  let activeClass = null;

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

  const { data: clinicDepartments, isLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  const handleCancelEdit = () => {
    setEditSrvMode(false);
    setEditSrvData([]);
    $("#srvSearchInput").val("");
    $("#QtyInput").val("1");
  };

  return (
    <>
      <div className="card presCard">
        <div className="card-body">
          {/* departments header */}
          <div className="card-body">
            {isLoading ? (
              <Skeleton className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll">
                {/*  */}
              </Skeleton>
            ) : (
              <ul className="nav nav-tabs nav-tabs-bottom nav-tabs-scroll">
                {clinicDepartments?.map((item, index) => {
                  return (
                    <DepartmentsHeader
                      key={index}
                      department={item}
                      activeClass={index == 0 ? "active" : ""}
                      handleDepTabChange={handleDepTabChange}
                    />
                  );
                })}
              </ul>
            )}
            <hr />

            <div className="w-100 pt-2">
              <div className="input-group mb-1 inputServiceContainer">
                <input type="hidden" name="srvCode" id="srvCode" />
                <label className="lblAbs font-12">نام / کد خدمت</label>
                <input
                  type="text"
                  id="srvSearchInput"
                  name="srvSearchInput"
                  className="form-control rounded-right w-50 padding-right-2"
                  onKeyUp={(e) => handleSearchService(e.target.value)}
                  defaultValue={(editSrvMode == true ? editSrvData?.Name : "")}
                  key={editSrvData.Name}
                />

                <button
                  className="btn btn-primary rounded-left w-10 d-flex align-items-center justify-center"
                  id="BtnServiceSearch"
                >
                  <i className="fe fe-search"></i>
                </button>
                <div className="col-12 SearchDiv input-group" id="searchDiv">
                  <SearchedServiceItems
                    data={searchedServices}
                    selectSearchedSrv={selectSearchedSrv}
                  />
                </div>
              </div>

              <div className="unsuccessfullSearch">
                <p>موردی یافت نشد!</p>
              </div>
            </div>

            <div className="d-flex align-items-center media-flex-column media-gap margin-top-1 gap-2">
              <div className="col-md-3  media-w-100">
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

              <div className="col-5 media-w-100">
                <label className="lblAbs font-12">توضیحات</label>
                <input
                  type="text"
                  className="form-control rounded padding-right-2"
                  id="ResPrescDescription"
                />
              </div>

              {!editSrvMode ? (
                <button
                  className="btn rounded w-100 addToListBtn font-12 media-w-100"
                  onClick={FuAddToList}
                >
                  اضافه به لیست
                </button>
              ) : (
                <>
                  <div className="media-flex-column col-xl-4 col-12 d-flex gap-2">
                    <button
                      className="btn rounded addToListBtn font-12 col-xl-6 col-12"
                      onClick={FuAddToList}
                    >
                      ثبت تغییرات
                    </button>
                    <button
                      className="btn btn-outline-dark cancelBtn rounded font-12 col-xl-5 col-12"
                      onClick={handleCancelEdit}
                    >
                      انصراف
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceptionCard;
