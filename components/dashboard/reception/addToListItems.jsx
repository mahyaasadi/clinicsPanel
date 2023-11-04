import { useState, useEffect, useReducer } from "react";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";

const AddToListItems = ({
  data,
  ActiveInsuranceType,
  handleEditService,
  ClinicID,
  applyDiscount,
}) => {
  // console.log({ data });
  // const [discountsList, setDiscountsList] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  // const [discountCost, setDiscountCost] = useState(null);

  // const handleSelectDiscount = (itemIndex, discountValue, srv) => {
  //   setSelectedDiscounts((prevSelectedDiscounts) => {
  //     const newSelectedDiscounts = [...prevSelectedDiscounts];
  //     newSelectedDiscounts[itemIndex] = discountValue.Value;
  //     return newSelectedDiscounts;
  //   });

  //   console.log({ srv });

  //   if (discountValue.Percent) {
  //     const totalCost = srv.Qty * srv.Price;
  //     const orgCost =
  //       srv.Qty *
  //       `${
  //         ActiveInsuranceType === "1"
  //           ? srv.SS
  //           : ActiveInsuranceType === "2"
  //           ? srv.ST
  //           : ActiveInsuranceType === "3"
  //           ? srv.SA
  //           : ""
  //       }`;

  //     const patientTotalCost = totalCost - orgCost;
  //     const disCost = (patientTotalCost * discountValue.Value) / 100;

  //     console.log({ disCost });
  //     setDiscountCost(disCost);
  //   }
  //   applyDiscount(srv._id, discountValue);
  // };

  // // get discounts list
  // const getDiscountsData = () => {
  //   axiosClient
  //     .get(`CenterDiscount/getAll/${ClinicID}`)
  //     .then(function (response) {
  //       console.log(response.data);
  //       setDiscountsList(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // useEffect(() => getDiscountsData(), []);

  const [discountsList, setDiscountsList] = useState([]);
  const [discountCosts, setDiscountCosts] = useState({}); // Store individual discount costs

  const handleSelectDiscount = (item, discountValue) => {
    const { _id } = item;
    const newDiscountCosts = { ...discountCosts };
    const srv = data.find((item) => item._id === _id);

    if (discountValue.Percent) {
      const totalCost = srv.Qty * srv.Price;
      const orgCost =
        srv.Qty *
        `${
          ActiveInsuranceType === "1"
            ? srv.SS
            : ActiveInsuranceType === "2"
            ? srv.ST
            : ActiveInsuranceType === "3"
            ? srv.SA
            : ""
        }`;

      const patientTotalCost = totalCost - orgCost;
      const disCost = (patientTotalCost * discountValue.Value) / 100;

      newDiscountCosts[_id] = disCost;
      applyDiscount(_id, discountValue, disCost);
    } else {
      newDiscountCosts[_id] = 0; // No discount
    }

    setDiscountCosts(newDiscountCosts);
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
        <div dir="rtl" key={srv._id} className="card mb-1">
          <div className="card-body font-13 receptionInfoText">
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
                    value={selectedDiscounts[srv._id]}
                    onChange={(e) => handleSelectDiscount(srv, e.value)}
                    options={discountsList}
                    optionLabel="Name"
                  />
                  <Tooltip target=".discountOptions">سایر موارد</Tooltip>
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
                      `${
                        ActiveInsuranceType === "1"
                          ? srv.SS
                          : ActiveInsuranceType === "2"
                          ? srv.ST
                          : ActiveInsuranceType === "3"
                          ? srv.SA
                          : 0
                      }`
                    )?.toLocaleString()}{" "}
                    تومان
                  </div>
                </div>

                <div className="vertical-line"></div>
                <div className="d-flex">
                  <div className="paddingR-5">
                    سهم بیمار :{" "}
                    {discountCosts[srv._id]
                      ? srv.Qty * srv.Price -
                        (srv.Qty *
                          `${
                            ActiveInsuranceType === "1"
                              ? srv.SS
                              : ActiveInsuranceType === "2"
                              ? srv.ST
                              : ActiveInsuranceType === "3"
                              ? srv.SA
                              : ""
                          }` +
                          discountCosts[srv._id])
                      : srv.Qty * srv.Price -
                        srv.Qty *
                          `${
                            ActiveInsuranceType === "1"
                              ? srv.SS
                              : ActiveInsuranceType === "2"
                              ? srv.ST
                              : ActiveInsuranceType === "3"
                              ? srv.SA
                              : ""
                          }`}
                  </div>
                </div>

                {discountCosts[srv._id] && (
                  <>
                    <div className="vertical-line"></div>
                    <div className="d-flex">
                      <div className="paddingR-5">
                        میزان تخفیف : {discountCosts[srv._id]?.toLocaleString()}{" "}
                        تومان
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
