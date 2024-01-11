const generateSalamatInstructionOptions = (data) => {
  let instructionOptions = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let obj = {
      value: item.Code,
      label: item.Name,
    };
    instructionOptions.push(obj);
  }
  return instructionOptions;
};
module.exports.generateSalamatInstructionOptions =
  generateSalamatInstructionOptions;
