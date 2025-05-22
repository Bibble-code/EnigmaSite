<template>
    <div v-if="settings.enigma">
        <form @submit.prevent="handleSubmit">

            <!-- Model Selection (Disabled) -->
            <div class="enigma-setting">
                <label>Modell:</label>
                <div class="dropdowns">
                    <select v-model.number="selectedUiType_model">
                        <option v-for="model in enigmaModels" :key="model.value + model.label" :value="model.uiType">
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
                        <select v-model.number="settings.enigma.rings[index - 1]">
                            <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                        <span v-if="index < rotorSpan">|</span>
                    </template>
                </div>
            </div>

            <!-- Steckerbrett (Plugboard) -->
            <div class="enigma-setting">
                <label>Steckerbrett:</label>
                <div class="dropdowns">
                    <input v-model="settings.enigma.plugboard" type="text" placeholder="z.B. AB, QW, CD"
                        :disabled="selectedUiType_model === 2">
                        <p>UI Type: {{ selectedUiType_model }}</p>

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
                        <textarea ref="inputTextarea" v-model="settings.enigma.input" @input="syncTextareas"></textarea>
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

<script>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import { ref, computed } from 'vue';



export default {
    setup() {

        const enigmaModels = [
            { value: 3, label: "I/II", uiType: 2 },
            { value: 3, label: "III", uiType: 3 },
            { value: 4, label: "IV", uiType: 4 }
        ];


        const reflectors = [
            { value: "A", label: "UKW_A" },
            { value: "B", label: "UKW_B" },
            { value: "C", label: "UKW_C" },
            { value: "b", label: "UKW_b_THIN" },
            { value: "c", label: "UKW_c_THIN" }
        ];

        const rotorOptions_m2 = [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" }
        ];

        const rotorOptions_m3 = [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 6, label: "6" },
            { value: 7, label: "7" },
            { value: 8, label: "8" }
        ];

        const rotorOptions_m4 = [
            { value: 9, label: "Beta" },
            { value: 10, label: "Gamma" }
        ];


        // Funktion, um die Rotoroptionen basierend auf dem UI-Typ zu holen
        const getRotorOptions = (index) => {
    const uiType = selectedUiType_model.value; // <- das ist der UI-Typ, nicht model

    if (uiType === 2) return rotorOptions_m2;
    if (uiType === 3) return rotorOptions_m3;
    if (uiType === 4) return index === 4 ? rotorOptions_m4 : rotorOptions_m3;

    return [];
};




        const ringOptions = Array.from({ length: 26 }, (_, i) => i);  // Array from 0 to 25

        const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({
            value: i,
            label: `${String.fromCharCode(65 + i)} (${i})`
        }));


        const defaultSettingsByUiType = {
            2: {
                model: 3,
                reflector: "B",
                rotors: [1, 2, 3],
                positions: [0, 0, 0],
                rings: [0, 0, 0],
                plugboard: "",
                input: ""
            },
            3: {
                model: 3,
                reflector: "B",
                rotors: [1, 2, 3],
                positions: [0, 0, 0],
                rings: [0, 0, 0],
                plugboard: "",
                input: ""
            },
            4: {
                model: 4,
                reflector: "b",
                rotors: [1, 2, 3, 9], // 9 = Beta
                positions: [0, 0, 0, 0],
                rings: [0, 0, 0, 0],
                plugboard: "",
                input: ""
            }
        };

        const defaultUiType = 3;
        const settings = ref({
            enigma: {
                ...defaultSettingsByUiType[defaultUiType]
            }
        });

        const selectedModel = ref(settings.value.enigma.model);  // temporäre Speicherung des Modells
        const enigma_output = ref("");


        const Encrypt = async (data) => {
            try {
                const response = await BackendEnigma.getEncryption(data);

                enigma_output.value = response.data.output;
            } catch (error) {
                console.log(error);
            }
        };

        Encrypt(JSON.stringify(settings.value))

        const handleSubmit = async () => {
            console.log("submit")
            Encrypt(JSON.stringify(settings.value))
        }




        const rotorSpan = computed(() => {
            // Wenn Modell 4 (m4), dann 4 Rotoren
            if (settings.value.enigma.model === 4) {
                settings.value.enigma.rotors = settings.value.enigma.rotors || [1, 2, 3, 9];  // Sicherstellen, dass rotors gesetzt ist
                return 4;  // Modell 4 hat 4 Rotoren
            } else {
                settings.value.enigma.rotors = settings.value.enigma.rotors || [1, 2, 3];  // Sicherstellen, dass rotors gesetzt ist
                return 3;  // Modell 3 hat 3 Rotoren
            }
        });



        // Handler für Modelländerungen
        const handleModelChange = (event) => {
            const selectedLabel = event.target.options[event.target.selectedIndex].text;
            const match = enigmaModels.find(m => m.label === selectedLabel);

            if (match) {
                const uiType = match.uiType;

                if (defaultSettingsByUiType[uiType]) {
                    settings.value.enigma = {
                        ...defaultSettingsByUiType[uiType],
                        input: settings.value.enigma.input,
                        output: settings.value.enigma.output
                    };
                    selectedModel.value = match.value; // Speichere den neuen Modellwert
                }
            }
        };

        const selectedUiType_model = computed({
  get() {
    return settings.value.enigma.uiType ?? 3; // Fallback falls uiType nicht gesetzt ist
  },
  set(uiType) {
    const match = enigmaModels.find(m => m.uiType === uiType);
    if (!match) return;

    const model = uiType === 4 ? 4 : 3;

    settings.value.enigma = {
      ...defaultSettingsByUiType[uiType],
      input: settings.value.enigma.input,
      output: settings.value.enigma.output,
      model,
      uiType // Wichtig: Speichern
    };
  }
});




        return {
            enigmaModels,
            reflectors,
            rotorOptions_m2,
            rotorOptions_m3,
            rotorOptions_m4,
            getRotorOptions,
            ringOptions,
            alphabetOptions,

            rotorSpan,
            selectedUiType_model,
            handleModelChange,
            selectedModel,


            Encrypt,
            settings,
            enigma_output,
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