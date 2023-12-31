import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import AddItem from "./addItem";

const AddToListItems = ({
  data,
  handleEditService,
  ClinicID,
  applyDiscount,
  deleteService,
  removeDiscount,
  openDiscountModal,
  discountCost,
  setDiscountCost,
  selectedDiscount,
  FUSelectDiscountPercent,
  submitManualDiscount,
}) => {
  const [discountsList, setDiscountsList] = useState([]);

  // get discounts list
  const getDiscountsData = () => {
    axiosClient
      .get(`CenterDiscount/getAll/${ClinicID}`)
      .then(function (response) {
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
        <AddItem
          key={index}
          srv={srv}
          discountsList={discountsList}
          applyDiscount={applyDiscount}
          handleEditService={handleEditService}
          deleteService={deleteService}
          removeDiscount={removeDiscount}
          openDiscountModal={openDiscountModal}
          discountCost={discountCost}
          setDiscountCost={setDiscountCost}
          selectedDiscount={selectedDiscount}
          FUSelectDiscountPercent={FUSelectDiscountPercent}
          submitManualDiscount={submitManualDiscount}
        />
      ))}
    </>
  );
};

export default AddToListItems;
