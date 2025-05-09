<template>
    <div v-if="settings">
        <p>{{ settings }}</p>
        <form @submit.prevent="handleCyclometer">

            <label>Modell: </label>
            <select v-model="settings.enigma.model">
                <option value=1>I</option>
                <option value=2>II</option>
                <option value=3>III</option>
                <option value=4>IV</option>
            </select>

            <label>Reflector: </label>
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
            <label>Anzahl der Abgefangenen Tagesschlüssel: </label>
            <input v-model="settings.parameters.daily_key_count" type="text">


            <div v-for="(key, index) in settings.parameters.manual_keys" :key="index" style="margin-bottom: 1rem;">
                <label>Key {{ index + 1 }}</label>
                <br />
                <input ref="manualKeyInput" type="text" v-model="settings.parameters.manual_keys[index]"
                    :class="{ invalid: !isValidKey(key) }" maxlength="6" @input="formatKey(index)"
                    @keydown.enter.prevent="addManualKey" />
                <br />
                <button @click="deleteManualKey(index)">Delete</button>
            </div>
            <button @click="addManualKey" type="button">Add Key</button>


            <div class="submit">
                <button type="submit">Zyklen erzeugen</button>
            </div>
        </form>
        <div>
            <p>Zyklen des ersten Rotors: {{ first_rotor_cycle }}</p>
            <p>Zyklen des zweiten Rotors: {{ second_rotor_cycle }}</p>
            <p>Zyklen des dritten Rotors: {{ third_rotor_cycle }}</p>

        </div>
        <div v-if="cataloguerequest">
            <form @submit.prevent="handleCatalogue">
                <div>
                    <p>Zyklen des ersten Rotors: {{ cataloguerequest.cycles.one_to_four_permut }}</p>
                    <p>Zyklen des zweiten Rotors: {{ cataloguerequest.cycles.two_to_five_permut }}</p>
                    <p>Zyklen des dritten Rotors: {{ cataloguerequest.cycles.three_to_six_permut }}</p>
                </div>
                <label>Anzahl der Seiten: </label>
                <input v-model="cataloguerequest.parameters.page" type="text">

                <div class="submit">
                    <button>Katalog:</button>
                </div>
            </form>
        </div>
    </div>
    <div v-if="catalogueres">
        <div v-if="catalogueres.content">
            <p v-for="object in catalogueres.content" :key="object.id">
                rotor_position: {{ object.enigmaConfiguration.rotor_position }},
                rotor_order: {{ object.enigmaConfiguration.rotor_order }},
                1to4: {{ object.cycles.one_to_four_permut }},
                2to5: {{ object.cycles.two_to_five_permut }},
                3to6: {{ object.cycles.three_to_six_permut }}
            </p>
        </div>
    </div>


</template>

<script>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import { ref, nextTick, getCurrentInstance } from 'vue';

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
                daily_key_count: "200",
                manual_keys: [""]
            }
        })

        const inputRefs = ref([]) // Refs to the input fields

        console.log("Csettings111")
        console.log(settings.value)

        const first_rotor_cycle = ref(0)
        const second_rotor_cycle = ref(0)
        const third_rotor_cycle = ref(0)

        const res = ref()

        const catalogueres = ref()

        const cataloguerequest = ref({
            cycles: {
                one_to_four_permut: ["13", "13"],
                two_to_five_permut: ["13", "13"],
                three_to_six_permut: ["13", "13"]
            },
            parameters: {
                page: "1"
            }
        })
        console.log("catalogue_req111")
        console.log(cataloguerequest.value)
        console.log(cataloguerequest.value.cycles)

        const Cyclometer = async (data) => {
            console.log("before", settings.value)

            try {
                const response = await BackendEnigma.getCyclometer(data)
                res.value = response.data
                console.log("res.value", res.value)

                first_rotor_cycle.value = response.data.computedCycles.one_to_four_permut
                second_rotor_cycle.value = response.data.computedCycles.two_to_five_permut
                third_rotor_cycle.value = response.data.computedCycles.three_to_six_permut
                cataloguerequest.value.cycles.one_to_four_permut = response.data.computedCycles.one_to_four_permut
                cataloguerequest.value.cycles.two_to_five_permut = response.data.computedCycles.two_to_five_permut
                cataloguerequest.value.cycles.three_to_six_permut = response.data.computedCycles.three_to_six_permut
            } catch (error) {
                console.log("error", error)
            }

        }

        const Catalogue = async (data) => {
            console.log("before", cataloguerequest.value)

            try {
                const resp = await BackendEnigma.getCatalogue(data)
                catalogueres.value = resp.data
                console.log("catalogueres.value", catalogueres.value)
                console.log("catalogueres.value.content0", catalogueres.value.content[0])

            } catch (error) {
                console.log("error", error)
            }

        }

        const handleCyclometer = async () => {
            console.log("submit")
            filterValidKeys()
            console.log("Filtered keys to submit:", settings.value.parameters.manual_keys)
            Cyclometer(JSON.stringify(settings.value))
        }

        const handleCatalogue = async () => {
            console.log("Catalogue")
            console.log(cataloguerequest.value)
            Catalogue(JSON.stringify(cataloguerequest.value))
        }

        const instance = getCurrentInstance()
        const addManualKey = async () => {
            settings.value.parameters.manual_keys.push("")
            await nextTick()

            const inputs = instance.refs.manualKeyInput
            const lastInput = Array.isArray(inputs) ? inputs[inputs.length - 1] : inputs
            if (lastInput) lastInput.focus()
        }

        const deleteManualKey = (index) => {
            settings.value.parameters.manual_keys.splice(index, 1)
        }

        // Same regex as backend
        const isValidKey = (key) => {
            const regex = /^([A-Z])([A-Z])([A-Z])\1\2\3$/
            return regex.test(key)
        }

        const filterValidKeys = () => {
            settings.value.parameters.manual_keys = settings.value.parameters.manual_keys.filter(isValidKey)
        }

        const formatKey = (index) => {
            // Force uppercase letters only
            const val = settings.value.parameters.manual_keys[index]
            settings.value.parameters.manual_keys[index] = val.toUpperCase().replace(/[^A-Z]/g, "")
        }

        return { Cyclometer, settings, handleCyclometer, handleCatalogue, first_rotor_cycle, second_rotor_cycle, third_rotor_cycle, catalogueres, cataloguerequest, addManualKey, deleteManualKey, isValidKey, formatKey, inputRefs }
    }
}
</script>

<style scoped>
.invalid {
    background-color: lightcoral;
    /* Light red background for invalid keys */
}
</style>