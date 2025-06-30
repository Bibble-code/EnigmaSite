<template>
    <div v-if="settings.enigma">
        <form @submit.prevent="handleSubmit">
            <div class="enigma">
                <div class="left-form form-box">

                    <ReverseMultiSelect v-model:single="uiType" :singleOptions="enigmaModels" label="Modell:"
                        info="Model I (Wehrmacht) und M3 (Marine) unterscheiden sich nur im Walzensatz und den verfügbaren Umkehrwalzen (UKWs). Model M4 (Uboot-Flotte) hat 4 Walzen und eigene UKWs.   Die verfügbaren Umkehrwalzen (UKW) unterscheiden sich je nach Enigma-Modell."
                        s />
                    <ReverseMultiSelect v-model:single="settings.enigma.reflector" :singleOptions="reflectors"
                        v-model:array="settings.enigma.rotors" :arrayOptions="rotorOptions" label="Walzenlage:"
                        info="Hier wird die Reihenfolge der Walzen eingestellt. In der Simulation sind auch doppelte Walzen möglich. Anordnung [schnelle Walze, mittlere Walze, langsame Walze]" />
                    <ReverseMultiSelect v-model:array="settings.enigma.positions" :arrayOptions="alphabetOptions"
                        label="Walzenstellung:" info="Hier wird die Startposition der Walzen eingestellt." />

                    <ReverseMultiSelect v-model:array="ringsFirstThree" :arrayOptions="alphabetOptions"
                        label="Ringstellung:"
                        info="Hier wird die Ringstellung der Walzen eingestellt, also die Verdrehung zwischen der inneren und äußeren Verdrahtung. Die vierte Walze besitzt keine einstellbare Ringstellung." />


                    <LabeledPlugboard v-model="settings.enigma.plugboard" label="Steckerbrett:"
                        info="Das Steckerbrett vertauscht Buchstaben. Auf die charakteristischen Zyklen hat das keinen Einfluss." />

                    <SubmitButton :disabled="!settings.enigma.input" :loading="isLoading">
                        {{ settings.enigma.input ? 'Verschlüsseln' : 'Bitte Text eingeben' }}
                    </SubmitButton>

                </div>

                <div class="right-form">
                    <!-- Left Section (Eingabe) -->
                    <div class="text-box">
                        <div class="textarea-wrapper">
                            <!-- Eingabe Controls -->
                            <div class="controls-row">
                                <label>Eingabe:</label>

                                <label class="font-label">
                                    Schrift:
                                    <input type="range" min="10" max="35" v-model="inputFontSize"
                                        style="width: 100px;" />
                                    <input type="number" min="10" max="35" v-model="inputFontSize" class="font-input" />
                                    px
                                </label>

                                <ToggleSwitch v-model="inputIsUpperCase">
                                    {{ inputIsUpperCase ? 'Groß' : 'Klein' }}
                                </ToggleSwitch>
                            </div>

                            <textarea ref="inputTextarea" v-model="settings.enigma.input" @input="sanitizeInput"
                                spellcheck="false" :style="{
                                    fontSize: inputFontSize + 'px',
                                    minWidth: '550px',
                                    resize: 'horizontal'
                                }" />
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
                            <div class="controls-row">
                                <label>Ausgabe:</label>

                                <label class="font-label">
                                    Schrift:
                                    <input type="range" min="10" max="35" v-model="outputFontSize"
                                        style="width: 100px;" />
                                    <input type="number" min="10" max="35" v-model="outputFontSize"
                                        class="font-input" />
                                    px
                                </label>

                                <ToggleSwitch v-model="outputIsUpperCase">
                                    {{ outputIsUpperCase ? 'Groß' : 'Klein' }}
                                </ToggleSwitch>
                            </div>

                            <textarea ref="outputTextarea" v-model="enigma_output" readonly class="output-textarea"
                                tabindex="-1" :style="{ fontSize: outputFontSize + 'px' }" />

                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div class="scroll-buffer"></div>
