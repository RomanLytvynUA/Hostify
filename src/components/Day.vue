<script setup>
import { useStore } from '@/store.js'
import { computed, ref, onMounted, watch } from 'vue'

import Timer from './Timer.vue'
import Voting from './Voting.vue'

const emit = defineEmits(['dayEnded'])

/**
Day states:
- playersSpeeches
- voting
- testament
**/
const state = ref('playersSpeeches')

useStore().musicPlaying = false;
useStore().cycle += 1;

const votingNomination = ref('None')
const timer = ref(null)

const playersData = computed(() => useStore().playersData);
const votingNominations = ref([])

const firstSpeechPlayer = useStore().firstPlayerToSpeak
const lastSpeechPlayer = firstSpeechPlayer == 1 ? 10 : firstSpeechPlayer - 1
const playerSpeaking = ref(playersData.value.find((player) => player.number == firstSpeechPlayer))
// next day a player next to the one that speaks first now will speak first
useStore().firstPlayerToSpeak = (firstSpeechPlayer % 10) + 1;

function skipSpeech() {
    // start voting if all players have spoken
    if (lastSpeechPlayer === playerSpeaking.value.number) {
        // end day if only 1 player was nominated in the 1st cycle or there are no nominations
        if ((useStore().cycle == 1 && votingNominations.value.length === 1) || votingNominations.value.length === 0) {
            emit('dayEnded')
        }
        state.value = 'voting'
    } else {
        playerSpeaking.value = playersData.value.find((player) => player.number == (playerSpeaking.value.number % 10) + 1);
        timer.value?.restart();
        votingNomination.value !== 'None' && votingNominations.value.push(votingNomination.value)
        votingNomination.value = 'None';
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
            <p style="margin-bottom: 8px;">Give {{ playerSpeaking.name }} a
                minute to speak.</p>
            <div class="d-flex justify-content-center align-items-center mb-3">
                <label class="me-2">Voting nomination:</label>
                <select v-model="votingNomination" class="form-select form-select-sm w-auto">
                    <option>None</option>
                    <option v-for="player in playersData" :value="player"
                        :disabled="player.dead || votingNominations.includes(player)">#{{ player.number }} -
                        {{ player.name
                        }}
                    </option>
                </select>
            </div>

            <Timer ref="timer" time="01:00" />
            <br>

            <button class="btn btn-light" @click="skipSpeech()">Continue</button>
        </div>
        <div v-if="state === 'voting'">
            <Voting :nominations="votingNominations" />
        </div>
    </div>
</template>