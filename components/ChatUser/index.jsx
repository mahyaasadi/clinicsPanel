const ChatUser = ({ user, cenetrs, SelectChat, Patients, ChatStatus }) => {
  if (user) {
    let patient = Patients?.find((x) => x._id === user?.User1);
    let LastMessage = "";
    let LastMessageUser = "";
    user.LastMessage.map((a) => {
      LastMessage = a;
      LastMessageUser = Patients?.find((x) => x._id === a.Sender);
    });
    let insuranceImg = "";
    if (user.Insurance) {
      insuranceImg = (
        <img
          src={"/assets/img/" + user?.Insurance + "Logo.png"}
          className="InsuranceImg"
        />
      );
    }
    return (
      <>
        <a
          href="#"
          className={"media d-flex read-chat ChatStatus-" + user.ChatStatus}
          id={"Chat-" + user._id}
          title={ChatStatus[user.ChatStatus].Name}
          onClick={() => SelectChat(patient, user._id, user.User1)}
        >
          <div className="media-img-wrap flex-shrink-0">
            <div
              id={"Status-" + user._id}
              className={"avatar avatar-offline Patient" + patient?._id}
            >
              <img
                src={"https://irannobat.ir/images/" + patient?.Avatar}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    "https://irannobat.ir/admin/assets/img/profiles/NoAvatar.png";
                }}
                alt="User"
                className="avatar-img rounded-circle"
              />
              {insuranceImg}
            </div>
          </div>
          <div className="media-body flex-grow-1">
            <div>
              <div className=" center-color "> {patient?.Name}</div>
              <div className="user-last-chat" dir="rtl">
                {user.DepName} - {user.RD}
              </div>
              <div className="user-last-chat" dir="rtl">
                {/* {LastMessageUser ? LastMessageUser.Name : "من" } : {LastMessage?.Text} */}
              </div>
            </div>

            <div>
              <div
                className="badge badge-success rounded-pill mt-4"
                id={"badge" + user._id}
              >
                {user.unReadChatCount}
                {LastMessageUser ? "جواب داده نشده" : ""}
              </div>
            </div>
          </div>
        </a>
      </>
    );
  } else {
    return false;
  }
};
export default ChatUser;
