"use client";

import React, { useState } from "react";

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
    <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{children}</span>
    </div>
);

export const Tabs = ({ value, onChange, children }: TabsProps) => {
    const tabs = React.Children.toArray(children);

    return (
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
            {tabs.map((tab: any) => (
                <button
                    key={tab.props.value}
                    onClick={() => onChange(tab.props.value)}
                    className={`py-2 px-4 ${
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
