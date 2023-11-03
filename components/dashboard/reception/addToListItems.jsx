import { useState, useEffect, useReducer } from "react";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";

// // Define a reducer function to manage the selected discounts state
// function discountsReducer(state, action) {
//   switch (action.type) {
//     case 'setDiscount':
//       return { ...state, [action.index]: action.value };
//     default:
//       return state;
//   }
// }

const AddToListItems = ({
  data,
  ActiveInsuranceType,
  handleEditService,
  ClinicID,
  selectedDiscounts,
  setSelectedDiscounts
}) => {
  // console.log({ data });
  const [discountsList, setDiscountsList] = useState([]);

  // Initialize selectedDiscounts array with default values for each item
  useEffect(() => {
    setSelectedDiscounts(data.map(() => null));
  }, [data]);

  const handleSelectDiscount = (itemIndex, discountValue) => {
    setSelectedDiscounts((prevSelectedDiscounts) => {
      const newSelectedDiscounts = [...prevSelectedDiscounts];
      newSelectedDiscounts[itemIndex] = discountValue;
      return newSelectedDiscounts;
    });
  };

  // get discounts list
  const getDiscountsData = () => {
    axiosClient
      .get(`CenterDiscount/getAll/${ClinicID}`)
      .then(function (response) {
        console.log(response.data);
        setDiscountsList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => getDiscountsData(), []);

  return (
    <>
      {data?.map((srv, index) => (
        <div dir="rtl" key={index} className="card mb-2">
          <div className="card-body font-13">
            <div className="d-flex gap-1 align-items-center justify-between">
              <div className="d-flex gap-2">
                <p className="mb-0">{srv.Code}</p>
                <p className="mb-0">|</p>
                <p>{srv.Name}</p>
              </div>

              <div className="d-flex gap-2 justify-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary editBtn height-30"
                  data-pr-position="top"
                  onClick={() => handleEditService(srv)}
                >
                  <Tooltip target=".editBtn">ویرایش</Tooltip>
                  <FeatherIcon icon="edit-2" className="prescItembtns" />
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger removeBtn height-30"
                  //   onClick={() => _DeleteService(srv.SrvCode, srv.prescId)}
                  data-pr-position="top"
                >
                  <Tooltip target=".removeBtn">حذف</Tooltip>
                  <FeatherIcon icon="trash" className="prescItembtns" />
                </button>

                <div
                  className={`discountOptions receptionPage ${index}`}
                  data-pr-position="top"
                >
                  <Dropdown
                    value={selectedDiscounts[index]}
                    onChange={(e) => handleSelectDiscount(index, e.value.Value)}
                    options={discountsList}
                    optionLabel="Name"
                  />
                  {/* <Tooltip target={`.discountOptions.${index}`}>سایر موارد</Tooltip> */}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="d-flex mt-2 gap-1 flex-wrap text-secondary font-11">
                <div className="d-flex">
                  <div className="">{srv.Qty} عدد</div>
                </div>

                <div className="vertical-line"></div>
                <div className="d-flex paddingR-5">
                  قیمت : {srv.Price?.toLocaleString()} تومان
                  <div className="vertical-line"></div>
                  <p className="paddingR-5">
                    جمع کل : {(srv.Qty * srv.Price)?.toLocaleString()} تومان
                  </p>
                </div>

                <div className="vertical-line"></div>
                <div className="d-flex">
                  <div className="paddingR-5">
                    سهم سازمان :{" "}
                    {(
                      srv.Qty *
                      `${ActiveInsuranceType === "1"
                        ? srv.SS
                        : ActiveInsuranceType === "2"
                          ? srv.ST
                          : ActiveInsuranceType === "3"
                            ? srv.SA
                            : ""
                      }`
                    )?.toLocaleString()}{" "}
                    تومان
                  </div>
                </div>

                {selectedDiscounts[index] && (
                  <>
                    <div className="vertical-line"></div>
                    <div className="d-flex">
                      <div className="paddingR-5">
                        میزان تخفیف : {selectedDiscounts[index] || ""}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      ))}
    </>
  );
};

export default AddToListItems;
