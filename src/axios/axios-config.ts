import axios, {type AxiosRequestConfig} from "axios"
import { ElMessage } from "element-plus";

const httpRequest = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    timeout: 30000
})

httpRequest.interceptors.response.use(response => {
    const data = response.data
    if(!data.success) {
        ElMessage.error(data.data)
        throw new Error(data.message)
    }
    return data
})

const post = (url: string, data: any, config: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}) => {
    return httpRequest.post(url, data, config)
}

export default httpRequest

export {
    post
}