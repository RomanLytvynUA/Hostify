<script setup>
import { useStore } from '@/store.js'
import { ref, computed } from 'vue'

import RolesAssignment from '@/components/RolesAssignment.vue'
import FirstNight from '@/components/FirstNight.vue'
import Day from '@/components/Day.vue'
import Night from '@/components/Night.vue'

const state = computed(() => useStore().gameState)
</script>

<template>
    <div class="container-fluid justify-content-center text-center">

        <!-- ROLES ASSIGNMENT -->
        <div v-if="state === 'rolesAssignmentPrep' || state === 'rolesAssignment'">
            <h1>Roles assignment</h1>

            <!-- prompt to start role assignment if state is rolesAssignmentPrep -->
            <button style="margin-top: 20px;" v-if="state === 'rolesAssignmentPrep'" class="btn btn-primary btn-lg"
                @click="useStore().gameState = 'rolesAssignment'">Start</button>

            <RolesAssignment @rolesAssigned="() => {
                useStore().gameState = 'firstNightPrep'
                // evaluate game just in case if too many players vere expelled during roles assignment
                useStore().evaluateGame()
            }" v-if="state === 'rolesAssignment'" />
        </div>

        <!-- FIRST NIGHT -->
        <div v-if="state === 'firstNightPrep' || state === 'firstNight'">
            <h1>Night</h1>

            <!-- prompt to start the first night if state is rolesAssignmentPrep -->
            <button style="margin-top: 20px;" v-if="state === 'firstNightPrep'" class="btn btn-primary btn-lg"
                @click="useStore().gameState = 'firstNight'">Start</button>

            <FirstNight @nightEnded="useStore().gameState = 'dayPrep'" v-if="state === 'firstNight'" />
        </div>

        <!-- DAY -->
        <div v-if="state === 'day' || state === 'dayPrep'">
            <h1>Day</h1>

            <!-- prompt to start the day if state is dayPrep -->
            <button style="margin-top: 20px;" v-if="state === 'dayPrep'" class="btn btn-primary btn-lg"
                @click="useStore().gameState = 'day'">Start</button>

            <Day @dayEnded="useStore().gameState = 'nightPrep'" v-if="state === 'day'" />
        </div>
        
        <!-- NIGHT -->
        <div v-if="state === 'night' || state === 'nightPrep'">
            <h1>Night</h1>

            <!-- prompt to start the night if state is nightPrep -->
            <button style="margin-top: 20px;" v-if="state === 'nightPrep'" class="btn btn-primary btn-lg"
                @click="useStore().gameState = 'night'">Start</button>

            <Night @nightEnded="useStore().gameState = 'dayPrep'" v-if="state === 'night'" />
        </div>

        <div v-if="state === ''">
            undifined state
        </div>
    </div>
</template>