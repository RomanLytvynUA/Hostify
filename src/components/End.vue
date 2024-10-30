<script setup>
import ConfettiExplosion from "vue-confetti-explosion";
import { useStore } from '@/store.js'
import { computed, nextTick, ref, onMounted, watch } from 'vue'

const playersData = computed(() => useStore().playersData);
const result = ref(useStore().evaluateGame());

// confetti overflow workaround
onMounted(() => {
  document.body.style.overflow = 'hidden'
  setTimeout(() => document.body.style.overflow = 'auto', 3500)
})
</script>

<template>
    <div style="display: flex; justify-content: center; align-items: center; overflow-y: visible;">
        <ConfettiExplosion :stageHeight="1000" :colors="['#FF0000', '#4CAF50', '#00BFFF', '#FFAA00']" />
    </div>
        
    <div class="container text-center justify-content-center">
        <p class="secondary-txt" v-if="result === 'mafiaWon'" style="margin-bottom: 8px;">Congratulations to the <b>mafia</b> team!</p>
        <p class="secondary-txt" v-else style="margin-bottom: 8px;">Congratulations to the <b>civilians</b> team!</p>
        <p class="secondary-txt" style="margin-bottom: 8px;">Don was player <b>#{{ useStore().don.number }} - {{ useStore().don.name }}</b>, 
            mafia - players <b>#{{ useStore().mafia[0].number }} - {{ useStore().mafia[0].name }}</b> and <b>#{{ useStore().mafia[1].number }} - {{ useStore().mafia[1].name }}</b>,
            sheriff - player <b>#{{ useStore().sheriff.number }} - {{ useStore().sheriff.name }}</b>.</p>
        <br>
        <button class="btn btn-primary" @click="console.log('download log')">Download the game log</button>
    </div>
</template>