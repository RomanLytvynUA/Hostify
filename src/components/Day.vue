<script setup>
import { useStore } from '@/store.js'
import { useGameLog } from '@/log.js'
import { computed, nextTick, ref, onMounted, watch } from 'vue'

import Timer from './Timer.vue'
import Voting from './Voting.vue'

const emit = defineEmits(['dayEnded'])

/**
Day states:
- testaments
- playersSpeeches
- votingNomination // for muted players
- voting
- defenceSpeeches
**/
const state = ref(useStore().testamentsQueue.length ? 'testaments' : 'playersSpeeches')

useStore().musicPlaying = false;
useStore().cycle += 1;
useGameLog().logPhase(`DAY ${useStore().cycle}`)

const votingNomination = ref('None')
const timer = ref(null)
const voting = ref(null)

const playersData = computed(() => useStore().playersData);

const votingNominations = ref([])
const firstSpeechPlayer = useStore().firstPlayerToSpeak
const lastSpeechPlayer = firstSpeechPlayer == 1 ? 10 : firstSpeechPlayer - 1
const playerSpeaking = ref(playersData.value.find((player) => player.number == firstSpeechPlayer))
// log the first player speaking if there are no testaments
if (state.value === 'playersSpeeches') {
    if (!playerSpeaking.value.dead) {
        useGameLog().logEvent(`${playerSpeaking.value.name} gives a speech.`)
    }
} else {
    useGameLog().logEvent(`${playersData.value.find(player => player.number === Number(useStore().testamentsQueue[0])).name} leaves a testament.`)
}

// next day a player next to the one that speaks first now will speak first
useStore().firstPlayerToSpeak = (firstSpeechPlayer % 10) + 1;

let agendaFinished = false;
function skipSpeech() {
    if (votingNomination.value !== 'None') {
        votingNominations.value.push(votingNomination.value)
        useGameLog().logEvent(`${playerSpeaking.value.name} nominates ${votingNomination.value.name} for voting.`)
        votingNomination.value = 'None';
    }
    // start voting if all players have spoken
    if (lastSpeechPlayer === playerSpeaking.value.number) {
        agendaFinished = true;
        state.value = 'voting';
    } else {
        state.value = 'playersSpeeches';
        playerSpeaking.value = playersData.value.find((player) => player.number == (playerSpeaking.value.number % 10) + 1);
        
        timer.value?.restart();
        if (!playerSpeaking.value.dead) {
            useGameLog().logEvent(`${playerSpeaking.value.name} gives a speech.`)
        }
        
        if (playerSpeaking.value.skipNextSpeech) {
            state.value = 'votingNomination'
            if (!playerSpeaking.value.dead) {
                useGameLog().logEvent(`${playerSpeaking.value.name} is mute for this round.`)
            }
        }
    }
}

const testamentsQueue = ref(useStore().testamentsQueue)
function skipTestament() {
    const player = playersData.value.find(player => player.number === Number(testamentsQueue.value[0]))
    player.dead = true
    testamentsQueue.value.shift()
    
    if (testamentsQueue.value.length) {
        timer.value?.restart();
        useGameLog().logEvent(`${playersData.value.find(player => player.number === Number(testamentsQueue.value[0])).name} leaves a testament.`)
    } else {
        useStore().evaluateGame()
        if (agendaFinished) {
            emit('dayEnded')
        } else {
            state.value = 'playersSpeeches'
            if (!playerSpeaking.value.dead) {
                useGameLog().logEvent(`${playerSpeaking.value.name} gives a speech.`)
            }
        }
    }
}

const defenceSpeechesQueue = ref([])
async function skipDefenseSpeech() {
    const player = playersData.value.find(player => player.number === Number(defenceSpeechesQueue.value[0]))
    votingNominations.value.push(player)
    defenceSpeechesQueue.value.shift()
    
    if (defenceSpeechesQueue.value.length) {
        timer.value?.restart();
        useGameLog().logEvent(`${playersData.value.find(player => player.number === Number(defenceSpeechesQueue.value[0])).name} gives a defense speech.`)
    } else {
        state.value = 'voting'
        await nextTick()
        voting.value.type = 'revoting'
    }
}

// make sure dead players don't get to speak
watch([() => playerSpeaking.value, () => playersData.value], async () => {
    if ((playersData.value.find((player) => player.number == playerSpeaking.value.number)).dead) {
        skipSpeech()
    }
}, { immediate: true, deep: true })

watch([() => useStore().votingsToSkip, () => state.value], () => {
    if (state.value == 'voting' && 
        (useStore().votingsToSkip > 0 || votingNominations.value.length === 0) || (useStore().cycle == 1 && votingNominations.value.length === 1)
    ) {
        // skip voting if forced by votingsToSkip OR there are no nominations OR it's the first cycle and there is a single nominee
        emit('dayEnded')

        // decrease votingsToSkip count 
        if (useStore().votingsToSkip > 0) {
            useStore().votingsToSkip = useStore().votingsToSkip - 1
        }
    }
})

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
            <p class="secondary-txt" style="margin-bottom: 8px;">Give {{ playerSpeaking.name }} a
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

            <button class="btn btn-dark" @click="skipSpeech()">Continue</button>
        </div>
        
        <!-- Voting nomination -->
        <div v-if="state === 'votingNomination'">
            <p class="secondary-txt" style="margin-bottom: 8px;">Please, let {{ playerSpeaking.name }} nominate a player for voting. The player is muted for this round.</p>
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
            <br>

            <button class="btn btn-dark" @click="playerSpeaking.skipNextSpeech = false; skipSpeech()">Continue</button>
        </div>

        <!-- Voting -->
        <div v-if="state === 'voting'">
            <Voting 
            ref="voting"
            @noEliminations="() => $emit('dayEnded')"
            @playersEliminated="(players) => {
                testamentsQueue = players; 
                state='testaments'; 
                useGameLog().logEvent(`${playersData.find(player => player.number === Number(players[0])).name} leaves a testament.`)
            }"
            @revote="(players) => {
                defenceSpeechesQueue = players; 
                state='defenceSpeeches'; 
                votingNominations = [];
                useGameLog().logEvent(`${playersData.find((player) => player.number === Number(defenceSpeechesQueue[0])).name} gives a defense speech.`)
            }" 
            :nominations="votingNominations" />
        </div>

        <!-- Testaments -->
        <div v-if="state === 'testaments'">
            <p class="secondary-txt" style="margin-bottom: 8px;">{{ playersData.find(player => player.number === Number(testamentsQueue[0])).name }} has a minute for a testament.</p>
            <Timer ref="timer" time="01:00" />
            <br>

            <button class="btn btn-dark" @click="skipTestament()">Continue</button>
        </div>
        
        <!-- Defence Speeches -->
        <div v-if="state === 'defenceSpeeches'">
            <p class="secondary-txt" style="margin-bottom: 8px;">{{ playersData.find(player => player.number === Number(defenceSpeechesQueue[0])).name }} has 30 seconds for a defence speech.</p>
            <Timer ref="timer" time="00:30" />
            <br>

            <button class="btn btn-dark" @click="skipDefenseSpeech()">Continue</button>
        </div>
    </div>
</template>