<template>
    <div class="plugboard-container">
        <input v-for="(pair, index) in pairs" :key="index" v-model="pairs[index]" @input="onInput(index, $event)"
            maxlength="2" type="text" spellcheck="false" autocomplete="off" autocorrect="off"
            autocapitalize="characters" />

    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification';


// === TOAST INITIALISIERUNG ===
const toast = useToast();
const lastToastTime = ref(0)

const showToastLimited = (msg, type = 'info', options = {}) => {
  const now = Date.now();
  if (now - lastToastTime.value > 1000) {
    toast[type](msg, options);
    lastToastTime.value = now;
  }
};


const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    },
    pairCount: {
        type: Number,
        default: 10
    }
})

const emit = defineEmits(['update:modelValue'])

const pairs = ref([])

const initPairs = () => {
    const rawPairs = props.modelValue.match(/.{1,2}/g) || []
    pairs.value = Array(props.pairCount).fill("").map((_, i) => rawPairs[i] || "")
}
initPairs()

watch(() => props.modelValue, (newVal) => {
    const rawPairs = newVal.match(/.{1,2}/g) || []
    pairs.value = Array(props.pairCount).fill("").map((_, i) => rawPairs[i] || "")
})

watch(pairs, (newPairs) => {
    const combined = newPairs.join('')
    emit('update:modelValue', combined)
}, { deep: true })


const onInput = (index, event) => {
  // Schritt 1: Eingabe grob bereinigen (nur A-Z, Großbuchstaben, max 2)
  let raw = event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);

  pairs.value[index] = raw;

  // Schritt 2: Gesamten Wert sanitizen
  sanitizePairs();
};

const sanitizePairs = () => {
  // 1. Kompletten String aus allen pairs holen
  let allChars = pairs.value.join('').toUpperCase();

  // 2. Nur Buchstaben behalten, alle anderen Zeichen entfernen
  allChars = allChars.replace(/[^A-Z]/g, '');

  const seen = new Set();
  let changed = false;
  let filteredChars = '';

  // 3. Duplikate entfernen, nur erste Vorkommen behalten
  for (const char of allChars) {
    if (!seen.has(char)) {
      seen.add(char);
      filteredChars += char;
    } else {
      changed = true;
    }
  }

  // 4. Paare neu zusammensetzen (je 2 chars)
  const chunkedPairs = [];
  for (let i = 0; i < filteredChars.length; i += 2) {
    chunkedPairs.push(filteredChars.slice(i, i + 2));
  }

  // 5. Auffüllen bis pairCount
  while (chunkedPairs.length < props.pairCount) {
    chunkedPairs.push('');
  }

  // 6. Nur neu setzen, wenn sich was geändert hat
  if (changed || chunkedPairs.some((val, i) => val !== pairs.value[i])) {
    pairs.value = chunkedPairs;
    showToastLimited("Doppelte Buchstaben wurden entfernt.")
  }
};

</script>

<style scoped>
.plugboard-container {
    display: grid;
    grid-template-columns: repeat(5, 4ch);
    grid-template-rows: repeat(2, auto);
    gap: 19px;
    justify-content: flex-end;
    margin-right: 14px;
    margin-top: 1rem;
}

.plugboard-container input {
    min-width: 4ch !important;
    max-width: 4ch !important;
    width: 4ch !important;
    padding: 2px 2px;
    border: 2px solid #808080;
    box-sizing: border-box;
    font-family: 'Courier New, monospace';
    text-align: center;
    text-transform: uppercase;
    font-size: 1.2rem;
    line-height: 1;
}
</style>
