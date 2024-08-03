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
  background: #3b3b3d !important;
  color: white !important;
}

td,
th {
  border-color: white !important;
  background-color: #3b3b3d !important;
  color: white !important;
}

input {
  background-color: #3b3b3d !important;
  border-color: white !important;
  color: white !important;
}

input:focus {
  box-shadow: none !important;
  outline: 0 none !important;
  border-color: white !important;
}

::placeholder {
  opacity: 0.4 !important;
  color: white !important;
}

hr {
  background-color: white;
  height: 1px;
  opacity: 1;
  border: 0;
}
</style>
