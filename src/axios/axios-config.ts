import axios, {type AxiosRequestConfig} from "axios"
import { ElMessage } from "element-plus";

const httpRequest = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    timeout: 30000
})

const defaultError = () => ElMessage.error("发生了一些错误，请联系管理员")

const defaultFailure = (data: any) => ElMessage.error(data)

const defaultConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

const post = (
    url: string,
    data: any,
    config: AxiosRequestConfig = defaultConfig,
    success: (data: any, status: number) => void,
    failure = defaultFailure,
    error = defaultError) => {
    httpRequest.post(url, data, config).then(( {data} ) => {
        if(data.success) success(data.data, data.status)
        else failure(data.data)
    }).catch(error)
}

const get = (
    url: string,
    success: (data: any, status: number) => void,
    failure: (data: any) => void = defaultFailure,
    error = defaultError) => {
    httpRequest.get(url).then(( {data} ) => {
        if(data.success) success(data.data, data.status)
        else failure(data.data)
    }).catch(error)
}


export default httpRequest

export {
    post,
    get,
    defaultConfig
}