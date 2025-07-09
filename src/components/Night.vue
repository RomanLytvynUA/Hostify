<script setup>
import { useStore } from '@/store.js'
import { useGameLog } from '@/log.js'
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' })

const emit = defineEmits(['nightEnded'])

/**
Night states:
- shooting
- donsCheck
- sheriffsCheck
- bestGuess
**/
const state = ref('shooting')

useStore().musicPlaying = true;
useGameLog().logPhase(`NIGHT #${useStore().cycle}`)

const playersData = computed(() => useStore().playersData);
const don = computed(() => playersData.value.find((player) => player.role === 'Don'))
const donCheck = ref(null)
const sheriff = computed(() => playersData.value.find((player) => player.role === 'Sheriff'))
const sheriffCheck = ref('')

const bestGuessPlayer = ref(null);
const bestGuess = ref(['', '', '']);

const mafiaChoices = ref({})
const evaluateMafiaChoices = () => {
    Object.keys(mafiaChoices.value).forEach((mafiaPlayerNumber) => {
        const mafiaPlayerName = playersData.value.find(player => player.number == mafiaPlayerNumber).name;
        const victimPlayerName = playersData.value.find(player => player.number == mafiaChoices.value[mafiaPlayerNumber]).name;
        useGameLog().logEvent(`${mafiaPlayerName} shoots ${victimPlayerName}.`);
    })

    // add selected player to testaments queue if mafia voted equally
    if (new Set(Object.values(mafiaChoices.value)).size === 1) {
        const victimPlayer = playersData.value.find(player => player.number == Object.values(mafiaChoices.value)[0]);
        useStore().testamentsQueue.push(victimPlayer.number);
        useGameLog().logEvent(`The mafia have made a unanimous kill of ${victimPlayer.name}.`);

        // best guess right is only granted to the player killed in the 1st cycle
        if (useStore().cycle == 1) {
            bestGuessPlayer.value = playersData.value.find((player) => String(player.number) === Object.values(mafiaChoices.value)[0])
        }
    } else {
        useGameLog().logEvent(`The mafia were split on the shot.`);
    }
    state.value = 'donsCheck';
}

</script>

