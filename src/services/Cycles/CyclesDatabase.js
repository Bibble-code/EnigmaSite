import Database from "./Database"
export default {
    getCycles() {
        return Database().get('/')
    }
}