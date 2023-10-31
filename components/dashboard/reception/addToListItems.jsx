import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Tooltip } from "primereact/tooltip";

const AddToListItems = ({ data, handleEditService }) => {
  //   console.log({ data });

  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSalamatShare, setTotalSalamatShare] = useState(0);
  const [totalTaminShare, setTotalTaminShare] = useState(0);
  const [totalArteshShare, setTotalArteshShare] = useState(0);


  useEffect(() => {
    let qty = 0;
    let price = 0;
    let ss = 0;
    let st = 0;
    let sa = 0;

    data.forEach((srvItem) => {
      const itemQty = parseInt(srvItem.Qty);
      const itemPrice = parseInt(srvItem.Price);
      const itemSS = parseInt(srvItem.SS);
      const itemST = parseInt(srvItem.ST);
      const itemSA = parseInt(srvItem.SA);

      const itemTotalPrice = itemQty * itemPrice;
      const itemTotalSS = itemQty * itemSS;
      const itemTotalST = itemQty * itemST;
      const itemTotalSA = itemQty * itemSA;

      qty += itemQty;
      price += itemTotalPrice;
      ss += itemTotalSS;
      st += itemTotalST;
      sa += itemTotalSA;
    });

    setTotalQty(qty);
    setTotalPrice(price);
    setTotalSalamatShare(ss);
    setTotalTaminShare(st);
    setTotalArteshShare(sa)
  }, [data]);
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
                  </div>
                </div>
              }
            >
              <div className="row">
                <div className="d-flex mt-2 gap-1 flex-wrap">
                  <div className="d-flex">
                    <div className="srvTypeInfo">تعداد : {totalQty}</div>
                  </div>
                  <div className="d-flex">
                    <div className="srvTypeInfo">هزینه : {totalPrice}</div>
                  </div>
                  <div className="d-flex">
                    <div className="srvTypeInfo">سهم بیمه سلامت : {totalSalamatShare}</div>
                  </div>
                  <div className="d-flex">
                    <div className="srvTypeInfo">سهم بیمه تامین : {totalTaminShare}</div>
                  </div>
                  <div className="d-flex">
                    <div className="srvTypeInfo">سهم بیمه ارتش : {totalArteshShare}</div>
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
