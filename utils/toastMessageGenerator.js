const displayToastMessages = (messages, toastRef, successMessage) => {
  const toastMessages = [];

  if (toastRef && messages && messages.length !== 0) {
    for (let i = 0; i < messages.length; i++) {
      const element = messages[i];
      let obj = {
        severity:
          element.type === "S"
            ? "Success"
            : element.type === "I"
              ? "Info"
              : element.type === "E"
                ? "Error"
                : "Warning",
        summary:
          element.type === "S"
            ? "موفق!"
            : element.type === "I"
              ? "اطلاعات!"
              : element.type === "E"
                ? "خطا!"
                : "هشدار!",
        detail: element.text,
        life: 5000,
      };
      toastMessages.push(obj);
    }
    toastRef.current.show(toastMessages);
  }

  if (toastRef && successMessage) {
    let msObj = {
      severity: "Success",
      // summary: "موفق!",
      detail: successMessage,
      life: 8000,
    };
    toastRef.current.show([msObj]);
  }
};

module.exports.displayToastMessages = displayToastMessages;
