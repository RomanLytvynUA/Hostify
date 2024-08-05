import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const playersData = ref([{ "number": 1, "name": "Name1" }, { "number": 2, "name": "Name2" }, { "number": 3, "name": "Name3" }, { "number": 4, "name": "Name4" }, { "number": 5, "name": "Name5" }, { "number": 6, "name": "Name6" }, { "number": 7, "name": "Name7" }, { "number": 8, "name": "Name8" }, { "number": 9, "name": "Name9" }, { "number": 10, "name": "Name10" }]);
  const gameState = ref('setup');

  const musicPlaying = ref(false)

  return { playersData, gameState, musicPlaying }
})
