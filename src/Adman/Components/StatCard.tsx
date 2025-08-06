import React from "react";

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-[#FAF7F2] rounded-xl w-4/1   h-[149px] flex flex-col items-center justify-center shadow-sm text-center">
      <div className="mb-2 text-4xl">{icon}</div>
      <div className="text-[#8B919E]  font-medium mb-2">{title}</div>
      <div className="text-black  font-bold">${value}</div>
    </div>
  );
};

export default StatCard;