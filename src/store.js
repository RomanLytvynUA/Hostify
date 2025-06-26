import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useGameLog } from '@/log.js'

export const useStore = defineStore('store', () => {
  // const playersData = ref([
  //   {
  //     "number": 1,
  //     "name": "Bob1",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Sheriff"
  //   },
  //   {
  //     "number": 2,
  //     "name": "Bob2",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Civilian"
  //   },
  //   {
  //     "number": 3,
  //     "name": "Bob3",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Civilian"
  //   },
  //   {
  //     "number": 4,
  //     "name": "Bob4",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Civilian"
  //   },
  //   {
  //     "number": 5,
  //     "name": "Bob5",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Civilian"
  //   },
  //   {
  //     "number": 6,
  //     "name": "Bob6",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Civilian"
  //   },
  //   {
  //     "number": 7,
  //     "name": "Bob7",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Civilian"
  //   },
  //   {
  //     "number": 8,
  //     "name": "Bob8",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Mafia"
  //   },
  //   {
  //     "number": 9,
  //     "name": "Bob9",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Mafia"
  //   },
  //   {
  //     "number": 10,
  //     "name": "Bob10",
  //     "fouls": 0,
  //     "expelled": false,
  //     "dead": false,
  //     "skipNextSpeech": false,
  //     "role": "Don"
  //   }
  // ]);
  const playersData = ref([])
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
  // const gameState = ref('nightPrep');
  const gameState = ref('rolesAssignmentPrep');

  const musicPlaying = ref(false)

  const router = useRouter()
  const currentRoute = computed(() => router.currentRoute.value.name)
  function evaluateGame() {
    const mafiaCount = playersData.value.filter((player) => ['Mafia', 'Don'].includes(player.role) && !player.dead).length
    const civCount = playersData.value.filter((player) => ['Civilian', 'Sheriff'].includes(player.role) && !player.dead).length

    if (mafiaCount >= civCount) {
      if (currentRoute !== 'results' && !['rolesAssignmentPrep', 'rolesAssignment'].includes(gameState.value)) {
        router.push('/results');
        gameState.value = 'rolesAssignmentPrep'
        useGameLog().logPhase('MAFIA WON')
      }

      return 'mafiaWon'
    } else if (mafiaCount === 0) {
      if (currentRoute !== 'results' && !['rolesAssignmentPrep', 'rolesAssignment'].includes(gameState.value)) {
        router.push('/results');
        gameState.value = 'rolesAssignmentPrep'
        useGameLog().logPhase('CIVILIANS WON')
      }

      return 'civWon'
    }
  }

  return { playersData, don, mafia, sheriff, gameState, musicPlaying, firstPlayerToSpeak, cycle, testamentsQueue, currentRoute, votingsToSkip, evaluateGame }
})
