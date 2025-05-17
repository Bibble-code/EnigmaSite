<template>
    <div v-if="settings.enigma">
        <form @submit.prevent="handleSubmit">

            <!-- Model Selection (Disabled) -->
            <div class="enigma-setting">
                <label>Modell:</label>
                <div class="dropdowns">
                    <select v-model.number="settings.enigma.model">
                        <option v-for="model in enigmaModels" :key="model.value" :value="model.value">
                            {{ model.label }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Reflector Selection (Disabled) -->
            <div class="enigma-setting">
                <label>Reflektor:</label>
                <div class="dropdowns">
                    <select v-model="settings.enigma.reflector">
                        <option v-for="r in reflectors" :key="r" :value="r">{{ r }}</option>
                    </select>
                </div>
            </div>

            <!-- Rotor Selection -->
            <div class="enigma-setting">
                <label>Walzenlage:</label>
                <div class="dropdowns">
                    <template v-for="index in 3" :key="'rotor-' + index">
                        <select v-model.number="settings.enigma.rotors[index - 1]">
                            <option v-for="r in rotorOptions" :key="r" :value="r">{{ r }}</option>
                        </select>
                        <span v-if="index < 3">|</span>
                    </template>
                </div>
            </div>

            <!-- Rotor Positions -->
            <div class="enigma-setting">
                <label>Walzenstellung:</label>
                <div class="dropdowns">
                    <template v-for="index in 3" :key="'position-' + index">
                        <select v-model.number="settings.enigma.positions[index - 1]">
                            <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                        <span v-if="index < 3">|</span>
                    </template>
                </div>
            </div>

            <!-- Ring Settings with Toggle -->
            <div class="enigma-setting">
                <label>Ringstellung:</label>
                <div class="dropdowns">
                    <template v-for="index in 3" :key="'ring-' + index">
                        <select v-model.number="settings.enigma.rings[index - 1]">
                            <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                        <span v-if="index < 3">|</span>
                    </template>
                </div>
            </div>

            <!-- Ring Settings with Toggle -->
            <div class="enigma-setting">
                <label>Steckbrett:</label>
                <div class="dropdowns">
                    <input v-model="settings.enigma.plugboard" type="text" placeholder="z.B. AB, QW, CD">
                </div>
            </div>
<!-- 
            <label>Eingabe:</label>
            <textarea v-model="settings.enigma.input"></textarea>

            <label>Ausgabe:</label>
            <textarea v-model="settings.enigma.output"></textarea>


            <div class="submit">
                <button>Verschlüsseln</button>
            </div> -->
            <div class="form-container">
                <!-- Left Section (Eingabe) -->
                <div class="form-section">
                    <div class="enigma-setting textarea-wrapper">
                        <label>Eingabe:</label>
                        <textarea 
                            ref="inputTextarea" 
                            v-model="settings.enigma.input" 
                            @input="syncTextareas"
                        ></textarea>
                    </div>
                </div>

                <!-- Center Section (Verschlüsseln Button) -->
                <div class="form-center">
                    <div class="submit">
                        <button type="submit">Verschlüsseln</button>
                    </div>
                </div>

                <!-- Right Section (Ausgabe) -->
                <div class="form-section">
                    <div class="enigma-setting textarea-wrapper">
                        <label>Ausgabe:</label>
                        <textarea 
                            ref="outputTextarea" 
                            v-model="settings.enigma.output" 
                            @input="syncTextareas"
                        ></textarea>
                    </div>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import { ref } from 'vue';

export default {
    setup() {
        const enigmaModels = [
            { value: 1, label: "I" },
            { value: 2, label: "II" },
            { value: 3, label: "III" },
            { value: 4, label: "IV" }
        ];

        const reflectors = ["A", "B", "C"];

        const rotorOptions = [1, 2, 3, 4, 5];
        const ringOptions = Array.from({ length: 26 }, (_, i) => i);  // Array from 0 to 25

        const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({
            value: i,
            label: `${String.fromCharCode(65 + i)} (${i})`
        }));


        const settings = ref({
            enigma: {
                model: 3,
                reflector: "B",
                rotors: [1, 2, 3],
                positions: [0, 0, 0],
                rings: [0, 0, 0],
                plugboard: "",
                input: "",
                output: ""
            }
        })
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
        }

        Encrypt(JSON.stringify(settings.value))

        const handleSubmit = async () => {
            console.log("submit")
            Encrypt(JSON.stringify(settings.value))
        }

        return {
            enigmaModels,
            reflectors,
            rotorOptions,
            ringOptions,
            alphabetOptions,

            Encrypt,
            settings,
            handleSubmit
        }
    }
}
</script>

<style>
.enigma-setting {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    /* text-align: right; */
}

.enigma-setting>label {
    width: 220px;
    /* or any size that fits your longest label */
    font-weight: bold;
    padding-top: 0.2rem;
}

.enigma-setting select,
.enigma-setting input[type="text"],
.enigma-setting input[type="number"] {
    min-width: 150px;
    padding: 0.3rem;
}

.enigma-setting select {
    min-width: 80px;
}

.enigma-setting button {
    margin-left: 0.5rem;
    padding: 0.3rem 0.6rem;
}

/* Stil für Eingabe und Ausgabe Textareas */
.enigma-setting textarea {
    width: 100%;
    height: 150px;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.dropdowns {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    flex: 1;
}

/* Wrapper für das gesamte Formular */
.form-container {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

/* Jede Sektion (Eingabe/Ausgabe) */
.form-section {
    flex: 1;
    display: flex;
    flex-direction: column;  /* Vertikale Ausrichtung */
    gap: 1rem;
}

/* Zentrierter Bereich für den Button */
.form-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0.2; /* Für zentrierten Bereich */
}


/* Neue Klasse für Textarea und Label */
.textarea-wrapper {
    display: flex;
    flex-direction: column; /* Label und Textarea vertikal anordnen */
    gap: 0.5rem; /* Abstand zwischen Label und Textarea */
    width: 100%; /* Textarea füllt den gesamten Container */
    box-sizing: border-box; /* sorgt dafür, dass Padding und Border in der Breite mitgerechnet werden */
}

.textarea-wrapper label {
    font-weight: bold;
    padding-bottom: 0.5rem; /* Abstand unter dem Label */
}

.textarea-wrapper textarea {
    width: 100%;  /* Textarea nimmt die gesamte Breite des Containers ein */
    min-height: 150px; /* Starthöhe für die Textareas */
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical; /* Nur vertikal veränderbar */
    box-sizing: border-box; /* Padding und Border innerhalb der Breite und Höhe des Elements */
}


.submit-btn {
    padding: 0.5rem 1rem;
    font-weight: bold;
    background-color: #4caf50;
    /* Green theme */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #45a049;
}

.submit-button {
    margin-top: 1.5rem;
}

/* Verschlüsseln Button */
.submit button {
    padding: 1rem 2rem;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit button:hover {
    background-color: #45a049;
}

/* Media Queries für kleinere Bildschirme */
@media (max-width: 768px) {
    .form-container {
        flex-direction: column;  /* Auf kleinen Bildschirmen unterbrechen wir das Layout in eine Spalte */
    }

    .form-section {
        flex: 1 1 100%;  /* Jede Sektion nimmt 100% der Breite ein */
        margin-bottom: 1rem;  /* Abstand zwischen den Abschnitten */
    }

    .form-center {
        flex: 0 1 auto;  /* Der Button bleibt zentriert, aber flexibel */
    }
}

</style>