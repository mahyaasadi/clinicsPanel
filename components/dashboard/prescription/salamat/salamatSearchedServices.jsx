import Image from "next/image";
import FeatherIcon from "feather-icons-react";
import { salamatLogo } from "components/commonComponents/imagepath";

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
            <span className="badge p-1">
              <Image
                src={salamatLogo}
                alt="salamatLogo"
                width="20"
                height="20"
              />
            </span>
          ) : (
            <span className="badge badge-danger p-1">
              <FeatherIcon
                icon="x"
                style={{ width: "15px !important", height: "15px !important" }}
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
