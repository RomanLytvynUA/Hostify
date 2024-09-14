<script setup>
import { useStore } from '@/store.js'
import { computed, ref } from 'vue'

import Timer from './Timer.vue'

/**
First night states:
- mafiaNegotiations
- sheriffInspection
**/
const state = ref('mafiaNegotiations')

const playersData = computed(() => useStore().playersData)
const mafia = ref(playersData.value.filter((player) => player.role === 'Mafia' || player.role === 'Don'))
const sheriff = ref(playersData.value.find((player) => player.role === 'Sheriff'))
</script>

<template>
    <div class="container text-center">
        <div v-if="state === 'mafiaNegotiations'">
            <p>Please, wake up the mafia ({{ mafia[0]?.name }}, {{ mafia[1]?.name }}, and {{ mafia[2]?.name }}). They
                have a
                minute to negotiate.</p>
            <Timer />
            <br>
            <button class="btn btn-light" @click="state = 'sheriffInspection'">Mafia falls asleep</button>
        </div>
        <div v-if="state === 'sheriffInspection'">
            <p>Please, wake up the sheriff ({{ sheriff?.name }}). The sheriff has 30 seconds to take a look at the
                table.</p>
            <Timer time="00:30" />
            <br>
            <button class="btn btn-light" @click="$emit('nightEnded')">The sheriff falls asleep</button>
        </div>
    </div>
</template>