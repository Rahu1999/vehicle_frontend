import React from "react";

export interface Tab {
    name: string;
    current: boolean;
    component: JSX.Element;
}

interface CustomTabBarProps {
    tabs: Tab[];
    handleTabChange?: (tabName: string) => void;
    setTabs: (tabs: Tab[]) => void;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ tabs, handleTabChange, setTabs }) => {
    const changeTab = (tabName: string) => {
        const updatedTabs = tabs.map((tab) => ({
            ...tab,
            current: tab.name === tabName,
        }));
        setTabs(updatedTabs);

        handleTabChange ? handleTabChange(tabName) : null
    }
    return (
        <div>
            <nav className="mb-2 flex space-x-8 border-b-2" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button key={tab.name}
                        onClick={() => changeTab(tab.name)} // Fixed the onClick handler
                        className={`${tab.current ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:border-primary hover:text-gray-700"}
                                     whitespace-nowrap rounded-none border-b-2 px-1 py-2 text-sm font-medium`}
                        aria-current={tab.current ? "page" : undefined}
                    >
                        {tab.name}
                    </button>

                ))}

            </nav>
            {tabs.map((tab) => (
                <div key={tab.name}>
                    {tab.current ? tab.component : null}
                </div>
            ))}
        </div>
    );
};

export default CustomTabBar;