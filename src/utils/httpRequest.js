import axios from "axios";

const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers : {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})


const send = async (method, url, data, config) => {
    const response = await httpRequest.request({
        method,
        url,
        data,
        ...config
    })
    if (response.status >= 200 && response.status < 400) {
        return response.data;
    }
}

export const get = (url,config) => {
    return send("get", url,null, config)
}


export const post = (url,data,config) => {
    return send("post", url,data,config)
}


export const put = (url,data,config) => {
    return send("put", url,data,config)
}


export const patch = (url,data, config) => {
    return send("patch", url, data, config)
}

export const del = (url,config) => {
    return send("delete", url, null, config)
}

export const setToken = (token) => {
    if(token) {
        httpRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token)
    } else {
        delete httpRequest.defaults.headers.common['Authorization']
    }
}

export default {
    get,
    post,
    put,
    patch,
    del,
    setToken
}