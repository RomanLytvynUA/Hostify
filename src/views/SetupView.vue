<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from "@/store.js"

const router = useRouter()

const tournamentName = ref('')
const game = ref('')
const stage = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const playersData = ref([
    { 'number': 1, "name": '' },
    { 'number': 2, "name": '' },
    { 'number': 3, "name": '' },
    { 'number': 4, "name": '' },
    { 'number': 5, "name": '' },
    { 'number': 6, "name": '' },
    { 'number': 7, "name": '' },
    { 'number': 8, "name": '' },
    { 'number': 9, "name": '' },
    { 'number': 10, "name": '' },
])

function downloadPreset() {
    const preset = {
        players: playersData.value,
        tournamentName: tournamentName.value,
        game: game.value,
        stage: stage.value,
        date: date.value
    };

    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tournamentName.value} game preset.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function loadDataFromPreset() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const json = JSON.parse(reader.result);
                tournamentName.value = json.tournamentName || ""
                game.value = json.game || ""
                stage.value = json.stage || ""
                date.value = json.date || ""
                playersData.value = json.players || [
                    { 'number': 1, "name": '' },
                    { 'number': 2, "name": '' },
                    { 'number': 3, "name": '' },
                    { 'number': 4, "name": '' },
                    { 'number': 5, "name": '' },
                    { 'number': 6, "name": '' },
                    { 'number': 7, "name": '' },
                    { 'number': 8, "name": '' },
                    { 'number': 9, "name": '' },
                    { 'number': 10, "name": '' },
                ]
            };
            reader.readAsText(file)
        }
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

function swapPlayerNumbers(currentNumber, targetNumber) {
    const player = playersData.value.find(player => player.number == currentNumber)
    const targetNumberPlayer = playersData.value.find(player => player.number == targetNumber)

    player.number = targetNumber
    targetNumberPlayer.number = currentNumber
}

function validateSettings() {
    const form = document.getElementById('settingsForm')
    let valid = true

    // add 'is-invalid' class to every element of the form that has no value
    for (const element of form.elements) {
        if (element.tagName === 'INPUT' && !element.value) {
            element.classList.add('is-invalid');
            valid = false
        } else {
            element.classList.remove('is-invalid');
        }
    }
    if (valid) {
        useStore().playersData = playersData.value
        router.push('/game')
    }
}
</script>

<template>
    <div class="container-fluid text-center">
        <h1>Game settings</h1>
        <!-- settings card -->
        <div style="margin-top: 20px;" class="d-flex flex-column justify-content-center">
            <div class="setup-card">
                <!-- preset controls -->
                <div style="width: 100%; border-bottom: 3px solid #555557;" role="group">
                    <button @click="downloadPreset()" style="width: 50%; border-radius: 3px 0 0 0;" type="button"
                        class="btn btn-dark">
                        Save this preset <i class="bi bi-file-earmark-arrow-down"></i>
                    </button>
                    <button @click="loadDataFromPreset()" style="width: 50%; border-radius: 0 3px 0 0;" type="button"
                        class="btn btn-dark">
                        <i class="bi bi-file-earmark-arrow-up"></i> Load a preset
                    </button>
                </div>
                <!-- general settings -->
                <form id="settingsForm">
                    <h3 class="secondary-txt" style="margin-top: 16px; margin-bottom: 0;">General</h3>
                    <hr class="setup-hr">
                    <div class="row text-start justify-content-center" style="margin: auto;">
                        <div class="col-auto mb-3">
                            <label class="form-label">Tournament name:</label>
                            <input v-model="tournamentName" type="text" class="form-control">
                        </div>
                        <div class="col-auto mb-3">
                            <label class="form-label">Game:</label>
                            <input v-model="game" type="text" class="form-control">
                        </div>
                        <div class="col-auto mb-3">
                            <label class="form-label">Stage:</label>
                            <input v-model="stage" type="text" class="form-control">
                        </div>
                        <div class="col-auto mb-3">
                            <label class="form-label">Date:</label>
                            <input v-model="date" type="date" class="form-control">
                        </div>
                    </div>
                    <!-- players settings -->
                    <hr class="setup-hr">
                    <h3 class="secondary-txt" style="margin-top: 0; margin-bottom: 0;">Players</h3>
                    <hr class="setup-hr">
                    <table class="table table-responsive" style="max-width: 1000px; margin: auto;">
                        <thead class="setup-table">
                            <tr>
                                <th scope="col" style="width: 10%;">#</th>
                                <th scope="col" style="width: 70%;">Name</th>
                                <th scope="col" style="width: 20%;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="setup-table" v-for="player in playersData.sort((a, b) => a.number - b.number)">
                                <th>{{ player.number }}</th>
                                <td><input v-model="player.name" style="max-width: 350px; margin: auto;"
                                        class="form-control form-control-sm" :placeholder="`Player #${player.number}`">
                                </td>
                                <td>
                                    <i @click="swapPlayerNumbers(player.number, player.number - 1)"
                                        v-if="player.number !== 1" class="bi bi-chevron-up"
                                        :style="player.number !== 10 ? 'margin-right: 10px;' : ''"></i>
                                    <i @click="swapPlayerNumbers(player.number, player.number + 1)"
                                        v-if="player.number !== 10" class="bi bi-chevron-down"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <br>
                <button style="width: 100%; max-width: 1200px; border-radius: 0 0 3px 3px; border-top: 3px solid #555557;" type="button"
                    @click="validateSettings()" class="btn btn-dark">
                    Start the game
                </button>
            </div>
        </div>
        <br>
    </div>
</template>

<style scoped>
i:hover {
    cursor: pointer;
}
</style>