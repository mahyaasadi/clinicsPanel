import { ErrorAlert } from "class/AlertManage"

const salamatPrescItemCreator = async (
    SavePresc,
    CenterID,
    SamadCode,
    CitizenSessionId,
    PrescType,
    nationalNumber,
    bulkId,
    SrvShape,
    QTY,
    description,
    consumption,
    consumptionInstruction,
    numberOfPeriod,
    otherServices,
    ActivePrescTypeID,
    setIsLoading
) => {
    let prescData = {
        SavePresc,
        CenterID,
        SamadCode,
        CitizenSessionId,
        PrescType,
        nationalNumber,
        bulkId,
        SrvShape,
        QTY,
        description,
        consumption,
        consumptionInstruction,
        numberOfPeriod,
        otherServices
    }

    if (
        (ActivePrescTypeID === 1 || ActivePrescTypeID === 10) &&
        !consumptionInstruction &&
        !numberOfPeriod
    ) {
        ErrorAlert("خطا", "لطفا دستور مصرف را انتخاب نمایید!");
        setIsLoading(false);
    } else if (
        (ActivePrescTypeID === 1 || ActivePrescTypeID === 10) &&
        !consumption
    ) {
        ErrorAlert("خطا", "لطفا زمان مصرف را انتخاب نمایید!");
        setIsLoading(false);
    }
    return prescData;
}

module.exports.salamatPrescItemCreator = salamatPrescItemCreator;