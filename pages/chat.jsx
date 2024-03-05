import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { getSession } from "lib/session";
import JDate from "jalali-date";
import { axiosClient } from "class/axiosConfig";
import { SuccessAlert, QuestionAlert } from "class/AlertManage";
import { convertBase64 } from "utils/convertBase64";
import Loading from "components/commonComponents/loading/loading";
import ChatPage from "components/dashboard/chat";
import CentersList from "components/dashboard/chat/centersList";
import ApplyAppointmentModal from "components/dashboard/appointment/applyAppointmentModal";
import { useGetAllClinicDepartmentsQuery } from "redux/slices/clinicDepartmentApiSlice";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import "../public/assets/css/style-patient.css";

let ClinicUserID = null;
let ClinicID = null;
let ChatClinicID = null;
let ChatClinicUserID = null;
let receiverId = null;
let ActiveChatRoom = null;
let LastID = "";
let LastChatID = "";
let UserChatsList = [];
let PatientList = [];
let ChatRoomsMessages = [];

export const getServerSideProps = async ({ req, res }) => {
  const result = await getSession(req, res);
  if (result) {
    const { ClinicUser } = result;
    return { props: { ClinicUser } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
};

let ActivePatientID = null;
const PatientChat = ({ ClinicUser }) => {
  ClinicID = ClinicUser.ClinicID;
  ClinicUserID = ClinicUser._id;
  ChatClinicID = ClinicID;
  ChatClinicUserID = ClinicUserID;

  const router = useRouter();

  // ChatClinicID = "6512a2347939420d31a6da4e";
  // ChatClinicID = "61f0002404bcad2461519db6";
  // ChatClinicUserID = "6512a33f576d609d5d0c0d29";

  const socket = require("socket.io-client")(`https://irannobat.ir:8443`, {
    query: `Admin=${ChatClinicUserID}&LIC=${ChatClinicID}`,
    transports: ["websocket"],
    credentials: true,
  });

  const [UserChats, setUserChats] = useState([]);
  const [Centers, setCenters] = useState([]);
  const [Patients, setPatients] = useState([]);
  const [ChatStatus, setChatStatus] = useState([]);
  const [ChatHeader, setChatHeader] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatRoomBody, setChatRoomBody] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageStatus, setMessageStatus] = useState();

  const SelectChat = async (patient, id, User1) => {
    receiverId = User1;
    if (patient) {
      $(".read-chat").removeClass("active");
      $("#Chat-" + id).addClass("active");
      $("#badge" + id).html("");
      $("#headerStatus").attr("class", $("#Status-" + id).attr("class"));
      setChatHeader(patient);
      getChatRommData(id);
    }
  };

  // centers & chatsrooms
  const centers = () => {
    setIsLoading(true);

    let url = "ChatRoom/GetData/Admin";
    let data = {
      User2: ChatClinicID,
      MyID: ChatClinicUserID,
    };

    axiosClient
      .post(url, data)
      .then((response) => {
        setUserChats(response.data.ChatRooms);
        setChatStatus(response.data.ChatStatus);
        UserChatsList = response.data.ChatRooms;
        setPatients(response.data.Patients);
        PatientList = response.data.Patients;
        // setCenters(response.data.Centers);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // images
  let gallery = null;
  const ImageGalleryRender = (src) => {
    let ul = document.createElement("ul");
    const imageMess = document.getElementsByClassName("hiden-image");
    if (Array.from(imageMess).length > 0) {
      Array.from(imageMess).map((el) => {
        ul.appendChild(el);
      });

      gallery = new Viewer(ul, {
        fullscreen: true,
      });
    }
    gallery.view(src);
  };

  // chats
  const getChatRommData = (id) => {
    let url = `/ChatRoom/GetChatRoomData`;

    axiosClient
      .post(url, { id })
      .then((response) => {
        ActiveChatRoom = id;
        setMessageStatus(response.data.MessageStatus);
        setUsers(response.data.Users);
        setChatRoomBody(ChatRoomsMessages);
        ChatRoomsMessages = response.data.ChatRooms.ChatsDate;
        $(".chat-window").addClass("chat-slide");

        //scroll to end
        setTimeout(() => {
          ScroolTobottom();
        }, 100);

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function getBase64Image(img) {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(img);
    return imageUrl;
  }

  const GetChatRoomDataNotList = (id) => {
    let url = `/ChatRoom/GetChatRoomDataNotList`;

    axiosClient
      .post(url, { id })
      .then((response) => {
        let p = {
          _id: response.data.Patient._id,
          Name: response.data.Patient.Name,
          Tel: response.data.Patient.Tel,
          P: "Patient",
        };

        let dataToSaveChatRoom = response.data.ChatRooms;
        UserChatsList.unshift(dataToSaveChatRoom);
        setUserChats(UserChatsList);
        setPatients([p, ...PatientList]);
        PatientList.push(p);
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  const ScroolTobottom = () => {
    const objDiv = document.getElementById("chat-body");
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  const BackToChatList = () => {
    $(".chat-window").removeClass("chat-slide");
  };

  // socket
  useEffect(() => {
    socket.on("SendMessageCallBack", (data) => {
      if (LastChatID !== data._id) {
        LastChatID = data._id;
        const jdate = new JDate();
        const formattedDate = jdate.format("YYYY/MM/DD");
        let TodayChat = chatRoomBody.find((a) => a.Date === formattedDate);

        let message = SendMessageDataCreator(
          data.Text,
          data.Receiver,
          data.Sender,
          data.Status,
          data.Type,
          data.Time,
          data._id
        );

        if (TodayChat) {
          // TodayChat.Chats.push(message);
          // UpdateTodayChat(TodayChat);
        } else {
          let newChat = {
            Chats: [message],
            Date: formattedDate,
            _id: "",
          };
          ChatRoomsMessages.push(newChat);
          setChatRoomBody(ChatRoomsMessages);
        }
      }
    });

    // socket.on("OnlineUsers", (data) => {
    //   data.map((center) => {
    //     setTimeout(() => {
    //       $(".Center-" + center.Center).attr(
    //         "class",
    //         "Center-" + center.Center + " avatar avatar-online"
    //       );
    //     }, 500);
    //   });
    // });
    // socket.on("ChangeUserStatusToOffline", (data) => {
    //   console.log(data);
    //       $(".Center-" +data.UserConnect).attr(
    //         "class",
    //         "Center-" + data.UserConnect + " avatar avatar-offline"
    //       );
    // });

    // ReceiveMessage
    socket.on("PhoneCall", async (data) => {
      let msg = `<div class="PhoneCallBox">
        <div class="card shadow">
            <div class="card-body h-100">
                <div class="row dir-rtl">
                    <div class="col-4"><button class="btn btn-success btn-PhoneCallBox"><i class="fe fe-phone"></i></button></div>
                    <div class="col-8 font-13">
                    ${data.Name}
                    <br />
                    ${data.Tel}
                    </div>
                </div>
            </div>
        </div>
    </div>`;

      $("body").append(msg);
      setTimeout(() => {
        $(".PhoneCallBox").remove();
      }, 15000);
    });

    socket.on("ReceiveMessage", async (data) => {
      if (LastID != data._id) {
        LastID = data._id;

        if (data.ChatRoomID === ActiveChatRoom) {
          const jdate = new JDate();
          const formattedDate = jdate.format("YYYY/MM/DD");
          let TodayRecivechat = ChatRoomsMessages.find(
            (a) => a.Date === formattedDate
          );

          let recieveData = {
            RepID: "",
            Sender: data.Sender,
            Status: data.Status,
            Text: data.Text,
            Time: data.Time,
            Type: data.Type,
            _id: data._id,
          };

          if (TodayRecivechat) {
            TodayRecivechat.Chats.push(recieveData);
            UpdateTodayChat(TodayRecivechat);
          } else {
            let newReciveChat = {
              Chats: [recieveData],
              Date: formattedDate,
              _id: "",
            };
            ChatRoomsMessages.push(newReciveChat);
            setChatRoomBody(ChatRoomsMessages);
          }
        } else {
          let newChatRoom = UserChatsList.find(
            (a) => a._id === data.ChatRoomID
          );

          if (newChatRoom) {
            if (newChatRoom.unReadChatCount) {
              newChatRoom.unReadChatCount++;
            } else {
              newChatRoom.unReadChatCount = 1;
            }
            UpdateUserChats(newChatRoom);
          } else {
            // newChatRoom
            let newChatRoom = {
              _id: data.ChatRoomID,
              ChatStatus: "0",
              User1: data.User1,
              User2: ChatClinicID,
              DepName: "بدون بخش",
              SpecialDiseases: [],
              Insurance: "",
              Type: "OnlineRegister",
              RD: "1402/11/10 14:34:06",
              unReadChatCount: 2,
            };
            GetChatRoomDataNotList(data.ChatRoomID);
          }
        }

        $("#Chat-" + ActiveChatRoom).addClass("active");
        setTimeout(() => {
          ScroolTobottom();
        }, 100);
      }
    });

    socket.on("ChangeUserStatusToOnline", (data) => {
      $(".Patient" + data.UserConnect).attr(
        "class",
        "Patient" + data.UserConnect + " avatar avatar-online"
      );
    });

    socket.on("OnlineUsers", (data) => {
      data
        .map((User) => {
          if (User.UserID != null) {
            $("#UserAvatar_" + User.UserID).attr(
              "class",
              "avatar avatar-online"
            );
            $(".Patient" + User.UserID).attr("class", "avatar avatar-online");
          }
        })
        .join(" ");
    });

    socket.on("PushNotificationNewRegister", (data) => {
      if (data.dataToSaveChatRoom._id != LastChatID) {
        LastChatID = data.dataToSaveChatRoom._id;
        let p = {
          _id: data.UserProfileID,
          Name: data.Name,
          Tel: data.Tel,
          P: "Patient",
        };

        UserChatsList.unshift(data.dataToSaveChatRoom);
        setUserChats(UserChatsList);
        setPatients([p, ...PatientList]);
        PatientList.push(p);
      }
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, [socket]);

  const SendMessageDataCreator = (
    Text,
    Receiver,
    Sender,
    Status,
    Type,
    Time,
    _id
  ) => {
    return {
      Text,
      Receiver,
      Sender,
      Status,
      Type,
      Time,
      _id,
    };
  };

  const sendTextToChatBox = (e) => {
    e.preventDefault();

    const jdate = new JDate();
    const formattedDate = jdate.format("YYYY/MM/DD");

    let date = new Date();
    let Time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let TodayChat = chatRoomBody.find((a) => a.Date === formattedDate);
    let Text = $("#TextInput").val();

    let message = SendMessageDataCreator(
      Text,
      ActiveChatRoom,
      ClinicUserID,
      "",
      "Text",
      Time,
      objectId()
    );

    if (TodayChat) {
      // TodayChat.Chats.push(message);
      UpdateTodayChat(TodayChat);
      socket.emit("SendMessage", { Data: message });
      e.target.reset();
    } else {
      let newChat = {
        Chats: [message],
        Date: formattedDate,
        _id: "",
      };

      ChatRoomsMessages.push(newChat);
      setChatRoomBody(ChatRoomsMessages);
      socket.emit("SendMessage", { Data: message });
      e.target.reset();
    }

    setTimeout(() => {
      ScroolTobottom();
    }, 150);
  };

  const UpdateUserChats = (newObj) => {
    // let index = UserChatsList.findIndex((x) => x._id === newObj._id);
    // UserChatsList = UserChatsList.slice(index + 1)
    UserChatsList = UserChatsList.filter(function (obj) {
      return obj._id !== newObj._id;
    });

    UserChatsList.unshift(newObj);
    setUserChats(UserChatsList);
  };

  const UpdateTodayChat = (newObj) => {
    let index = ChatRoomsMessages.findIndex((x) => x._id === newObj._id);
    let g = ChatRoomsMessages[index];
    g = newObj;

    setChatRoomBody([
      ...ChatRoomsMessages.slice(0, index),
      g,
      ...ChatRoomsMessages.slice(index + 1),
    ]);
  };

  async function SendFile(file) {
    const jdate = new JDate();
    const formattedDate = jdate.format("YYYY/MM/DD");

    let date = new Date();
    let Time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let TodayChat = chatRoomBody.find((a) => a.Date === formattedDate);
    let Text = await convertBase64(file);

    let message = SendMessageDataCreator(
      Text,
      ActiveChatRoom,
      ClinicUserID,
      "",
      "Image",
      Time,
      objectId()
    );

    if (TodayChat) {
      UpdateTodayChat(TodayChat);
      socket.emit("SendMessage", { Data: message });
    } else {
      let newChat = {
        Chats: [message],
        Date: formattedDate,
        _id: "",
      };

      ChatRoomsMessages.push(newChat);
      setChatRoomBody(ChatRoomsMessages);
      socket.emit("SendMessage", { Data: message });
    }
    setTimeout(() => {
      ScroolTobottom();
    }, 150);
  }

  function objectId() {
    return (
      hex(Date.now() / 1000) +
      " ".repeat(16).replace(/./g, () => hex(Math.random() * 16))
    );
  }

  const sendBackToChatSms = async (PatientID, Tel, Name) => {
    const res = await QuestionAlert(
      "آیا مطمئن هستید؟",
      "شما در حال ارسال پیامک پیام ناخوانده هستید"
    );

    if (res) {
      let url = `Sms2/Clinic/unreadMessage`;

      let data = {
        Title: Name,
        ChatRoomID: ActiveChatRoom,
        UserID: PatientID,
        ClinicID: ClinicID,
        Tel: Tel,
      };

      axiosClient
        .post(url, data)
        .then((response) => {
          SuccessAlert("ارسال موفق", "پیامک با موفقیت ارسال گردید");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function hex(value) {
    return Math.floor(value).toString(16);
  }

  // Appointment Modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [defaultDepValue, setDefaultDepValue] = useState();
  const [ActiveModalityData, setActiveModalityData] = useState(null);
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  const { data: clinicDepartments, isLoading: itIsLoading } =
    useGetAllClinicDepartmentsQuery(ClinicID);

  let modalityOptions = [];
  for (let i = 0; i < clinicDepartments?.length; i++) {
    const item = clinicDepartments[i];
    let obj = {
      value: item._id,
      label: item.Name,
    };
    modalityOptions.push(obj);
  }

  const openAppointmentModal = (patientID) => {
    ActivePatientID = patientID;
    setShowAppointmentModal(true);
    setActiveModalityData(clinicDepartments[0]);

    setDefaultDepValue({
      Name: modalityOptions[0].label,
      _id: modalityOptions[0].value,
    });
  };

  const addAppointment = (data) => {
    if (data) {
      setShowAppointmentModal(false);
      SuccessAlert("موفق", "ثبت نوبت با موفقیت انجام گردید!");
    }
  };

  useEffect(() => centers(), []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="page-wrapper p-0 mt-4 h-100">
          <div className="content p-0 margint-md">
            <div className="container-fluid">
              <div className="dir-rtl">
                <div className="row">
                  <div className="col-xl-12 chat-main">
                    <div className="chat-window">
                      <div className="chat-cont-left">
                        <div className="chat-header">
                          <p className="text-secondary font-16 fw-bold mb-0">
                            گفت و گو ها{" "}
                          </p>
                          <a href="#" className="chat-compose">
                            <i className="material-icons">control_point</i>
                          </a>
                        </div>
                        <form className="chat-search">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <i className="fas fa-search"></i>
                            </div>
                            <input
                              type="text"
                              className="form-control rounded-pill"
                              placeholder="جست و جو "
                            />
                          </div>
                        </form>

                        <CentersList
                          UserChats={UserChats}
                          ChatStatus={ChatStatus}
                          Patients={Patients}
                          cenetrs={Centers}
                          SelectChat={SelectChat}
                        />
                      </div>

                      <ChatPage
                        messageStatus={messageStatus}
                        sendBackToChatSms={sendBackToChatSms}
                        SendFile={SendFile}
                        users={users}
                        ChatHeader={ChatHeader}
                        chatRoomBody={chatRoomBody}
                        ImageGalleryRender={ImageGalleryRender}
                        BackToChatList={BackToChatList}
                        sendTextToChatBox={sendTextToChatBox}
                        ClinicUserID={ClinicUserID}
                        openAppointmentModal={openAppointmentModal}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ApplyAppointmentModal
            ClinicID={ClinicID}
            show={showAppointmentModal}
            onHide={handleCloseAppointmentModal}
            addAppointment={addAppointment}
            ActivePatientID={ActivePatientID}
            defaultDepValue={defaultDepValue}
            ActiveModalityData={ActiveModalityData}
            setActiveModalityData={setActiveModalityData}
          />
        </div>
      )}
    </>
  );
};

export default PatientChat;