<template>
    <div class="container text-center">
        <!-- Shooting -->
        <div v-if="state === 'shooting'">
            <p class="secondary-txt" style="margin-bottom: 8px;">{{ t("night.mafiaSubtitle") }}</p>
            <div class="d-flex justify-content-center align-items-center mb-3">
                <table class="mx-auto text-center">
                    <tbody>
                        <tr v-for="mafia in playersData.filter((mafia) => !mafia.dead && (mafia.role === 'Mafia' || mafia.role === 'Don'))"
                            :key="mafia.number">
                            <td style="width: 150px;" class="p-2 text-end"><b>{{ mafia.name }}</b></td>
                            <td style="width: 90px;" class="p-2">{{ t("night.shoots") }}</td>
                            <td style="width: 150px;" class="p-2">
                                <select @change="mafiaChoices[mafia.number] = $event.target.value"
                                    class="form-select form-select-sm mx-auto" style="margin: 0 !important;">
                                    <option hidden></option>
                                    <option v-for="player in playersData" :value="player.number">{{ player.name }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button class="btn btn-dark" @click="evaluateMafiaChoices()">{{ t("night.continueBtn") }}</button>
        </div>

        <!-- Don's Check -->
        <div v-if="state === 'donsCheck'">
            <div v-if="!don.dead">
                <p class="secondary-txt" style="margin-bottom: 8px;">
                    {{ t("night.donSubtitle").replace("PLAYER_NAME", `#${don.number} - ${don.name}`) }}
                </p>
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <label class="me-2">{{ t("night.check") }}</label>
                    <select class="form-select form-select-sm w-auto" @change="donCheck = $event.target.value">
                        <option hidden></option>
                        <option v-for="player in playersData" :value="player.number">#{{ player.number }} -
                            {{ player.name
                            }}
                        </option>
                    </select>
                    <label v-if="donCheck" class="me-2" style="margin-left: 6px !important;">
                        <i v-if="donCheck === String(sheriff.number)" style="font-size: 20px; color: green;"
                            class="bi bi-check-lg"></i>
                        <i v-else style="font-size: 20px; color: red;" class="bi bi-x-lg"></i>
                    </label>
                </div>
            </div>
            <p class="secondary-txt" v-else style="margin-bottom: 8px;">
                {{ t("night.deadDonSubtitle") }}
            </p>
            <button class="btn btn-dark" @click="state = 'sheriffsCheck';
            (() => {
                const checkedPlayer = playersData.find(player => String(player.number) === donCheck);
                const result = donCheck === String(sheriff?.number) ? 'POSITIVE' : 'NEGATIVE';
                useGameLog().logEvent(`The Don checks #${donCheck} - ${checkedPlayer?.name}. ${result}`);
            })()">{{ t("night.continueBtn") }}</button>
        </div>

        <!-- Sheriff's Check -->
        <div v-if="state === 'sheriffsCheck'">
            <div v-if="!sheriff.dead">
                <p class="secondary-txt" style="margin-bottom: 8px;">
                    {{ t("night.sheriffSubtitle").replace("PLAYER_NAME", `#${sheriff.number} - ${sheriff.name}`) }}
                </p>
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <label class="me-2">{{ t("night.check") }}</label>
                    <select class="form-select form-select-sm w-auto" @change="sheriffCheck = $event.target.value">
                        <option hidden></option>
                        <option v-for="player in playersData" :value="player.number">#{{ player.number }} -
                            {{ player.name
                            }}
                        </option>
                    </select>
                    <label v-if="sheriffCheck" class="me-2" style="margin-left: 6px !important;">
                        <i v-if="['Don', 'Mafia'].includes(playersData.find((player) => String(player.number) === sheriffCheck).role)"
                            style="font-size: 20px; color: green;" class="bi bi-check-lg"></i>
                        <i v-else style="font-size: 20px; color: red;" class="bi bi-x-lg"></i>
                    </label>
                </div>
            </div>
            <p class="secondary-txt" v-else style="margin-bottom: 8px;">
                {{ t("night.deadSheriffSubtitle") }}
            </p>
            <button class="btn btn-dark" @click="
                () => {
                    const checkedPlayer = playersData.find(player => String(player.number) === sheriffCheck);
                    const result = ['Don', 'Mafia'].includes(checkedPlayer?.role) ? 'POSITIVE' : 'NEGATIVE';
                    useGameLog().logEvent(`The Sheriff checks #${sheriffCheck} - ${checkedPlayer?.name}. ${result}`);

                    if (bestGuessPlayer) {
                        state = 'bestGuess';
                    } else {
                        $emit('nightEnded');
                    }
                }
            ">{{ t("night.continueBtn") }}</button>
        </div>

        <!-- Best Guess -->
        <div v-if="state === 'bestGuess'">
            <p class="secondary-txt" style="margin-bottom: 8px;">
                {{ t("night.sheriffSubtitle").replace("PLAYER_NAME", `#${bestGuessPlayer.number} -
                ${bestGuessPlayer.name}`) }}
            </p>
            <div class="row justify-content-center mb-3">
                <div class="col-auto" v-for="(guess, index) in bestGuess" :key="index">
                    <select v-model="bestGuess[index]" class="form-select form-select-sm">
                        <option hidden></option>
                        <option v-for="player in playersData" :value="player.number">#{{ player.number }} - {{
                            player.name
                        }}</option>
                    </select>
                </div>
            </div>

            <button class="btn btn-dark" @click="(() => {
                const guessedPlayers = bestGuess.map((playerNumber) => playersData.find((player) => player.number === playerNumber));
                const guessedMafia = guessedPlayers.filter((player) => ['Don', 'Mafia'].includes(player.role));

                useGameLog().logEvent(`${bestGuessPlayer.name}'s best guess: ${guessedPlayers.map(player => `#${player.number} - ${player.name}`).join(', ')}. (${guessedMafia.length}/3)`);

                $emit('nightEnded')
            })">{{ t("night.continueBtn") }}</button>
        </div>
    </div>
</template>