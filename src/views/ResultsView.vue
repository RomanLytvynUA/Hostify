<script setup>
import ConfettiExplosion from "vue-confetti-explosion";
import { useStore } from '@/store.js'
import { useGameLog } from '@/log.js'
import { computed, nextTick, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' })

const result = ref(useStore().evaluateGame());

// confetti overflow workaround
onMounted(() => {
    document.body.style.overflow = 'hidden'
    setTimeout(() => document.body.style.overflow = 'auto', 3500)
})
</script>

<template>


    <div class="container text-center justify-content-center">
        <h1>{{ t("results.title") }}</h1>
        <p class="secondary-txt" v-if="result === 'mafiaWon'" style="margin-bottom: 8px;">{{ t("results.mafiaWins") }}
        </p>
        <p class="secondary-txt" v-else style="margin-bottom: 8px;">{{ t("results.civiliansWin") }}</p>

        <div style="display: flex; justify-content: center; align-items: center; overflow-y: visible;">
            <ConfettiExplosion :stageHeight="1000" :colors="['#FF0000', '#4CAF50', '#00BFFF', '#FFAA00']" />
        </div>

        <p class="secondary-txt" style="margin-bottom: 8px;" v-html="t('results.info')
            .replace('DON_NAME', `<b>#${useStore().don?.number} - ${useStore().don?.name}</b>`)
            .replace('SHERIFF_NAME', `<b>#${useStore().sheriff?.number} - ${useStore().sheriff?.name}</b>`)
            .replace(
                'MAFIA_NAMES',
                `<b>#${useStore().mafia[0]?.number} - ${useStore().mafia[0]?.name}</b> and <b>#${useStore().mafia[1]?.number} - ${useStore().mafia[1]?.name}</b>`
            )
            "></p>

        <br>
        <button class="btn btn-primary" @click="useGameLog().downloadGameLog()">{{ t("results.downloadLogBtn")
            }}</button>
    </div>
</template>