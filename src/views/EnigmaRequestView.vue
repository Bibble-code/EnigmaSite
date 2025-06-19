<template>
    <div v-if="settings.enigma">
        <form @submit.prevent="handleSubmit">

            <div class="enigma-settings-wrapper">
                <!-- Model Selection (Disabled) -->
                <div class="enigma-setting">
                    <label>Modell:</label>
                    <div class="dropdowns">
                        <select v-model.number="selectedUiType_model">
                            <option v-for="model in enigmaModels" :key="model.value + model.label"
                                :value="model.uiType">
                                {{ model.label }}
                            </option>
                        </select>


                    </div>
                </div>

                <!-- Reflector Selection (Disabled) -->
                <div class="enigma-setting">
                    <label>Umkehrwalze:</label>
                    <div class="dropdowns">
                        <select v-model="settings.enigma.reflector">
                            <option v-for="r in reflectors" :key="r.value" :value="r.value">
                                {{ r.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Rotor Selection -->
                <div class="enigma-setting">
                    <label>Walzenlage:</label>
                    <div class="dropdowns">
                        <template v-for="index in rotorSpan" :key="'rotor-' + index">
                            <select v-model.number="settings.enigma.rotors[index - 1]">
                                <option v-for="r in getRotorOptions(index)" :key="r.value" :value="r.value">
                                    {{ r.label }}
                                </option>
                            </select>
                            <span v-if="index < rotorSpan">|</span>
                        </template>

                    </div>
                </div>

                <!-- Rotor Positions -->
                <div class="enigma-setting">
                    <label>Walzenstellung:</label>
                    <div class="dropdowns">
                        <template v-for="index in rotorSpan" :key="'position-' + index">
                            <select v-model.number="settings.enigma.positions[index - 1]">
                                <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                    {{ opt.label }}
                                </option>
                            </select>
                            <span v-if="index < rotorSpan">|</span>
                        </template>
                    </div>
                </div>


                <!-- Ring Settings with Toggle -->
                <div class="enigma-setting">
                    <label>Ringstellung:</label>
                    <div class="dropdowns">
                        <template v-for="index in rotorSpan" :key="'ring-' + index">
                            <select v-model.number="settings.enigma.rings[index - 1]"
                                :disabled="settings.enigma.model === 4 && index === 4">
                                <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                    {{ opt.label }}
                                </option>
                            </select>
                            <span v-if="index < rotorSpan">|</span>
                        </template>
                    </div>
                </div>


                <div class="enigma-setting">
                    <label>Steckerbrett:</label>
                    <div class="plugboard-container">
                        <input v-for="(pair, index) in plugboardPairs" :key="index" v-model="plugboardPairs[index]"
                            @input="onPlugboardInput(index)" maxlength="2" :disabled="selectedUiType_model === 2"
                            type="text" style="text-transform: uppercase;" />
                    </div>
                </div>
            </div>


            <div class="submit">
                <button>Verschlüsseln</button>
            </div>

            <div class="form-container">
                <!-- Left Section (Eingabe) -->
                <div class="form-section">
                    <div class="enigma-setting textarea-wrapper">
                        <label>Eingabe:</label>
                        <textarea ref="inputTextarea" v-model="settings.enigma.input" @input="sanitizeInput"
                            spellcheck="false">
            </textarea>

                    </div>

                </div>



                <!-- Right Section (Ausgabe) -->
                <div class="form-section">
                    <div class="enigma-setting textarea-wrapper">
                        <label>Ausgabe:</label>
                        <textarea ref="outputTextarea" v-model="enigma_output" @input="syncTextareas"></textarea>
                    </div>
                </div>
            </div>

        </form>
    </div>
</template>

<script setup>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import TooltipLabel from '@/components/TooltipLabel.vue';
import { ref, computed, watch } from 'vue';

// 1. === KONSTANTEN & STATISCHE OPTIONEN ===
const enigmaModels = [
    { value: 3, label: "I", uiType: 2 },
    { value: 3, label: "M3", uiType: 3 },
    { value: 4, label: "M4", uiType: 4 }
];

const reflectorOptionsByUiType = {
    2: [{ value: "A", label: "UKW A" }, { value: "B", label: "UKW B" }, { value: "C", label: "UKW C" }],
    3: [{ value: "B", label: "UKW B" }, { value: "C", label: "UKW C" }],
    4: [{ value: "b", label: "UKW B thin" }, { value: "c", label: "UKW C thin" }]
};

// Hilfsfunktion für römische Ziffern
function toRoman(num) {
    const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return romans[num - 1] || num.toString();
}

// Statische Optionen
const rotorOptions_m2 = [1, 2, 3, 4, 5].map(i => ({ value: i, label: toRoman(i) }));
const rotorOptions_m3 = [1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ value: i, label: toRoman(i) }));
const rotorOptions_m4 = [
    { value: 9, label: "Beta" },
    { value: 10, label: "Gamma" }
];

