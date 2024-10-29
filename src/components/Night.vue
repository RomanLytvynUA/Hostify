<script setup>
import { useStore } from '@/store.js'
import { computed, ref, onMounted, watch } from 'vue'

const emit = defineEmits(['nightEnded'])

/**
Night states:
- shooting
- donsCheck
- sheriffsCheck
**/
const state = ref('shooting')

useStore().musicPlaying = true;

const playersData = computed(() => useStore().playersData);
const don = computed(() => playersData.value.find((player) => player.role === 'Don'))
const donCheckRole = ref('')
const sheriff = computed(() => playersData.value.find((player) => player.role === 'Sheriff'))
const sheriffCheckRole = ref('')

const mafiaChoices = ref({})
const evaluateMafiaChoices = () => {
    // add selected player to testaments queue if mafia voted equally
    if (new Set(Object.values(mafiaChoices.value)).size === 1) {
        useStore().testamentsQueue.push(Object.values(mafiaChoices.value)[0])
    }
    state.value = 'donsCheck';
}

</script>

<template>
    <div class="container text-center">
        <!-- Shooting -->
        <div v-if="state === 'shooting'">
            <p style="margin-bottom: 8px;">Please, mark the fields below in accordiance with the mafia decisions.</p>
            <div class="d-flex justify-content-center align-items-center mb-3">
                <table class="mx-auto text-center">
                    <tbody>
                        <tr v-for="mafia in playersData.filter((mafia) => !mafia.dead && (mafia.role === 'Mafia' || mafia.role === 'Don'))" :key="mafia.number">
                            <td style="width: 150px;" class="p-2 text-end"><b>{{ mafia.name }}</b></td>
                            <td style="width: 90px;" class="p-2">shoots</td>
                            <td style="width: 150px;" class="p-2">
                                <select
                                    @change="mafiaChoices[mafia.number] = $event.target.value"
                                    class="form-select form-select-sm mx-auto" style="margin: 0 !important;">
                                    <option hidden></option>
                                    <option v-for="player in playersData" :value="player.number">{{ player.name }}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button class="btn btn-light" @click="evaluateMafiaChoices()">Continue</button>
        </div>
        
        <!-- Don's Check -->
        <div v-if="state === 'donsCheck'">
            <div v-if="!don.dead" >
                <p style="margin-bottom: 8px;">
                    Please, wake the player <b>#{{ don.number }} - {{ don.name }}</b> up and let him check for a sheriff.
                </p>
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <label class="me-2">Check:</label>
                    <select class="form-select form-select-sm w-auto" @change="donCheckRole = $event.target.value">
                        <option hidden></option>
                        <option v-for="player in playersData" :value="player.role">#{{ player.number }} -
                            {{ player.name
                            }}
                        </option>
                    </select>
                    <label v-if="donCheckRole" class="me-2" style="margin-left: 6px !important;">
                        <i v-if="donCheckRole === 'Sheriff'" style="font-size: 20px; color: green;"  class="bi bi-check-lg"></i>
                        <i v-else style="font-size: 20px; color: red;" class="bi bi-x-lg"></i>
                    </label>
                </div>
            </div>
            <p v-else style="margin-bottom: 8px;">
                Even though the Don is dead, please pretend to wake him up. 
            </p>
            <button class="btn btn-light" @click="state = 'sheriffsCheck'">Continue</button>
        </div>
        
        <!-- Sheriff's Check -->
        <div v-if="state === 'sheriffsCheck'">
            <div v-if="!sheriff.dead" >
                <p style="margin-bottom: 8px;">
                    Please, wake the player <b>#{{ sheriff.number }} - {{ sheriff.name }}</b> up and let him check for mafia.
                </p>
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <label class="me-2">Check:</label>
                    <select class="form-select form-select-sm w-auto" @change="sheriffCheckRole = $event.target.value">
                        <option hidden></option>
                        <option v-for="player in playersData" :value="player.role">#{{ player.number }} -
                            {{ player.name
                            }}
                        </option>
                    </select>
                    <label v-if="sheriffCheckRole" class="me-2" style="margin-left: 6px !important;">
                        <i v-if="['Don', 'Mafia'].includes(sheriffCheckRole)" style="font-size: 20px; color: green;"  class="bi bi-check-lg"></i>
                        <i v-else style="font-size: 20px; color: red;" class="bi bi-x-lg"></i>
                    </label>
                </div>
            </div>
            <p v-else style="margin-bottom: 8px;">
                Even though the sheriff is dead, please pretend to wake him up. 
            </p>
            <button class="btn btn-light" @click="$emit('nightEnded')">Continue</button>
        </div>
    </div>
</template>