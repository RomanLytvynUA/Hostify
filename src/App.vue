<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <Navbar />
  <br>
  <RouterView />
</template>

<style>
body {
  background-color: #3b3b3d;
  color: white;
}
</style>
