import React from 'react';
import { BookOpen, LucideIcon, ShoppingBag, Users, BarChart3 } from "lucide-react";

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

  const ModalSelections: { name: ModalSelectionsType, Icon: LucideIcon, label: string }[] = [
    { name: 'overview', Icon: BarChart3, label: 'Overview' },
    { name: 'orders', Icon: ShoppingBag, label: 'Orders' },
    { name: 'books', Icon: BookOpen, label: 'Books' },
    { name: 'users', Icon: Users, label: 'Users' },
  ];

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-72 flex-shrink-0 max-md:w-full`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 max-md:hidden">
          <h3 className="text-white font-bold text-lg">Navigation</h3>
          <p className="text-blue-100 text-sm mt-1">Manage your dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="p-2 max-md:flex items-center w-full max-xxs:overflow-x-scroll">
          {ModalSelections.map((item, index) => (
            <SelectionButton 
              key={item.name}
              name={item.name}
              Icon={item.Icon}
              label={item.label}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isLast={index === ModalSelections.length - 1}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 max-md:hidden">
          <div className="text-center">
            <p className="text-xs text-gray-500">Admin Dashboard</p>
            <p className="text-xs text-gray-400 mt-1">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

type SelectionButtonProps = {
  activeSection: ModalSelectionsType;
  setActiveSection: React.Dispatch<React.SetStateAction<ModalSelectionsType>>;
  name: ModalSelectionsType;
  Icon: LucideIcon;
  label: string;
  isLast?: boolean;
}

const SelectionButton = ({ 
  activeSection, 
  setActiveSection, 
  name, 
  Icon, 
  label,
  isLast = false 
}: SelectionButtonProps) => {
  const isActive = activeSection === name;

  return (
    <button 
      className={`w-full text-left font-medium flex items-center p-4 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
      } ${!isLast ? 'mb-1' : ''}`}
      onClick={() => setActiveSection(name)}
    >
      <div className={`p-2 rounded-lg mr-3 ${
        isActive 
          ? 'bg-white/20' 
          : 'bg-gray-100 group-hover:bg-blue-100'
      }`}>
        <Icon className={`h-5 w-5 ${
          isActive 
            ? 'text-white' 
            : 'text-gray-600 group-hover:text-blue-600'
        }`} />
      </div>
      <span className="font-semibold">{label}</span>
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
      )}
    </button>
  )
}