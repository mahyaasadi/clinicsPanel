import { useGetAllQuery } from "redux/slices/clinicDepartmentsApiSlice";
import DepartmentsHeader from "./departmentsHeader";
import SearchedServiceItems from "components/dashboard/reception/searchedSrvItems";
import ExtraSmallLoader from "components/commonComponents/loading/extraSmallLoader";

const ReceptionCard = ({
  ClinicID,
  handleDepTabChange,
  handleSearchService,
  searchedServices,
  // isLoading
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

  const {
    data: clinicDepartments,
    error,
    isLoading: depsFetchIsLoading,
  } = useGetAllQuery(ClinicID);

  return (
    <>
      <div>
        <div className="card presCard">
          <div className="card-body">
            <div className="prescript-header">
              <div className="prescript-title text-secondary">پذیرش</div>
              <div className="prescript-btns d-flex gap-2">
                <button
                  className="btn btn-primary border-radius font-13"
                //   onClick={}
                >
                  ثبت نسخه نهایی
                </button>
              </div>
            </div>

            {/* departments header */}
            <div className="card-body">
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

              <hr />

              <form
                className="w-100 pt-2"
              //   onSubmit={SearchTaminSrv}
              >
                <div className="input-group mb-3 inputServiceContainer">
                  <input type="hidden" name="srvCode" id="srvCode" />
                  <label className="lblAbs font-12">نام / کد خدمت</label>
                  <input
                    type="text"
                    id="srvSearchInput"
                    name="srvSearchInput"
                    className="form-control rounded-right w-50 padding-right-2"
                    // onChange={(e) => handleSearchService(e.target.value)}
                    onKeyUp={(e) => handleSearchService(e.target.value)}
                  />

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
                </div>

                <div className="col-12" id="searchDiv">
                  <SearchedServiceItems
                    data={searchedServices}
                  // SelectSrvSearch={SelectSrvSearch}
                  />
                </div>
                {/* 
                <div className="unsuccessfullSearch">
                  <p>موردی یافت نشد!</p>
                </div> */}
              </form>
              <div className="d-flex align-items-center gap-2 media-flex-column media-gap margin-top-1">
                <div className="col-md-3 media-w-100">
                  <label className="lblAbs margin-top-left font-12">
                    تعداد
                  </label>

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

                <div className="col-md-7 media-w-100">
                  <label className="lblAbs font-12">توضیحات</label>
                  <input
                    type="text"
                    className="form-control rounded padding-right-2"
                    id="eprscItemDescription"
                  />
                </div>

                <div className="col-md-2 media-w-100">
                  <button
                    className="btn rounded w-100 addToListBtn font-12"
                  //   onClick={FuAddToListItem}
                  >
                    اضافه به لیست
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceptionCard;
