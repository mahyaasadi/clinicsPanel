import { useEffect } from "react";
import Image from "next/image";

const PrescriptionTypeHeader = ({ item, changePrescTypeTab }) => {
  const handleSearchDivs = () => {
    $("#unsuccessfullSearch").hide();
    $("#searchDiv").hide();
    $("#srvSearchInput").val("");
    $("#QtyInput").val("1");
    $("#eprscItemDescription").val("")
  };

  const selectPrescType = () => {
    $(".prescService").hide();
    let prescTypeId = $(".prescTypeId" + item.id);
    prescTypeId.show();

    switch (item.id) {
      case 1:
        $("#ServiceSearchSelect").val("01");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").show();
        $("#drugAmount").show();

        changePrescTypeTab("01", item.img, item.name, 1);
        handleSearchDivs();
        break;
      case 2:
        $("#ServiceSearchSelect").show();
        $("#ServiceSearchSelect").val("02");
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab("02", item.img, item.name, 2);
        handleSearchDivs();
        break;
      case 3:
        $("#ServiceSearchSelect").val("16");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab("16", item.img, item.name, 3);
        handleSearchDivs();
        break;
      case 5:
        $("#ServiceSearchSelect").val("17");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab("17", item.img, item.name, 5);
        handleSearchDivs();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (item.Active === "active" && item.id === 1) changePrescTypeTab("01", item.img, item.name, 1)
  }, []);

  return (
    <>
      <li className="nav-item">
        <a
          className={"d-flex align-items-center nav-link media-nav-link " + item.Active}
          href={"#bottom-tab" + item.id}
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
