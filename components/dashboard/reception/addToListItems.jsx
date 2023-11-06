import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import AddItem from "./addItem";

const AddToListItems = ({
  data,
  handleEditService,
  ClinicID,
  applyDiscount,
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
        />
      ))}
    </>
  );
};

export default AddToListItems;
