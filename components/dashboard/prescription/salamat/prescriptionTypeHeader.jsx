import { useEffect } from "react";
import Image from "next/image";

const PrescriptionTypeHeader = ({
  item,
  index,
  changePrescTypeTab,
  ActivePrescTypeID,
}) => {
  const handleReset = () => {
    $("#unsuccessfullSearch").hide();
    $("#searchDiv").hide();
    $("#srvSearchInput").val("");
    $("#QtyInput").val("1");
  };

  const selectPrescType = () => {
    let prescTypeId = $(".prescTypeId" + item.id);
    prescTypeId.show();

    $("#ServiceSearchSelect").val(item.id);
    $("#ServiceSearchSelect").hide();

    handleReset();
    changePrescTypeTab(item.img, item.title, item.id);
  };

  useEffect(() => {
    if (index === 0) changePrescTypeTab(item.img, item.title, 1);
  }, []);

  return (
    <>
      <li className="nav-item">
        <a
          className={`nav-link media-nav-link ${
            item.id === ActivePrescTypeID ? "active" : item.Active
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
