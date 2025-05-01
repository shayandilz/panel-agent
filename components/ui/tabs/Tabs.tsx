"use client";

import React from "react";

interface TabProps {
    value: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

interface TabsProps {
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}

export const Tab = ({ value, icon, children }: TabProps) => (
    <div className="flex items-center gap-1">
        {icon && <span className={'small'}>{icon}</span>}
        <span>{children}</span>
    </div>
);

export const Tabs = ({ value, onChange, children }: TabsProps) => {
    const tabs = React.Children.toArray(children);

    return (
        <div className="flex flex-nowrap gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            {tabs.map((tab: any) => (
                <button
                    key={tab.props.value}
                    onClick={() => onChange(tab.props.value)}
                    className={`py-2 px-2 ${
                        value === tab.props.value
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
