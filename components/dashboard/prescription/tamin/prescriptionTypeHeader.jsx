import { useEffect } from "react";
import Image from "next/image";

const PrescriptionTypeHeader = ({
  item,
  index,
  changePrescTypeTab,
  ActivePrescTypeID,
}) => {
  const handleSearchDivs = () => {
    $("#unsuccessfullSearch").hide();
    $("#searchDiv").hide();
    $("#srvSearchInput").val("");
    $("#QtyInput").val("1");
    $("#eprscItemDescription").val("");
  };

  const selectPrescType = () => {
    let prescTypeId = $(".prescTypeId" + item.id);
    prescTypeId.show();
    handleSearchDivs();

    switch (item.id) {
      case 1:
        $("#ServiceSearchSelect").hide();
        $("#ServiceSearchSelect").val("01");
        changePrescTypeTab("01", item.img, item.name, 1);
        break;
      case 2:
        $("#ServiceSearchSelect").show();
        $("#ServiceSearchSelect").val("02");
        changePrescTypeTab("02", item.img, item.name, 2);
        break;
      case 3:
        $("#ServiceSearchSelect").val("16");
        $("#ServiceSearchSelect").hide();
        changePrescTypeTab("16", item.img, item.name, 3);
        break;
      case 5:
        $("#ServiceSearchSelect").val("17");
        $("#ServiceSearchSelect").hide();
        changePrescTypeTab("17", item.img, item.name, 5);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (index === 0) changePrescTypeTab("01", item.img, item.name, 1);
  }, []);

  return (
    <>
      <li className="nav-item">
        <a
          className={`d-flex align-items-center nav-link media-nav-link ${
            item.id === ActivePrescTypeID && "active"
          }`}
          href={"#presc-tab" + item.id}
          id={"prescTypeId" + item.id}
          data-bs-toggle="tab"
          onClick={selectPrescType}
        >
          <Image src={item.img} alt="prescTypeIcon" height="35" width="35" />{" "}
          &nbsp;
          {item.name}{" "}
          <span
            className="badge badge-primary"
            id={"srvItemCountId" + item.id}
          ></span>
        </a>
      </li>
    </>
  );
};

export default PrescriptionTypeHeader;
