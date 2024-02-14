import { useEffect, useState } from "react";
import Avatar from "../../assets/PFP.png";
import { PaperAirplaneIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Input from "../../components/Input";

const conversationId = "65cc638158b2be14e2488c88";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversations, setConversations] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const fetchConversation = async () => {
      const response = await fetch(
        `http://localhost:8000/api/conversations/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await response.json();
      setConversations(res);
    };

    fetchConversation();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch(
      `http://localhost:8000/api/message/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setMessages(data);
    console.log(messages?.user);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = async(e) => {
    e.preventDefault();
    console.log({
      conversationId,
      senderId: user?.id,
      message: inputMessage,
      receiverId: messages?.user?.id
    })
    const response = await fetch('http://localhost:8000/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        senderId: user?.id,
        message: inputMessage,
      })
    });
    const data = await response.json();
    setInputMessage('');
    console.log((data));
  }

  return (
    <main className="w-screen flex">
      <div className="w-[25%] h-screen bg-[#f3f5ff]">
        <div className="flex m-10">
          <img
            src={Avatar}
            width={75}
            height={75}
            className="border border-[#1476ff] p-[2px] rounded-full"
          />
          <div className="ml-8">
            <h3 className="text-2xl">{user.fullName}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-5 space-y-5">
          <div className="text-[#1476ff] text-lg">Group</div>
          <div className="">
            {conversations &&
              conversations.map(({ user }) => (
                <div className="flex items-center py-8 border-b border-b-gray-300">
                  <img
                    src={Avatar}
                    width={60}
                    height={60}
                    className="border border-[#1476ff] p-[2px] rounded-full"
                  />
                  <div className="ml-8">
                    <h3 className="text-2xl">{user?.fullName}</h3>
                    <p className="text-lg font-light">{user?.email}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="w-[75%] h-screen bg-white flex flex-col items-center">
        <div className="flex mr-auto m-5">
          <img
            src={Avatar}
            alt="Profile pic"
            width={60}
            height={60}
            className="border border-[#1476ff] p-[2px] rounded-full"
          />
          <div className="pl-4">
            <h1 className="text-2xl font-bold text-[#1476ff] ">Group Name</h1>
            <p className="text-neutral-400">Public Group</p>
          </div>
        </div>
        <div className="h-[75%] border w-full overflow-y-scroll">
          <div className="h-[1000px] px-10 py-14">
            <div className=" max-w-[40%] bg-[#f3f5ff] rounded-b-xl rounded-tr-xl p-4 mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quo
              esse, aperiam labore asperiores.
            </div>
            <div className=" max-w-[40%] text-[#f3f5ff] bg-[#1476ff] rounded-b-xl mb-6 rounded-tl-xl ml-auto p-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quo
              esse, aperiam labore asperiores.
            </div>
            {messages &&
              messages.map(({ message, user: { id } }) =>
                id === user?.id ? (
                  <div className=" max-w-[40%] text-[#f3f5ff] bg-[#1476ff] mb-6 rounded-b-xl rounded-tl-xl ml-auto p-4">
                    {message}
                  </div>
                ) : (
                  <div className=" max-w-[40%] bg-[#f3f5ff] rounded-b-xl rounded-tr-xl p-4 mb-6">
                    {message}
                  </div>
                )
              )}
          </div>
        </div>
        <div className="p-14 w-full relative ">
          <Input
            type="text"
            name="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-4 border outline-none border-[#1476ff] rounded-full shadow-lg bg-light focus:ring-0 focus:border-0 "
          />
          <div className="absolute top-[4.5rem] right-20 text-[#1476ff] flex gap-3">
            <PaperAirplaneIcon className="w-6 h-6" onClick={handleSendMessage}/>
            <PlusCircleIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
      {/* <div className="w-[25%] h-screen"></div> */}
    </main>
  );
};

export default Dashboard;