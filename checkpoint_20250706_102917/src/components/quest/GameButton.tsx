import React from "react";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

interface GameButtonProps {
  label: string;
  Icon: React.FC<LucideProps>;
  gradient: string; // e.g., "from-purple-500 to-indigo-600"
  onClick: () => void;
  isOptional?: boolean;
}

const GameButton: React.FC<GameButtonProps> = ({
  label,
  Icon,
  gradient,
  onClick,
  isOptional = false,
}) => (
  <button
    className={cn(
      "w-full p-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition text-white flex flex-col items-center justify-center gap-2 text-center",
      `bg-gradient-to-br ${gradient}`,
      {
        "opacity-75 hover:opacity-100": isOptional,
      }
    )}
    onClick={onClick}
    data-testid={`game-btn-${label.toLowerCase().replace(/ /g, "-")}`}
  >
    <Icon className="w-8 h-8" />
    <span className="text-sm font-bold">{label}</span>
    {isOptional && (
      <span className="text-xs font-light tracking-wider uppercase">
        Challenge
      </span>
    )}
  </button>
);

export default GameButton;
