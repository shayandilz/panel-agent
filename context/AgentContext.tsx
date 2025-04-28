"use client"
import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import services from "@/core/service";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import {Loader} from "lucide-react";

interface AgentData {
    agent_id: String | null,
    agent_code: String | null,
    agent_gender: String | null,
    agent_name: String | null,
    agent_family: String | null,
    agent_mobile: String | null,
    agent_tell: String | null,
    agent_email: String | null,
    $agenttoken: String | null,
    agent_token_str: String | null,
    employee_name: String | null,
    employee_family: String | null,
    agent_required_phone: String | null,
    agent_address: String | null,
    agent_register_date: String | null,
    agent_state_name: String | null,
    agent_city_name: String | null,
    agent_sector_name: String | null,
    agent_long: String | null,
    agent_lat: String | null,
    agent_banknum: String | null,
    agent_bankname: String | null,
    agent_banksheba: String | null,
    agent_image_code: String | null,
    agent_image: String | null,
    agent_image_tumb: String | null,
    agent_company_name: String | null,
    agent_company_logo_url: String | null,
    agent_deactive: String | null,
}

interface AuthContextType {
    agentData: AgentData | null;
    agentStatus: boolean | 'none';
    token: string | false;
    isAuthenticated: boolean;
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