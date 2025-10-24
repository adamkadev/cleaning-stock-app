import React from "react";

interface StatusBadgeProps {
  status: "Initial" | "En cours" | "Traité";
  onClick?: () => void;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick, className }) => {
  let color = "bg-red-500";
  if (status === "En cours") color = "bg-yellow-500";
  else if (status === "Traité") color = "bg-green-500";

  return (
    <span
      onClick={onClick}
      className={`${color} text-white px-2 py-1 rounded-full text-sm cursor-pointer ${className}`}
    >
      {status === "Initial" ? "Initial" : status === "En cours" ? "En cours" : "Traité"}
    </span>
  );
};

export default StatusBadge;
