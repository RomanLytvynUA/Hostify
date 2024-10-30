<script setup>
import { useStore } from '@/store.js'
import { ref, computed } from 'vue'

/**
Voting types:
- normal
- revoting
- eliminateAll
**/
const type = ref('normal')
defineExpose({type})
const props = defineProps(['nominations'])
const emit = defineEmits(['playersEliminated', 'revote', 'noEliminations'])

const voters = computed(() => useStore().playersData.filter((player) => player.dead !== true));
const votingQueue = ref(props.nominations)
const votes = ref({})

const currentCandidate = computed(() => votingQueue.value[0])
const currentCandidateVoters = ref([])
const alreadyVoted = ref([])

function nextNomination() {
    alreadyVoted.value = alreadyVoted.value.concat(currentCandidateVoters.value)
    currentCandidateVoters.value = []

    votes.value[currentCandidate.value.number] = [...document.querySelectorAll('#votingForm input[type="checkbox"]')]
    .filter(checkbox => checkbox.checked).length

    // move to next candidate unless queue is empty
    if (votingQueue.value.length > 1) {
        votingQueue.value = votingQueue.value.slice(1)
        document.querySelectorAll('#votingForm input[type="checkbox"]').forEach(checkbox => checkbox.checked = false)

        
        // force everyone to vote the candidate is last in queue 
        if (currentCandidate.value.number === props.nominations[props.nominations.length-1].number) {
            document.querySelectorAll('#votingForm input[type="checkbox"]').forEach(checkbox => {
                if (!alreadyVoted.value.includes(Number(checkbox.getAttribute('data-player-number')))) {
                    checkbox.checked = true;
                    checkbox.disabled = true;
                }
            });
        }
    } else {
        evaluateVotes()
    }
}

function evaluateVotes() {
    if (type.value == 'eliminateAll') {
        const requiredVotesNumber = Math.floor(voters.value.length / 2) + 1
        const numberOfVotes = [...document.querySelectorAll('#votingForm input[type="checkbox"]')].filter(checkbox => checkbox.checked).length
        
        if (numberOfVotes >= requiredVotesNumber) {
            emit('playersEliminated', props.nominations.map((player) => player.number))      
        } else {
            emit('noEliminations')      
        }

    } else {
        const mostVotes = Math.max(...Object.values(votes.value))
        const winners = Object.keys(votes.value).filter(player => votes.value[player] === mostVotes)

        if (winners.length > 1) {
            if (type.value == 'normal') {
                emit('revote', winners)
            } else if (type.value == 'revoting') {
                type.value = 'eliminateAll'
            }
        } else {
            emit('playersEliminated', winners)
        }
    }
}

</script>
<template>
    <div v-if="type !== 'eliminateAll'">
        <p>Please, mark all those in favor of voting player <b>#{{ currentCandidate.number }} - {{ currentCandidate.name }}</b> off.</p>
        <form id="votingForm">
            <table class="mx-auto">
                <tbody>
                    <tr v-for="player in voters" :style="alreadyVoted.includes(player.number) && 'opacity: 50%'" :key="player.number">
                        <td style="width: 50px;">
                            <input :id="'voting'+player.number"
                            :data-player-number="player.number"
                            :disabled="alreadyVoted.includes(player.number)"
                            type="checkbox" 
                            @click="$event.target.checked ? currentCandidateVoters.push(player.number) : currentCandidateVoters.splice(currentCandidateVoters.indexOf(player.number), 1)" 
                            class="form-check-input">
                        </td>
                        <td><label :for="'voting'+player.number">#{{ player.number }} - {{ player.name }}</label></td>
                    </tr>
                </tbody>
            </table>
        </form>
        <br>
        <button class="btn btn-light" @click="nextNomination()">Continue</button>
    </div>
    <div v-else>
        <p>Please, mark all those in favor of voting all players off.</p>
        <form id="votingForm">
            <table class="mx-auto">
                <tbody>
                    <tr v-for="player in voters" :key="player.number">
                        <td style="width: 50px;">
                            <input
                            :id="'voting'+player.number"
                            type="checkbox"  
                            class="form-check-input">
                        </td>
                        <td><label :for="'voting'+player.number">#{{ player.number }} - {{ player.name }}</label></td>
                    </tr>
                </tbody>
            </table>
        </form>
        <br>
        <button class="btn btn-light" @click="evaluateVotes()">Continue</button>
    </div>
</template>