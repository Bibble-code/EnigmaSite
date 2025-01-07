<template>
    <div v-if="settings">
        <p>{{ settings }}</p>
        <form @submit.prevent="handleSubmit">

            <label>Modell: </label>
            <select v-model="settings.enigma.model">
                <option value=1>I</option>
                <option value=2>II</option>
                <option value=3>III</option>
                <option value=4>IV</option>
            </select>

            <label>Reflector:</label>
            <select v-model="settings.enigma.reflector">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>

            <div>
                <label>{{ settings.enigma.rotors[0] }}. Rotor:</label>
                <select v-model="settings.enigma.rotors[0]">
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
                <label>{{ settings.enigma.rotors[1] }}. Rotor:</label>
                <select v-model="settings.enigma.rotors[1]">
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
                <label>{{ settings.enigma.rotors[2] }}. Rotor:</label>
                <select v-model="settings.enigma.rotors[2]">
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
            </div>

            <div>
                <label>{{ settings.enigma.positions[0] }}. Position:</label>
                <select v-model="settings.enigma.positions[0]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
                <label>{{ settings.enigma.positions[1] }}. Position:</label>
                <select v-model="settings.enigma.positions[1]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
                <label>{{ settings.enigma.positions[2] }}. Position:</label>
                <select v-model="settings.enigma.positions[2]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
            </div>
            <div>
                <label>{{ settings.enigma.rings[0] }}. Ring:</label>
                <select v-model="settings.enigma.rings[0]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
                <label>{{ settings.enigma.rings[1] }}. Ring:</label>
                <select v-model="settings.enigma.rings[1]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
                <label>{{ settings.enigma.rings[2] }}. Ring:</label>
                <select v-model="settings.enigma.rings[2]">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=2>2</option>
                    <option value=3>3</option>
                    <option value=4>4</option>
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                </select>
            </div>
            <!-- <label>Steckbrett:</label>
            <input v-model="settings.enigma.plugboard" type="text"> -->

            <!-- <label>Eingabe:</label>
            <textarea v-model="settings.enigma.input"></textarea>

            <label>Ausgabe:</label>
            <textarea v-model="settings.enigma.output"></textarea> -->


            <div class="submit">
                <button>Zyklen erzeugen</button>
            </div>
        </form>
        <div>
            <p>Zyklen des ersten Rotors: {{ first_rotor_cycle }}</p>
            <p>Zyklen des zweiten Rotors: {{ second_rotor_cycle }}</p>
            <p>Zyklen des dritten Rotors: {{ third_rotor_cycle }}</p>
        </div>
    </div>



</template>

<script>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import { ref } from 'vue';

export default {
    setup() {


        const settings = ref({
            enigma: {
                model: "3",
                reflector: "B",
                rotors: ["2", "5", "3"],
                positions: ["0", "0", "0"],
                rings: ["0", "0", "0"],
                plugboard: "",
                input: "",
                output: ""
            },
            parameters: {
                "daily-key-count": "200"
            }
        })

        const first_rotor_cycle = ref(0)
        const second_rotor_cycle = ref(0)
        const third_rotor_cycle = ref(0)

        const res = ref()




        const Cyclometer = async (data) => {
            console.log("before", settings.value)

            try {
                const response = await BackendEnigma.getCyclometer(data)
                res.value = response.data
                console.log("res.value", res.value)

                first_rotor_cycle.value = response.data.first_rotor
                second_rotor_cycle.value = response.data.second_rotor
                third_rotor_cycle.value = response.data.third_rotor
            } catch (error) {
                console.log("error", error)
            }

            //console.log("response",response)
            //console.log("responsedata",response.data.parsedBody._value)
            // console.log("settingsvalue", settings.value)
            // console.log("settings", settings)
            // 
            //console.log("response", response.data)
            // console.log("response.data", response.data)




            //settings.value = response.data
            //console.log("after   ", settings.value)

            // console.log("Settings", settings.value)
        }
        // console.log("JSON",JSON.stringify(settings))
        // console.log("test1", settings.value)
        Cyclometer(JSON.stringify(settings.value))
        // console.log("JSON",JSON.stringify(settings))
        // console.log("test", settings.value)


        const handleSubmit = async () => {
            console.log("submit")
            Cyclometer(JSON.stringify(settings.value))
        }


        return { Cyclometer, settings, handleSubmit, first_rotor_cycle, second_rotor_cycle, third_rotor_cycle }
    }
}
</script>

<style></style>