<script setup>
import { useStore } from '@/store.js'
import { computed, ref, onMounted, watch } from 'vue'

import Timer from './Timer.vue'

/**
Day states:
- playersSpeeches
- testament
**/
const state = ref('playersSpeeches')
useStore().musicPlaying = false;
const timer = ref(null)

const playersData = computed(() => useStore().playersData);

const firstSpeechPlayer = useStore().firstPlayerToSpeak
const lastSpeechPlayer = firstSpeechPlayer == 1 ? 10 : firstSpeechPlayer - 1
const playerSpeaking = ref(playersData.value.find((player) => player.number == firstSpeechPlayer))
// next day a player near the one that speaks first now will speak first
useStore().firstPlayerToSpeak = (firstSpeechPlayer % 10) + 1;

function skipSpeech() {
    // start voting if all players have spoken
    if (lastSpeechPlayer === playerSpeaking.value.number) {
        console.log('voting')
    } else {
        playerSpeaking.value = playersData.value.find((player) => player.number == (playerSpeaking.value.number % 10) + 1)
        timer.value?.restart()
    }
}

// make sure dead players don't get to speak
watch(() => playerSpeaking.value, () => {
    if (playerSpeaking.value.dead) {
        skipSpeech()
    }
}, { immediate: true })

// set mandatory players properties if missing
onMounted(() => {
    playersData.value.forEach(player => {
        if (!('dead' in player)) {
            player.dead = false
        }
    });
})
</script>

<template>
    <div class="container text-center">
        <div v-if="state === 'playersSpeeches'">
            <p>Give {{ playerSpeaking.name }} a minute to speak.</p>
            <Timer ref="timer" time="01:00" />
            <br>
            <button class="btn btn-light" @click="skipSpeech()">Continue</button>
        </div>
        <div v-if="state === 'voting'">
            <p>voting</p>
        </div>
    </div>
</template>