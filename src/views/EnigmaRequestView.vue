<template>
    <div v-if="settings">
        <p>{{ settings }}</p>
        <form @submit.prevent="handleSubmit">

            <label>Modell: </label>
            <select v-model="settings.model">
                <option value=1>I</option>
                <option value=2>II</option>
                <option value=3>III</option>
                <option value=4>IV</option>
            </select>

            <label>Reflector:</label>
            <select v-model="settings.reflector">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>

            <div>
                <label>{{ settings.rotors[0] }}. Rotor:</label>
                <select v-model="settings.rotors[0]">
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
                <label>{{ settings.rotors[1] }}. Rotor:</label>
                <select v-model="settings.rotors[1]">
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
                <label>{{ settings.rotors[2] }}. Rotor:</label>
                <select v-model="settings.rotors[2]">
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
            </div>

            <div>
                <label>{{ settings.positions[0] }}. Position:</label>
                <select v-model="settings.positions[0]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
                <label>{{ settings.positions[1] }}. Position:</label>
                <select v-model="settings.positions[1]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
                <label>{{ settings.positions[2] }}. Position:</label>
                <select v-model="settings.positions[2]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
            </div>
            <div>
                <label>{{ settings.rings[0] }}. Ring:</label>
                <select v-model="settings.rings[0]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
                <label>{{ settings.rings[1] }}. Ring:</label>
                <select v-model="settings.rings[1]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
                <label>{{ settings.rings[2] }}. Ring:</label>
                <select v-model="settings.rings[2]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                </select>
            </div>
            <label>Steckbrett:</label>
            <input v-model="settings.plugboard" type="text">

            <label>Eingabe:</label>
            <textarea v-model="settings.input"></textarea>

            <label>Ausgabe:</label>
            <textarea v-model="settings.output"></textarea>


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
            model: "3",
            reflector: "B",
            rotors: ["1", "2", "3"],
            positions: ["0", "0", "0"],
            rings: ["0", "0", "0"],
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