import Cookies from "js-cookie";
import axios from "axios";
import {AppConstants} from "./constants";
import {toast} from "react-toastify";

// const fetchRefresh = async () => {
//     try {
//         const agentId = ` ${Cookies.get('agent_id')}`;
//         const response = await General.fetchAgentData(agentId);
//         if (response) {
//             if (response.status === 200) {
//                 Cookies.set('server_agent_token', response.data?.access_token, {path: '/', domain: `${AppConstants.domain}`})
//
//                 window.location.reload();
//                 // call api
//             }
//             if (response.status === 404) {
//                 window.location.href = `${AppConstants.redirect_url}`
//             }
//         }
//     } catch (error) {
//         // throw error;
//     }
// };

// axios.defaults.baseURL = `${AppConstants.base_url_api}`;
axios.interceptors.request.use(
    (config) => {
        const token = ` ${Cookies.get('server_agent_token')}`;
        console.log('tokeen', token)
        if (token) config.headers.Authorization = `${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(undefined, (error) => {
    if (error.message === "Network Error" && !error?.response) {

    }
    if (error.response) {
        const {status} = error?.response;
        if (status) {
            if (status === 401 || status === 403) {
                if (Cookies.get('server_agent_token')) {
                    window.location.href = `${AppConstants.redirect_url}`
                } else {
                    window.location.href = `${AppConstants.login_url}`
                }
            }
            if (status === 200) {
                // return error;
            }
            if (status === 404) {
                // fetchRefresh()
                // return error;
                // window.location.href = '/error-404'
            }
            if (status === 400) {

            }
            if (status === 500) {
                // window.location.href = '/server-error'
            }
        }
    }

    throw error.response;
});

const responseBody = (response: any) => {
    return response;
};
const errorBody = (error: any) => {
    return error;
};

const axiosRequests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: any) => axios.post(url, body).then(responseBody).catch(errorBody),
    put: (url: string, body: any) => axios.put(url, body).then(responseBody).catch(errorBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, data: any) => {
        let formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                if (Array.isArray(data[key])) {
                    data[key].forEach((item: any) => {
                        formData.append(`${key}`, item);
                    });
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        return axios.post(url, formData, {headers: {"Content-type": "multipart/form-data"},}).then(responseBody);
    },
    putForm: (url: string, data: any) => {
        let formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null) {
                if (Array.isArray(data[key])) {
                    data[key].forEach((item: any) => {
                        formData.append(`${key}`, item);
                    });
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        return axios
            .put(url, formData, {
                headers: {"Content-type": "multipart/form-data"},
            })
            .then(responseBody);
    },
    postFormVideo: (url: string, Video: string | Blob) => {
        let formData = new FormData();
        formData.append('Video', Video);
        return axios
            .post(url, formData, {
                headers: {"Content-type": "multipart/form-data"},
            })
            .then(responseBody);
    },
    pdf: (url: string) => {
        return axios
            .get(url, {
                headers: {"Content-type": "application/pdf"},
            })
            .then(responseBody);
    },
};

const General = {
    logout: () => axiosRequests.post(`${AppConstants.base_url_api}/agentlogin?command=logout`,{}),
    getData: (params: string = '',data: any = {}) => axiosRequests.post(`${AppConstants.base_url_api}/agentlogin${params}`,data),
    agentData: (agentId: number) => axiosRequests.post(`${AppConstants.base_url_api}/agentlogin?command=getagent&agent_id=${agentId}`,{}),
    provinceList: () => axiosRequests.get(`${AppConstants.base_url_api}province-list`),
    cityList: (province_id: string) => axiosRequests.get(`${AppConstants.base_url_api}city-list/${province_id}`),
}

const Requests = {
    getState: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/statecity${params}`,{}),
    getReport: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport${params}`,{}),
    sendImage: (params: string = '',data: any = {}) => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport${params}`,data),
    sendRequest: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport${params}`,{}),
    getDoc: (command) => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport?command=${command}`,{}),
    provinceList: () => axiosRequests.get(`${AppConstants.base_url_api}province-list`),
    cityList: (province_id: string) => axiosRequests.get(`${AppConstants.base_url_api}city-list/${province_id}`),
}

const Fields = {
    insurances: () => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport?command=get_fieldinsurance`,{}),
    steps: () => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport?command=getstaterequest`,{}),
}

const User = {
    profile: () => axiosRequests.get(`${AppConstants.base_url_api}profile`),
    contrant: (hasHeader?: boolean) => axiosRequests.get(`${AppConstants.base_url_api}profile/contract?is_header=${hasHeader ? "true" : "false"}`),
    sheba: (sheba_number: string) => axiosRequests.post(`${AppConstants.base_url_api}sheba`, {sheba_number: `IR${sheba_number}`}),
}

const Agent = {
    edit: (params: string = '',data: any = {}) => axiosRequests.postForm(`${AppConstants.base_url_api}/agentlogin${params}`, data),
    create: (data: any) => axiosRequests.post(`${AppConstants.base_url_api}brag/create/`, data),
    upload: (data: any) => axiosRequests.post(`${AppConstants.base_url_api}brag-upload/`, data),
    uploadList: (data: any) => axiosRequests.post(`${AppConstants.base_url_api}brag-upload-lists/`, data),
}

export default {
    Agent,
    Fields,
    Requests,
    User,
    General,
};

