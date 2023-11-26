import { useEffect } from "react";
import Image from "next/image";

const PrescriptionTypeHeader = ({ item, changePrescTypeTab }) => {
  //   const handleSearchDivs = () => {
  //     $("#unsuccessfullSearch").hide();
  //     $("#searchDiv").hide();
  //     $("#srvSearchInput").val("");
  //     $("#QtyInput").val("1");
  //   };

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

        changePrescTypeTab(1, item.img, item.name, 1);
        // handleSearchDivs();
        break;

      case 2:
        $("#ServiceSearchSelect").val("2");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(2, item.img, item.name, 2);
        // handleSearchDivs();
        break;
      case 4:
        $("#ServiceSearchSelect").val("4");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(4, item.img, item.name, 4);
        // handleSearchDivs();
        break;
      case 5:
        $("#ServiceSearchSelect").val("5");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(5, item.img, item.name, 5);
        // handleSearchDivs();
        break;
      case 6:
        $("#ServiceSearchSelect").val("6");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(6, item.img, item.name, 6);
        // handleSearchDivs();
        break;
      case 7:
        $("#ServiceSearchSelect").val("7");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(7, item.img, item.name, 7);
        // handleSearchDivs();
        break;
      case 8:
        $("#ServiceSearchSelect").val("8");
        $("#ServiceSearchSelect").hide();
        $("#drugInstruction").hide();
        $("#drugAmount").hide();

        changePrescTypeTab(8, item.img, item.name, 8);
        // handleSearchDivs();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (item.Active === "active" && item.id === 1)
      changePrescTypeTab("01", item.img, item.name, 1);
  }, []);

  return (
    <>
      <li className="nav-item">
        <a
          className={"nav-link media-nav-link " + item.Active}
          href={"#bottom-tab" + item.id}
          id={"prescTypeId" + item.id}
          data-bs-toggle="tab"
          onClick={selectPrescType}
          style={{
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Image src={item.img} alt="prescTypeIcon" height="20" width="20" />{" "}
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
