<script setup>
import { useStore } from '@/store.js'
import { computed, ref } from 'vue'

// force the player to play
useStore().musicPlaying = true;

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
        errors.value.push('There must be 1 Sheriff role.');
        valid = false
    }
    if (roles['Don'] !== 1) {
        errors.value.push('There must be 1 Don role.')
        valid = false
    }
    if (roles['Mafia'] !== 2) {
        errors.value.push('There must be 2 Mafia roles.')
        valid = false
    }

    if (valid) {
        console.log('valid')
    }
}
</script>

<template>
    <div class="d-flex flex-column align-items-center">
        <p @click="console.log(errors)">Please, hand out the roles to the players while keeping the fields below in
            accordance with the roles
            selected.</p>
        <div v-for="error in errors" style="width: 50%; min-width: 350px; margin-bottom: 5px; padding: 5px;"
            class="alert alert-danger">
            {{ error }}
        </div>
        <br>
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
                                <option>Civilian</option>
                                <option>Mafia</option>
                                <option>Don</option>
                                <option>Sheriff</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
        <br>
        <button class="btn btn-light" @click="validateRoles()">Done</button>
    </div>
</template>

<style scoped>
td {
    padding-bottom: 10px;
}
</style>