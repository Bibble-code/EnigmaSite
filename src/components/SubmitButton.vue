<template>
  <button :disabled="disabled || loading" class="submit-button">
    <span v-if="loading">Lädt...</span>
    <span v-else><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.submit-button {
  padding: 0.6rem 1.2rem;
  background-color: #0052cc;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;    /* Button füllt die gesamte Breite des Containers */
  margin-top: 1rem;
  box-sizing: border-box; /* wichtig, damit Padding in Breite eingerechnet wird */
}


.submit-button:disabled {
  background-color: #8fa7ca;
  cursor: not-allowed;
}

</style>
