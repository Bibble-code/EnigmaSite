<template>
  <span class="label-with-tooltip">
    {{ label }}
    <span
      ref="infoIcon"
      class="info-icon"
      @mouseenter="checkPosition"
      @mouseleave="resetPosition"
    >
      🛈
      <span :class="['tooltip', { 'tooltip-bottom': showBelow }]">{{ info }}</span>
    </span>
  </span>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  info: String
})

const infoIcon = ref(null)
const showBelow = ref(false)

function checkPosition() {
  const icon = infoIcon.value
  if (!icon) return

  const tooltip = icon.querySelector('.tooltip')
  if (!tooltip) return

  // Tooltip Höhe & Position berechnen
  const tooltipHeight = tooltip.offsetHeight
  const iconRect = icon.getBoundingClientRect()

  // Wenn Tooltip nach oben rausfällt (Fenster obere Kante)
  if (iconRect.top - tooltipHeight < 0) {
    showBelow.value = true
  } else {
    showBelow.value = false
  }
}

function resetPosition() {
  showBelow.value = false
}
</script>

<style scoped>
.label-with-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.info-icon {
  position: relative;
  font-style: normal;
  font-size: 0.85rem;
  color: #007bff;
  cursor: help;
}

.tooltip {

  visibility: hidden;
  opacity: 0;
  background-color: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: normal;
  z-index: 10;
  transition: opacity 0.2s;
  font-size: 0.75rem;
  pointer-events: none;
    max-width: 600px;  /* Maximalbreite */
  min-width: 300px;  /* Mindestbreite */
  white-space: normal; /* Zeilenumbruch */
   text-align: left;
}

.tooltip-bottom {
  top: 125%;
  bottom: auto;
}

.info-icon:hover .tooltip,
.info-icon:hover .tooltip-bottom {
  visibility: visible;
  opacity: 1;
}
</style>
