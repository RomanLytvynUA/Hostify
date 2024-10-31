import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useStore = defineStore('store', () => {
  const playersData = ref([{ "number": 1, "name": "Name1", "role": "Civilian" }, { "number": 2, "name": "Name2", "role": "Mafia" },
  { "number": 3, "name": "Name3", "role": "Civilian" }, { "number": 4, "name": "Name4", "role": "Sheriff" }, { "number": 5, "name": "Name5", "role": "Civilian" },
  { "number": 6, "name": "Name6", "role": "Don" }, { "number": 7, "name": "Name7", "role": "Civilian" }, { "number": 8, "name": "Name8", "role": "Civilian" },
  { "number": 9, "name": "Name9", "role": "Mafia", 'dead': true }, { "number": 10, "name": "Name10", "role": "Civilian" }
  ]);
  // const playersData = ref([])
  const don = computed(() => playersData.value.find((player) => player.role === 'Don'))
  const mafia = computed(() => playersData.value.filter((player) => player.role === 'Mafia'))
  const sheriff = computed(() => playersData.value.find((player) => player.role === 'Sheriff'))

  const votingsToSkip = ref(0)
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
  */
  const gameState = ref('day');
  // const gameState = ref('rolesAssignmentPrep');

  const musicPlaying = ref(false)

  const router = useRouter()
  const currentRoute = computed(() => router.currentRoute.value.name)
  function evaluateGame() {
    const mafiaCount = playersData.value.filter((player) => ['Mafia', 'Don'].includes(player.role) && !player.dead).length
    const civCount = playersData.value.filter((player) => ['Civilian', 'Sheriff'].includes(player.role) && !player.dead).length

    if (mafiaCount >= civCount) {
      if (currentRoute !== 'results') {
        router.push('/results');
        gameState.value = 'rolesAssignmentPrep'
      }
      return 'mafiaWon'
    } else if (mafiaCount === 0) {
      if (currentRoute !== 'results') {
        router.push('/results');
        gameState.value = 'rolesAssignmentPrep'
      }
      return 'civWon'
    }
  }

  return { playersData, don, mafia, sheriff, gameState, musicPlaying, firstPlayerToSpeak, cycle, testamentsQueue, currentRoute, votingsToSkip, evaluateGame }
})
