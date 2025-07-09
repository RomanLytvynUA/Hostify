<script setup>
import { useStore } from '@/store.js'
import { useGameLog } from '@/log.js'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' })

/**
Voting types:
- normal
- revoting
- eliminateAll
**/
const type = ref('normal')
defineExpose({ type })
const props = defineProps(['nominations'])
const emit = defineEmits(['playersEliminated', 'revote', 'noEliminations'])

const voters = computed(() => useStore().playersData.filter((player) => player.dead !== true));
const votingQueue = ref(props.nominations)
const votes = ref({})

const currentCandidate = computed(() => votingQueue.value[0])
const currentCandidateVoters = ref([])
const alreadyVoted = ref([])

function nextNomination() {
    const namesOfPlayersVoted = currentCandidateVoters.value.map((player) => voters.value.find((voter) => voter.number === player).name)
    if (namesOfPlayersVoted.length > 0) {
        useGameLog().logEvent(`${namesOfPlayersVoted.join(', ')} vote against ${currentCandidate.value.name}. (${currentCandidateVoters.value.length} votes)`)
    } else {
        useGameLog().logEvent(`No one votes against ${currentCandidate.value.name}. (0 votes)`)
    }

    alreadyVoted.value = alreadyVoted.value.concat(currentCandidateVoters.value)
    currentCandidateVoters.value = []

    votes.value[currentCandidate.value.number] = [...document.querySelectorAll('#votingForm input[type="checkbox"]')]
        .filter(checkbox => checkbox.checked).length

    // move to next candidate unless queue is empty
    if (votingQueue.value.length > 1) {
        votingQueue.value = votingQueue.value.slice(1)
        document.querySelectorAll('#votingForm input[type="checkbox"]').forEach(checkbox => checkbox.checked = false)


        // force everyone to vote the candidate is last in queue 
        if (currentCandidate.value.number === props.nominations[props.nominations.length - 1].number) {
            document.querySelectorAll('#votingForm input[type="checkbox"]').forEach(checkbox => {
                if (!alreadyVoted.value.includes(Number(checkbox.getAttribute('data-player-number')))) {
                    checkbox.checked = true;
                    checkbox.disabled = true;
                    currentCandidateVoters.value.push(Number(checkbox.getAttribute('data-player-number')))
                }
            });
        }
    } else {
        evaluateVotes()
    }
}

function evaluateVotes() {
    if (type.value == 'eliminateAll') {
        const checkBoxes = [...document.querySelectorAll('#votingForm input[type="checkbox"]')]
        const requiredVotesNumber = Math.floor(voters.value.length / 2) + 1
        const numberOfVotes = checkBoxes.filter(checkbox => checkbox.checked).length

        const namesOfPlayersVoted = checkBoxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.getAttribute('data-player-name'))
        const namesOfPlayersAbstained = checkBoxes.filter(checkbox => !checkbox.checked).map(checkbox => checkbox.getAttribute('data-player-name'))
        if (namesOfPlayersVoted.length > 0) {
            useGameLog().logEvent(`${namesOfPlayersVoted.join(', ')} vote to eliminate all players. (${namesOfPlayersVoted.length} votes)`)
        }
        if (namesOfPlayersAbstained.length > 0) {
            useGameLog().logEvent(`${namesOfPlayersAbstained.join(', ')} abstain from the voting. (${namesOfPlayersAbstained.length} votes)`)
        }

        if (numberOfVotes >= requiredVotesNumber) {
            useGameLog().logEvent(`Players ${props.nominations.map((player) => player.name).join(', ')} are eliminated.`)
            emit('playersEliminated', props.nominations.map((player) => player.number))
        } else {
            useGameLog().logEvent(`The players failed to pass the vote.`)
            emit('noEliminations')
        }

    } else {
        const mostVotes = Math.max(...Object.values(votes.value))
        const winners = Object.keys(votes.value).filter(player => votes.value[player] === mostVotes)

        if (winners.length > 1) {
            if (type.value == 'normal') {
                const namesOfTiePlayers = voters.value.filter((player) => winners.includes(String(player.number))).map((player) => player.name)
                useGameLog().logEvent(`${namesOfTiePlayers.join(', ')} got equal number of votes.`)
                emit('revote', winners)
            } else if (type.value == 'revoting') {
                const namesOfTiePlayers = voters.value.filter((player) => winners.includes(String(player.number))).map((player) => player.name)
                useGameLog().logEvent(`${namesOfTiePlayers.join(', ')} got equal number of votes.`)
                type.value = 'eliminateAll'
            }
        } else {
            const nameOfEliminatedPlayer = voters.value.find((voter) => voter.number === Number(winners[0])).name
            useGameLog().logEvent(`${nameOfEliminatedPlayer} is eliminated.`)
            emit('playersEliminated', winners)
        }
    }
}

</script>
<template>
    <div v-if="type !== 'eliminateAll'">
        <p>{{ t("voting.subtitle").replace("PLAYER_NAME", `#${currentCandidate.number} - ${currentCandidate.name}`) }}
        </p>
        <form id="votingForm">
            <table class="mx-auto">
                <tbody>
                    <tr v-for="player in voters" :style="alreadyVoted.includes(player.number) && 'opacity: 50%'"
                        :key="player.number">
                        <td style="width: 50px;">
                            <input :id="'voting' + player.number" :data-player-number="player.number"
                                :data-player-name="player.name" :disabled="alreadyVoted.includes(player.number)"
                                type="checkbox"
                                @click="$event.target.checked ? currentCandidateVoters.push(player.number) : currentCandidateVoters.splice(currentCandidateVoters.indexOf(player.number), 1)"
                                class="form-check-input">
                        </td>
                        <td><label :for="'voting' + player.number">#{{ player.number }} - {{ player.name }}</label></td>
                    </tr>
                </tbody>
            </table>
        </form>
        <br>
        <button class="btn btn-light" @click="nextNomination()">{{ t("voting.continueBtn") }}</button>
    </div>
    <div v-else>
        <p>{{ t("voting.eliminateAllSubtitle") }}</p>
        <form id="votingForm">
            <table class="mx-auto">
                <tbody>
                    <tr v-for="player in voters" :key="player.number">
                        <td style="width: 50px;">
                            <input :id="'voting' + player.number" :data-player-name="player.name" type="checkbox"
                                class="form-check-input">
                        </td>
                        <td><label :for="'voting' + player.number">#{{ player.number }} - {{ player.name }}</label></td>
                    </tr>
                </tbody>
            </table>
        </form>
        <br>
        <button class="btn btn-light" @click="evaluateVotes()">{{ t("voting.continueBtn") }}</button>
    </div>
</template>