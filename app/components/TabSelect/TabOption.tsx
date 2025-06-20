"use client";

interface TabOptionProps {
  option: string;
  isSelected: boolean;
  onSelect: (option: string) => void;
}

export default function TabOption({
  option,
  isSelected,
  onSelect,
}: TabOptionProps) {
  const bgColour = isSelected ? "bg-white" : "bg-transparent";
  const textColour = isSelected ? "text-black" : "text-gray-400";
  const transition = "transition-colors duration-300";

  return (
    <button
      className={`w-full  rounded-sm flex justify-center items-center ${transition} ${bgColour}`}
      onClick={() => onSelect(option)}
    >
      <p className={`${transition} ${textColour}`}>{option}</p>
    </button>
  );
}
