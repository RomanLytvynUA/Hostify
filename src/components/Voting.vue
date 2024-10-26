<script setup>
import { useStore } from '@/store.js'
import { ref, computed } from 'vue'

const props = defineProps(['nominations'])
const emit = defineEmits(['playersEliminated', 'revote'])

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
        const mostVotes = Math.max(...Object.values(votes.value))
        const winners = Object.keys(votes.value).filter(player => votes.value[player] === mostVotes)
        
        if (winners.length > 1 && false) {
            // request a revoting if some players have the same amount of votes
            emit('revote', winners)
        } else {
            emit('playersEliminated', winners)
        }
    }
}

</script>
<template>
    <p>Please mark all those in favor of voting player <b>#{{ currentCandidate.number }} - {{ currentCandidate.name }}</b> off.</p>
    <form id="votingForm">
        <table class="mx-auto">
            <tbody>
                <tr v-for="player in voters" :style="alreadyVoted.includes(player.number) && 'opacity: 50%'" :key="player.number">
                    <td style="width: 50px;">
                        <input
                        :data-player-number="player.number"
                        :disabled="alreadyVoted.includes(player.number)"
                        type="checkbox" 
                        @click="$event.target.checked ? currentCandidateVoters.push(player.number) : currentCandidateVoters.splice(currentCandidateVoters.indexOf(player.number), 1)" 
                        class="form-check-input">
                    </td>
                    <td>#{{ player.number }} - {{ player.name }}</td>
                </tr>
            </tbody>
        </table>
    </form>
    <br>
    <button class="btn btn-light" @click="nextNomination()">Continue</button>
</template>