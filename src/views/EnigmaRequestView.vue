<template>
    <div v-if="settings">
        <p>{{ settings }}</p>
        <form @submit.prevent="handleSubmit">
            <label>Role:</label>
            <select v-model="settings.model">
                <option value=1>I</option>
                <option value=2>II</option>
                <option value=3>III</option>
            </select>

            <div class="submit">
                <button>Verschlüsseln</button>
            </div>
        </form>
    </div>



</template>

<script>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import { ref } from 'vue';

export default {
    setup() {
        

        const settings = ref({
            model: 3,
            reflector: "B",
            rotors: [1, 2, 3],
            positions: [0, 0, 0],
            rings: [0, 0, 0],
            plugboard: "",
            input: "TEST",
            output: ""
        })

        const Encrypt = async (data) => {

            // const response = await BackendEnigma.getEncryption(data)
            // //console.log("response",response)
            // //console.log("responsedata",response.data.parsedBody._value)
            // console.log("settingsvalue", settings.value)
            // console.log("settings", settings)
            // console.log("response",response.data.parsedBody)
            // settings.value = response.data.parsedBody
            // console.log("after   ", settings.value)

            console.log("Settings", settings.value)
        }
        // console.log("JSON",JSON.stringify(settings))
        // console.log("test1", settings.value)
        Encrypt(JSON.stringify(settings))
        // console.log("JSON",JSON.stringify(settings))
        // console.log("test", settings.value)


        const handleSubmit = async () => {
            console.log("test")
            console.log(settings.value.model, settings.value)
            Encrypt(settings.value)
        }


        return { Encrypt, settings, handleSubmit }
    }
}
</script>

<style></style>