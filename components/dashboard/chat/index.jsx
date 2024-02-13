import List from "components/dashboard/chat/chatUserMes/list";

export default function ChatPage({
  ChatHeader,
  chatRoomBody,
  ImageGalleryRender,
  users,
  BackToChatList,
  sendTextToChatBox,
  messageStatus,
  ClinicUserID,
}) {
  return (
    <>
      <div className="chat-cont-right">
        {/* chat header */}
        <div className="chat-header">
          <a
            id="back_user_list"
            href="#"
            onClick={BackToChatList}
            className="back-user-list"
          >
            <i className="material-icons">chevron_left</i>
          </a>
          {ChatHeader ? (
            <div className="media d-flex  ">
              <div className="media-img-wrap flex-shrink-0">
                <div className="avatar avatar-online" id="headerStatus">
                  <img
                    src={"https://irannobat.ir/images/" + ChatHeader?.Avatar}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src =
                        "https://irannobat.ir/admin/assets/img/profiles/NoAvatar.png";
                    }}
                    alt="Logo "
                    className="avatar-img rounded-circle"
                  />
                </div>
              </div>

              <div className="media-body flex-grow-1">
                <div className="user-name ">{ChatHeader?.Name}</div>
                <div className="user-status"></div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="chat-options">
            <a href="#">
              <i className="material-icons">more_vert</i>
            </a>
          </div>
        </div>

        {/*chatBoody*/}

        <div className="chat-scroll" id="chat-body">
          <div className="chat-body">
            <ul className="list-unstyled" id="AddChat">
              <List
                messageStatus={messageStatus}
                chatRoomBody={chatRoomBody}
                img={ChatHeader}
                ImageGalleryRender={ImageGalleryRender}
                users={users}
                ClinicUserID={ClinicUserID}
              />
            </ul>
          </div>
        </div>

        {/* chatFooter */}
        <form onSubmit={sendTextToChatBox}>
          <div className="chat-footer">
            <div className="input-group">
              <div className="btn-file btn">
                <i className="fa fa-paperclip"></i>
                <input type="file" />
              </div>
              <input
                id="TextInput"
                type="text"
                className="input-msg-send form-control rounded-pill"
                placeholder="متن خود را اینجا بنویسید "
              />
              <button
                type="submit"
                className="btn msg-send-btn rounded-pill ms-2  bg-tel"
              >
                <i className="fab fa-telegram-plane tel-icon"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