const defaultSettingsByUiType = {
    2: { model: 3, reflector: "B", rotors: [1, 2, 3], positions: [0, 0, 0], rings: [0, 0, 0], plugboard: "", input: "" },
    3: { model: 3, reflector: "B", rotors: [1, 2, 3], positions: [0, 0, 0], rings: [0, 0, 0], plugboard: "", input: "" },
    4: { model: 4, reflector: "b", rotors: [1, 2, 3, 9], positions: [0, 0, 0, 0], rings: [0, 0, 0, 0], plugboard: "", input: "" }
};

const ringOptions = Array.from({ length: 26 }, (_, i) => i);
const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({ value: i, label: `${String.fromCharCode(65 + i)} (${i})` }));

// 2. === REAKTIVE STATES ===
const defaultUiType = 3;
const settings = ref({ enigma: { ...defaultSettingsByUiType[defaultUiType], uiType: defaultUiType } });
const selectedModel = ref(settings.value.enigma.model);
const enigma_output = ref("");
const plugboardPairs = ref(Array(10).fill(""));

// 3. === COMPUTED PROPERTIES ===
const reflectors = computed(() => reflectorOptionsByUiType[selectedUiType_model.value] || []);

const selectedUiType_model = computed({
    get() {
        return settings.value.enigma.uiType ?? 3;
    },
    set(uiType) {
        const match = enigmaModels.find(m => m.uiType === uiType);
        if (!match) return;

        const model = uiType === 4 ? 4 : 3;

        settings.value.enigma = {
            ...defaultSettingsByUiType[uiType],
            input: settings.value.enigma?.input || "",
            output: settings.value.enigma?.output || "",
            model,
            uiType
        };
    }
});

const rotorSpan = computed(() => {
    const model = settings.value.enigma.model;
    settings.value.enigma.rotors = model === 4
        ? settings.value.enigma.rotors || [1, 2, 3, 9]
        : settings.value.enigma.rotors || [1, 2, 3];
    return model === 4 ? 4 : 3;
});

// 4. === WATCHER ===
watch(plugboardPairs, () => {
    settings.value.enigma.plugboard = plugboardPairs.value.join('');
}, { deep: true });

watch(selectedUiType_model, () => {
    plugboardPairs.value = Array(10).fill("");
});

watch(selectedUiType_model, (newVal) => {
    const enigma = settings.value.enigma;
    if (newVal === 2 || newVal === 3) {
        enigma.reflector = "B";
    } else if (newVal === 4) {
        enigma.reflector = "b";
    } else {
        enigma.reflector = null;
    }
});

// 5. === METHODEN ===
const getRotorOptions = (index) => {
    const uiType = selectedUiType_model.value;
    if (uiType === 2) return rotorOptions_m2;
    if (uiType === 3) return rotorOptions_m3;
    if (uiType === 4) return index === 4 ? rotorOptions_m4 : rotorOptions_m3;
    return [];
};

const handleModelChange = (event) => {
    const selectedLabel = event.target.options[event.target.selectedIndex].text;
    const match = enigmaModels.find(m => m.label === selectedLabel);
    if (match) {
        const uiType = match.uiType;
        settings.value.enigma = {
            ...defaultSettingsByUiType[uiType],
            input: settings.value.enigma.input,
            output: settings.value.enigma.output,
            model: match.value,
            uiType
        };
        selectedModel.value = match.value;
    }
};

