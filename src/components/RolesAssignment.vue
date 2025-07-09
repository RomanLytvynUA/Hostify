<script setup>
import { useStore } from '@/store.js'
import { useGameLog } from '@/log.js'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' })

// force the player to play
useStore().musicPlaying = true;

const emit = defineEmits(['rolesAssigned'])

const errors = ref([])

const playersData = computed(() => useStore().playersData)

function validateRoles() {
    const form = document.getElementById('rolesForm')
    let valid = true
    errors.value = []

    // add 'is-invalid' class to every element of the form that has no value
    for (const element of form.elements) {
        if (element.tagName === 'SELECT' && !element.value) {
            element.classList.add('is-invalid');
            valid = false
        } else {
            element.classList.remove('is-invalid');
        }
    }

    const roles = {};
    playersData.value.map((player) => player.role).forEach(function (x) { roles[x] = (roles[x] || 0) + 1; });

    if (roles['Sheriff'] !== 1) {
        errors.value.push(t('rolesAssignment.sheriffAlert'));
        valid = false
    }
    if (roles['Don'] !== 1) {
        errors.value.push(t('rolesAssignment.donAlert'))
        valid = false
    }
    if (roles['Mafia'] !== 2) {
        errors.value.push(t('rolesAssignment.mafiaAlert'))
        valid = false
    }

    if (valid) {
        useGameLog().generatePlayersList(playersData.value)
        emit('rolesAssigned')
    }
}
</script>

<template>
    <div class="d-flex flex-column align-items-center">
        <p class="secondary-txt" style="margin-bottom: 0;" @click="console.log(errors)">
            {{ t('rolesAssignment.subtitle') }}</p>
        <br>
        <div v-if="errors.length" style="margin-bottom: 20px;">
            <div v-for="error in errors" class="alert">
                {{ error }}
            </div>
        </div>
        <form id="rolesForm">
            <table class="mx-auto">
                <tbody>
                    <tr v-for="player in playersData" :key="player.number">
                        <td>#{{ player.number }} - {{ player.name }}
                        </td>
                        <td style="width: 150px;">
                            <select
                                @change="useStore().playersData.find((player1) => player1.number === player.number).role = $event.target.value"
                                class="form-select form-select-sm mx-2" style="max-width: 100px;">
                                <option hidden></option>
                                <option value="Civilian">{{ t('rolesAssignment.civilian') }}</option>
                                <option value="Mafia">{{ t('rolesAssignment.mafia') }}</option>
                                <option value="Don">{{ t('rolesAssignment.don') }}</option>
                                <option value="Sheriff">{{ t('rolesAssignment.sheriff') }}</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
        <button style="margin-top: 20px;" class="btn btn-primary" @click="validateRoles()">{{
            t('rolesAssignment.doneBtn') }}</button>
    </div>
</template>

<style scoped>
td {
    padding-bottom: 10px;
}
</style>