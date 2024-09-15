<script setup>
import { ref } from 'vue'

const props = defineProps(['nominations'])
</script>
<template>
    <p>Voting between {{ props.nominations }}</p>
</template>