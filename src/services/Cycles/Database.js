import axios from "axios"

export default (url ='http://localhost:3000/cycles') => {
    return axios.create ({
        baseURL: url
    })
}