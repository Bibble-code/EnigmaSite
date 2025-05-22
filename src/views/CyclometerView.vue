<template>
    <div v-if="settings">

        <div class="form-container">
            <div class="left-form">
                <form @submit.prevent="handleCyclometer">

                    <!-- Model Selection (Disabled) -->
                    <div class="enigma-setting">
                        <label>Modell:</label>
                        <div class="dropdowns">
                            <select v-model.number="settings.enigma.model" disabled>
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
                            <select v-model="settings.enigma.reflector" disabled>
                                <option v-for="r in reflectors" :key="r" :value="r">{{ r }}</option>
                            </select>
                        </div>
                    </div>

                    <!-- Rotor Selection -->
                    <div class="enigma-setting">
  <label>Walzenlage:</label>
  <div class="dropdowns">
    <template v-for="(index, i) in [0, 1, 2]" :key="'rotor-' + index">
      <select v-model.number="settings.enigma.rotors[i]">
        <option v-for="r in availableRotors[i]" :key="r" :value="r">{{ r }}</option>
      </select>
      <span v-if="i < 2">|</span>
    </template>
  </div>
</div>

                    <!-- Rotor Positions -->
                    <div class="enigma-setting">
                        <label>Walzenstellung:</label>
                        <div class="dropdowns">
                            <template v-for="index in [0, 1, 2]" :key="'position-' + index">
                                <select v-model.number="settings.enigma.positions[index]">
                                    <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                        {{ opt.label }}
                                    </option>
                                </select>
                                <span v-if="index < 2">|</span>
                            </template>
                        </div>
                    </div>

                    <!-- Ring Settings with Toggle -->
                    <div class="enigma-setting">
                        <label>Ringstellung:</label>
                        <div class="dropdowns">
                            <template v-for="index in [0, 1, 2]" :key="'ring-' + index">
                                <select v-model.number="settings.enigma.rings[index]" :disabled="!ringstellungEnabled">
                                    <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                        {{ opt.label }}
                                    </option>
                                </select>
                                <span v-if="index < 2">|</span>
                            </template>

                            <!-- Nur Checkbox, kein Button mehr -->
                            <label style="margin-left: 1rem; user-select: none; cursor: pointer;">
                                <input type="checkbox" v-model="ringstellungEnabled" />
                            </label>
                        </div>
                    </div>


                    <!-- Ring Settings with Toggle -->
                    <div class="enigma-setting">
                        <label>Steckerbrett:</label>
                        <div class="dropdowns">
                            <input v-model="settings.enigma.plugboard" type="text" placeholder="z.B. AB, QW, CD">
                        </div>
                    </div>

                    <div class="enigma-setting">
                        <label>Anzahl der zufälligen Tagesschlüssel:</label>
                        <div class="dropdowns">
                            <input v-model="settings.parameters.daily_key_count" type="number" min="0" />
                        </div>
                    </div>

                    <!-- Eigene Tagesschlüssel with aligned button -->
                    <div class="enigma-setting">
                        <label>Eigene Tagesschlüssel:</label>
                        <div class="dropdowns">
                            <button type="button" @click="addManualKey" class="square-button">+ Key hinzufügen</button>
                            <button type="button" @click="deleteLastManualKey" class="square-button">Lösche letzten
                                Schlüssel</button>
                        </div>
                    </div>


                    <div class="manual-keys-grid">
                        <div v-for="(key, index) in settings.parameters.manual_keys" :key="index"
                            class="manual-key-row">
                            <label>{{ index + 1 }}.</label>
                            <input ref="manualKeyRefs" type="text" v-model="settings.parameters.manual_keys[index]"
                                :class="{ invalid: !isValidKey(key) }" maxlength="6" @input="formatKey(index)"
                                placeholder="ABCABC" />
                        </div>
                    </div>

                    <div class="enigma-setting submit-button">
                        <label></label>
                        <div class="dropdowns">
                            <button type="submit" class="submit-btn">Zyklen erzeugen</button>
                        </div>
                    </div>
                </form>

                <div class="enigma-setting">
                    <label>Zyklen 1 auf 4:</label>
                    <div class="dropdowns">
                        <span v-for="(cycle, i) in cyclometerResponse.cycles.one_to_four_permut" :key="'r1-' + i"
                            class="cycle-item">
                            {{ cycle }}
                        </span>
                    </div>
                </div>

                <div class="enigma-setting">
                    <label>Zyklen 2 auf 5:</label>
                    <div class="dropdowns">
                        <span v-for="(cycle, i) in cyclometerResponse.cycles.two_to_five_permut" :key="'r2-' + i"
                            class="cycle-item">
                            {{ cycle }}
                        </span>
                    </div>
                </div>

                <div class="enigma-setting">
                    <label>Zyklen 3 auf 6:</label>
                    <div class="dropdowns">
                        <span v-for="(cycle, i) in cyclometerResponse.cycles.three_to_six_permut" :key="'r3-' + i"
                            class="cycle-item">
                            {{ cycle }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="right-form">
                <form v-if="cataloguerequest" @submit.prevent="handleCatalogue" class="right-form">
                    
                    <!-- Sortiere nach -->
                    <div class="enigma-setting">
                        <label>Sortiere nach:</label>
                        <div class="dropdowns">
                            <select v-model="cataloguerequest.parameters.sortBy">
                                <option value="rotor_order">Rotorreihenfolge</option>
                                <option value="rotor_position">Rotorposition</option>
                                <option value="one_to_four_permut">Zyklen des ersten Rotors</option>
                                <option value="two_to_five_permut">Zyklen des zweiten Rotors</option>
                                <option value="three_to_six_permut">Zyklen des dritten Rotors</option>
                            </select>
                        </div>
                    </div>

                    <!-- Sortierrichtung -->
                    <div class="enigma-setting">
                        <label>Sortierrichtung:</label>
                        <div class="dropdowns">
                            <select v-model="cataloguerequest.parameters.sortDir">
                                <option value="asc">Aufsteigend</option>
                                <option value="desc">Absteigend</option>
                            </select>
                        </div>
                    </div>


                    <!-- Walzenlage button -->
                    <div class="enigma-setting">
                        <label>Nach Walzenlage filtern:</label>
                        <div class="dropdowns">
                            <input type="checkbox" :checked="showRotorOrderFilter" @change="toggleRotorOrderFilter" />
                            <div class="dropdown-wrapper">
                            <div class="dropdowns" v-if="showRotorOrderFilter">
                                <template v-for="index in [0, 1, 2]" :key="'rotor-' + index">
                                    <select v-model.number="cataloguerequest.parameters.rotorOrder[index]">
                                        <option v-for="r in availableRotors_filter[index]" :key="r" :value="r">{{ r }}</option>
                                    </select>
                                    <span v-if="index < 2">|</span>
                                </template>
                                </div>
                            </div>
                        </div>
                    </div>


                    

                    <!-- Ringstellung button -->
                    <div class="enigma-setting">
                        <label>Nach Walzenstellung filtern:</label>
                        <div class="dropdowns">
                            <input type="checkbox" :checked="showRotorPositionFilter"
                                @change="toggleRotorPositionFilter" />
                                <div class="dropdown-wrapper">
                            <div class="dropdowns" v-if="showRotorPositionFilter">
                                <template v-for="index in [0, 1, 2]" :key="'rotor-' + index">
                                    <select v-model.number="cataloguerequest.parameters.rotorPosition[index]">
                                        <option v-for="opt in alphabetOptions" :key="opt.value" :value="opt.value">
                                            {{ opt.label }}
                                        </option>
                                    </select>
                                    <span v-if="index < 2">|</span>
                                </template>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="enigma-setting">
                        <label>Zyklen 1 auf 4 vereinfacht:</label>
                        <div class="dropdowns">
                            <span v-for="(cycle, i) in cataloguerequest.cycles.one_to_four_permut" :key="'r1-' + i"
                                class="cycle-item">
                                {{ cycle }}
                            </span>
                        </div>
                    </div>

                    <div class="enigma-setting">
                        <label>Zyklen 2 auf 5 vereinfacht:</label>
                        <div class="dropdowns">
                            <span v-for="(cycle, i) in cataloguerequest.cycles.two_to_five_permut" :key="'r2-' + i"
                                class="cycle-item">
                                {{ cycle }}
                            </span>
                        </div>
                    </div>

                    <div class="enigma-setting">
                        <label>Zyklen 3 auf 6 vereinfacht:</label>
                        <div class="dropdowns">
                            <span v-for="(cycle, i) in cataloguerequest.cycles.three_to_six_permut" :key="'r3-' + i"
                                class="cycle-item">
                                {{ cycle }}
                            </span>
                        </div>
                    </div>




                    <!-- Submit Button -->
                    <div class="enigma-setting submit-button">
                        <label></label>
                        <div class="dropdowns">
                            <button type="submit" class="submit-btn">Katalog abfragen</button>
                        </div>
                    </div>

                </form>
            </div>

        </div>

    </div>

    <div v-if="catalogueres && catalogueres.content && catalogueres.content.length">
        <!-- Total found and loaded info in a row -->
        <div class="enigma-setting load-controls" style="display: flex; align-items: center; gap: 1rem;">
            <!-- Gefundene Konfigurationen -->
             <div class="centered-container">
            <div class="info-item">
                <label>Gefundene Konfigurationen:</label>
                <span>{{ formatNumber(catalogueres.totalElements) }}</span>

            </div>

            <!-- Geladene Konfigurationen -->
            <div class="info-item">
                <label>Geladene Konfigurationen:</label>
                <span>{{ formatNumber(catalogueres.content.length) }}</span>
            </div>

            <!-- Letzte geladene Seite -->
            <div class="info-item">
                <label>Letzte geladene Seite:</label>
                <span>{{ formatNumber(catalogueres.pageNumber) }}</span>
            </div>

            <!-- Load buttons -->
            <div>
                <button type="button" @click="loadNextPage" class="square-button"
                    :disabled="(catalogueres.pageNumber + 1) >= catalogueres.totalPages">
                    +100 laden
                </button>

                <!-- <button type="button" @click="loadAllPages" class="square-button"
                    :disabled="(catalogueres.pageNumber + 1) >= catalogueres.totalPages">
                    Alle laden
                </button> -->
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
                    <th>Zyklen 1 auf 4</th>
                    <th>Zyklen 2 auf 5</th>
                    <th>Zyklen 3 auf 6</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(object, index) in catalogueres.content" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ object.enigmaConfiguration.rotor_order.join(", ") }}</td>
                    <td>{{ object.enigmaConfiguration.rotor_position.join(", ") }}</td>
                    <td>{{ object.cycles.one_to_four_permut.join(", ") }}</td>
                    <td>{{ object.cycles.two_to_five_permut.join(", ") }}</td>
                    <td>{{ object.cycles.three_to_six_permut.join(", ") }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="scroll-buffer"></div>

</template>


<script>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import { ref, nextTick, computed } from 'vue';

export default {
    setup() {
        // Static data
        const enigmaModels = [
            { value: 1, label: "I" },
            { value: 2, label: "II" },
            { value: 3, label: "III" },
            { value: 4, label: "IV" },
        ];
        const reflectors = ["A", "B", "C"];
        const rotorOptions = [1, 2, 3, 4, 5];
        const ringOptions = Array.from({ length: 26 }, (_, i) => i);
        const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({
            value: i,
            label: `${String.fromCharCode(65 + i)} (${i})`,
        }));

        // UI State
        const settings = ref({
            enigma: {
                model: 3,
                reflector: "B",
                rotors: [1, 2, 3],
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

        const buildCatalogueRequestFromCyclometer = () => {
            const sourceCycles = cyclometerResponse.value.cycles;

            const reduceDuplicates = (arr) => {
                const freqMap = {};

                // Zähle Vorkommen
                for (const num of arr) {
                    freqMap[num] = (freqMap[num] || 0) + 1;
                }

                // Baue reduziertes Array basierend auf Regel: ceil(count / 2)
                const reduced = [];
                for (const num in freqMap) {
                    const count = freqMap[num];
                    const keepCount = Math.ceil(count / 2);
                    for (let i = 0; i < keepCount; i++) {
                        reduced.push(Number(num));
                    }
                }

                // Absteigend sortieren
                reduced.sort((a, b) => b - a);

                return reduced;
            };

            // Auf jeden Cycle-Typ anwenden
            cataloguerequest.value.cycles = {
                one_to_four_permut: reduceDuplicates(sourceCycles.one_to_four_permut),
                two_to_five_permut: reduceDuplicates(sourceCycles.two_to_five_permut),
                three_to_six_permut: reduceDuplicates(sourceCycles.three_to_six_permut),
            };
        };



        // Action handlers
        const handleCyclometer = async () => {
            filterValidKeys();
            if (
                settings.value.parameters.daily_key_count === null ||
                settings.value.parameters.daily_key_count === undefined ||
                settings.value.parameters.daily_key_count === ""
            ) {
                settings.value.parameters.daily_key_count = 0;
            }

            await Cyclometer(JSON.stringify(settings.value));
        };

        const Cyclometer = async (data) => {
            try {
                const response = await BackendEnigma.getCyclometer(data);

                cyclometerResponse.value.cycles = { ...response.data.computedCycles };
                buildCatalogueRequestFromCyclometer();
            } catch (error) {
                console.error("Cyclometer error:", error);
            }
        };


        const handleCatalogue = async () => {
            cataloguerequest.value.parameters.page = 0;

            const req = structuredClone(cataloguerequest.value);

            if (!showRotorOrderFilter.value) req.parameters.rotorOrder = [];
            if (!showRotorPositionFilter.value) req.parameters.rotorPosition = [];

            await Catalogue(JSON.stringify(req));
        };

        const Catalogue = async (data) => {
            try {
                const response = await BackendEnigma.getCatalogue(data);
                catalogueres.value = response.data;
            } catch (error) {
                console.error("Catalogue error:", error);
            }
        };

        const manualKeyRefs = ref([]);

        const addManualKey = async () => {
            settings.value.parameters.manual_keys.push(""); // Add new key
            await nextTick(); // Ensure DOM updates before focusing
            const lastInput = manualKeyRefs.value.at(-1);
            if (lastInput) lastInput.focus(); // Focus the newly added input field
        };

        const deleteLastManualKey = () => {
            // Only delete the last key if there are keys in the array
            if (settings.value.parameters.manual_keys.length > 0) {
                settings.value.parameters.manual_keys.pop(); // Remove the last key from the array
            }
        };

        const isValidKey = (key) => /^([A-Z])([A-Z])([A-Z])\1\2\3$/.test(key);

        const filterValidKeys = () => {
            settings.value.parameters.manual_keys = settings.value.parameters.manual_keys.filter(isValidKey);
        };

        const formatKey = (index) => {
            const val = settings.value.parameters.manual_keys[index] || "";
            settings.value.parameters.manual_keys[index] = val.toUpperCase().replace(/[^A-Z]/g, "");
        };

        // Toggle filters
const toggleRotorOrderFilter = () => {
  showRotorOrderFilter.value = !showRotorOrderFilter.value;

  // Defensive Absicherung, falls parameters noch nicht existiert
  if (!cataloguerequest.value.parameters) {
    cataloguerequest.value.parameters = {};
  }

  // Setze rotorOrder je nachdem ob Filter aktiv ist
  cataloguerequest.value.parameters.rotorOrder = showRotorOrderFilter.value ? [1, 2, 3] : [];
};


        const toggleRotorPositionFilter = () => {
            showRotorPositionFilter.value = !showRotorPositionFilter.value;
            cataloguerequest.value.parameters.rotorPosition = showRotorPositionFilter.value ? [0, 0, 0] : [];
        };

        const ringstellungEnabled = ref(false);
        const toggleRingstellung = () => {
            ringstellungEnabled.value = !ringstellungEnabled.value;
        };

        const steckerbrettEnabled = ref(false);
        const toggleSteckerbrett = () => {
            steckerbrettEnabled.value = !steckerbrettEnabled.value;
        };

        // Paging
        const loadNextPage = async () => {
            const nextPage = cataloguerequest.value.parameters.page + 1;
            if (nextPage < catalogueres.value.totalPages) {
                cataloguerequest.value.parameters.page = nextPage;
                const { data } = await BackendEnigma.getCatalogue(JSON.stringify(cataloguerequest.value));
                catalogueres.value.content.push(...data.content);
                Object.assign(catalogueres.value, {
                    pageNumber: data.pageNumber,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                });
            }
        };

        const loadAllPages = async () => {
            let page = cataloguerequest.value.parameters.page + 1;
            while (page < catalogueres.value.totalPages) {
                cataloguerequest.value.parameters.page = page;
                const { data } = await BackendEnigma.getCatalogue(JSON.stringify(cataloguerequest.value));
                catalogueres.value.content.push(...data.content);
                page++;
            }
            cataloguerequest.value.parameters.page = page - 1;
        };

const formatNumber = (value) => {
  return new Intl.NumberFormat('de-DE').format(value);
};


                // Computed property, die für jeden Index die passenden Optionen liefert
const availableRotors = computed(() => {
  return settings.value.enigma.rotors.map((currentValue, idx) => {
    // Alle Werte außer dem aktuellen Index
    const otherSelected = settings.value.enigma.rotors.filter((_, i) => i !== idx);
    // Filtere rotorOptions, die nicht in otherSelected sind, plus den aktuellen Wert (damit aktueller Wert immer drin bleibt)
    return rotorOptions.filter(r => !otherSelected.includes(r) || r === currentValue);
  });
});

const availableRotors_filter = computed(() => {
  return cataloguerequest.value.parameters.rotorOrder.map((currentValue, idx) => {
    // Alle Werte außer dem aktuellen Index
    const otherSelected = cataloguerequest.value.parameters.rotorOrder.filter((_, i) => i !== idx);
    // Filtere rotorOptions, die nicht in otherSelected sind, plus den aktuellen Wert (damit aktueller Wert immer drin bleibt)
    return rotorOptions.filter(r => !otherSelected.includes(r) || r === currentValue);
  });
});
        return {
            addManualKey,
            alphabetOptions,
            catalogueres,
            cataloguerequest,
            Cyclometer,
            deleteLastManualKey,
            enigmaModels,
            cyclometerResponse,
            formatKey,
            handleCatalogue,
            handleCyclometer,
            isValidKey,
            loadAllPages,
            loadNextPage,
            reflectors,
            ringOptions,
            rotorOptions,
            settings,
            showRotorOrderFilter,
            showRotorPositionFilter,
            toggleRingstellung,
            ringstellungEnabled,
            toggleSteckerbrett,
            steckerbrettEnabled,
            toggleRotorOrderFilter,
            toggleRotorPositionFilter,
            manualKeyRefs,
            availableRotors,
            availableRotors_filter,
            formatNumber
        };
    },
};
</script>


<style scoped>
.enigma-setting {
    display: grid;
    grid-template-columns: 220px 1fr;
    /* 220px für Label, Rest für Inhalt */
    align-items: start;
    gap: 0.5rem 1.5rem;
    /* vertikal, horizontaler Abstand */
    margin-bottom: 1.5rem;
}

.enigma-setting>label {
    font-weight: bold;
    padding-top: 0.4rem;
    text-align: right;
    /* optional für klare Trennung */
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

.dropdowns {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    flex: 1;
}

.manual-keys-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    /* Adjust based on available space */
    gap: 0.1rem;
    padding: 0.1rem;
    /* Optional: Adds some padding around the grid */
}

.manual-key-row {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    margin-bottom: 0.3rem;
}

.manual-key-row label {
    width: 20px;
    /* Fixed width for the label */
    font-weight: 500;
    font-size: 0.9rem;
    text-align: right;
}

.manual-key-row input {
    width: 9ch;
    /* Limit input width to 9 characters */
    padding: 0.1rem;
    font-size: 0.9rem;
}

.square-button,
.delete-last-btn .load-controls {
    background-color: #eee;
    border: 1px solid #ccc;
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
    height: 2.3rem;
    cursor: pointer;
    white-space: nowrap;
}

.square-button:hover,
.delete-last-btn:hover .load-controls {
    background-color: #ddd;
}


.invalid {
    background-color: rgb(255, 180, 180);
}


.submit-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    min-width: 160px; /* gleiche Mindestbreite */
    min-height: 40px;
    text-align: center;
    display: inline-block;
}

.submit-btn:hover {
    background-color: #45a045; /* optional: etwas dunkler beim Hover */
}

.submit-button {
    margin: 2rem 0; /* oben und unten je 2rem Abstand */
}


.cycle-item {
    background-color: #f0f0f0;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.95rem;

        padding-top: 0.3rem;
    padding-bottom: 0.3rem;

    width: 2ch;           /* Fixe Breite für 1-2-stellige Werte */
    text-align: center;   /* Zahlen zentrieren */
    display: inline-block; /* damit width wirkt */
}

.filter-toggle-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.filter-inputs {
    display: flex;
    gap: 0.5rem;
}

/* Container for the information items and buttons */
.load-controls {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.centered-container {
  display: flex;
  justify-content: center; /* horizontal zentrieren */
  align-items: center;     /* vertikal zentrieren falls Höhe definiert */
  gap: 2rem;               /* Abstand zwischen Elementen */
  flex-wrap: wrap;         /* Zeilenumbruch bei Bedarf */
  padding: 1rem 0;         /* oben und unten Abstand */
}


/* Info Item Styling for consistency */
.info-item {
    display: flex;
    justify-content:space-around;
    width: 350px;
    /* Same width as Zyklen fields */
}

.info-item label {
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.2;
}

.info-item span {
    font-size: 1rem;          /* Größere Zahl */
    font-weight: 600;
    background-color: #f0f0f0;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    min-width: 80px;
    text-align: center;
}
table {
    width: 100%;
    max-width: 1000px;
    margin: 1rem auto;
    border-collapse: collapse;
}

table th,
table td {
    padding: 0.5rem;
    text-align: left;
    border: 1px solid #ddd;
    font-size: 0.9rem;
}

/* Header styling */
table th {
    background-color: #f6f6f6;
    font-weight: bold;
    white-space: nowrap;
}

/* Spaltenbreiten optimiert: schmal für Walzenlage und Walzenposition, mehr Platz für Zyklen */

table th:nth-child(1),
table td:nth-child(1) {
    width: 5%;
    min-width: 30px;
}

table th:nth-child(2),
table td:nth-child(2),
table th:nth-child(3),
table td:nth-child(3) {
    width: auto; /* Breite passt sich Label an */
    white-space: nowrap; /* Kein Zeilenumbruch im Label */
    min-width: 120px; /* Minimal genug Platz, damit Label nicht umbrechen muss */
}

table th:nth-child(4),
table td:nth-child(4),
table th:nth-child(5),
table td:nth-child(5),
table th:nth-child(6),
table td:nth-child(6) {
    width: 20%;
    min-width: 150px;
}

table td {
    word-wrap: break-word;
    white-space: normal;
}

/* Für Spalten 2 und 3 Text nicht umbrechen */
table td:nth-child(2),
table td:nth-child(3) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

.scroll-buffer {
    height: 200px;
    /* Oder mehr, je nach Bedarf */
}

.form-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    /* Abstand zwischen den beiden Spalten */
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
}

.left-form,
.right-form {
    flex: 1;
    /* Beide nehmen gleich viel Platz ein */
    max-width: 48%;
    /* Optional: Begrenze Breite */
}
.dropdown-wrapper {
  min-height: 30px; /* Höhe anpassen an deine selects, z.B. 40-50px */
  /* Alternativ: feste Höhe */
  height: 30px;
}
</style>