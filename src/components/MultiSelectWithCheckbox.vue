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

      <label v-if="hasCheckbox" class="switch">
        <input type="checkbox" v-model="checkboxModelValue" />
        <span class="slider"></span>
        <span class="toggle-label">
          {{ checkboxModelValue ? 'Deaktivieren' : 'Aktivieren' }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
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
.dropdowns {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  flex: 1;
}

.dropdowns select {
  width: 70px;
  font-size: 1rem;
  text-align: center;
  padding: 0.3rem;
  box-sizing: border-box;
}
</style>

<style scoped>
.enigma-setting {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: center;
  gap: 0.5rem 1.5rem;
  margin-bottom: 1.5rem;
}

.label {
  font-weight: bold;
  padding-top: 0.4rem;
  text-align: left;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.switch input {
  display: none;
}

.slider {
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s;
}

.slider::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  top: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.switch input:checked+.slider {
  background-color: #007bff;
}

.switch input:checked+.slider::before {
  transform: translateX(20px);
}

.toggle-label {
  display: inline-block;
  min-width: 90px;
}
</style>
