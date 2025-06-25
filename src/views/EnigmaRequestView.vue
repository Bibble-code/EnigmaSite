<template>
    <div v-if="settings.enigma">
        <form @submit.prevent="handleSubmit">
            <div class="enigma">
                <div class="left-form form-box">

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

<SubmitButton :disabled="!settings.enigma.input" :loading="isLoading">Verschlüsseln</SubmitButton>




                </div>

                            <div class="right-form">
                <!-- Left Section (Eingabe) -->
                <div class="text-box">
                    <div class="textarea-wrapper">
                        <label>Eingabe:</label>
                        <textarea ref="inputTextarea" v-model="settings.enigma.input" @input="sanitizeInput"
                            spellcheck="false">
                        </textarea>

                    </div>

                </div>

                                <div class="arrow-container">
                    <svg width="160" height="20" viewBox="0 0 160 20" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="0,0 160,0 80,20" fill="#444" />
                    </svg>
                </div>



                <!-- Right Section (Ausgabe) -->
                <div class="text-box">
                    <div class="textarea-wrapper">
                        <label>Ausgabe:</label>
                        <textarea ref="outputTextarea" v-model="enigma_output" @input="syncTextareas"></textarea>
                    </div>
                </div>
            </div>


            </div>




        </form>
    </div>
</template>

<script setup>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import MultiSelectWithCheckbox from '../components/MultiSelectWithCheckbox.vue';
import LabeledPlugboard from '../components/LabeledPlugboard.vue';
import { ref, computed, watch, reactive } from 'vue';
import SubmitButton from '../components/SubmitButton.vue';

// 1. === KONSTANTEN & STATISCHE OPTIONEN ===
const enigmaModels = [
    { value: 2, label: "I" },
    { value: 3, label: "M3" },
    { value: 4, label: "M4" }
];


const reflectorOptionsByUiType = {
    2: [{ value: "A", label: "UKW A" }, { value: "B", label: "UKW B" }, { value: "C", label: "UKW C" }],
    3: [{ value: "B", label: "UKW B" }, { value: "C", label: "UKW C" }],
    4: [{ value: "b", label: "UKW b" }, { value: "c", label: "UKW c" }]
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

const isLoading = ref(false);

const handleSubmit = async () => {
    isLoading.value = true;

    let plugboard = settings.enigma.plugboard || "";

    if (plugboard.length % 2 !== 0) {
        plugboard = plugboard.slice(0, -1);
        settings.enigma.plugboard = plugboard;
    }

    try {
        await Encrypt(JSON.stringify(settings));
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
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


.arrow-container {
    flex: 0 0 50px;
    /* feste Breite */
    padding: 0rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

.arrow-container.bottom-arrow {
    margin: 1rem auto 0 auto;
    /* oben Abstand, horizontal zentriert */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<style scoped>
/* Stil für Eingabe und Ausgabe Textareas */
.enigma {
  display: flex;
  gap: 2rem;
  align-items: stretch;  /* wichtig */
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto 0 auto;
  height: auto;
}


.form-box {
    display: flex;
    flex-direction: column;
    background-color: #f5f7fa;
    border: 1px solid #bbb;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    min-height: 100%;
    max-width: 100%;
    width: fit-content;

}

.text-box {
        display: flex;
    flex-direction: column;
    background-color: #f5f7fa;
    border: 1px solid #bbb;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  flex: 1;
  height: 100%;
    min-height: 0;  /* wichtig, um Überlauf zu verhindern */
}

.left-form {
    min-width: 560px;
}

.right-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: auto;         /* oder nichts setzen */
}





/* Wrapper für das gesamte Formular */
.textarea-wrapper textarea {
  flex: 1;
  padding: 1rem;
  font-size: 1.1rem;
  line-height: 1.5;
  font-family: monospace;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  box-sizing: border-box;
}



/* Neue Klasse für Textarea und Label */
.textarea-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.textarea-wrapper label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}



/* Media Queries für kleinere Bildschirme */
@media (max-width: 768px) {

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