<template>
    <div v-if="settings.enigma">
        <form @submit.prevent="handleSubmit">
            <div class="left-form-content">
                <div class="enigma-settings-wrapper">

                    <MultiSelectWithCheckbox label="Modell:"
                        info="Model I und M3 unterscheiden sich nur im Walzensatz und den verfügbaren Umkehrwalzen (UKWs). Model M4 hat 4 Walzen und eigene UKWs."
                        :options="enigmaModels" v-model="uiType" :selectCount="1" />

                    <MultiSelectWithCheckbox label="Umkehrwalze:"
                        info="Die verfügbaren Umkehrwalzen (UKW) unterscheiden sich je nach Enigma-Modell."
                        :options="reflectors" v-model="settings.enigma.reflector" :selectCount="1" />


                    <MultiSelectWithCheckbox label="Walzenlage:"
                        info="Hier wird die Reihenfolge der Walzen eingestellt. In der Simulation sind auch doppelte Walzen möglich."
                        :options="rotorOptions" v-model="settings.enigma.rotors" :selectCount="rotorSpan" />

                    <MultiSelectWithCheckbox label="Walzenstellung:"
                        info="Hier wird die Startposition der Walzen eingestellt." :options="alphabetOptions"
                        v-model="settings.enigma.positions" :selectCount="rotorSpan" />
                    <MultiSelectWithCheckbox label="Ringstellung:"
                        info="Hier wird die Ringstellung der Walzen eingestellt, also die Verdrehung zwischen der inneren und äußeren Verdrahtung. Die vierte Walze besitzt keine einstellbare Ringstellung."
                        :options="alphabetOptions" v-model="ringsFirstThree" :selectCount="3" />

                    <LabeledPlugboard v-model="settings.enigma.plugboard" label="Steckerbrett:"
                        info="Das Steckerbrett vertauscht Buchstaben. Auf die charakteristischen Zyklen hat das keinen Einfluss." />

                </div>


                <div class="submit">
                    <button>Verschlüsseln</button>
                </div>

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
import MultiSelectWithCheckbox from '../components/MultiSelectWithCheckbox.vue';
import LabeledPlugboard from '../components/LabeledPlugboard.vue';
import { ref, computed, watch, reactive } from 'vue';

// 1. === KONSTANTEN & STATISCHE OPTIONEN ===
const enigmaModels = [
    { value: 2, label: "I" },
    { value: 3, label: "M3" },
    { value: 4, label: "M4" }
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
const uiType = ref(defaultUiType);


const settings = reactive({
    enigma: {
        ...defaultSettingsByUiType[defaultUiType]
    }
});

const enigma_output = ref("");


// 3. === COMPUTED PROPERTIES ===

const rotorSpan = computed(() => {
    return settings.enigma.model === 4 ? 4 : 3;
});


const reflectors = computed(() => reflectorOptionsByUiType[uiType.value] || []);

const rotorOptions = computed(() => {
    const currentUiType = Number(uiType.value);

    if (currentUiType === 2) return [rotorOptions_m2, rotorOptions_m2, rotorOptions_m2];
    if (currentUiType === 3) return [rotorOptions_m3, rotorOptions_m3, rotorOptions_m3];
    if (currentUiType === 4) return [rotorOptions_m3, rotorOptions_m3, rotorOptions_m3, rotorOptions_m4];

    console.warn("Unexpected uiType value:", currentUiType);
    return [];
});

const ringsFirstThree = computed({
    get() {
        return settings.enigma.rings.slice(0, 3)
    },
    set(newVals) {
        // Hier die ersten 3 Werte aktualisieren, 4. Wert bleibt unverändert
        settings.enigma.rings = [
            ...newVals,
            settings.enigma.rings[3] // 4. Wert bleibt gleich
        ]
    }
})



// 4. === WATCHER ===
watch(uiType, (newUiType) => {
    const defaults = defaultSettingsByUiType[newUiType];
    if (!defaults) return;

    settings.enigma.model = defaults.model;
    settings.enigma.reflector = defaults.reflector;
    settings.enigma.rotors.splice(0, settings.enigma.rotors.length, ...defaults.rotors);
    settings.enigma.positions.splice(0, settings.enigma.positions.length, ...defaults.positions);
    settings.enigma.rings.splice(0, settings.enigma.rings.length, ...defaults.rings);
});


// 5. === METHODEN ===

const Encrypt = async (data) => {
    try {
        const response = await BackendEnigma.getEncryption(data);
        enigma_output.value = response.data.output;
    } catch (error) {
        console.error(error);
    }
};

const handleSubmit = async () => {
    let plugboard = settings.enigma.plugboard || "";

    if (plugboard.length % 2 !== 0) {
        plugboard = plugboard.slice(0, -1);
        settings.enigma.plugboard = plugboard;
    }

    await Encrypt(JSON.stringify(settings));
};


const sanitizeInput = (event) => {
    settings.enigma.input = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");
};


</script>


<style>
.enigma-setting {
    display: grid;
    grid-template-columns: 170px 1fr;
    align-items: start;
    gap: 0.5rem 1.5rem;
    margin-bottom: 1.5rem;
}

.enigma-setting>label {
    font-weight: bold;
    padding-top: 0.4rem;
    text-align: left;
}

.enigma-setting select,
.enigma-setting input[type="number"] {
    min-width: 80px;
    padding: 0.3rem;
}


.enigma-setting button {
    margin-left: 0.5rem;
    padding: 0.3rem 0.6rem;
}

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




.form-container {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 100%;
}
</style>

<style scoped>
/* Stil für Eingabe und Ausgabe Textareas */

/* Wrapper für das gesamte Formular */

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
</style>