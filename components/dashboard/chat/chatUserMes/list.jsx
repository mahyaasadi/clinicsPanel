import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RecieveMessage from "./recieveMessage";
import SendMessage from "./sendmes";

let CounterImage = 0;
let ClinicUserID = null;

const List = ({
  chatRoomBody,
  ImageGalleryRender,
  Patient,
  users,
  messageStatus,
  ClinicUserID,
}) => {
  const router = useRouter();

  return chatRoomBody.map((chatDate) => {
    return (
      <>
        <li className="chat-date">{chatDate.Date}</li>
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
                    Patient={Patient}
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
                    Patient={Patient}
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
