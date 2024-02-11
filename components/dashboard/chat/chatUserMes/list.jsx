import ChatsDate from "./ChatsDates";
import RecieveMessage from "./recieveMessage";
import SendMessage from "./sendmes";

let CounterImage = 0;
const List = ({
  chatRoomBody,
  ImageGalleryRender,
  img,
  users,
  messageStatus,
  ClinicUserID
}) => {
  return chatRoomBody.map((chatDate) => {
    return (
      <>
        <ChatsDate date={chatDate.Date} />

        {chatDate.Chats.map((chat) => {
          if (chat) {
            if (chat.Type == "Image") {
              if (chat.Sender === ClinicUserID) {
                return (
                  <SendMessage
                    messageStatus={messageStatus}
                    key={chat._id}
                    ImageGalleryRender={ImageGalleryRender}
                    sendmes={chat}
                    imageCunter={CounterImage++}
                  />
                );
              } else {
                let userInfo = users?.find((a) => a._id === chat.Sender);
                return (
                  <RecieveMessage
                    key={chat._id}
                    recievemes={chat}
                    ImageGalleryRender={ImageGalleryRender}
                    imageCunter={CounterImage++}
                    img={img}
                    userInfo={userInfo}
                  />
                );
              }
            } else {
              if (chat.Sender === ClinicUserID) {
                return (
                  <SendMessage
                    messageStatus={messageStatus}
                    key={chat._id}
                    ImageGalleryRender={ImageGalleryRender}
                    sendmes={chat}
                  />
                );
              } else {
                let userInfo = users?.find((a) => a._id === chat.Sender);
                return (
                  <RecieveMessage
                    key={chat._id}
                    recievemes={chat}
                    ImageGalleryRender={ImageGalleryRender}
                    img={img}
                    userInfo={userInfo}
                  />
                );
              }
            }
          }
        })}
      </>
    );
  });
};

export default List;
