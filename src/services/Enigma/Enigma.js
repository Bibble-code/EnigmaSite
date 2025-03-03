import axios from "axios"

export default (url ='https://localhost:8081') => {
    return axios.create ({
        baseURL: url
    })
}