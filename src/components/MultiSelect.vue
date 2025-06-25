<!-- components/MultiSelect.vue -->
<template>
    <div class="dropdowns">
        <template v-for="(value, idx) in localValues" :key="idx">
            <select :value="value" @change="onChange($event, idx)"
                :disabled="disabled || disabledIndexes.includes(idx)">
                <option v-for="option in getOptions(idx)" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [Array, String, Number, null],
        default: () => []
    },
    options: {
        type: Array,
        required: true
    },
    selectCount: {
        type: Number,
        default: 1
    },
    disabled: {
        type: Boolean,
        default: false
    },
    disabledIndexes: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

const localValues = computed({
    get() {
        const base = Array.isArray(props.modelValue) ? [...props.modelValue] : [props.modelValue]
        while (base.length < props.selectCount) base.push(null)
        return base.slice(0, props.selectCount)
    },
    set(val) {
        emit('update:modelValue', props.selectCount === 1 ? val[0] : val)
    }
})

const getOptions = (idx) => {
    return Array.isArray(props.options[0]) ? props.options[idx] || [] : props.options
}

function onChange(event, idx) {
    const updated = [...localValues.value]
    updated[idx] = event.target.value
    localValues.value = updated
}
</script>

<style scoped></style>
