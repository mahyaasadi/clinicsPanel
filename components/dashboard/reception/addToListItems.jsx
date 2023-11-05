import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import Item from "./Item";

const AddToListItems = ({
  data,
  handleEditService,
  ClinicID,
  applyDiscount,
}) => {
  // const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [discountsList, setDiscountsList] = useState([]);
  // const [discountCosts, setDiscountCosts] = useState({}); // Store individual discount costs

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
        <Item
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
