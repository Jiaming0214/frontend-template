import axios from "axios"
import { ElMessage } from "element-plus";

const httpRequest = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    timeout: 30000
})

httpRequest.interceptors.response.use(response => {
    const data = response.data
    if(!data.success) {
        ElMessage.error('发生了一些错误，请联系管理员')
        throw new Error(data.message)
    }
    return data
})

const post = (url: string, data: any) => {
    return httpRequest.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export default httpRequest

export {
    post
}