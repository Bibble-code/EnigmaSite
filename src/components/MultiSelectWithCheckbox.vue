<template>
  <div class="enigma-setting">
    <label class="label">
      <TooltipLabel :label="label" :info="info" />
    </label>
    <div class="dropdowns">
      <template v-for="(value, idx) in values" :key="idx">
        <select :value="values[idx]" @change="onSelectChange($event, idx)"
          :disabled="props.disabledIndexes.includes(idx) || props.disabled || (hasCheckbox && !checkboxModelValue)">
          <option v-for="option in (Array.isArray(props.options[0]) ? props.options[idx] : props.options)"
            :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </template>

    <ToggleSwitch v-if="hasCheckbox" v-model="checkboxModelValue">
      {{ checkboxModelValue ? 'Deaktivieren' : 'Aktivieren' }}
    </ToggleSwitch>
    </div>
  </div>
</template>

<script setup>
import ToggleSwitch from './ToggleSwitch.vue'
import TooltipLabel from './TooltipLabel.vue'
import { computed } from 'vue'

const props = defineProps({
  label: String,
  info: String,
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [Array, String, Number, null],
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false  // default aktiv (nicht disabled)
  },
  showCheckbox: {
    type: Boolean,
    default: false
  },
  selectCount: {
    type: Number,
    default: 1
  },
  disabledIndexes: {
    type: Array,
    default: () => []
  }
})

const checkboxModelValue = defineModel('checkboxModelValue', {
  required: false,
})

const hasCheckbox = computed(() => props.showCheckbox)

const emit = defineEmits(['update:modelValue', 'update:checkboxModelValue'])

const values = computed({
  get() {
    if (Array.isArray(props.modelValue)) {
      const arr = [...props.modelValue]
      while (arr.length < props.selectCount) arr.push(null)
      return arr.slice(0, props.selectCount)
    } else {
      const arr = [props.modelValue]
      while (arr.length < props.selectCount) arr.push(null)
      return arr.slice(0, props.selectCount)
    }
  },
  set(newVals) {
    if (props.selectCount === 1) {
      emit('update:modelValue', newVals[0])
    } else {
      emit('update:modelValue', newVals)
    }
  }
})

function onSelectChange(event, idx) {
  const newVals = [...values.value]
  newVals[idx] = event.target.value
  values.value = newVals
}
</script>


<style>



</style>

<style scoped>


</style>
