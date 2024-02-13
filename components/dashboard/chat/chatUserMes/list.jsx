import ChatsDate from "./ChatsDates";
import RecieveMessage from "./recieveMessage";
import SendMessage from "./sendmes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
let CounterImage = 0;
let ClinicUserID = null;

const List = ({
  chatRoomBody,
  ImageGalleryRender,
  img,
  users,
  messageStatus,
  ClinicUserID,
}) => {
  const router = useRouter();

  return chatRoomBody.map((chatDate, index) => {
    return (
      <>
        <ChatsDate date={chatDate.Date} />
        {chatDate.Chats.map((chat, index) => {
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
