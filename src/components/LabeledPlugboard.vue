<template>
    <div class="enigma-setting">
        <label class="label-with-tooltip">
            <TooltipLabel :label="label" :info="info" />
        </label>

        <div class="plugboard-container">
            <input v-for="(pair, index) in pairs" :key="index" v-model="pairs[index]" @input="onInput(index)"
                maxlength="2" type="text" spellcheck="false" autocomplete="off" autocorrect="off"
                autocapitalize="characters" style="text-transform: uppercase; width: 50px; margin-right: 8px;" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'
import TooltipLabel from './TooltipLabel.vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    },
    pairCount: {
        type: Number,
        default: 10
    },
    label: {
        type: String,
        default: "Steckerbrett:"
    },
    info: {
        type: String,
        default: "Das Steckerbrett vertauscht Buchstaben. Auf die charakteristischen Zyklen hat das keinen Einfluss."
    }
})

const emit = defineEmits(['update:modelValue'])

const pairs = ref([])

// Initialisiere pairs aus modelValue
const initPairs = () => {
    const rawPairs = props.modelValue.match(/.{1,2}/g) || []
    pairs.value = Array(props.pairCount).fill("").map((_, i) => rawPairs[i] || "")
}
initPairs()

// Synchronisiere pairs, wenn modelValue sich ändert (von außen)
watch(() => props.modelValue, (newVal) => {
    const rawPairs = newVal.match(/.{1,2}/g) || []
    pairs.value = Array(props.pairCount).fill("").map((_, i) => rawPairs[i] || "")
})

// Emitte zusammengesetzten String, wenn pairs sich ändern
watch(pairs, (newPairs) => {
    const combined = newPairs.join('')
    emit('update:modelValue', combined)
}, { deep: true })

// Eingabe validieren und Duplikate verhindern
const onInput = (index) => {
    let raw = pairs.value[index]
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 2)

    const usedElsewhere = pairs.value
        .map((v, i) => (i === index ? '' : v))
        .join('')
        .split('')

    const unique = [...new Set(raw)].filter(char => !usedElsewhere.includes(char))
    pairs.value[index] = unique.join('')
}
</script>


<style scoped>
.enigma-setting {
    display: grid;
    grid-template-columns: 160px 1fr;
    align-items: center;
    gap: 0.5rem 1.5rem;
    margin-bottom: 1.5rem;
}

.label-with-tooltip {
    font-weight: bold;
    padding-top: 0.4rem;
    text-align: left;
}

.plugboard-container {
    display: grid;
    grid-template-columns: repeat(5, 4ch);
    grid-template-rows: repeat(2, auto);
    gap: 15px;
}

.plugboard-container input {
    min-width: 4ch !important;
    max-width: 4ch !important;
    width: 4ch !important;
    padding: 2px 2px;
    border: 2px solid #808080;
    box-sizing: border-box;
    font-family: monospace;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.2rem;
    /* größerer Text */
    line-height: 1;
    /* optional, für bessere vertikale Ausrichtung */
}
</style>
