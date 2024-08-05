<script setup>
import { useStore } from '@/store.js'
import { ref, computed } from 'vue'

import RolesAssignment from '@/components/RolesAssignment.vue'

const state = computed(() => useStore().gameState)
</script>

<template>
    <div class="container-fluid justify-content-center text-center">
        <!-- prompt to start role assignment if state is setup -->
        <div v-if="state === 'setup' || state === 'rolesAssignment'">
            <h1>Roles assignment</h1>

            <button style="margin-top: 20px;" v-if="state === 'setup'" class="btn btn-light btn-lg"
                @click="useStore().gameState = 'rolesAssignment'">Start</button>
            <RolesAssignment v-if="state === 'rolesAssignment'" />
        </div>
    </div>
</template>