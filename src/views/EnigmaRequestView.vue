<template>
    <div v-if="settings.enigma">
        <p>{{ settings.enigma }}</p>
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
                <label>Erste Walze: </label>
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
                <label>Zweite Walze: </label>
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
                <label>Dritte Walze: </label>
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
                <label>Erste Walzenlage: </label>
                <select v-model="settings.enigma.positions[0]">
                    <option value=0>A</option>
                    <option value=1>B</option>
                    <option value=2>C</option>
                    <option value=3>D</option>
                    <option value=4>E</option>
                    <option value=5>F</option>
                    <option value=6>G</option>
                    <option value=7>H</option>
                    <option value=8>I</option>
                    <option value=9>J</option>
                    <option value=10>K</option>
                    <option value=11>L</option>
                    <option value=12>M</option>
                    <option value=13>N</option>
                    <option value=14>O</option>
                    <option value=15>P</option>
                    <option value=16>Q</option>
                    <option value=17>R</option>
                    <option value=18>S</option>
                    <option value=19>T</option>
                    <option value=20>U</option>
                    <option value=21>V</option>
                    <option value=22>W</option>
                    <option value=23>X</option>
                    <option value=24>Y</option>
                    <option value=25>Z</option>

                </select>
                <label>Zweite Walzenlage: </label>
                <select v-model="settings.enigma.positions[1]">
                    <option value=0>A</option>
                    <option value=1>B</option>
                    <option value=2>C</option>
                    <option value=3>D</option>
                    <option value=4>E</option>
                    <option value=5>F</option>
                    <option value=6>G</option>
                    <option value=7>H</option>
                    <option value=8>I</option>
                    <option value=9>J</option>
                    <option value=10>K</option>
                    <option value=11>L</option>
                    <option value=12>M</option>
                    <option value=13>N</option>
                    <option value=14>O</option>
                    <option value=15>P</option>
                    <option value=16>Q</option>
                    <option value=17>R</option>
                    <option value=18>S</option>
                    <option value=19>T</option>
                    <option value=20>U</option>
                    <option value=21>V</option>
                    <option value=22>W</option>
                    <option value=23>X</option>
                    <option value=24>Y</option>
                    <option value=25>Z</option>
                </select>
                <label>Dritte Walzenalge: </label>
                <select v-model="settings.enigma.positions[2]">
                    <option value=0>A</option>
                    <option value=1>B</option>
                    <option value=2>C</option>
                    <option value=3>D</option>
                    <option value=4>E</option>
                    <option value=5>F</option>
                    <option value=6>G</option>
                    <option value=7>H</option>
                    <option value=8>I</option>
                    <option value=9>J</option>
                    <option value=10>K</option>
                    <option value=11>L</option>
                    <option value=12>M</option>
                    <option value=13>N</option>
                    <option value=14>O</option>
                    <option value=15>P</option>
                    <option value=16>Q</option>
                    <option value=17>R</option>
                    <option value=18>S</option>
                    <option value=19>T</option>
                    <option value=20>U</option>
                    <option value=21>V</option>
                    <option value=22>W</option>
                    <option value=23>X</option>
                    <option value=24>Y</option>
                    <option value=25>Z</option>
                </select>
            </div>
            <div>
                <label>1. Ring: </label>
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
                <label>2. Ring: </label>
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
                <label>3. Ring: </label>
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
            <label>Steckbrett:</label>
            <input v-model="settings.enigma.plugboard" type="text">

            <label>Eingabe:</label>
            <textarea v-model="settings.enigma.input"></textarea>

            <label>Ausgabe:</label>
            <textarea v-model="settings.enigma.output"></textarea>


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
            enigma: {
                model: "3",
                reflector: "B",
                rotors: ["1", "2", "3"],
                positions: ["0", "0", "0"],
                rings: ["0", "0", "0"],
                plugboard: "",
                input: "TEST",
                output: ""
            }
        })


        // const settings = ref({
        //     model: "3",
        //     reflector: "B",
        //     rotors: ["1", "2", "3"],
        //     positions: ["0", "0", "0"],
        //     rings: ["0", "0", "0"],
        //     plugboard: "",
        //     input: "TEST",
        //     output: "ASDF"
        // })


        const Encrypt = async (data) => {
            

            try {
                const response = await BackendEnigma.getEncryption(data)
                console.log("before", settings.value)
                settings.value = response.data
                console.log("after   ", settings.value)
                console.log("enigma", response.data)

            } catch (error) {
                console.log(error)
            }

            //console.log("response",response)
            //console.log("responsedata",response.data.parsedBody._value)
            // console.log("settingsvalue", settings.value)
            // console.log("settings", settings)
            // console.log("response", response)
            // console.log("response.data", response.data)



            // console.log("Settings", settings.value)
        }
        // console.log("JSON",JSON.stringify(settings))
        // console.log("test1", settings.value)
        Encrypt(JSON.stringify(settings.value))
        // console.log("JSON",JSON.stringify(settings))
        // console.log("test", settings.value)


        const handleSubmit = async () => {
            console.log("submit")
            Encrypt(JSON.stringify(settings.value))
        }


        return { Encrypt, settings, handleSubmit }
    }
}
</script>

<style></style>