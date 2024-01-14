import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { salamatLogo } from "components/commonComponents/imagePath";

const SalamatSearchedServices = ({ data, selectSearchedService }) => {
  return data?.map((x, index) => {
    return (
      <button
        key={index}
        className="btn btn-outline-primary border-radius btn-sm w-100 mb-1 right-text bg-white searchSelectBtn"
        onClick={() =>
          selectSearchedService(
            x?.interfaceName,
            x?.state?.shape,
            x?.nationalNumber
          )
        }
      >
        <div dir="rtl" className="d-flex align-items-center gap-2">
          {x?.state?.isCovered ? (
            <span className="badge ">
              {/* <FeatherIcon icon="check" /> */}
              <Image
                src={salamatLogo}
                alt="salamatLogo"
                width="20"
                height="20"
              />
            </span>
          ) : (
            <span className="badge badge-success">
              <FeatherIcon
                icon="x"
                style={{ width: "16px !important", height: "16px !important" }}
              />
            </span>
          )}
          {x.interfaceName}
        </div>
      </button>
    );
  });
};

export default SalamatSearchedServices;
