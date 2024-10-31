<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from '@/store.js'

// make a copy of players data
const playersData = ref(JSON.parse(JSON.stringify(useStore().playersData)));

onMounted(() => {
    reset();
    // reset data on modal close
    document.getElementById('dashboardModal').addEventListener('hidden.bs.modal', function () {
        reset();
    });
})

function reset() {
    playersData.value = JSON.parse(JSON.stringify(useStore().playersData))
    // set mandatory players properties if missing
    playersData.value.forEach(player => {
        if (!('fouls' in player)) {
            player.fouls = 0
            player.expelled = false
        }
    });
}

function applyChanges() {
    useStore().playersData = playersData.value;

    useStore().playersData.forEach((player) => {
        if (player.fouls === 3) {
            player.skipNextSpeech = true;
        }
        if (player.fouls === 4) {
            player.expelled = true;
        }
        if (player.expelled) {
            player.dead = true;
        }
    })

    useStore().evaluateGame()
}
</script>

<template>
    <i style="font-size: 25px; margin-left: 10px;"
    class="bi bi-person-gear" data-bs-toggle="modal" data-bs-target="#dashboardModal"></i>

    <div class="modal fade" id="dashboardModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Dashboard</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <table class="table table-responsive text-center">
                        <thead class="setup-table">
                            <tr>
                                <th scope="col" style="width: 10%;">#</th>
                                <th scope="col" style="width: 50%;">Name</th>
                                <th scope="col" style="width: 15%;">Fouls</th>
                                <th scope="col" style="width: 25%;">Expel</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="setup-table" 
                            v-for="player in playersData"
                            :style="player.dead ? 'opacity: 0.5' : ''">
                                <th>{{ player.number }}</th>
                                <td>{{ player.name }}</td>
                                <td><input class="form-control form-control-sm" v-model="player.fouls" min="0" max="4" type="number" :disabled="player.dead"></td>
                                <td>
                                    <i
                                    :style="player.expelled || player.fouls === 4 ? 'color: red; font-size: 17px;' : 'color: #cccccc; font-size: 17px;'" 
                                    :class="player.dead ? 'bi bi-ban disabled' : 'bi bi-ban'"
                                    @click="() => {if (!(player.fouls === 4)) {player.expelled = !player.expelled}}"></i>
                                </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer" style="padding: 5px;">
                <button style="width: 100%;" type="button" class="btn btn-dark" data-bs-dismiss="modal" @click="applyChanges()">Authorize changes</button>
            </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
i:hover {
    cursor: pointer;
}

i.disabled {
    cursor: default !important;
    color: #cccccc !important;
}
</style>