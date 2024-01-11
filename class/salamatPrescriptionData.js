const generateSalamatPrescType = (data) => {
  // const resultArray = Object.entries(data).map(([id, Des, Title]) => ({
  //   id: parseInt(id),
  //   name: Des,
  //   title: Title,
  //   img: `/assets/img/TaminPrescTypeID${id}.png`,
  //   Active: "",
  // }));

  let prescTypeOptions = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let obj = {
      id: parseInt(item.id),
      name: item.Des,
      title: item.Title,
      img: `/assets/img/TaminPrescTypeID${item.id}.png`,
      Active: "",
    };
    prescTypeOptions.push(obj);
  }

  return prescTypeOptions;
};

module.exports.generateSalamatPrescType = generateSalamatPrescType;
