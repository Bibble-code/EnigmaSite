import axios from "axios";

export default (url = "/api") => {
  return axios.create({
    baseURL: url,
  });
};
