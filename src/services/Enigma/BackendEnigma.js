import Enigma from "./Enigma"


export default {
    getEncryption(data) {
        return Enigma().post("/enigma", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        )
    },
    getCyclometer(data) {
        return Enigma().post("/manualcyclometer", data, {
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