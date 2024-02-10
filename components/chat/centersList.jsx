import ChatUser from "../ChatUser";
export default function CentersList({ UserChats, cenetrs, SelectChat, Patients,ChatStatus}) {
  return (
    <>
      <div className="chat-users-list">
        <div className="chat-scroll UserList">
          {UserChats.map((user) => {
            return (
              <ChatUser user={user} cenetrs={cenetrs} SelectChat={SelectChat} ChatStatus={ChatStatus}
              Patients={Patients}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
