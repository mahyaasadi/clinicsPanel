import { ErrorAlert } from "class/AlertManage";

const taminPrescItemCreator = async (
  prescId,
  Instruction,
  Amount,
  SrvCode,
  SrvName,
  Qty,
  PrscImg,
  InstructionLbl,
  AmountLbl,
  PrscName,
  SrvTypePrsc,
  ParaCode
) => {
  let prescData = {};
  let prescItems = {};

  if (prescId == 1 && Instruction == null) {
    ErrorAlert("خطا", "در اقلام دارویی زمان مصرف باید انتخاب گردد");
    return false;
  } else if (prescId == 1 && Amount == null) {
    ErrorAlert("خطا", "در اقلام دارویی  تعداد در وعده باید انتخاب گردد");
    return false;
  } else {
    if (SrvCode == null || SrvName == null) {
      ErrorAlert("خطا", "خدمتی انتخاب نشده است");
      return false;
    } else {
      prescItems = {
        SrvName,
        SrvCode,
        Img: PrscImg,
        Qty,
        DrugInstruction: InstructionLbl,
        TimesADay: AmountLbl,
        PrescType: PrscName,
        prescId,
      };

      prescData = null;
      if (prescId == 1) {
        prescData = {
          srvId: {
            srvType: {
              srvType: SrvTypePrsc,
            },
            srvCode: SrvCode,
          },
          srvQty: parseInt(Qty),
          timesAday: {
            drugAmntId: Amount,
          },
          repeat: null,
          drugInstruction: {
            drugInstId: Instruction,
          },
          dose: "",
        };
      } else {
        let parTarefGrp = null;
        if (ParaCode === undefined) {
          parTarefGrp = null;
        } else {
          parTarefGrp = {
            parGrpCode: ParaCode,
          };
        }

        prescData = {
          srvId: {
            srvType: {
              srvType: SrvTypePrsc,
            },
            srvCode: SrvCode,
            parTarefGrp: parTarefGrp,
          },
          srvQty: parseInt(Qty),
        };
      }
    }
  }
  return { prescData, prescItems };
};

module.exports.taminPrescItemCreator = taminPrescItemCreator;

