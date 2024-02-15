import { useNavigate } from "react-router-dom";
import Image from "../../assets/chat.jpg";

const index = () => {
  const navigate = useNavigate();
  const user = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const createConversation = async () => {
    const response = await fetch(`${baseURL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: user?.id,
      }),
    });
    
    navigate('/chats');
  };


  return (
    <div className="bg-[#ffffff] flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-6xl m-5 font-semibold text-[#1476ff]">
          Chat Application
        </h1>
        <div className="flex flex-row">
          <div className="">
            <img src={Image} alt="Chat Image" width={500} height={500} />
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={createConversation}
              className="bg-[#1476ff] text-white p-6 rounded-full font-semibold text-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
