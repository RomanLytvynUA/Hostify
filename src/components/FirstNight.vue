<script setup>
import { useStore } from '@/store.js'
import { useGameLog } from '@/log.js'
import { computed, ref } from 'vue'

import Timer from './Timer.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' })

useGameLog().logPhase(`FIRST NIGHT`)

/**
First night states:
- mafiaNegotiations
- sheriffInspection
**/
const state = ref('mafiaNegotiations')
useGameLog().logEvent(`Mafia negotiations started.`)

const playersData = computed(() => useStore().playersData)
const mafia = ref(playersData.value.filter((player) => player.role === 'Mafia' || player.role === 'Don'))
const sheriff = ref(playersData.value.find((player) => player.role === 'Sheriff'))
</script>

<template>
    <div class="container text-center">
        <div v-if="state === 'mafiaNegotiations'">
            <p class="secondary-txt">
                {{ t("firstNight.mafiaSubtitle").replace("MAFIA_PLAYERS", `${mafia[0]?.name}, ${mafia[1]?.name} and
                ${mafia[2]?.name}`) }}</p>
            <Timer />
            <br>
            <button class="btn btn-dark"
                @click="state = 'sheriffInspection'; useGameLog().logEvent(`Sheriff's inspection started.`)">
                {{ t("firstNight.mafiaFallsAsleep") }}
            </button>
        </div>
        <div v-if="state === 'sheriffInspection'">
            <p class="secondary-txt">{{ t("firstNight.sheriffSubtitle").replace("SHERIFF_NAME", sheriff?.name) }}</p>
            <Timer time="00:30" />
            <br>
            <button class="btn btn-dark" @click="$emit('nightEnded')">{{ t("firstNight.sheriffFallsAsleep") }}</button>
        </div>
    </div>
</template>