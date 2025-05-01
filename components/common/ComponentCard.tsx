"use client";

import React, {useState} from "react";
import {MoreDotIcon} from "@/icons";
import {Dropdown} from "@/components/ui/dropdown/Dropdown";
import {DropdownItem} from "@/components/ui/dropdown/DropdownItem";
import {ListIcon} from "lucide-react";

interface ComponentCardProps {
  title: string | null;
  children: React.ReactNode;
  showAll: string | null | undefined;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title= '',
  children,
  showAll = '',
  className = "",
  desc = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Card Header */}
      <div className="flex justify-between px-6 py-5">
        <div>
          <h3 className="flex gap-2 text-base font-medium text-gray-800 dark:text-white/90">
            <ListIcon /> {title}
          </h3>
          {desc && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {desc}
              </p>
          )}
        </div>

        {!!showAll && <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"/>
          </button>
          <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
          >
            <DropdownItem
                href={showAll}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              بیشتر
            </DropdownItem>
          </Dropdown>
        </div>}
      </div>


      {/* Card Body */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
