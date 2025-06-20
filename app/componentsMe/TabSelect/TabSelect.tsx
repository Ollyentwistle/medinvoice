import TabOption from "./TabOption";

interface TabSelectProps {
  options: string[];
  selectedOption: string;
  setSelected: (id: string) => void;
}

export default function TabSelect({
  options,
  selectedOption,
  setSelected,
}: TabSelectProps) {
  return (
    <div className="w-full h-[40px] rounded-md bg-gray-200 flex flex-row justify-between gap-[4px] p-[4px]">
      {options.map((option: string) => (
        <TabOption
          key={option}
          option={option}
          isSelected={option == selectedOption}
          onSelect={(option: string) => setSelected(option)}
        />
      ))}
    </div>
  );
}