</template>

<script setup>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import LabeledPlugboard from '../components/LabeledPlugboard.vue';
import SubmitButton from '../components/SubmitButton.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import ReverseMultiSelect from '../components/ReverseMultiSelect.vue';
import { useToast } from 'vue-toastification'
import { debounce } from "lodash";

import { ref, computed, watch, reactive, nextTick } from 'vue';


// 1. === KONSTANTEN & STATISCHE OPTIONEN ===

const toast = useToast()
const enigmaModels = [
    { value: 2, label: "Enigma Ⅰ der Wehrmacht" },
    { value: 3, label: "Enigma M3 der Kriegsmarine" },
    { value: 4, label: "Enigma M4 der U-Boot-Flotte" }
];

const reflectorOptionsByUiType = {
    2: [{ value: "A", label: "Umkehrwalze A" }, { value: "B", label: "Umkehrwalze B" }, { value: "C", label: "Umkehrwalze C" }],
    3: [{ value: "B", label: "Umkehrwalze B" }, { value: "C", label: "Umkehrwalze C" }],
    4: [{ value: "b", label: "UKW b" }, { value: "c", label: "UKW c" }]
};

// Hilfsfunktion für römische Ziffern
function toRoman(num) {
    const romanUnicode = [
        "Ⅰ", // U+2160
        "Ⅱ", // U+2161
        "Ⅲ", // U+2162
        "Ⅳ", // U+2163
        "Ⅴ", // U+2164
        "Ⅵ", // U+2165
        "Ⅶ", // U+2166
        "Ⅷ", // U+2167
        "Ⅸ", // U+2168
        "Ⅹ"  // U+2169
    ];
    return romanUnicode[num - 1] || num.toString();
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

const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({
    value: i,
    label: `${String.fromCharCode(65 + i)} (${i + 1})`,
}));


// 2. === REAKTIVE STATES ===
const defaultUiType = 3;
const uiType = ref(defaultUiType);


const settings = reactive({
    enigma: {
        ...defaultSettingsByUiType[defaultUiType]
    }
});

const enigma_output = ref("");


const inputTextarea = ref(null);

const inputFontSize = ref(16);
const outputFontSize = ref(16);

const inputIsUpperCase = ref(false);
const outputIsUpperCase = ref(true);



// 3. === COMPUTED PROPERTIES ===


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
        return settings.enigma.rings.slice(0, 3);
    },
    set(newVals) {
        const model = settings.enigma.model;

        if (model === 4) {
            // Bewahre vierten Wert bei Modell 4
            const fourth = settings.enigma.rings[3] ?? 0;
            settings.enigma.rings = [...newVals.slice(0, 3), fourth];
        } else {
            // Modell 2 oder 3 – genau 3 Elemente setzen
            settings.enigma.rings = [...newVals.slice(0, 3)];
        }
    }
});




// 4. === WATCHER ===
watch(uiType, (newUiType) => {
    const defaults = defaultSettingsByUiType[newUiType];
    if (!defaults) return;

    settings.enigma.model = defaults.model;
    settings.enigma.reflector = defaults.reflector;

    // komplettes Ersetzen statt splice
    settings.enigma.rotors = [...defaults.rotors];
    settings.enigma.positions = [...defaults.positions];
    settings.enigma.rings = [...defaults.rings];
});


watch(inputIsUpperCase, (newVal) => {
    settings.enigma.input = newVal
        ? settings.enigma.input.toUpperCase()
        : settings.enigma.input.toLowerCase();

    nextTick(() => {
        inputTextarea.value?.focus();
    });
});

watch(outputIsUpperCase, (newVal) => {
    enigma_output.value = newVal
        ? enigma_output.value.toUpperCase()
        : enigma_output.value.toLowerCase();
});



watch(() => settings.enigma.input, () => {
    sanitizeInput();
    debouncedSubmit();
});


// 5. === METHODEN ===

