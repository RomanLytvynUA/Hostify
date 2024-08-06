import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const playersData = ref([{ "number": 1, "name": "Name1", "role": "Civilian" }, { "number": 2, "name": "Name2", "role": "Mafia" },
  { "number": 3, "name": "Name3", "role": "Civilian" }, { "number": 4, "name": "Name4", "role": "Sheriff" }, { "number": 5, "name": "Name5", "role": "Civilian" },
  { "number": 6, "name": "Name6", "role": "Don" }, { "number": 7, "name": "Name7", "role": "Civilian" }, { "number": 8, "name": "Name8", "role": "Civilian" },
  { "number": 9, "name": "Name9", "role": "Mafia" }, { "number": 10, "name": "Name10", "role": "Civilian" }
  ]);

  /*
  Game states:
  - rolesAssignmentPrep
  - rolesAssignment
  - firstNightPrep
  - firstNight
  - day
  - voting
  - night
  */
  const gameState = ref('rolesAssignmentPrep');
  // const gameState = ref('firstNight');

  const musicPlaying = ref(false)

  return { playersData, gameState, musicPlaying }
})
