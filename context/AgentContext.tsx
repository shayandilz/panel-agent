"use client"
import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import services from "@/core/service";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import {Loader} from "lucide-react";

interface AgentData {
    agent_id: String | '-',
    agent_code: String | '-',
    agent_gender: String | '-',
    agent_name: String | '-',
    agent_family: String | '-',
    agent_mobile: String | '-',
    agent_tell: String | '-',
    agent_email: String | '-',
    $agenttoken: String | '-',
    agent_token_str: String | '-',
    employee_name: String | '-',
    employee_family: String | '-',
    agent_required_phone: String | '-',
    agent_address: String | '-',
    agent_register_date: String | '-',
    agent_state_name: String | '-',
    agent_city_name: String | '-',
    agent_sector_name: String | '-',
    agent_long: String | '-',
    agent_lat: String | '-',
    agent_banknum: String | '-',
    agent_bankname: String | '-',
    agent_banksheba: String | '-',
    agent_image_code: String | '-',
    agent_image: String | '-',
    agent_image_tumb: String | '-',
    agent_company_name: String | '-',
    agent_company_logo_url: String | '-',
    agent_deactive: String | '-',
}

interface AuthContextType {
    agentData: AgentData | null;
    agentStatus: boolean | 'none';
    token: string | false;
    isAuthenticated: boolean | false;
    isLoading: boolean;
    login: (agentData: AgentData) => void;
    logout: () => void;
    fetchAgentData: () => Promise<void>;
    fetchAgentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [agentData, setAgent] = useState<AgentData | null>(null);
    const [agentStatus, setAgentStatus] = useState<boolean>(false);
    const [agentId, setAgentId] = useState<number | null>(Cookies.get('agent_id') || null);
    const [token, setToken] = useState<string | null>(Cookies.get('server_agent_token') || null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!token;

    const fetchAgentData = useCallback(async () => {
        if (!token || !agentId) return;

        setIsLoading(true);
        try {
            const res = await services.General.agentData(agentId);
            if (res.data?.result === 'ok') {
                setAgent(res.data.data);
            } else {
                throw new Error(res.data?.desc || 'خطا در دریافت اطلاعات کاربر');
            }
        } catch (err) {
            toast.error(err.message || 'خطا در دریافت اطلاعات کاربر');
        } finally {
            setIsLoading(false);
        }
    }, [agentId, token]);

    const fetchAgentStatus = useCallback(async () => {
        if (!token || !agentId) return;
        try {
            const res = await services.General.getData('?command=get_status');
            if (res) {
                let data = res.data
                if (data?.result === 'ok') {
                    setAgentStatus(data?.data?.agent_status == '1')
                    console.log(agentStatus)
                } else {
                    throw new Error(data?.desc || 'خطا در دریافت وضعیت کاربر');
                }
            }
        } catch (err) {
            toast.error(err.message || 'خطا در دریافت وضعیت کاربر');
        }
    }, [agentId, token]);

    const login = (agentData: AgentData) => {
        let token = agentData?.agent_token_str || null
        let id = agentData?.agent_id || null
        Cookies.set('server_agent_token', token, {expires: 1}); // Store token for 7 days
        Cookies.set('agent_data', JSON.stringify(agentData));
        Cookies.set('agent_id', id);
        setAgentId(id);
        setToken(token);
        setAgent(agentData);
    };

    const logout = () => {
        Cookies.remove('server_agent_token');
        Cookies.remove('agent_data');
        Cookies.remove('agent_id');
        setToken(null);
        setAgent(null);
        setAgentId(null);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                await fetchAgentData();
            } else setIsLoading(false);
        };

        initializeAuth();
    }, [token, fetchAgentData]);

    return (
        <AuthContext.Provider
            value={{
                agentData,
                agentStatus,
                token,
                isAuthenticated,
                isLoading,
                login,
                logout,
                fetchAgentData,
                fetchAgentStatus
            }}
        >
            {isLoading && <div
                className={`flex z-99999 items-center justify-center inset-0 fixed bg-white-900 dark:bg-gray-900 transition-all opacity-90`}>
                <Loader/></div>}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};