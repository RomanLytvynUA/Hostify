<script setup>
import { useStore } from '@/store.js'
import { computed, nextTick, ref, onMounted, watch } from 'vue'

import Timer from './Timer.vue'
import Voting from './Voting.vue'

const emit = defineEmits(['dayEnded'])

/**
Day states:
- testaments
- playersSpeeches
- voting
- defenceSpeeches
**/
const state = ref(useStore().testamentsQueue.length ? 'testaments' : 'playersSpeeches')

useStore().musicPlaying = false;
useStore().cycle += 1;

const votingNomination = ref('None')
const timer = ref(null)
const voting = ref(null)

const playersData = computed(() => useStore().playersData);

const votingNominations = ref([])
const firstSpeechPlayer = useStore().firstPlayerToSpeak
const lastSpeechPlayer = firstSpeechPlayer == 1 ? 10 : firstSpeechPlayer - 1
const playerSpeaking = ref(playersData.value.find((player) => player.number == firstSpeechPlayer))
// next day a player next to the one that speaks first now will speak first
useStore().firstPlayerToSpeak = (firstSpeechPlayer % 10) + 1;

let agendaFinished = false;
function skipSpeech() {
    if (votingNomination.value !== 'None') {
        votingNominations.value.push(votingNomination.value)
        votingNomination.value = 'None';
    }
    // start voting if all players have spoken
    if (lastSpeechPlayer === playerSpeaking.value.number) {
        agendaFinished = true;
        // end day if only 1 player was nominated in the 1st cycle or there are no nominations
        if ((useStore().cycle == 1 && votingNominations.value.length === 1) || votingNominations.value.length === 0) {
            emit('dayEnded')
        } else {
            state.value = 'voting'
        }
    } else {
        playerSpeaking.value = playersData.value.find((player) => player.number == (playerSpeaking.value.number % 10) + 1);
        timer.value?.restart();
    }
}

const testamentsQueue = ref(useStore().testamentsQueue)
function skipTestament() {
    const player = playersData.value.find(player => player.number === Number(testamentsQueue.value[0]))
    player.dead = true
    testamentsQueue.value.shift()
    
    if (testamentsQueue.value.length) {
        timer.value?.restart();
    } else {
        useStore().evaluateGame()
        if (agendaFinished) {
            emit('dayEnded')
        } else {
            state.value = 'playersSpeeches'
        }
    }
}

const defenceSpeechesQueue = ref([])
async function skipDefenceSpeech() {
    const player = playersData.value.find(player => player.number === Number(defenceSpeechesQueue.value[0]))
    votingNominations.value.push(player)
    defenceSpeechesQueue.value.shift()
    
    if (defenceSpeechesQueue.value.length) {
        timer.value?.restart();
    } else {
        state.value = 'voting'
        await nextTick()
        voting.value.type = 'revoting'
    }
}

// make sure dead players don't get to speak
watch([() => playerSpeaking.value, () => playersData.value], () => {
    if (playerSpeaking.value.dead) {
        skipSpeech()
    }
}, { immediate: true, deep: true })

onMounted(() => {
    // set mandatory players properties if missing
    playersData.value.forEach(player => {
        if (!('dead' in player)) {
            player.dead = false
        }
    });
})
</script>

<template>
    <div class="container text-center">
        <!-- Agenda -->
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

        <!-- Voting -->
        <div v-if="state === 'voting'">
            <Voting 
            ref="voting"
            @noEliminations="() => $emit('dayEnded')"
            @playersEliminated="(players) => {testamentsQueue = players; state='testaments'}"
            @revote="(players) => {defenceSpeechesQueue = players; state='defenceSpeeches'; votingNominations = []}" 
            :nominations="votingNominations" />
        </div>

        <!-- Testaments -->
        <div v-if="state === 'testaments'">
            <p style="margin-bottom: 8px;">{{ playersData.find(player => player.number === Number(testamentsQueue[0])).name }} has a minute for a testament.</p>
            <Timer ref="timer" time="01:00" />
            <br>

            <button class="btn btn-light" @click="skipTestament()">Continue</button>
        </div>
        
        <!-- Defence Speeches -->
        <div v-if="state === 'defenceSpeeches'">
            <p style="margin-bottom: 8px;">{{ playersData.find(player => player.number === Number(defenceSpeechesQueue[0])).name }} has 30 seconds for a defence speech.</p>
            <Timer ref="timer" time="00:30" />
            <br>

            <button class="btn btn-light" @click="skipDefenceSpeech()">Continue</button>
        </div>
    </div>
</template>