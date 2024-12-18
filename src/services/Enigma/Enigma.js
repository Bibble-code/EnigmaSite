import axios from "axios"

export default (url ='https://echo.free.beeceptor.com') => {
    return axios.create ({
        baseURL: url
    })
}