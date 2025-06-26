<template>
  <label class="switch">
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
    <span class="slider"></span>
    <span class="toggle-label"><slot /></span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean
})
</script>

<style scoped>
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

.switch input:checked + .slider {
  background-color: #007bff;
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}

.toggle-label {
  display: inline-block;
  min-width: 90px;
  text-align: left;
}
</style>
