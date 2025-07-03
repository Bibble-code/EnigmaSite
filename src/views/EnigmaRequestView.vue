<template>
    <!-- Nur anzeigen, wenn Enigma-Einstellungen vorhanden sind -->
    <div v-if="settings.enigma">
        <form @submit.prevent="handleSubmit">
            <div class="enigma">

                <!-- Linke Seite: Konfiguration -->
                <div class="left-form form-box">

                    <!-- Enigma-Modell Auswahl -->
                    <ReverseMultiSelect v-model:single="uiType" :singleOptions="enigmaModels" label="Modell:"
                        info="Model I und M3 unterscheiden sich nur im Walzensatz..." s />

                    <!-- Walzenlage: Auswahl von Reflektor und Walzen -->
                    <ReverseMultiSelect v-model:single="settings.enigma.reflector" :singleOptions="reflectors"
                        v-model:array="settings.enigma.rotors" :arrayOptions="rotorOptions" label="Walzenlage:"
                        info="Hier wird die Reihenfolge der Walzen eingestellt..." />

                    <!-- Walzenstellung: Startposition der Walzen mit Markierung der Einkerbung -->
                    <ReverseMultiSelect v-model:array="settings.enigma.positions"
                        :arrayOptions="positionAlphabetOptions" label="Walzenstellung:"
                        info="Startposition der Walzen, * markiert Einkerbung" />

                    <!-- Ringstellung: Position der Ringverdrehung -->
                    <ReverseMultiSelect v-model:array="ringsFirstThree" :arrayOptions="alphabetOptions"
                        label="Ringstellung:" info="Einstellung der Ringstellung für die ersten 3 Walzen" />

                    <!-- Steckerbrett: Buchstabenpaare -->
                    <LabeledPlugboard v-model="settings.enigma.plugboard" label="Steckerbrett:"
                        info="Vertauscht Buchstaben, beeinflusst keine Zyklen" />

                    <!-- Absenden-Button: aktiviert, wenn Text eingegeben ist -->
                    <SubmitButton :disabled="!settings.enigma.input" :loading="isLoading">
                        {{ settings.enigma.input ? 'Verschlüsseln' : 'Bitte Text eingeben' }}
                    </SubmitButton>

                </div>

                <!-- Rechte Seite: Texteingabe und -ausgabe -->
                <div class="right-form">

                    <!-- Eingabe-Feld -->
                    <div class="text-box">
                        <div class="textarea-wrapper">

                            <!-- Steuerleiste für Eingabe -->
                            <div class="controls-row">
                                <label>Eingabe:</label>

                                <!-- Schriftgröße für Eingabe -->
                                <label class="font-label">
                                    Schrift:
                                    <input type="range" min="10" max="35" v-model="inputFontSize"
                                        style="width: 100px;" />
                                    <input type="number" min="10" max="35" v-model="inputFontSize" class="font-input" />
                                    px
                                </label>

                                <!-- Groß-/Kleinschreibung -->
                                <ToggleSwitch v-model="inputIsUpperCase">
                                    {{ inputIsUpperCase ? 'Groß' : 'Klein' }}
                                </ToggleSwitch>
                            </div>

                            <!-- Texteingabefeld -->
                            <textarea ref="inputTextarea" v-model="settings.enigma.input" @input="sanitizeInput"
                                spellcheck="false" :style="{
                                    fontSize: inputFontSize + 'px',
                                    minWidth: '550px',
                                    resize: 'horizontal'
                                }" />
                        </div>
                    </div>

                    <!-- Pfeil zur Ausgabe -->
                    <div class="arrow-container">
                        <svg width="160" height="20" viewBox="0 0 160 20" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="0,0 160,0 80,20" fill="#444" />
                        </svg>
                    </div>

                    <!-- Ausgabe-Feld -->
                    <div class="text-box">
                        <div class="textarea-wrapper">

                            <!-- Steuerleiste für Ausgabe -->
                            <div class="controls-row">
                                <label>Ausgabe:</label>

                                <!-- Schriftgröße für Ausgabe -->
                                <label class="font-label">
                                    Schrift:
                                    <input type="range" min="10" max="35" v-model="outputFontSize"
                                        style="width: 100px;" />
                                    <input type="number" min="10" max="35" v-model="outputFontSize"
                                        class="font-input" />
                                    px
                                </label>

                                <!-- Groß-/Kleinschreibung -->
                                <ToggleSwitch v-model="outputIsUpperCase">
                                    {{ outputIsUpperCase ? 'Groß' : 'Klein' }}
                                </ToggleSwitch>
                            </div>

                            <!-- Textausgabe (readonly) -->
                            <textarea ref="outputTextarea" v-model="enigma_output" readonly class="output-textarea"
                                tabindex="-1" :style="{ fontSize: outputFontSize + 'px' }" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- Abstand zum unteren Rand -->
    <div class="scroll-buffer"></div>
