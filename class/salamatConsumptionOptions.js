const generateSalamatConsumptionOptions = (data) => {
  let consumptionOptions = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let obj = {
      value: item.Code,
      label: item.Name,
    };
    consumptionOptions.push(obj);
  }
  return consumptionOptions;
};

module.exports.generateSalamatConsumptionOptions =
  generateSalamatConsumptionOptions;
