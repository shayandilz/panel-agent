"use client";
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import services from "@/core/service";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";

// Define types for AgentData and other states
interface AgentData {
    agent_id: string | null;
    agent_code: string | null;
    agent_gender: string | null;
    agent_name: string | null;
    agent_family: string | null;
    agent_mobile: string | null;
    agent_tell: string | null;
    agent_email: string | null;
    $agenttoken: string | null;
    employee_name: string | null;
    employee_family: string | null;
    agent_required_phone: string | null;
    agent_address: string | null;
    agent_register_date: string | null;
    agent_state_name: string | null;
    agent_city_name: string | null;
    agent_sector_name: string | null;
    agent_long: string | null;
    agent_lat: string | null;
    agent_banknum: string | null;
    agent_bankname: string | null;
    agent_banksheba: string | null;
    agent_image_code: string | null;
    agent_image: any; // Consider typing this based on how the image is handled (string, URL, etc.)
    agent_image_tumb: string | null;
    agent_company_name: string | null;
    agent_company_logo_url: string;
    agent_deactive: string | null;
}

interface AuthContextType {
    agentData: AgentData | null;
    agentStatus: boolean | 'none';
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (agentData: AgentData) => void;
    logout: () => void;
    fetchAgentData: () => Promise<void>;
    fetchAgentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [agentData, setAgent] = useState<AgentData | null>(null); // Type agentData correctly
    const [agentStatus, setAgentStatus] = useState<boolean>(false); // Type agentStatus correctly
    const [agentId, setAgentId] = useState<string | null>(Cookies.get('agent_id') || null); // Correct type for agentId
    const [token, setToken] = useState<string | null>(Cookies.get('server_agent_token') || null); // Correct type for token
    const [isLoading, setIsLoading] = useState<boolean>(true); // Type for isLoading

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
            toast.error('خطا در دریافت اطلاعات کاربر');
        } finally {
            setIsLoading(false);
        }
    }, [agentId, token]);

    const fetchAgentStatus = useCallback(async () => {
        if (!token || !agentId) return;
        try {
            const res = await services.General.getData('?command=get_status');
            if (res) {
                const data = res.data;
                if (data?.result === 'ok') {
                    setAgentStatus(data?.data?.agent_status === '1');
                    console.log(agentStatus);
                } else {
                    throw new Error(data?.desc || 'خطا در دریافت وضعیت کاربر');
                }
            }
        } catch (err) {
            toast.error('خطا در دریافت وضعیت کاربر');
        }
    }, [agentId, token]);

    const login = (agentData: AgentData) => {
        let token = agentData?.$agenttoken || ''; // Ensure correct key is used for the token
        let id = agentData?.agent_id || '';
        Cookies.set('server_agent_token', token, { expires: 1 }); // Store token for 1 day
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
            } else {
                setIsLoading(false);
            }
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
            {isLoading && (
                <div
                    className={`flex z-99999 items-center justify-center inset-0 fixed bg-white-900 dark:bg-gray-900 transition-all opacity-90`}
                >
                    <Loader />
                </div>
            )}
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
