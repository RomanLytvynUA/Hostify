<script setup>
import { computed } from 'vue'
import { useStore } from '@/store';
import Player from './Player.vue'
import Dashboard from './Dashboard.vue'
import { useI18n } from 'vue-i18n';
const { t, locale, availableLocales, getLocaleMessage } = useI18n({ useScope: 'global' })

const routeName = computed(() => useStore().currentRoute)


const setLocale = (localeName) => {
    locale.value = localeName;
    localStorage.setItem('lang', localeName);
}
</script>


<template>
    <nav style="background-color: #333334 !important;" class="navbar navbar-expand-lg">
        <div class="container-fluid position-relative">

            <!-- Centered section -->
            <div class="d-flex justify-content-center align-items-center w-100">
                <RouterLink style="color: white; margin: 0;" class="navbar-brand d-flex align-items-center" to="/">
                    <img src="../assets/logo.png" alt="logo" width="50" style="margin-right: 5px;">
                    {{ routeName == 'home' ? '' : 'Hostify' }}
                </RouterLink>
                <Player style="margin-left: 10px;" v-if="routeName == 'game'" />
                <Dashboard v-if="routeName == 'game'" />
            </div>

            <!-- Right-aligned section -->
            <ul class="navbar-nav d-flex align-items-center position-absolute"
                style="right: 16px; top: 50%; transform: translateY(-50%);">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ t('localeEmoji') }}
                    </a>
                    <ul class="dropdown-menu w-auto">
                        <button v-for="availableLocale in availableLocales" class="dropdown-item"
                            @click.prevent="setLocale(availableLocale)">
                            {{ getLocaleMessage(availableLocale).localeEmoji }}
                        </button>
                    </ul>
                </li>
            </ul>

        </div>
    </nav>
</template>

<style scoped>
.navbar .dropdown-menu.show {
    min-width: inherit;
    display: inline-block;
}
</style>