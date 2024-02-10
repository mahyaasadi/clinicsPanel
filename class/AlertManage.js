import Swal from "sweetalert2";

const ErrorAlert = (Title, Text) => {
  Swal.fire({
    title: Title,
    text: Text,
    icon: "error",
    allowOutsideClick: true,
    confirmButtonColor: "#1B5A90",
    confirmButtonText: "تایید",
  });
};

const SuccessAlert = (Title, Text) => {
  Swal.fire({
    title: Title,
    text: Text,
    icon: "success",
    allowOutsideClick: true,
    confirmButtonColor: "#1B5A90",
    confirmButtonText: "تایید",
  });
};

const WarningAlert = (Title, Text) => {
  Swal.fire({
    title: Title,
    text: Text,
    icon: "warning",
    allowOutsideClick: true,
    confirmButtonColor: "#1B5A90",
    confirmButtonText: "تایید",
  });
};

const QuestionAlert = async (Title, Text) => {
  const promise = await Swal.fire({
    title: Title,
    text: Text,
    icon: "question",
    showCancelButton: true,
    allowOutsideClick: true,
    confirmButtonColor: "#1B5A90",
    cancelButtonColor: "#d33",
    confirmButtonText: "بله",
    cancelButtonText: "خیر",
  });
  return promise.isConfirmed;
};

const TimerAlert = (options) => {
  const {
    title,
    html,
    timer,
    timerProgressBar,
    cancelButton,
    onBeforeOpen,
    willClose,
    onConfirm,
    onCancel,
  } = options;

  let timerInterval;
  let timerElement;

  Swal.fire({
    title,
    html,
    timer,
    timerProgressBar,
    showCancelButton: cancelButton ? true : false,
    cancelButtonText: cancelButton ? cancelButton.text : "Cancel",
    cancelButtonColor: "#c2410c",
    customClass: {
      content: "custom-swal-content",
      actions: "custom-swal-actions",
      cancelButton: "custom-swal-cancel-button",
    },
    didOpen: () => {
      if (onBeforeOpen) {
        onBeforeOpen();
      }

      if (timer) {
        timerElement = Swal.getPopup().querySelector("b");
        Swal.showLoading();
      }
    },
    onBeforeOpen: () => {
      if (onBeforeOpen) {
        onBeforeOpen();
      }

      if (cancelButton) {
        const cancelButtonElement = Swal.getCancelButton();
        cancelButtonElement.addEventListener("click", () => {
          clearInterval(timerInterval);
          if (onCancel) {
            onCancel();
          }
          Swal.close();
        });
      }
    },
    willClose: () => {
      clearInterval(timerInterval);
      if (willClose) {
        willClose();
      }
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer && onConfirm) {
      onConfirm();
    }
  });
};

const multipleQuestionsAlert = (title, Q1, Q2, Q1Res, Q2Res) => {
  Swal.fire({
    title: title,
    showDenyButton: true,
    confirmButtonText: Q1,
    confirmButtonColor: "#B45309",
    denyButtonText: Q2,
  }).then((result) => {
    if (result.isConfirmed) {
      Q1Res(true);
    } else if (result.isDenied) {
      // Swal.fire("Changes are not saved", "", "info");
    }
  });
};

module.exports.ErrorAlert = ErrorAlert;
module.exports.SuccessAlert = SuccessAlert;
module.exports.WarningAlert = WarningAlert;
module.exports.QuestionAlert = QuestionAlert;
module.exports.TimerAlert = TimerAlert;
module.exports.multipleQuestionsAlert = multipleQuestionsAlert;

// const oneInputAlert = async (Title) => {
//   const promise = await Swal.fire({
//     title: Title,
//     icon: "question",
//     input: "text",
//     showCancelButton: true,
//     allowOutsideClick: true,
//     confirmButtonColor: "#1B5A90",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "تایید",
//     cancelButtonText: "انصراف",
//   });
//   return promise.value;
// };

// module.exports.oneInputAlert = oneInputAlert;
