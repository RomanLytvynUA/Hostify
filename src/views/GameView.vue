<script setup>
import { useStore } from '@/store.js'
import { ref, computed } from 'vue'

import RolesAssignment from '@/components/RolesAssignment.vue'
import FirstNight from '@/components/FirstNight.vue'

const state = computed(() => useStore().gameState)
</script>

<template>
    <div class="container-fluid justify-content-center text-center">
        <div v-if="state === 'rolesAssignmentPrep' || state === 'rolesAssignment'">
            <h1>Roles assignment</h1>

            <!-- prompt to start role assignment if state is rolesAssignmentPrep -->
            <button style="margin-top: 20px;" v-if="state === 'rolesAssignmentPrep'" class="btn btn-light btn-lg"
                @click="useStore().gameState = 'rolesAssignment'">Start</button>

            <RolesAssignment @rolesAssigned="useStore().gameState = 'firstNightPrep'"
                v-if="state === 'rolesAssignment'" />
        </div>

        <div v-if="state === 'firstNightPrep' || state === 'firstNight'">
            <h1>Night</h1>

            <!-- prompt to start the first night if state is rolesAssignmentPrep -->
            <button style="margin-top: 20px;" v-if="state === 'firstNightPrep'" class="btn btn-light btn-lg"
                @click="useStore().gameState = 'firstNight'">Start</button>

            <FirstNight @rolesAssigned="useStore().gameState = 'day'" v-if="state === 'firstNight'" />
        </div>
    </div>
</template>