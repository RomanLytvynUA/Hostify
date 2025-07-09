<script setup>
import { ref, computed } from 'vue';
import { useStore } from '@/store.js'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';

const { t, locale, availableLocales, getLocaleMessage } = useI18n({ useScope: 'global' })

const anthem = ref(null)
const switchedToRussian = ref(false)

const router = useRouter()
let lastRoute = ""
const currentRoute = computed(() => router.currentRoute.value.path)

const setLocale = (localeName) => {
    locale.value = localeName;
    localStorage.setItem('lang', localeName);
}

const toggleRussian = () => {
    useStore().musicPlaying = false;
    if (switchedToRussian.value === false) {
        lastRoute = currentRoute.value;

        anthem.value.play();
        switchedToRussian.value = true;
        router.push('/grammar');
    } else {
        anthem.value.pause();
        anthem.value.currentTime = 0;
        switchedToRussian.value = false;
        router.push(lastRoute);
    }
}
</script>

<template>
    <li class="nav-item dropdown">
        <div v-if="!switchedToRussian">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ t('localeEmoji') }}
            </a>
            <ul class="dropdown-menu w-auto">
                <button v-for="availableLocale in availableLocales" class="dropdown-item"
                    @click.prevent="setLocale(availableLocale)">
                    {{ getLocaleMessage(availableLocale).localeEmoji }}
                </button>
                <button class="dropdown-item" @click.prevent="toggleRussian()">🇷🇺</button>
            </ul>
        </div>
        <button v-else class="btn btn-dark" @click.prevent="toggleRussian()">Ужє вьіучил украинский</button>
    </li>

    <!-- Play anthem -->
    <div style="display: none;">
        <audio ref="anthem" controls loop>
            <source src="/music/anthem.mp3" type="audio/mp3">
        </audio>
    </div>
</template>

<style scoped>
.dropdown-menu.show {
    min-width: inherit;
    display: inline-block;
}
</style>