import Enigma from "./Enigma"


export default {
    getEncryption(data) {
        //return Enigma('https://echo.free.beeceptor.com').post("/application/json", data)
        return Enigma().post("", data)
    }
}