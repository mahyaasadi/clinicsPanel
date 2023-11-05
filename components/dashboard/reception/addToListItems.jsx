import { useState, useEffect } from "react";
import { axiosClient } from "class/axiosConfig";
import FeatherIcon from "feather-icons-react";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";
import Item from "./Item";
const AddToListItems = ({
  data,
  ActiveInsuranceType,
  handleEditService,
  ClinicID,
  applyDiscount,
}) => {
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [discountsList, setDiscountsList] = useState([]);
  const [discountCosts, setDiscountCosts] = useState({}); // Store individual discount costs
  const [cashDiscountMode, setCashDiscountMode] = useState(false);

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
        <Item
          key={index}
          srv={srv}
          discountsList={discountsList}
          applyDiscount={applyDiscount}
        />
      ))}
    </>
  );
};

export default AddToListItems;
