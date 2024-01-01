import { useState } from "react";

const FormAutoComplete = ({ data }) => {
  //   console.log({ data });
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  //   // event handlers
  //   const onChangeHandler = (e) => {
  //     const userInput = e.target.value;
  //     setInputValue(userInput);
  //     const filtered = suggestions.filter(
  //       (suggestion) =>
  //         suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
  //     );
  //     setFilteredSuggestions(filtered);
  //   };

  //   const onClickHandler = (e) => {
  //     setInputValue(e.target.innerText);
  //     setFilteredSuggestions([]);
  //   };

  //   const onKeyDownHandler = (e) => {
  //     if (e.keyCode === 13) {
  //       setInputValue(filteredSuggestions[activeSuggestion]);
  //       setFilteredSuggestions([]);
  //     } else if (e.keyCode === 38) {
  //       e.preventDefault();
  //       setActiveSuggestion(
  //         (activeSuggestion + filteredSuggestions.length - 1) %
  //           filteredSuggestions.length
  //       );
  //     } else if (e.keyCode === 40) {
  //       e.preventDefault();
  //       setActiveSuggestion((activeSuggestion + 1) % filteredSuggestions.length);
  //     }
  //   };

  // render method
  return (
    <div className="autocomplete">
      <label>{data.label}</label>
      <input
        type="text"
        value={inputValue}
        className={data.className}
        // onChange={onChangeHandler}
        // onKeyDown={onKeyDownHandler}
      />
      {/* <ul>
        {filteredSuggestions.map((suggestion, index) => (
          <li
            key={suggestion}
            className={index === activeSuggestion ? "active" : ""}
            onClick={onClickHandler}
          >
            {suggestion}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default FormAutoComplete;
