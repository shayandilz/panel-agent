"use client"
import React, {createContext, useState, useContext} from 'react';
import services from "@/core/service";

interface TokenData {
    token: String,
}

interface AgentData {
    agent_id: String,
    agent_code: String,
    agent_gender: String,
    agent_name: String,
    agent_family: String,
    agent_mobile: String,
    agent_tell: String,
    agent_email: String,
    $agenttoken: String,
    employee_name: String,
    employee_family: String,
    agent_required_phone: String,
    agent_address: String,
    agent_register_date: String,
    agent_state_name: String,
    agent_city_name: String,
    agent_sector_name: String,
    agent_long: String,
    agent_lat: String,
    agent_banknum: String,
    agent_bankname: String,
    agent_banksheba: String,
    agent_image_code: String,
    agent_image: String,
    agent_image_tumb: String,
    agent_company_name: String,
    agent_company_logo_url: String,
    agent_deactive: String,
}

const AgentContext = createContext<{
    agentData: AgentData | null;
    setAgentData: (data: AgentData) => void;
    agentStatus: false;
    setAgentStatus: (data) => void;
    tokenData: TokenData | null;
    setTokenData: (data: TokenData) => void;
}>({
    agentData: null, setAgentData: () => {},
    agentStatus: false, setAgentStatus: () => {},
    tokenData: null, setTokenData: () => {}
});

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [agentData, setAgentData] = useState<AgentData | null>(null);
    const [agentStatus, setAgentStatus] = useState(false);
    const [tokenData, setTokenData] = useState<TokenData | null>(null);

    return (
        <AgentContext.Provider value={{agentData, setAgentData, agentStatus, setAgentStatus, tokenData, setTokenData}}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgent = () => useContext(AgentContext);
