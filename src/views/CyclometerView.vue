<template>
    <div v-if="settings">

        <div class="form-container">
            <div class="left-form">

                <!-- CylometerForm -->
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
                        <label>Umkehrwalze:</label>
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
                                    <option v-for="r in rotorOptions" :key="r.value" :value="r.value">{{ r.label }}
                                    </option>
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

                    <div class="enigma-setting">
                        <label>Steckerbrett:</label>
                        <div class="plugboard-container">
                            <input v-for="(pair, index) in plugboardPairs" :key="index" v-model="plugboardPairs[index]"
                                @input="onPlugboardInput(index)" maxlength="2" type="text"
                                style="text-transform: uppercase;" />
                        </div>
                    </div>

                    <div class="enigma-setting">
                        <label>Anzahl der zufälligen Spruchschlüssel:</label>
                        <div class="dropdowns">
                            <input v-model="settings.parameters.daily_key_count" type="number" min="0" />
                        </div>
                    </div>

                    <!-- Eigene Spruchschlüssel with aligned button -->
                    <div class="enigma-setting">
                        <label>Eigene Sprushschlüssel:</label>
                        <div class="dropdowns">
                            <button type="button" @click="addManualKey" class="manual-button">+ Schlüssel
                                hinzufügen</button>
                            <button type="button" @click="deleteLastManualKey" class="manual-button">Lösche letzten
                                Schlüssel</button>
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

                    <div class="enigma-setting submit-button">
                        <label></label>
                        <div class="dropdowns">
                            <button type="submit" class="submit-btn">Zyklen erzeugen</button>
                        </div>
                    </div>
                </form>

                <!-- Cylometer Output-->
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

                <!-- Catalog Form -->
                <form v-if="cataloguerequest" @submit.prevent="handleCatalogue" class="right-form">

                    <!-- Sortiere nach -->
                    <div class="enigma-setting">
                        <label>Sortiere nach:</label>
                        <div class="dropdowns">
                            <select v-model="cataloguerequest.parameters.sortBy">
                                <option value="rotor_order">Rotorreihenfolge</option>
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
                                            <option v-for="r in rotorOptions" :key="r.value" :value="r.value">{{ r.label
                                            }}</option>
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
                        <label>Zyklen 1/4 ohne Verdoppelungen:</label>
                        <div class="dropdowns">
                            <span v-for="(cycle, i) in cataloguerequest.cycles.one_to_four_permut" :key="'r1-' + i"
                                class="cycle-item">
                                {{ cycle }}
                            </span>
                        </div>
                    </div>

                    <div class="enigma-setting">
                        <label>Zyklen 2/5 ohne Verdoppelungen:</label>
                        <div class="dropdowns">
                            <span v-for="(cycle, i) in cataloguerequest.cycles.two_to_five_permut" :key="'r2-' + i"
                                class="cycle-item">
                                {{ cycle }}
                            </span>
                        </div>
                    </div>

                    <div class="enigma-setting">
                        <label>Zyklen 3/6 ohne Verdoppelungen:</label>
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

    <!-- Catalog Output -->
    <div v-if="catalogueres && catalogueres.content && catalogueres.content.length">
        <!-- Total found and loaded info in a row -->
        <div class="load-controls" style="display: flex; align-items: center; gap: 1rem;">
            <!-- Gefundene Konfigurationen -->
            <div class="centered-container">
                <div class="info-item">
                    <label>Gefundene Konfigurationen: </label>
                    <span>{{ formatNumber(catalogueres.totalElements) }}</span>
                </div>

                <!-- Geladene Konfigurationen -->
                <div class="info-item">
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
                    <th>Zyklen 1/4</th>
                    <th>Zyklen 2/5</th>
                    <th>Zyklen 3/6</th>
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

    <!-- Buffer-->
    <div class="scroll-buffer"></div>

</template>


<script>
import BackendEnigma from '@/services/Enigma/BackendEnigma';
import { ref, nextTick, computed, watch } from 'vue';

