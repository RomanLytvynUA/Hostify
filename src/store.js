import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  // const playersData = ref([{ "number": 1, "name": "Name1", "role": "Civilian" }, { "number": 2, "name": "Name2", "role": "Mafia" },
  // { "number": 3, "name": "Name3", "role": "Civilian" }, { "number": 4, "name": "Name4", "role": "Sheriff" }, { "number": 5, "name": "Name5", "role": "Civilian" },
  // { "number": 6, "name": "Name6", "role": "Don" }, { "number": 7, "name": "Name7", "role": "Civilian" }, { "number": 8, "name": "Name8", "role": "Civilian" },
  // { "number": 9, "name": "Name9", "role": "Mafia" }, { "number": 10, "name": "Name10", "role": "Civilian" }
  // ]);
  const playersData = ref([])
  const don = computed(() => playersData.value.find((player) => player.role === 'Don'))
  const mafia = computed(() => playersData.value.filter((player) => player.role === 'Mafia'))
  const sheriff = computed(() => playersData.value.find((player) => player.role === 'Sheriff'))

  const firstPlayerToSpeak = ref(1)
  const testamentsQueue = ref([])

  const cycle = ref(0)

  /*
  Game states:
  - rolesAssignmentPrep
  - rolesAssignment
  - firstNightPrep
  - firstNight
  - dayPrep
  - day
  - nightPrep
  - night
  - end
  */
  const gameState = ref('rolesAssignmentPrep');
  // const gameState = ref('end');

  const musicPlaying = ref(false)

  function evaluateGame() {
    const mafiaCount = playersData.value.filter((player) => ['Mafia', 'Don'].includes(player.role) && !player.dead).length
    const civCount = playersData.value.filter((player) => ['Civilian', 'Sheriff'].includes(player.role) && !player.dead).length

    if (mafiaCount >= civCount) {
      gameState.value = 'end'
      return 'mafiaWon'
    } else if (mafiaCount === 0) {
      gameState.value = 'end'
      return 'civWon'
    }
  }

  return { playersData, don, mafia, sheriff, gameState, musicPlaying, firstPlayerToSpeak, cycle, testamentsQueue, evaluateGame }
})
