<template>
  <span class="label-with-tooltip">
    {{ label }}
    <span v-if="info" ref="infoIcon" class="info-icon" @mouseenter="checkPosition" @mouseleave="resetPosition">
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

  const iconRect = icon.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()

  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  // Zeige Tooltip unten, wenn oben nicht genug Platz
  if (iconRect.top - tooltipRect.height < 0) {
    showBelow.value = true
  } else if (iconRect.bottom + tooltipRect.height > viewportHeight) {
    // Wenn unten auch nicht passt → oben anzeigen
    showBelow.value = false
  }

  // Optional: Tooltip horizontal verschieben wenn nötig
  const overflowRight = iconRect.left + tooltipRect.width / 2 > viewportWidth
  const overflowLeft = iconRect.left - tooltipRect.width / 2 < 0

  if (overflowRight) {
    tooltip.style.left = 'auto'
    tooltip.style.right = '0'
    tooltip.style.transform = 'none'
  } else if (overflowLeft) {
    tooltip.style.left = '0'
    tooltip.style.right = 'auto'
    tooltip.style.transform = 'none'
  } else {
    tooltip.style.left = '50%'
    tooltip.style.right = 'auto'
    tooltip.style.transform = 'translateX(-50%)'
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
  font-size: 1rem;
  pointer-events: none;
  max-width: 600px;
  /* Maximalbreite */
  min-width: 300px;
  /* Mindestbreite */
  white-space: normal;
  /* Zeilenumbruch */
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
