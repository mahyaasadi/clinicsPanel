const generateSalamatPrescType = (data) => {
  const resultArray = Object.entries(data).map(([id, name]) => ({
    id: parseInt(id),
    name,
    img: `/assets/img/TaminPrescTypeID${id}.png`,
    Active: "",
  }));

  return resultArray;
};

module.exports.generateSalamatPrescType = generateSalamatPrescType;
