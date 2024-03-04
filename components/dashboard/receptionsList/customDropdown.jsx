import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import FeatherIcon from "feather-icons-react";

const CustomDropdown = ({
  row,
  openFrmOptionsModal,
  deleteReception,
  openHistoryModal,
  openInfoModal,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (action) => {
    // Perform action based on the selected option
    switch (action) {
      case "openFrmOptionsModal":
        openFrmOptionsModal(row);
        break;
      case "deleteReception":
        deleteReception(row._id);
        break;
      case "showHistoryModal":
        openHistoryModal(true, row);
        break;
      case "showInfoModal":
        openInfoModal(true, row);
        break;
      default:
        break;
    }
    setSelectedOption(null);
  };

  const options = [
    { label: "افزودن فرم", action: "openFrmOptionsModal" },
    { label: "تاریخچه پذیرش", action: "showHistoryModal" },
    { label: "جزئیات پذیرش", action: "showInfoModal" },
    { label: "حذف پذیرش", action: "deleteReception" },
  ];

  const handleDropdownChange = (option) => {
    setSelectedOption(option);
    handleOptionClick(option.action);
  };

  const ActionOptionTemplate = (option) => {
    return (
      <div className="d-flex align-items-center justify-center gap-2 customDropdownOption">
        {option.action == "openFrmOptionsModal" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-18"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
        ) : option.action == "deleteReception" ? (
          <FeatherIcon
            icon="trash-2"
            style={{ width: "16px", height: "16px" }}
          />
        ) : option.action == "showHistoryModal" ? (
          <FeatherIcon
            icon="clock"
            size="18"
            className="text-secondary access2Svg"
          />
        ) : (
          <FeatherIcon
            icon="info"
            size="18"
            className="text-secondary access2Svg"
          />
        )}

        <div>{option.label}</div>
      </div>
    );
  };

  const customDropdownIcon = <FeatherIcon icon="more-vertical" />

  return (
    <div className="dir-rtl customDropdown">
      <Dropdown
        options={options}
        onChange={(e) =>
          handleDropdownChange(
            options.find((option) => option.label === e.value.label)
          )
        }
        value={selectedOption ? selectedOption.label : "انتخاب نمایید"}
        itemTemplate={ActionOptionTemplate}
        dropdownIcon={customDropdownIcon}
      // placeholder="سایر عملیات ها"
      // optionLabel="label"
      />
    </div>
  );
};

export default CustomDropdown;
