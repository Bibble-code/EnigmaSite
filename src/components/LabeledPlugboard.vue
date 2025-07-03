<template>
    <div class="enigma-setting">
        <label class="label-with-tooltip">
            <TooltipLabel :label="label" :info="info" />
        </label>
        <Plugboard v-model="internalValue" :pairCount="pairCount" />
    </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import TooltipLabel from './TooltipLabel.vue'
import Plugboard from './Plugboard.vue'

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

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    internalValue.value = val
})

watch(internalValue, (val) => {
    emit('update:modelValue', val)
})
</script>

<style scoped></style>
