interface WhyChooseCardProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
}

const WhyChooseCard: React.FC<WhyChooseCardProps> = ({
    icon,
    title,
    description,
}) => (
  <div className="bg-[#FAF7F2] rounded-xl shadow p-8 flex flex-col items-center text-center w-full">
    {icon && <div className="mb-4 ">{icon}</div>}
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-base font-normal">{description}</p>
  </div>
);

export default WhyChooseCard;