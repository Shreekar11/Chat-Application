import Avatar from "./../assets/PFP.png";

const Conversations = ({user}) => {
  return (
    <div>
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
    </div>
  );
};

export default Conversations;
