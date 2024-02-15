import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Avatar from "../../assets/PFP.png";
import Input from "../../components/Input";
import Conversations from "../../components/Conversations";

const conversationId = "65ce1e51234b0b360d31e735";
const baseURL = process.env.VITE_BASE_URL;

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversations, setConversations] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = io("http://localhost:8080");

  // conversation useEffect
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const fetchConversation = async () => {
      const response = await fetch(
        `${baseURL}/conversations/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setConversations(data);
    };

    fetchConversation();
  }, []);

  // Messages Fetched
  const fetchMessages = async () => {
    const response = await fetch(`${baseURL}/message/${conversationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setMessages(data);
    console.log(messages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // socket useEffect
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    socket.emit("message", inputMessage);

    const response = await fetch(`${baseURL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        senderId: user?.id,
        message: inputMessage,
      }),
    });

    setInputMessage("");
    window.location.reload();
  };

  return (
    <main className="w-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[25%] md:h-screen bg-[#f3f5ff]">
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
          <div className="text-[#1476ff] text-2xl">Users</div>
          <div className="">
            {conversations &&
              conversations.map(({ user }) => <Conversations user={user} />)}
          </div>
          <div className="">
            <div className="flex items-center py-8 border-b border-b-gray-300">
              <img
                src={Avatar}
                width={60}
                height={60}
                className="border border-[#1476ff] p-[2px] rounded-full"
              />
              <div className="ml-8">
                <h3 className="text-2xl">Kyrie Irving</h3>
                <p className="text-lg font-light">kyrie@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-[75%] w-full h-screen bg-white flex flex-col items-center">
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
            {messages ? (
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
              )
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Messages or No Conversation Selected
              </div>
            )}
          </div>
        </div>
        <div className="p-12 w-full relative ">
          <Input
            type="text"
            name="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-4 border outline-none border-[#1476ff] rounded-full shadow-lg bg-light focus:ring-0 focus:border-0 "
          />
          <div className="absolute top-[4rem] right-20 text-[#1476ff] flex gap-3">
            <PaperAirplaneIcon
              className="w-6 h-6"
              onClick={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
