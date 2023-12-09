const convertDateFormat = (str) => {
  if (str !== " " || str !== null) {
    let date =
      str.substr(0, 4) + "/" + str.substr(4, 2) + "/" + str.substr(6, 7);
    return date;
  } else {
    return 0;
  }
};

module.exports.convertDateFormat = convertDateFormat;
