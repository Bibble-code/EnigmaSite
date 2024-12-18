<template>
    <div v-if="!cycles">
    loading...
    </div>
    <div v-if="cycles">
    <p v-for="cycle in cycles" :key="cycle.id">
        1. Zyklus: {{ cycle.cycle1 }}, 
        2. Zyklus: {{ cycle.cycle2 }}, 
        3. Zyklus: {{ cycle.cycle3 }}, 
        Positionen: {{ cycle.positions }}, 
        Walzen: {{ cycle.rotors }}, 
    </p>        
    </div>

</template>

<script>
import { ref } from 'vue';
import CyclesDatabase from '@/services/Cycles/CyclesDatabase';

export default {
    setup() {
        const cycles = ref([])

        const loadCycles = async () => {
            try {
                const response = await CyclesDatabase.getCycles()
                cycles.value = response.data
                
            } catch (err) {
                console.log(err)
            }
            console.log("test",cycles.value)
        }
        loadCycles()
        return { cycles }
    }
}
</script>

<style></style>