const convertToLocaleString = (event, setValue) => {
  const rawValue = event.target.value.replace(/,/g, "");
  const parsedValue = parseFloat(rawValue);

  if (!isNaN(parsedValue)) {
    setValue(parsedValue);
  } else {
    setValue("");
  }
};

module.exports.convertToLocaleString = convertToLocaleString;
