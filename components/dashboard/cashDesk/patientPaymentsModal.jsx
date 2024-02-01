import { Modal } from "react-bootstrap";

const PatientPaymentsModal = ({ show, onHide, data }) => {
  console.log({ data });
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p className="mb-0 text-secondary font-14 fw-bold">
            سوابق پرداختی بیمار
          </p>
          <p className="text-secondary font-13 ">
            {data?.Patient?.Name} | کد پذیرش {data.ReceptionID}
          </p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="table-responsive p-2">
          <table className="table mt-4 font-13 text-secondary table-bordered shadow-sm">
            <thead>
              <tr>
                <th scope="col">تاریخ</th>
                <th scope="col">شرح پرداخت</th>
                <th scope="col">بدهکار</th>
                <th scope="col">بستانکار</th>
              </tr>
            </thead>

            <tbody className="font-13 text-secondary">
              <tr>
                <td>
                  <p className="mb-1">{data.Date}</p>
                  <p>{data.Time}</p>
                </td>
                <th scope="row">مبلغ کل</th>
                <td>
                  {data?.Calculated?.TotalPrice.toLocaleString() + " تومان"}
                </td>
                <td>0</td>
              </tr>

              {data?.Payments?.map((x, index) => (
                <tr key={index}>
                  <td>
                    <p className="mb-1">{x.Date}</p>
                    <p>{x.Time}</p>
                  </td>
                  <td>
                    {x.Cart
                      ? "پرداخت با کارت"
                      : x.Return
                      ? "دریافت وجه"
                      : "پرداخت نقدی"}
                  </td>
                  <td>
                    <p className=""> {x.Price.toLocaleString() + " تومان"}</p>
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PatientPaymentsModal;
