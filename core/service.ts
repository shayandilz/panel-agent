import Cookies from "js-cookie";
import axios from "axios";
import {AppConstants} from "./constants";

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
        // console.log('tokeen', token)
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


    if(response?.data && response?.data?.desc == "توکن در سیستم موجود نیست") {
        Cookies.remove('server_agent_token');
        Cookies.remove('agent_data');
        Cookies.remove('agent_id');

        window.location.href = '/signin';

    }
    return response;
};
const errorBody = (error: any) => {

    if(error?.data?.desc == "توکن در سیستم موجود نیست") {
        Cookies.remove('server_agent_token');
        Cookies.remove('agent_data');
        Cookies.remove('agent_id');

        window.location.href = '/signin';

    }
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

        return axios.post(url, formData, {headers: {"Content-type": "multipart/form-data"}}).then(responseBody);
    },
    // putForm: (url: string, data: any) => {
    //     let formData = new FormData();
    //     Object.keys(data).forEach((key) => {
    //         if (data[key] !== null) {
    //             if (Array.isArray(data[key])) {
    //                 data[key].forEach((item: any) => {
    //                     formData.append(`${key}`, item);
    //                 });
    //             } else {
    //                 formData.append(key, data[key]);
    //             }
    //         }
    //     });
    //
    //     return axios
    //         .put(url, formData, {
    //             headers: {"Content-type": "multipart/form-data"},
    //         })
    //         .then(responseBody);
    // },
    // postFormVideo: (url: string, Video: string | Blob) => {
    //     let formData = new FormData();
    //     formData.append('Video', Video);
    //     return axios
    //         .post(url, formData, {
    //             headers: {"Content-type": "multipart/form-data"},
    //         })
    //         .then(responseBody);
    // },
    // pdf: (url: string) => {
    //     return axios
    //         .get(url, {
    //             headers: {"Content-type": "application/pdf"},
    //         })
    //         .then(responseBody);
    // },
};

const General = {
    logout: () => axiosRequests.post(`${AppConstants.base_url_api}/agentlogin?command=logout`,{}),
    getData: (params: string = '',data: any = {}) => axiosRequests.post(`${AppConstants.base_url_api}/agentlogin${params}`,data),
    agentData: (agentId: string | any) => axiosRequests.post(`${AppConstants.base_url_api}/agentlogin?command=getagent&agent_id=${agentId}`,{}),
}

const Requests = {
    getState: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/statecity${params}`,{}),
    getReport: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport${params}`,{}),
    getOrgan: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/organ${params}`,{}),
    sendImage: (params: string = '',data: any = {}) => axiosRequests.post(`${AppConstants.base_url_api}/image${params}`,data),
    sendRequest: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport${params}`,{}),
    getRequestDetail: (id?: string | Array<string>) => axiosRequests.post(`${AppConstants.base_url_api}/getrequestagent?command=get_request&request_id=${id}`,{}),
}

const Fields = {
    fetchList: (params: string = '') => axiosRequests.post(`${AppConstants.base_url_api}/${params}`,{}),
    insurances: () => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport?command=get_fieldinsurance`,{}),
    steps: () => axiosRequests.post(`${AppConstants.base_url_api}/agentrequestreport?command=getstaterequest`,{}),
}

const Agent = {
    edit: (params: string = '',data: object = {}) => axiosRequests.postForm(`${AppConstants.base_url_api}/agentlogin${params}`, data),
}

export default {
    Agent,
    Fields,
    Requests,
    General,
};

