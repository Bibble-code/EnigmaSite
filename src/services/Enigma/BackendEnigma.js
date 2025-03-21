import Enigma from "./Enigma"


export default {
    getEncryption(data) {
        //return Enigma('https://echo.free.beeceptor.com').post("/application/json", data)
        return Enigma().post("/enigma", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        )
    },
    getCyclometer(data) {
        return Enigma().post("/cyclometer", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        )
    },
    getCatalogue(data) {
        return Enigma().post("/catalogue", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        )
    }
}