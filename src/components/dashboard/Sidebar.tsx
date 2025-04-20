import { BookOpen, LucideIcon, ShoppingBag, Users } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  activeSection: ModalSelectionsType;
  setActiveSection: React.Dispatch<React.SetStateAction<ModalSelectionsType>>;
}

export default function Sidebar(
  {
    setActiveSection, isOpen,
    activeSection,
  }: SidebarProps
) {

  const ModalSelections: { name: ModalSelectionsType, Icon: LucideIcon }[] = [
    { name: 'overview', Icon: ShoppingBag },
    { name: 'orders', Icon: ShoppingBag },
    { name: 'books', Icon: BookOpen },
    { name: 'users', Icon: Users },
  ];

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:block md:w-64`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <nav className="divide-y">
          {
            ModalSelections.map((value) => (
              <SelectionButton 
                key={value.name}
                name={value.name}
                Icon={value.Icon}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            ))
          }
        </nav>
      </div>
    </div>
  )
}

type SelectionButtonProps = {
  activeSection: ModalSelectionsType;
  setActiveSection: React.Dispatch<React.SetStateAction<ModalSelectionsType>>;
  name: ModalSelectionsType;
  Icon: LucideIcon;
}

const SelectionButton = ({ activeSection, setActiveSection, name, Icon }: SelectionButtonProps) => {

  return (
    <button 
      className={`capitalize px-4 py-3 w-full text-left font-medium flex items-center ${
        activeSection === name ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
      }`}
      onClick={() => setActiveSection(name)}
    >
      <Icon className={`mr-2 h-5 w-5 ${activeSection === name ? 'text-blue-800' : 'text-gray-500'}`} />
      {name}
    </button>
  )
}