</template>

<script setup>
// === IMPORTS ===
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import LabeledPlugboard from '../components/LabeledPlugboard.vue';
import SubmitButton from '../components/SubmitButton.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import ReverseMultiSelect from '../components/ReverseMultiSelect.vue';
import { useToast } from 'vue-toastification';
import { debounce } from "lodash";
import { ref, computed, watch, reactive, nextTick } from 'vue';


// === TOAST INITIALISIERUNG ===
const toast = useToast();


// === KONSTANTEN UND OPTIONEN ===

// Enigma-Modelloptionen
const enigmaModels = [
    { value: 2, label: "Enigma Ⅰ der Wehrmacht" },
    { value: 3, label: "Enigma M3 der Kriegsmarine" },
    { value: 4, label: "Enigma M4 der U-Boot-Flotte" }
];

// UKW-Auswahl basierend auf Modell
const reflectorOptionsByUiType = {
    2: [{ value: "A", label: "Umkehrwalze A" }, { value: "B", label: "Umkehrwalze B" }, { value: "C", label: "Umkehrwalze C" }],
    3: [{ value: "B", label: "Umkehrwalze B" }, { value: "C", label: "Umkehrwalze C" }],
    4: [{ value: "b", label: "UKW b" }, { value: "c", label: "UKW c" }]
};

// Hilfsfunktion: Zahl zu römischer Ziffer
function toRoman(num) {
const romanLatin = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
return romanLatin[num - 1] || num.toString();

}

// Rotoroptionen je Modell
const rotorOptions_m2 = [1, 2, 3, 4, 5].map(i => ({ value: i, label: toRoman(i) }));
const rotorOptions_m3 = [1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ value: i, label: toRoman(i) }));
const rotorOptions_m4 = [{ value: 9, label: "Beta" }, { value: 10, label: "Gamma" }];

// Default-Konfigurationen je Modell
const defaultSettingsByUiType = {
    2: { model: 3, reflector: "B", rotors: [1, 2, 3], positions: [0, 0, 0], rings: [0, 0, 0], plugboard: "", input: "" },
    3: { model: 3, reflector: "B", rotors: [1, 2, 3], positions: [0, 0, 0], rings: [0, 0, 0], plugboard: "", input: "" },
    4: { model: 4, reflector: "b", rotors: [1, 2, 3, 9], positions: [0, 0, 0, 0], rings: [0, 0, 0, 0], plugboard: "", input: "" }
};

// Alphabet mit Indexanzeige
const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({
    value: i,
    label: `${String.fromCharCode(65 + i)} (${i + 1})`,
}));

// Einkerbungspositionen für Rotoren (A=0, ..., Z=25)
const starPositionsByRotor = {
    1: 16, 2: 4, 3: 21, 4: 9, 5: 25,
    6: [25, 12], 7: [25, 12], 8: [25, 12],
};


// === REAKTIVE STATES ===

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
const isLoading = ref(false);


// === COMPUTED PROPERTIES ===

// Mögliche UKWs basierend auf Modell
const reflectors = computed(() => reflectorOptionsByUiType[uiType.value] || []);

// Rotoroptionen je nach Modell (für ReverseMultiSelect)
const rotorOptions = computed(() => {
    const currentUiType = Number(uiType.value);
    if (currentUiType === 2) return [rotorOptions_m2, rotorOptions_m2, rotorOptions_m2];
    if (currentUiType === 3) return [rotorOptions_m3, rotorOptions_m3, rotorOptions_m3];
    if (currentUiType === 4) return [rotorOptions_m3, rotorOptions_m3, rotorOptions_m3, rotorOptions_m4];
    console.warn("Unexpected uiType value:", currentUiType);
    return [];
});

// Ringstellung – für die ersten 3 Walzen separat
const ringsFirstThree = computed({
    get() {
        return settings.enigma.rings.slice(0, 3);
    },
    set(newVals) {
        const model = settings.enigma.model;
        if (model === 4) {
            const fourth = settings.enigma.rings[3] ?? 0;
            settings.enigma.rings = [...newVals.slice(0, 3), fourth];
        } else {
            settings.enigma.rings = [...newVals.slice(0, 3)];
        }
    }
});

// Positionseinstellungen mit Markierung der Einkerbungen (Sternchen)
const positionAlphabetOptions = computed(() => {
    return settings.enigma.rotors.map(rotorId => {
        if (rotorId >= 1 && rotorId <= 8) {
            return createAlphabetOptionsWithIndent(rotorId);
        }
        return alphabetOptions;
    });
});


// === WATCHER ===

// Wenn Modell gewechselt wird, default Settings laden
watch(uiType, (newUiType) => {
    const defaults = defaultSettingsByUiType[newUiType];
    if (!defaults) return;

    settings.enigma.model = defaults.model;
    settings.enigma.reflector = defaults.reflector;
    settings.enigma.rotors = [...defaults.rotors];
    settings.enigma.positions = [...defaults.positions];
    settings.enigma.rings = [...defaults.rings];
});

