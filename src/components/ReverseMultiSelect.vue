<script setup>
import { computed, ref, onMounted } from 'vue'
import ToggleSwitch from './ToggleSwitch.vue'
import TooltipLabel from './TooltipLabel.vue'

const props = defineProps({
  single: { type: [String, Number], required: false },
  array: { type: Array, required: false },
  arrayOptions: { type: [Array], default: () => [] },
  singleOptions: { type: Array, default: () => [] },
  toggle: { type: Boolean, required: false, default: true },
  toggleLabel: { type: String, required: false },
  isSingleEnabled: { type: Boolean, default: true },
  isArrayEnabled: { type: Boolean, default: true },
  label: { type: String, required: false },
  info: { type: String, required: false }
})

const emit = defineEmits(['update:single', 'update:array', 'update:toggle'])

const hasSingle = computed(() => props.single !== undefined)
const reversedArray = computed(() => [...(props.array || [])].reverse())

const rawWidth = ref(85)
const rawGap = ref(8)

onMounted(() => {
  document.documentElement.style.setProperty('--select-width', `${rawWidth.value}px`)
  document.documentElement.style.setProperty('--select-gap', `${rawGap.value}px`)
})

const singleStyle = computed(() => {
  const len = props.array?.length ?? 0

  if (len === 3) {
    return { width: `${2 * rawWidth.value + rawGap.value}px` }
  }

  if (len === 0) {
    return { width: `${3 * rawWidth.value + 2 * rawGap.value}px` }
  }

  return { width: `${rawWidth.value}px` }
})

const isSingleSelectEnabled = computed(() => props.isSingleEnabled && props.toggle)
const isArraySelectEnabled = computed(() => props.isArrayEnabled && props.toggle)

const showSeparator = computed(() => hasSingle.value && (props.array?.length ?? 0) > 0)


function onSingleChange(e) {
  emit('update:single', e.target.value)
}

function onArrayChange(e, idx) {
  const updated = [...(props.array || [])]
  updated[idx] = e.target.value
  emit('update:array', updated)
}

function onToggleChange(val) {
  emit('update:toggle', val)
}

function getArrayOptions(idx) {
  const opts = props.arrayOptions
  if (Array.isArray(opts[0])) {
    return opts[idx] || []
  }
  return opts
}
</script>


<template>
  <div class="enigma-setting">
    <label class="label">
      <TooltipLabel v-if="props.label" :label="props.label" :info="props.info" />
    </label>

    <div class="select-row right-align" v-if="hasSingle">
<!-- Single Select -->
<select
  :value="single"
  @change="onSingleChange"
  :style="singleStyle"
  :disabled="!isSingleSelectEnabled"
>
  <option
    v-for="option in singleOptions"
    :key="option.value"
    :value="option.value"
  >
    {{ option.label }}
  </option>
</select>

<!-- Separator -->
<span v-if="showSeparator" class="separator">|</span>

<!-- Array Selects -->
<template v-for="(value, idx) in reversedArray" :key="idx">
        <select
          :value="value"
          @change="e => onArrayChange(e, array.length - 1 - idx)"
          :disabled="!isArraySelectEnabled"
        >
          <option
            v-for="option in getArrayOptions(array.length - 1 - idx)"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </template>
    </div>

    <div class="select-row right-align" v-else>
      <ToggleSwitch
        v-if="toggle !== undefined && toggleLabel !== undefined"
        :model-value="toggle"
        @update:model-value="onToggleChange"
      >
        {{ toggleLabel }}
      </ToggleSwitch>

      <!-- Array Selects (no single) -->
      <template v-for="(value, idx) in reversedArray" :key="idx">
        <select
          :value="value"
          @change="e => onArrayChange(e, array.length - 1 - idx)"
          :disabled="!isArraySelectEnabled"
        >
          <option
            v-for="option in getArrayOptions(array.length - 1 - idx)"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </template>
    </div>
  </div>
</template>

<style>

</style>

<style scoped>
.select-row {
  display: flex;
  align-items: center;
  text-align: center;
  flex: 1;
  gap: var(--select-gap);
  margin-bottom: 8px;
  justify-content: flex-start;
}

.label{
  font-weight: bold;
}

.select-row.right-align {
  justify-content: flex-end;
}

select {
  width: var(--select-width);
  font-size: 1rem;
  text-align: center;
  padding: 0.3rem;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #bbb;
  font-family: inherit;
  line-height: 1.2;
}



select:disabled {
  background-color: #fff;
  color: #000000;
  cursor: not-allowed;
}

.separator {
  margin: 0 8px;
  color: #aaa;
  font-weight: bold;
  font-size: 1.2rem;
  user-select: none;
  line-height: 1;
}


</style>
