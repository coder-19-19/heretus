import axios from 'axios'
import {toast} from "react-toastify";

let baseURL
const href = window.location.href

if (href.includes('dev') || href.includes('localhost')) {
    baseURL = process.env.REACT_APP_BASE_API_URL
} else {
    baseURL = process.env.REACT_APP_PROD_BASE_API_URL
}

const instance = axios.create({
    baseURL
})


instance.interceptors.response.use(response => {
    if (response.config.method !== 'get' && !response.config.skipToast) {
        toast.success(response.data.message)
    }
    return response?.data
}, error => {
    if (error.response?.status === 401) {
        localStorage.clear()
        window.location.href = '/login'
    }
    return Promise.reject(error)
})


instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default instance
