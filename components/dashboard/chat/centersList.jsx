import ChatUser from "components/dashboard/chat/ChatUser";

export default function CentersList({
  UserChats,
  cenetrs,
  SelectChat,
  Patients,
  ChatStatus,
}) {
  return (
    <>
      <div className="chat-users-list">
        <div className="chat-scroll UserList">
          {UserChats.map((user, index) => {
            return (
              <ChatUser
                key={index}
                user={user}
                cenetrs={cenetrs}
                SelectChat={SelectChat}
                ChatStatus={ChatStatus}
                Patients={Patients}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