// Bei Umschaltung Groß-/Kleinschreibung für Eingabe
watch(inputIsUpperCase, (newVal) => {
    settings.enigma.input = newVal
        ? settings.enigma.input.toUpperCase()
        : settings.enigma.input.toLowerCase();

    nextTick(() => {
        inputTextarea.value?.focus();
    });
});

// Groß-/Kleinschreibung Ausgabe synchron halten
watch(outputIsUpperCase, (newVal) => {
    enigma_output.value = newVal
        ? enigma_output.value.toUpperCase()
        : enigma_output.value.toLowerCase();
});

// Bei Änderung der Eingabe automatisch verarbeiten (debounced)
watch(() => settings.enigma.input, () => {
    sanitizeInput();
    debouncedSubmit();
});


// === METHODEN ===

// Debounced Verarbeitung der Eingabe
const debouncedSubmit = debounce(() => {
    if (!settings.enigma.input || settings.enigma.input.trim() === "") {
        enigma_output.value = "";
        return;
    }
    handleSubmit();
}, 300);

// Sendet Konfiguration an Backend zur Verschlüsselung
const Encrypt = async (data) => {
    try {
        const response = await BackendEnigma.getEncryption(data);
        let outputFromBackend = response.data.output || "";

        enigma_output.value = outputIsUpperCase.value
            ? outputFromBackend.toUpperCase()
            : outputFromBackend.toLowerCase();

    } catch (error) {
        if (error.response?.data?.errors) {
            Object.values(error.response.data.errors).forEach(msg => toast.error(msg));
        } else {
            toast.error(error.message || "Unbekannter Fehler");
        }
    }
};

// Übergibt das Formular zur Verarbeitung
const handleSubmit = async () => {
    if (!settings.enigma.input || settings.enigma.input.trim() === "") {
        enigma_output.value = "";
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

// Bereinigt Eingabetext, begrenzt Länge und synchronisiert Ausgabe
const sanitizeInput = () => {
    let input = settings.enigma.input || "";
    if (input.length > 10000) {
        input = input.slice(0, 10000);
        settings.enigma.input = input;
        toast.warning("Maximal 10.000 Zeichen erlaubt.");
    }

    if (enigma_output.value.length > input.length) {
        enigma_output.value = enigma_output.value.slice(0, input.length);
    }
};


// === HILFSFUNKTIONEN ===

// Fügt bei den Alphabetoptionen ein Sternchen an den Einkerbungspositionen hinzu
function createAlphabetOptionsWithIndent(rotorNumber) {
    const starPos = starPositionsByRotor[rotorNumber];

    return alphabetOptions.map((opt, idx) => {
        let label = opt.label;
        if (Array.isArray(starPos)) {
            if (starPos.includes(idx)) label += " *";
        } else if (idx === starPos) {
            label += " *";
        }
        return { value: opt.value, label };
    });
}
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
    line-height: 1.2rem;
}

.dropdowns select:disabled {
    background-color: #fff;
    color: #000000;
    cursor: not-allowed;
}
</style>

<style scoped>
/* =====================
   LAYOUT-GRID & FORMS
===================== */
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

/* =====================
   DROPDOWNS & SELECTS
===================== */
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

/* =====================
   PFEIL-CONTAINER
===================== */
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

/* =====================
   OUTER WRAPPER: Enigma
===================== */
.enigma {
    display: flex;
    gap: 2rem;
    align-items: stretch;
    width: 100%;
    max-width: 1200px;
    margin: 4rem auto 0 auto;
    height: auto;
}

/* =====================
   FORMULAR-STYLES
===================== */
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

.form-box>button {
    margin-top: auto;
}

.left-form {
    min-width: 620px;
}

.right-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: auto;
}

/* =====================
   TEXTAREA-BEREICHE
===================== */
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
}


.textarea-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-weight: bold;
}

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

.textarea-wrapper textarea {
    flex-grow: 1;
    min-height: 150px;
    resize: none;
    font-family: monospace;
    font-size: inherit;
}


/* =====================
   OUTPUT TEXTAREA
===================== */
.output-textarea {
    resize: none;
}

/* =====================
   CONTROLS & SLIDER
===================== */
.controls-row {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
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

/* =====================
   FONT-SLIDER
===================== */
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

/* =====================
   SCROLL-BUFFER (optional)
===================== */
.scroll-buffer {
    height: 200px;
}

/* =====================
   RESPONSIVE
===================== */
@media (max-width: 768px) {
    .form-section {
        flex: 1 1 100%;
        margin-bottom: 1rem;
    }

    .form-center {
        flex: 0 1 auto;
    }
}
</style>