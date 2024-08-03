<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeName = computed(() => route.name)
</script>


<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid justify-content-center">
            <RouterLink style="color: white; margin: 0;" class="navbar-brand d-flex align-items-center" to="/">
                <img src="../assets/logo.png" alt="logo" width="50" style="margin-right: 5px;">
                {{ routeName == 'home' ? '' : 'Hostify' }}
            </RouterLink>
        </div>
    </nav>
</template>

<style scoped>
nav {
    background-color: #333334 !important;
}
</style>