export default {
    setup() {
        // 1. Konstanten / statische Daten
        const enigmaModels = [
            { value: 1, label: "I" },
            { value: 2, label: "I" },
            { value: 3, label: "I" },
            { value: 4, label: "IV" },
        ];

        const reflectors = ["B", "C"];

        const rotorOptions = [
            { value: 1, label: "I" },
            { value: 2, label: "II" },
            { value: 3, label: "III" },
            { value: 4, label: "IV" },
            { value: 5, label: "V" }
        ];

        const ringOptions = Array.from({ length: 26 }, (_, i) => i);

        const alphabetOptions = Array.from({ length: 26 }, (_, i) => ({
            value: i,
            label: `${String.fromCharCode(65 + i)} (${i})`,
        }));


        // 2. Reactive State / Refs
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
        const ringstellungEnabled = ref(false);
        const steckerbrettEnabled = ref(false);

        const manualKeyRefs = ref([]);

        // Plugboard
        const plugboardPairs = ref(Array(10).fill(""));

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
        watch(plugboardPairs, () => {
            settings.value.enigma.plugboard = plugboardPairs.value.join('');
        }, { deep: true });


        // 5. Hilfsfunktionen / Utils (keine reactive Daten, z.B. Formatierung)
        const formatRotorPositionCompact = (positions) => {
            const letters = positions.map(pos => {
                const opt = alphabetOptions.find(o => o.value === pos);
                return opt ? opt.label.split(' ')[0] : '?';
            }).join('');

            const numbers = positions
                .map(n => (n < 10 ? ' ' + n : n.toString()))
                .join(',');

            return `${letters}  (${numbers})`;
        };

        const formatCycleNumbers = (numbers) => {
            return numbers
                //.map(n => (n < 10 ? ' ' + n : n.toString()))
                .join(',');
        };


        function toRoman(num) {
            const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
            return romans[num - 1] || num.toString();
        }

        function formatRotorOrderWithNumbers(arr) {
            const roman = arr.map(toRoman).join(",");
            const numbers = arr.join(",");
            return `${roman} (${numbers})`;
        }

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

                let chars = plugboard.match(/.{1,2}/g) || [];
                plugboardPairs.value = Array(10).fill("").map((_, i) => chars[i] || "");
            }

            await Cyclometer(settings.value);
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

        const addManualKey = async () => {
            settings.value.parameters.manual_keys.push("");
            await nextTick();
            const lastInput = manualKeyRefs.value.at(-1);
            if (lastInput) lastInput.focus();
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

        const toggleRingstellung = () => {
            ringstellungEnabled.value = !ringstellungEnabled.value;
        };

        const toggleSteckerbrett = () => {
            steckerbrettEnabled.value = !steckerbrettEnabled.value;
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



        // 10. Plugboard Input Handling
        const onPlugboardInput = (index) => {
            let raw = plugboardPairs.value[index]
                .toUpperCase()
                .replace(/[^A-Z]/g, "")
                .slice(0, 2);

            const usedElsewhere = plugboardPairs.value
                .map((v, i) => (i === index ? "" : v))
                .join("")
                .split("");

            const unique = [...new Set(raw)].filter(char => !usedElsewhere.includes(char));
            plugboardPairs.value[index] = unique.join("");
        };



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
            loadNextPage,
            reflectors,
            ringOptions,
            ringstellungEnabled,
            rotorOptions,
            settings,
            showRotorOrderFilter,
            showRotorPositionFilter,
            toggleRingstellung,
            toggleRotorOrderFilter,
            toggleRotorPositionFilter,
            toggleSteckerbrett,
            steckerbrettEnabled,
            formatRotorOrder,
            formatRotorOrderWithNumbers,
            formatRotorPositionCompact,
            formatCycleNumbers,
            formatNumber,
            manualKeyRefs,
            manual_keys: settings.value.parameters.manual_keys,
            plugboardPairs,
            onPlugboardInput,
            availableRotors,
            availableRotors_filter,
        };
    },
};
</script>


<style scoped>
/* =========[ 1. Layout & Struktur ]========= */
.scroll-buffer {
    height: 200px;
}

.form-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
}

.left-form,
.right-form {
    flex: 1;
    max-width: 48%;
}


/* =========[ 2. Formulare & Steuerelemente ]========= */
.enigma-setting {
    display: grid;
    grid-template-columns: 220px 1fr;
    align-items: start;
    gap: 0.5rem 1.5rem;
    margin-bottom: 1.5rem;
}

.enigma-setting > label {
    font-weight: bold;
    padding-top: 0.4rem;
    text-align: right;
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

.dropdown-wrapper {
    min-height: 30px;
    height: 30px;
}

.manual-keys-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.1rem;
    padding: 0.1rem;
}

.manual-key-row {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    margin-bottom: 0.3rem;
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

.manual-button,
.delete-last-btn .load-controls {
    background-color: #eee;
    border: 1px solid #ccc;
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
    height: 2.3rem;
    cursor: pointer;
    white-space: nowrap;
}

.manual-button:hover,
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
    min-width: 160px;
    min-height: 40px;
    text-align: center;
    display: inline-block;
}

.submit-btn:hover {
    background-color: #45a045;
}

.submit-button {
    margin: 2rem 0;
}


/* =========[ 3. Tabelle / Rotoranzeige ]========= */
table {
    width: auto;              /* Passt sich dem Inhalt an */
    max-width: 100%;          /* Verhindert Überlauf bei kleinen Bildschirmen */
    table-layout: fixed;
    margin: 1rem auto;        /* Zentriert die Tabelle */
    border-collapse: collapse;
}


table th,
table td {
    padding: 0.5rem;
    text-align: left;
    border: 2px solid #000000;
    font-size: 1.5rem;
}

table th {
    background-color: #f6f6f6;
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
  width: 280px;
  min-width: 120px;
  max-width: 280px;
  white-space: nowrap;
}

/* Spalte 3: Walzenposition */
table th:nth-child(3),
table td:nth-child(3) {
  width: 230px;
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
  width: 180px;
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
    background-color: #f9f9f9;
}


.tabelle_format {
    font-family: monospace;
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
.cycle-item {
    background-color: #f0f0f0;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.95rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    width: 2ch;
    text-align: center;
    display: inline-block;
}


/* =========[ 5. Infoanzeige / Info-Elemente ]========= */
.info-item {
    display: flex;
    justify-content: space-around;
    min-width: 350px;
    max-width: fit-content;
}

.info-item label {
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.1;
}

.info-item span {
    font-size: 1rem;
    font-weight: 600;
    background-color: #f0f0f0;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    min-width: 60px;
    text-align: center;
}

.load-controls {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.centered-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    width: 100%;
}


/* =========[ 6. Filter / Zusatz-Funktionen ]========= */
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
</style>
