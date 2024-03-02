import { useEffect } from "react";
import Image from "next/image";

const PrescriptionTypeHeader = ({ item, index, changePrescTypeTab }) => {
  const handleSearchDivs = () => {
    $("#unsuccessfullSearch").hide();
    $("#searchDiv").hide();
    $("#srvSearchInput").val("");
    $("#QtyInput").val("1");
  };

  const selectPrescType = () => {
    $(".prescService").hide();
    let prescTypeId = $(".prescTypeId" + item.id);
    prescTypeId.show();

    switch (item.id) {
      case 1:
        $("#ServiceSearchSelect").val("1");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").show();
        $("#drugAmount").show();

        changePrescTypeTab(item.img, item.title, 1);
        handleSearchDivs();
        break;
      case 10:
        $("#ServiceSearchSelect").val("10");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").show();
        $("#drugAmount").show();

        changePrescTypeTab(item.img, item.title, 10);
        handleSearchDivs();
        break;
      case 2:
        $("#ServiceSearchSelect").val("2");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(item.img, item.title, 2);
        handleSearchDivs();
        break;
      case 3:
        $("#ServiceSearchSelect").val("3");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(item.img, item.title, 3);
        handleSearchDivs();
        break;
      case 4:
        $("#ServiceSearchSelect").val("4");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(item.img, item.title, 4);
        handleSearchDivs();
        break;
      case 5:
        $("#ServiceSearchSelect").val("5");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(item.img, item.title, 5);
        handleSearchDivs();
        break;
      case 6:
        $("#ServiceSearchSelect").val("6");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(item.img, item.title, 6);
        handleSearchDivs();
        break;
      case 7:
        $("#ServiceSearchSelect").val("7");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(item.img, item.title, 7);
        handleSearchDivs();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (index === 0) changePrescTypeTab(item.img, item.title, 1);
  }, []);

  return (
    <>
      <li className="nav-item">
        <a
          className={`nav-link media-nav-link ${
            index === 0 ? "active" : item.Active
          } ${
            index === 1 || index === 3 || index === 6 || index === 7
              ? "w-190"
              : ""
          }`}
          href={"#salamat-bottom-tab" + item.id}
          id={"prescTypeId" + item.id}
          data-bs-toggle="tab"
          onClick={selectPrescType}
          style={{
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <Image src={item.img} alt="prescTypeIcon" height="35" width="35" />{" "}
          &nbsp;
          {item.name}{" "}
          {/* <span
            className="badge badge-primary"
            id={"srvItemCountId" + item.id}
          ></span> */}
        </a>
      </li>
    </>
  );
};

export default PrescriptionTypeHeader;
