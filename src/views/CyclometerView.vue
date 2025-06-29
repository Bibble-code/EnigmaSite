<template>
    <div v-if="settings">
        <div class="form-container">
            <div class="left-form form-box">
                <h2>Erstellen der charakteristischen Zyklen
                    <label class="label-with-tooltip">
                        <TooltipLabel label=""
                            info="Die Zyklometer-Simulation erstellt Zyklen aus Klartext-Spruchschlüsseln, die noch nicht mit der Enigma verschlüsselt wurden." />
                    </label>
                </h2>

                <form @submit.prevent="handleCyclometer">

                    <div class="left-form-content">


                        <ReverseMultiSelect v-model:single="settings.enigma.model" :singleOptions="enigmaModels"
                            label="Modell:" info="Das Zyklometer ist nur mit der Enigma I der Wehrmacht kompatibel."
                            :isSingleEnabled="false" />
                        <ReverseMultiSelect v-model:single="settings.enigma.reflector" :singleOptions="reflectors"
                            v-model:array="settings.enigma.rotors" :arrayOptions="rotorOptions" label="Walzenlage:"
                            info="Hier wird die Reihenfolge der Walzen eingestellt. In der Simulation sind auch doppelte Walzen möglich. Der Katalog der Charakteristiken wurde mit Umkehrwalze B erstellt."
                            :isSingleEnabled="false" />

                        <ReverseMultiSelect v-model:array="settings.enigma.positions" :arrayOptions="alphabetOptions"
                            label="Walzenstellung:" info="Hier wird die Startposition der Walzen eingestellt." />

                        <ReverseMultiSelect v-model:array="settings.enigma.rings" :arrayOptions="alphabetOptions"
                            v-model:toggle="ringstellungEnabled"
                            :toggleLabel="ringstellungEnabled ? 'Deaktivieren' : 'Aktivieren'" label="Ringstellung:"
                            info="Der Katalog basiert auf neutraler Ringstellung. Bei anderer Ringstellung muss durch Rückrechnung die richtige Walzenstellung ermittelt werden." />




                        <!--                         <MultiSelectWithCheckbox label="Modell:"
                            info="Das Zyklometer ist nur mit der Enigma I der Wehrmacht kompatibel."
                            :options="enigmaModels" v-model="settings.enigma.model" :selectCount="1" :disabled="true" />

                        <MultiSelectWithCheckbox label="Umkehrwalze:"
                            info="Der Katalog der Charakteristiken wurde historisch zunächst mit Umkehrwalze A erstellt, später mit B. Diese Implementierung nutzt ausschließlich UKW B."
                            :options="reflectors.map(r => ({ label: r, value: r }))" v-model="settings.enigma.reflector"
                            :selectCount="1" :disabled="true" />


                        <MultiSelectWithCheckbox label="Walzenlage:"
                            info="Die Walzenauswahl erfolgt hier. In der Originalmaschine kamen keine Walzen doppelt vorkommen."
                            :options="rotorOptions" v-model="settings.enigma.rotors" :selectCount="3" />

                        <MultiSelectWithCheckbox label="Walzenstellung:"
                            info="Anfangsstellung der Walzen – sie dreht sich bei jedem Tastendruck weiter."
                            :options="alphabetOptions" v-model="settings.enigma.positions" :selectCount="3" />

                        <MultiSelectWithCheckbox label="Ringstellung:"
                            info="Der Katalog basiert auf neutraler Ringstellung. Bei anderer Ringstellung muss durch Rückrechnung die richtige Walzenstellung ermittelt werden."
                            :options="alphabetOptions" v-model="settings.enigma.rings"
                            v-model:checkboxModelValue="ringstellungEnabled" :selectCount="3" :disabled="false"
                            :showCheckbox="true" /> -->

                        <LabeledPlugboard v-model="settings.enigma.plugboard" label="Steckerbrett:"
                            info="Das Steckerbrett vertauscht Buchstaben. Auf die charakteristischen Zyklen hat das keinen Einfluss." />

                        <h3>
                            <label class="label-with-tooltip">
                                <TooltipLabel label="Spruchschlüssel"
                                    info="Hier wird festgelegt, mit wie vielen unverschlüsselten Spruchschlüsseln die Zyklometer-Simulation ausgeführt wird." />
                            </label>
                        </h3>


                        <!-- Zufällig generierte -->
                        <div class="enigma-setting">
                            <label class="label-with-tooltip">
                                <TooltipLabel label="Zufällig generierte:"
                                    info="Gibt an, wie viele Spruchschlüssel generiert werden sollen." />
                            </label>
                            <div class="keys full-width">
                                <input type="range" min="0" :max="sliderMax" v-model="sliderValue"
                                    @input="onSliderInput" class="styled-slider flex-grow" />
                                <input type="number" min="0" :max="actualMax"
                                    v-model.number="settings.parameters.daily_key_count" @input="onNumberInput"
                                    class="styled-number-input" style="width: 4ch;" />
                            </div>
                        </div>

                        <!-- Eigene -->
                        <div class="enigma-setting">
                            <label class="label-with-tooltip">
                                <TooltipLabel label="+ Eigene:"
                                    info="Hier können eigene unverschlüsselte Spruchschlüssel eingegeben werden..." />
                            </label>
                            <div class="keys full-width">
                                <button type="button" @click="addManualKey" class="manual-button flex-grow"
                                    :disabled="settings.parameters.manual_keys.length >= MAX_MANUAL_KEYS">
                                    Hinzufügen
                                </button>
                                <button type="button" @click="deleteLastManualKey" class="manual-button flex-grow">
                                    Löschen
                                </button>
                            </div>
                        </div>




                        <div class="manual-keys-grid">
                            <div v-for="(key, index) in settings.parameters.manual_keys" :key="index"
                                class="manual-key-row">
                                <label>{{ index + 1 }}.</label>
                                <input ref="manualKeyRefs" type="text" v-model="settings.parameters.manual_keys[index]"
                                    :class="{ invalid: !isValidKey(key) }" maxlength="6" @input="formatKey(index)"
                                    placeholder="z.B. ABCABC" />
                            </div>
                        </div>
                    </div>

                    <div class="form-footer">
                        <div>
                            <SubmitButton :loading="isLoadingCyclometer">Zyklen erzeugen</SubmitButton>
                        </div>
                    </div>
                </form>

            </div>

            <div class="arrow-container" :style="arrowStyle">
                <svg width="20" height="160" viewBox="0 0 20 160" xmlns="http://www.w3.org/2000/svg">
                    <!-- Punkte: links oben, Spitze rechts mittig, links unten -->
                    <polygon points="0,0 20,80 0,160" fill="#444" />
                </svg>
            </div>




            <div class="right-form">
                <div class="form-box topbox">
                    <h2>
                        <label class="label-with-tooltip">
                            <TooltipLabel label="Zyklen mit Verdoppelungen"
                                info="Das Zyklometer berechnet Zyklen, deren Vollständigkeit von der Anzahl der Spruchschlüssel abhängt. Vollständige Zyklen haben eine Summe von 26, und alle Werte treten paarweise auf." />
                        </label>
                    </h2>
                    <div class="cycle">
                        <!-- Cylometer Output-->
                        <div class="single-cycle">
                            <label class="label-with-tooltip">
                                <TooltipLabel label="Zyklen 1 → 4"
                                    info="Die Zyklen, die aus dem ersten und vierten Buchstaben des Spruchschlüssel generiert werden." />

                            </label>
                            <div class="dropdowns">
                                <span v-for="(cycle, i) in cyclometerResponse.cycles.one_to_four_permut"
                                    :key="'r1-' + i" class="cycle-dropdowns">
                                    {{ cycle }}
                                </span>
                            </div>
                        </div>

                        <div class="single-cycle">
                            <label class="label-with-tooltip">
                                <TooltipLabel label="Zyklen 2 → 5:"
                                    info="Die Zyklen, die aus dem zweiten und fünften Buchstaben des Spruchschlüssel generiert werden." />
                            </label>
                            <div class="dropdowns">
                                <span v-for="(cycle, i) in cyclometerResponse.cycles.two_to_five_permut"
                                    :key="'r2-' + i" class="cycle-dropdowns">
                                    {{ cycle }}
                                </span>
                            </div>
                        </div>

                        <div class="single-cycle">
                            <label class="label-with-tooltip">
                                <TooltipLabel label="Zyklen 3 → 6:"
                                    info="Die Zyklen, die aus dem dritten und sechsten Buchstaben des Spruchschlüssel generiert werden." />
                            </label>
                            <div class="dropdowns">
                                <span v-for="(cycle, i) in cyclometerResponse.cycles.three_to_six_permut"
                                    :key="'r3-' + i" class="cycle-dropdowns">
                                    {{ cycle }}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="arrow-container" :style="arrowStyle">
                    <svg width="160" height="20" viewBox="0 0 160 20" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="0,0 160,0 80,20" fill="#444" />
                    </svg>
                </div>

                <div class="form-box">
                    <h2>
                        <label class="label-with-tooltip">
                            <TooltipLabel label="Abfrage des Katalogs der Charakteristiken"
                                info="Hier wird der Katalog der Charakteristiken mit den zugehörigen charakteristischen Zyklen abgefragt. Zusätzlich kann die Datenbankabfrage gefiltert und sortiert werden." />
                        </label>
                    </h2>


                    <!-- Catalog Form -->
                    <form v-if="cataloguerequest" @submit.prevent="handleCatalogue" class="handleCatalogue">



                        <h3>
                            <label class="label-with-tooltip">
                                <TooltipLabel label="Zyklen ohne Verdoppelungen"
                                    info="Zyklen kommen immer doppelt vor, diese Verdoppelung wird für die Datenbankabfrage herausgerechnet." />
                            </label>
                        </h3>

                        <div class="cycle">
                            <div class="single-cycle">
                                <label>Zyklen 1 → 4:</label>
                                <div class="dropdowns">
                                    <span v-for="(cycle, i) in cataloguerequest.cycles.one_to_four_permut"
                                        :key="'r1-' + i" class="cycle-dropdowns">
                                        {{ cycle }}
                                    </span>
                                </div>
                            </div>

                            <div class="single-cycle">
                                <label>Zyklen 2 → 5:</label>
                                <div class="dropdowns">
                                    <span v-for="(cycle, i) in cataloguerequest.cycles.two_to_five_permut"
                                        :key="'r2-' + i" class="cycle-dropdowns">
                                        {{ cycle }}
                                    </span>
                                </div>
                            </div>

                            <div class="single-cycle">
                                <label>Zyklen 3 → 6:</label>
                                <div class="dropdowns">
                                    <span v-for="(cycle, i) in cataloguerequest.cycles.three_to_six_permut"
                                        :key="'r3-' + i" class="cycle-dropdowns">
                                        {{ cycle }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <h3>
                            <label class="label-with-tooltip">
                                Filtere nach:
                            </label>
                        </h3>



                        <div class="filter">
                            <label>Walzenlage:</label>
                            <div class="filter-options">
                                <label class="filter-switch">
                                    <input type="checkbox" :checked="showRotorOrderFilter"
                                        @change="toggleRotorOrderFilter" />
                                    <span class="slider"></span>
                                </label>

                                <span class="switch-label" v-if="!showRotorOrderFilter">
                                    Nach Walzenlage filtern
                                </span>

                                <div class="filter-wrapper" v-if="showRotorOrderFilter">
                                    <MultiSelect v-model="cataloguerequest.parameters.rotorOrder"
                                        :options="rotorOptions" :selectCount="3" :disabled="false" />
                                </div>
                            </div>
                        </div>

                        <div class="filter">
                            <label>Walzenstellung:</label>
                            <div class="filter-options">
                                <label class="filter-switch">
                                    <input type="checkbox" :checked="showRotorPositionFilter"
                                        @change="toggleRotorPositionFilter" />
                                    <span class="slider"></span>
                                </label>

                                <span class="switch-label" v-if="!showRotorPositionFilter">
                                    Nach Walzenstellung filtern
                                </span>

                                <div class="filter-wrapper" v-if="showRotorPositionFilter">
                                    <MultiSelect v-model="cataloguerequest.parameters.rotorPosition"
                                        :options="alphabetOptions" :selectCount="3" />
                                </div>
                            </div>
                        </div>




                        <!-- Sortiere nach -->
                        <h3>
                            <label class="label-with-tooltip">
                                Sortiere nach:
                            </label>
                        </h3>
                        <div class="sort-dropdowns">
                            <select v-model="cataloguerequest.parameters.sortBy">
                                <option value="rotor_order">Walzenlage</option>
                                <option value="rotor_position">Walzenstellung</option>
                            </select>
                            <select v-model="cataloguerequest.parameters.sortDir">
                                <option value="asc">Aufsteigend</option>
                                <option value="desc">Absteigend</option>
                            </select>
                        </div>


                        <label></label>
                        <div class="form-footer">
                            <SubmitButton :loading="isLoadingCatalogue">Katalog abfragen</SubmitButton>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    </div>
    <div class="arrow-container bottom-arrow" :style="arrowStyleBottom">
        <svg width="160" height="20" viewBox="0 0 160 20" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,0 160,0 80,20" fill="#444" />
        </svg>
    </div>


    <!-- Catalog Output -->
    <div class="catalogue" v-if="catalogueres && catalogueres.content && catalogueres.content.length">
        <div class="table-box">
            <!-- Total found and loaded info in a row -->
            <div class="load-controls">
                <!-- Gefundene Konfigurationen -->
                <div class="centered-container">
                    <div class="info">
                        <label>Gefundene Konfigurationen: </label>
                        <span>{{ formatNumber(catalogueres.totalElements) }}</span>
                    </div>

                    <!-- Geladene Konfigurationen -->
                    <div class="info">
                        <label>Geladene Konfigurationen: </label>
                        <span>{{ formatNumber(catalogueres.content.length) }}</span>
                    </div>


                    <!-- Load buttons -->
                    <div>
                        <button type="button" @click="loadNextPage" class="manual-button"
                            :disabled="(((catalogueres.pageNumber + 1) >= catalogueres.totalPages) || (catalogueres.pageNumber > 99))">
                            +100 laden
                        </button>

                    </div>
                </div>
            </div>

            <!-- Table displaying configurations -->
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Walzenlage</th>
                        <th>Walzenposition</th>
                        <th>Zyklen 1 → 4</th>
                        <th>Zyklen 2 → 5</th>
                        <th>Zyklen 3 → 6</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(object, index) in catalogueres.content" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td class="tabelle_format">
                            <pre>{{ formatRotorOrder(object.enigmaConfiguration.rotor_order) }}</pre>
                        </td>
                        <td class="tabelle_format">
                            <pre>{{ formatRotorPositionCompact(object.enigmaConfiguration.rotor_position) }}</pre>
                        </td>
                        <td class="tabelle_format">
                            <pre>{{ formatCycleNumbers(object.cycles.one_to_four_permut) }}</pre>
                        </td>
                        <td class="tabelle_format">
                            <pre>{{ formatCycleNumbers(object.cycles.two_to_five_permut) }}</pre>
                        </td>
                        <td class="tabelle_format">
                            <pre>{{ formatCycleNumbers(object.cycles.three_to_six_permut) }}</pre>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>




    </div>

    <!-- Buffer-->
    <div class="scroll-buffer"></div>


</template>


<script setup>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import TooltipLabel from '@/components/TooltipLabel.vue';
import MultiSelect from '../components/MultiSelect.vue';
import LabeledPlugboard from '../components/LabeledPlugboard.vue';
import SubmitButton from '../components/SubmitButton.vue';
import ReverseMultiSelect from '../components/ReverseMultiSelect.vue';
import { useToast } from 'vue-toastification'

import { ref, nextTick, computed, onMounted, onBeforeUnmount, watch } from 'vue';


const toast = useToast()
const arrowStyle = ref({})

onMounted(() => {
    nextTick(() => {
        const topEl = document.querySelector('.topbox')
        if (topEl) {
            const height = topEl.offsetHeight
            arrowStyle.value = {
                height: height + 'px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    })
})



const arrowStyleBottom = ref({})

function updateArrowPosition() {
    const rightFormEl = document.querySelector('.right-form')
    const arrowEl = document.querySelector('.arrow-container.bottom-arrow')

    if (rightFormEl && arrowEl) {
        const rightFormRect = rightFormEl.getBoundingClientRect()
        const arrowRect = arrowEl.getBoundingClientRect()

        const rightFormCenterX = rightFormRect.left + rightFormRect.width / 2
        const arrowLeft = rightFormCenterX - arrowRect.width / 2

        arrowStyleBottom.value = {
            position: 'absolute',
            left: arrowLeft + 'px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: arrowRect.width + 'px',
            zIndex: 10
        }
    }
}

onMounted(() => {
    nextTick(() => {
        updateArrowPosition()
        window.addEventListener('resize', updateArrowPosition)
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateArrowPosition)
})







// 1. Konstanten / statische Daten
const enigmaModels = [
    { value: 1, label: "Enigma Ⅰ der Wehrmacht" },
    { value: 2, label: "Enigma Ⅰ der Wehrmacht" },
    { value: 3, label: "Enigma Ⅰ der Wehrmacht" },
    { value: 4, label: "IV" },
];

const reflectors = [{ value: 'B', label: 'Umkehrwalze B' }]


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
const rotorOptions = [1, 2, 3, 4, 5].map(i => ({ value: i, label: toRoman(i) }));


const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({
    value: i,
    label: `${String.fromCharCode(65 + i)} (${i + 1})`,
}));



// 2. Reactive State / Refs
const settings = ref({
    enigma: {
        model: 3,
        reflector: "B",
        rotors: [3, 2, 1],
        positions: [0, 0, 0],
        rings: [0, 0, 0],
        plugboard: "",
        input: "",
        output: "",
    },
    parameters: {
        daily_key_count: 100,
        manual_keys: [],
    },
});

const cyclometerResponse = ref({
    cycles: {
        one_to_four_permut: [],
        two_to_five_permut: [],
        three_to_six_permut: []
    }
});

const catalogueres = ref();

const cataloguerequest = ref({
    cycles: {
        one_to_four_permut: [],
        two_to_five_permut: [],
        three_to_six_permut: [],
    },
    parameters: {
        page: 0,
        sortBy: "rotor_order",
        sortDir: "asc",
        rotorOrder: [],
        rotorPosition: [],
    },
});

// UI toggles
const showRotorOrderFilter = ref(false);
const showRotorPositionFilter = ref(false);
const ringstellungEnabled = ref(false);
const manualKeyRefs = ref([]);
const isLoadingCyclometer = ref(false);
const isLoadingCatalogue = ref(false);


// 3. Computed Properties
const availableRotors = computed(() => {
    return settings.value.enigma.rotors.map((currentValue, idx) => {
        const otherSelected = settings.value.enigma.rotors.filter((_, i) => i !== idx);
        return rotorOptions.filter(r => !otherSelected.includes(r.value) || r.value === currentValue);
    });
});

const availableRotors_filter = computed(() => {
    return cataloguerequest.value.parameters.rotorOrder.map((currentValue, idx) => {
        const otherSelected = cataloguerequest.value.parameters.rotorOrder.filter((_, i) => i !== idx);
        return rotorOptions.filter(r => !otherSelected.includes(r.value) || r.value === currentValue);
    });
});

// 4. Watchers

// 5. Hilfsfunktionen / Utils (keine reactive Daten, z.B. Formatierung)
const formatRotorPositionCompact = (positions) => {
    const letters = positions.map(pos => {
        const opt = alphabetOptions.find(o => o.value === pos);
        return opt ? opt.label.split(' ')[0] : '?';
    }).join('');

    const numbers = positions
        .map(n => (n + 1 < 10 ? ' ' + (n + 1) : (n + 1).toString()))
        .join(',');

    return `${letters}  (${numbers})`;
};


const formatCycleNumbers = (numbers) => {
    return numbers
        //.map(n => (n < 10 ? ' ' + n : n.toString()))
        .join(',');
};




function formatRotorOrder(rotorOrderValues) {
    const romanMap = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" };

    let rotorOrderRoman = rotorOrderValues.map(v => romanMap[v] || v).join(",");

    const padded = rotorOrderRoman.padEnd(10, " ");
    const numbersString = rotorOrderValues.join(",");

    return `${padded} (${numbersString})`;
}

const formatNumber = (value) => {
    return new Intl.NumberFormat('de-DE').format(value);
};


// 6. Action Handlers / Event Handlers
const handleCyclometer = async () => {
    isLoadingCyclometer.value = true;
    try {
        filterValidKeys();
        if (
            settings.value.parameters.daily_key_count === null ||
            settings.value.parameters.daily_key_count === undefined ||
            settings.value.parameters.daily_key_count === ""
        ) {
            settings.value.parameters.daily_key_count = 0;
        }

        let plugboard = settings.value.enigma.plugboard || "";

        if (plugboard.length % 2 !== 0) {
            plugboard = plugboard.slice(0, -1);
            settings.value.enigma.plugboard = plugboard;
        }

        await Cyclometer(settings.value);
    } finally {
        isLoadingCyclometer.value = false;
    }
};


const Cyclometer = async (data) => {
    try {
        const response = await BackendEnigma.getCyclometer(data);
        cyclometerResponse.value.cycles = { ...response.data.computedCycles };
        buildCatalogueRequestFromCyclometer();
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

const handleCatalogue = async () => {
    isLoadingCatalogue.value = true;
    try {
        cataloguerequest.value.parameters.page = 0;

        const req = structuredClone(cataloguerequest.value);

        if (!showRotorOrderFilter.value) req.parameters.rotorOrder = [];
        if (!showRotorPositionFilter.value) req.parameters.rotorPosition = [];

        await Catalogue(JSON.stringify(req));
    } finally {
        isLoadingCatalogue.value = false;
    }
};


const Catalogue = async (data) => {
    try {
        const response = await BackendEnigma.getCatalogue(data);
        catalogueres.value = response.data;

        await nextTick(); // Warten, bis die Tabelle gerendert ist

        // Nur scrollen, wenn die Seite ganz oben ist
        if (window.scrollY === 0) {
            window.scrollBy({
                top: 200,
                behavior: 'smooth' // optional smooth scroll
            });
        }

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





const MAX_MANUAL_KEYS = 35;
const addManualKey = async () => {
    if (settings.value.parameters.manual_keys.length < MAX_MANUAL_KEYS) {
        settings.value.parameters.manual_keys.push("");
        await nextTick();
        const lastInput = manualKeyRefs.value.at(-1);
        if (lastInput) lastInput.focus();
    }
};

const deleteLastManualKey = () => {
    if (settings.value.parameters.manual_keys.length > 0) {
        settings.value.parameters.manual_keys.pop();
    }
};


// 7. Validierungen / Filter
//const isValidKey = (key) => /^([A-Z])([A-Z])([A-Z])\1\2\3$/.test(key);

const MANUAL_KEY_REGEX = /^([A-Z])([A-Z])([A-Z])\1\2\3$/;

/**
 * Prüft, ob ein manueller Schlüssel dem Muster entspricht:
 * Drei Buchstaben (A-Z), gefolgt von genau denselben drei Buchstaben.
 * Beispiel: ABCABC
 * @param {string} key 
 * @returns {boolean}
 */
const isValidKey = (key) => MANUAL_KEY_REGEX.test(key);


const filterValidKeys = () => {
    settings.value.parameters.manual_keys = settings.value.parameters.manual_keys.filter(isValidKey);
};

const formatKey = (index) => {
    const val = settings.value.parameters.manual_keys[index] || "";
    settings.value.parameters.manual_keys[index] = val.toUpperCase().replace(/[^A-Z]/g, "");
};


// 8. UI Toggles
const toggleRotorOrderFilter = () => {
    showRotorOrderFilter.value = !showRotorOrderFilter.value;
    if (!cataloguerequest.value.parameters) {
        cataloguerequest.value.parameters = {};
    }
    cataloguerequest.value.parameters.rotorOrder = showRotorOrderFilter.value ? [1, 2, 3] : [];
};

const toggleRotorPositionFilter = () => {
    showRotorPositionFilter.value = !showRotorPositionFilter.value;
    cataloguerequest.value.parameters.rotorPosition = showRotorPositionFilter.value ? [0, 0, 0] : [];
};



// 9. Sonstige Hilfsfunktionen
const buildCatalogueRequestFromCyclometer = () => {
    const sourceCycles = cyclometerResponse.value.cycles;

    const reduceDuplicates = (arr) => {
        const freqMap = {};
        for (const num of arr) {
            freqMap[num] = (freqMap[num] || 0) + 1;
        }
        const reduced = [];
        for (const num in freqMap) {
            const count = freqMap[num];
            const keepCount = Math.ceil(count / 2);
            for (let i = 0; i < keepCount; i++) {
                reduced.push(Number(num));
            }
        }
        reduced.sort((a, b) => b - a);
        return reduced;
    };

    cataloguerequest.value.cycles = {
        one_to_four_permut: reduceDuplicates(sourceCycles.one_to_four_permut),
        two_to_five_permut: reduceDuplicates(sourceCycles.two_to_five_permut),
        three_to_six_permut: reduceDuplicates(sourceCycles.three_to_six_permut),
    };
};

// Paging
const isLoadingNextPage = ref(false);

const loadNextPage = async () => {
    if (isLoadingNextPage.value) return;

    const nextPage = cataloguerequest.value.parameters.page + 1;
    const maxPages = catalogueres.value?.totalPages ?? 0;

    if (nextPage >= maxPages || nextPage >= 100) return;

    isLoadingNextPage.value = true;

    try {
        cataloguerequest.value.parameters.page = nextPage;

        const { data } = await BackendEnigma.getCatalogue(
            JSON.stringify(cataloguerequest.value)
        );

        if (data?.content) {
            catalogueres.value.content.push(...data.content);
        }

        Object.assign(catalogueres.value, {
            pageNumber: data.pageNumber,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
        });
    } catch (error) {
        console.error("loadNextPage error:", error);
    } finally {
        isLoadingNextPage.value = false;
    }
};







const sliderMax = 10000
const actualMax = 1024
const targetMidValue = 100
const base = Math.pow((actualMax / targetMidValue) + 1, 2)
const A = actualMax / (base - 1)

// Slider-Wert im großen Bereich
const sliderValue = ref(valueToSlider(settings.value.parameters.daily_key_count))

function sliderToValue(sliderVal) {
    const t = sliderVal / sliderMax
    const value = A * (Math.pow(base, t) - 1)
    return Math.round(value)
}

function valueToSlider(actualVal) {
    const t = Math.log((actualVal / A) + 1) / Math.log(base)
    return Math.round(t * sliderMax)
}


// Wenn Slider bewegt wird, echten Wert aktualisieren
function onSliderInput() {
    settings.value.parameters.daily_key_count = sliderToValue(sliderValue.value)
}

// Wenn Nummerneingabe geändert wird, Slider anpassen
function onNumberInput() {
    if (settings.value.parameters.daily_key_count < 0) settings.value.parameters.daily_key_count = 0
    if (settings.value.parameters.daily_key_count > actualMax) settings.value.parameters.daily_key_count = actualMax
    sliderValue.value = valueToSlider(settings.value.parameters.daily_key_count)
}

// Synchronisieren, falls sich der Wert außerhalb von Slider ändert (optional)
watch(() => settings.value.parameters.daily_key_count, (newVal) => {
    sliderValue.value = valueToSlider(newVal)
})




</script>

<style>
body {
    background-color: #eaeaea;
    /* einfache Hintergrundfarbe */
    /* oder mit Bild */
    /* background-image: url('dein-bild.jpg'); */
    /* background-size: cover; */
    /* background-repeat: no-repeat; */
    /* background-position: center center; */
    margin: 0;
    /* Optional, um Standardabstände zu entfernen */
    min-height: 100vh;
    /* Damit der Hintergrund immer die ganze Höhe hat */
}
</style>

<style scoped>
/* =========[ 1. Layout & Struktur ]========= */

.scroll-buffer {
    height: 200px;
}



form {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.form-container {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto 0 auto;
    box-sizing: border-box;
    min-height: 100%;
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
    max-width: 100%
}

.table-box {
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


.form-footer {
    margin-top: auto;
    /* schiebt die Fußzeile nach unten */
    padding-top: 1rem;
}

.left-form {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Falls nötig, spezifische Anpassung */
.right-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    min-height: 100%;
    margin: 0;
    flex-grow: 1;
}


.left-form-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}



.cycles {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.catalogue {
    display: flex;
    justify-content: center;
    /* zentriert den Inhalt horizontal */
    padding: 1rem;
    /* optional für Abstand zum Bildschirmrand */
    margin-top: 60px;
    position: relative;
}



/* =========[ 2. Formulare & Steuerelemente ]========= */


.filter {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
    /* Vertikal zentrieren von Label + rechter Spalte */
    gap: 0.5rem 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: bold;
    padding-top: 0.4rem;
    text-align: left;
}

.filter-switch input[type="checkbox"] {
    width: 18px;
    /* optional: explizit setzen */
    height: 18px;
    /* optional: explizit setzen */
    transform: scale(1.4);
    /* skaliert die Checkbox */
    margin-right: 0.5rem;
    /* etwas Abstand zum Slider/Text */
    cursor: pointer;
}



.filter-options {
    min-height: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    /* Checkbox & MultiSelect vertikal zentrieren */
    gap: 1rem;
    /* Abstand zwischen Checkbox und Selects */
}

.filter-switch {
    display: inline-flex;
    align-items: center;
}

.switch-label {
    margin-left: 0.5rem;
    white-space: nowrap;
    font-weight: normal;
}



.manual-keys-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* 5 Spalten mit gleicher Breite */
    gap: 0.1rem;
    padding: 0.1rem;
}


.manual-key-row {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    margin-bottom: 0.5rem;
}

.manual-key-row label {
    width: 20px;
    font-weight: 500;
    font-size: 0.9rem;
    text-align: right;
}

.manual-key-row input {
    width: 10ch;
    padding: 0.1rem;
    font-size: 0.9rem;
}



.manual-button {
    background-color: #7121ad;
    color: white;
    font-weight: 500;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(108, 0, 250, 0.3);
    transition: background-color 0.3s ease;
    line-height: 1.2;
}


.manual-button:hover {
    background-color: #5a188c;
}


.manual-button:disabled {
    background-color: #b78fe4;
    cursor: not-allowed;
    box-shadow: none;
}

.invalid {
    background-color: #ede0ff;
}




/* =========[ 3. Tabelle / Rotoranzeige ]========= */
table {
    max-width: 100%;
    /* Verhindert Überlauf bei kleinen Bildschirmen */
    table-layout: fixed;
    margin: 1rem auto;
    /* Zentriert die Tabelle */
    border-collapse: collapse;
    background-color: #ffffff;
}


table th,
table td {
    padding-left: 0.5rem;
    padding-bottom: 0.1rem;
    text-align: left;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
    font-size: 1rem;
}

table th {
    background-color: #f0f0f0;
    font-weight: bold;
    white-space: nowrap;
}

/* Spalte 1: # */
table th:nth-child(1),
table td:nth-child(1) {
    width: 40px;
    min-width: 40px;
    max-width: 50px;
}


/* Spalte 2: Walzenlage */
table th:nth-child(2),
table td:nth-child(2) {
    width: 200px;
    min-width: 120px;
    max-width: 280px;
    white-space: nowrap;
}

/* Spalte 3: Walzenposition */
table th:nth-child(3),
table td:nth-child(3) {
    width: 170px;
    min-width: 100px;
    max-width: 230px;
    white-space: nowrap;
}

table th:nth-child(4),
table td:nth-child(4),
table th:nth-child(5),
table td:nth-child(5),
table th:nth-child(6),
table td:nth-child(6) {
    width: 120px;
    min-width: 30px;
    max-width: 300px;
    white-space: nowrap;
}

table td {
    word-wrap: break-word;
    white-space: normal;
}

table td:nth-child(2),
table td:nth-child(3) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

table tbody tr:nth-child(even) {
    background-color: #f3f3f3;
}


.tabelle_format {
    font-family: monospace;
    padding-left: 1rem;
}

.tabelle_format pre {
    display: inline;
    margin: 0;
    padding: 0;
    line-height: 1.2;
    font-family: monospace;
    white-space: pre;
}

/* =========[ 4. Zyklenanzeige / Einzelwerte ]========= */
.cycle-dropdowns {
    background-color: transparent;
    border-bottom: 1px solid #333;
    font-family: monospace;
    font-size: 1.2rem;
    padding: 0.2rem 0.4rem 0.1rem 0.4rem;
    text-align: center;
    display: inline-block;
}

.single-cycle {
    line-height: 1rem;
    /* etwas mehr Zeilenhöhe */
    min-height: 1.5rem;
    /* feste Mindesthöhe */
    font-weight: bold;
    padding-top: 0.4rem;
    text-align: right;
    display: grid;
    grid-template-columns: 130px 1fr;
    align-items: start;
    gap: 0.5rem 1.5rem;
    margin-bottom: 1.5rem;
}


/* =========[ 5. Infoanzeige / Info-Elemente ]========= */
.load-controls {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    padding: 0.5rem 1rem;
    /* etwas helles, neutrales */
    align-items: center;
}

.centered-container {
    display: flex;
    align-items: center;
    /* vertikal zentriert */
    gap: 1.5rem;
    flex-wrap: wrap;
}

.info {
    display: flex;
    align-items: baseline;
    /* Label und Zahl auf gleicher Grundlinie */
    gap: 0.3rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

.info label {
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.1;
    user-select: none;
}

.info span {
    font-size: 1.25rem;
    font-weight: 700;
    background-color: #e0f2ff;
    /* hellblauer Hintergrund */
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    min-width: 50px;
    text-align: center;
}


/* =========[ 6. Filter / Zusatz-Funktionen ]========= */


.left-form h2,
.right-form h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.5rem;
}




.sort-dropdowns select {
    font-size: 1rem;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    text-align: center;
    padding: 0.3rem;
    box-sizing: border-box;
    border-radius: 6px;
    border: 1px solid #bbb;
    font-family: inherit;
    line-height: 1.2;
    cursor: pointer;
}


.sort-dropdowns {
    display: flex;
    gap: 0.5rem;
    /* Abstand zwischen den Selects */
    align-items: center;
}





.keys,
additional-keys {
    text-align: left;
    display: flex;
    gap: 0.5rem;
    /* Abstand zwischen Buttons */
    margin-top: 0.5rem;
}





.toggle-label {
    display: inline-block;
    min-width: 90px;
    /* oder z. B. 11ch */
}

.styled-number-input {
    font-size: 1.2rem;
    /* größere Schrift */
    width: 6ch;
    /* Platz für 4 Ziffern (+ etwas Luft) */
    padding: 0.4rem 0.6rem;
    /* Innenabstand */
    border: 1px solid #ccc;
    /* dezenter Rahmen */
    border-radius: 6px;
    /* abgerundete Ecken */
    background-color: #fefefe;
    /* leicht helles Eingabefeld */
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.styled-number-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

/* Optional: Pfeile im Input-Feld ausblenden (je nach Stilwunsch) */
.styled-number-input::-webkit-outer-spin-button,
.styled-number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}


.keys.full-width {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    width: 100%;
    align-items: center;
}

.styled-number-input {
    /* ca. 4 Zeichen breit */
    width: 4ch;
    min-width: 4ch;
    /* verhindert Verkleinerung */
    max-width: 4ch;
    /* optional: Text zentrieren */
    text-align: center;
    /* damit der Input nicht zu groß wird */
    flex-shrink: 0;
}

.flex-grow {
    flex: 1;
    min-width: 0;
    /* verhindert Überlauf bei zu langen Werten */
}

.styled-slider {
    flex: 1;
    width: auto;
    /* überschreibt width 100% */
    accent-color: #0052cc;
}

.styled-number-input {
    width: 100%;
}



@media (max-width: 1000px) {
    .form-container {
        flex-direction: column;
    }

    .left-form,
    .right-form {
        max-width: 100%;
    }
}
</style>