const debouncedSubmit = debounce(() => {
    if (!settings.enigma.input || settings.enigma.input.trim() === "") {
        enigma_output.value = "";
        return;
    }
    handleSubmit();
}, 300);

const Encrypt = async (data) => {
    try {
        const response = await BackendEnigma.getEncryption(data);

        // Rohdaten vom Backend
        let outputFromBackend = response.data.output || "";

        // Direkt an den Slider-Status anpassen
        enigma_output.value = outputIsUpperCase.value
            ? outputFromBackend.toUpperCase()
            : outputFromBackend.toLowerCase();

    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors;
            // Alle Fehlermeldungen ausgeben (falls mehrere)
            Object.values(errors).forEach(msg => {
                toast.error(msg);
            });
        } else {
            // Fallback
            toast.error(error.message || "Unbekannter Fehler");
        }
    }


};

const isLoading = ref(false);

const handleSubmit = async () => {
    if (!settings.enigma.input || settings.enigma.input.trim() === "") {
        enigma_output.value = "";
        // toast.warning("Bitte gib einen Text ein.");
        return;
    }

    isLoading.value = true;

    let plugboard = settings.enigma.plugboard || "";

    if (plugboard.length % 2 !== 0) {
        plugboard = plugboard.slice(0, -1);
        settings.enigma.plugboard = plugboard;
    }

    try {
        await Encrypt(JSON.stringify(settings));
    } catch (error) {
        error.response?.data?.message || error.message || "Fehler bei der Verarbeitung";
    } finally {
        isLoading.value = false;
    }
};





const sanitizeInput = () => {
  let input = settings.enigma.input || "";
  
  // Schneide auf 10.000 Zeichen ab
  if (input.length > 10000) {
    input = input.slice(0, 10000);
    settings.enigma.input = input;
    toast.warning("Maximal 10.000 Zeichen erlaubt.");
  }

  // Ausgabe ggf. anpassen (kannst du beibehalten)
  if (enigma_output.value.length > input.length) {
    enigma_output.value = enigma_output.value.slice(0, input.length);
  }
};






</script>


<style>
.enigma-setting {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: start;
    gap: 0.5rem 0.5rem;
    margin-bottom: 1rem;
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

.dropdowns {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  flex: 1;
}

.dropdowns select,
.dropdowns select:disabled {
  width: 85px;
  font-size: 1rem;
  text-align: center;
  padding: 0.3rem;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #bbb;
  font-family: inherit;
  line-height: 1.2;
}

.dropdowns select:disabled {
  background-color: #fff;
  color: #000000;
  cursor: not-allowed;
}

</style>

<style scoped>
/* Stil für Eingabe und Ausgabe Textareas */
.enigma {
    display: flex;
    gap: 2rem;
    align-items: stretch;
    /* wichtig */
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

.form-box > button { 
  margin-top: auto;
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
    min-height: 0;
    /* wichtig, um Überlauf zu verhindern */
}

.left-form {
    min-width: 620px;
}

.right-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: auto;
    /* oder nichts setzen */
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

.output-textarea {
    resize: none;
    /* Verhindert Größenänderung */
}

.output-textarea:focus {
    outline: none;
    /* Kein blauer Rahmen beim Fokus */
}


.textarea-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-weight: bold;
}

.controls-row {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    /* Falls es zu eng wird, umbrechen */
    accent-color: #0052cc;
}

.controls-row label,
.controls-row {
    white-space: nowrap;
}

.controls-row label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
}




/* Textarea soll den restlichen Platz einnehmen */
.textarea-wrapper textarea {
    flex-grow: 1;
    min-height: 150px;
    /* oder was du willst */
    resize: none;
    font-family: monospace;
    font-size: inherit;
    /* Vererbt vom Parent */
}


.scroll-buffer {
    height: 200px;
}

.font-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.font-input {
    width: 60px;
    padding: 0.2rem;
    font-size: 1rem;
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