const Encrypt = async (data) => {
    try {
        const response = await BackendEnigma.getEncryption(data);
        enigma_output.value = response.data.output;
    } catch (error) {
        console.error(error);
    }
};

const handleSubmit = async () => {
    let plugboard = settings.value.enigma.plugboard || "";

    if (plugboard.length % 2 !== 0) {
        plugboard = plugboard.slice(0, -1);
        settings.value.enigma.plugboard = plugboard;

        const chars = plugboard.match(/.{1,2}/g) || [];
        plugboardPairs.value = Array(10).fill("").map((_, i) => chars[i] || "");
    }

    await Encrypt(JSON.stringify(settings.value));
};

const onPlugboardInput = (index) => {
    let value = plugboardPairs.value[index].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
    let uniqueChars = [...new Set(value)].join("");

    const allOtherChars = plugboardPairs.value
        .filter((_, i) => i !== index)
        .join("")
        .split("");

    const filteredValue = [...uniqueChars].filter(char => !allOtherChars.includes(char)).join("");
    plugboardPairs.value[index] = filteredValue;
};

const sanitizeInput = (event) => {
    settings.value.enigma.input = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");
};


</script>



<style>
.enigma-setting {
    width: 100%;
    max-width: 600px;
    /* Begrenze die Breite sinnvoll */
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.enigma-setting>label {
    width: 220px;
    /* or any size that fits your longest label */
    font-weight: bold;
    padding-top: 0.2rem;
}

.enigma-setting select,
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

.enigma-settings-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* zentriert horizontal */
    justify-content: center;
    width: 100%;
    padding: 1rem;
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
    flex-direction: column;
    /* Vertikale Ausrichtung */
    gap: 1rem;
}

/* Zentrierter Bereich für den Button */
.form-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0.2;
    /* Für zentrierten Bereich */
}


/* Neue Klasse für Textarea und Label */
.textarea-wrapper {
    display: flex;
    flex-direction: column;
    /* Label und Textarea vertikal anordnen */
    gap: 0.5rem;
    /* Abstand zwischen Label und Textarea */
    width: 100%;
    /* Textarea füllt den gesamten Container */
    box-sizing: border-box;
    /* sorgt dafür, dass Padding und Border in der Breite mitgerechnet werden */
}

.textarea-wrapper label {
    font-weight: bold;
    padding-bottom: 0.5rem;
    /* Abstand unter dem Label */
}

.textarea-wrapper textarea {
    width: 100%;
    /* Textarea nimmt die gesamte Breite des Containers ein */
    min-height: 150px;
    /* Starthöhe für die Textareas */
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
    /* Nur vertikal veränderbar */
    box-sizing: border-box;
    /* Padding und Border innerhalb der Breite und Höhe des Elements */
}



.submit-button {
    margin-top: 1.5rem;
}

/* Verschlüsseln Button */
.submit button {
    padding: 1.2rem 2.5rem;
    /* größerer Innenabstand für Größe */
    font-size: 1.2rem;
    /* größere Schrift */
    margin: 2rem 0;
    /* Abstand oben und unten */
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    /* etwas stärker abgerundet */
    cursor: pointer;
}


.submit button:hover {
    background-color: #45a049;
}

/* Media Queries für kleinere Bildschirme */
@media (max-width: 768px) {
    .form-container {
        flex-direction: column;
        /* Auf kleinen Bildschirmen unterbrechen wir das Layout in eine Spalte */
    }

    .form-section {
        flex: 1 1 100%;
        /* Jede Sektion nimmt 100% der Breite ein */
        margin-bottom: 1rem;
        /* Abstand zwischen den Abschnitten */
    }

    .form-center {
        flex: 0 1 auto;
        /* Der Button bleibt zentriert, aber flexibel */
    }
}

.plugboard-container {
    display: grid;
    grid-template-columns: repeat(5, 46px);
    /* 5 Spalten à 30px */
    gap: 12px;
    max-width: calc(5 * 46px + 4 * 12px);
    /* = 150px + 32px = 182px */
    box-sizing: border-box;
}
</style>