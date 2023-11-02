import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";

const AddToListItems = ({
  data,
  ActiveInsuranceType,
  handleEditService,
  ClinicID,
  selectedDiscount,
  setSelectedDiscount,
}) => {
  // console.log({ data });
  const [discountsList, setDiscountsList] = useState([]);

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
      <div dir="rtl">
        <Accordion multiple activeIndex={[0]}>
          {data?.map((srv, index) => (
            <AccordionTab
              key={index}
              header={
                <div className="d-flex">
                  <div className="d-flex col-9 gap-2 font-13 align-items-center">
                    <div className="d-flex gap-2 font-13 align-items-center prescDetails">
                      <p className="mb-0">{srv.Code}</p>
                      <p className="mb-0">|</p>
                      <p>{srv.Name}</p>
                    </div>
                  </div>

                  <div className="d-flex col-3 gap-1 justify-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary editBtn"
                      data-pr-position="top"
                      onClick={() => handleEditService(srv)}
                    >
                      <Tooltip target=".editBtn">ویرایش</Tooltip>
                      <FeatherIcon icon="edit-2" className="prescItembtns" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger removeBtn"
                      //   onClick={() => _DeleteService(srv.SrvCode, srv.prescId)}
                      data-pr-position="top"
                    >
                      <Tooltip target=".removeBtn">حذف</Tooltip>
                      <FeatherIcon icon="trash" className="prescItembtns" />
                    </button>

                    <div
                      className="discountOptions receptionPage"
                      data-pr-position="top"
                    >
                      <Dropdown
                        value={selectedDiscount}
                        onChange={(e) => setSelectedDiscount(e.value)}
                        options={discountsList}
                        optionLabel="Name"
                      />
                      <Tooltip target=".discountOptions">سایر موارد</Tooltip>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="row">
                <div className="d-flex mt-2 gap-1 flex-wrap">
                  <div className="d-flex">
                    <div className="srvTypeInfo">تعداد : {srv.Qty}</div>
                  </div>
                  <div className="d-flex">
                    <div className="srvTypeInfo">
                      قیمت : {srv.Price?.toLocaleString()} تومان | جمع کل :{" "}
                      {(srv.Qty * srv.Price)?.toLocaleString()} تومان
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="srvTypeInfo">
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
                            : ""
                        }`
                      )?.toLocaleString()}{" "}
                      تومان
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="srvTypeInfo">
                      میزان تخفیف : {selectedDiscount ? selectedDiscount : ""}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default AddToListItems;
