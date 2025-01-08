import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameLog = defineStore('log', () => {
    const log = ref("")
    
    const generateLogHeader = (tournamentName, game, stage, date) => {
        log.value = "---[INFO]---\n"
        log.value += `| Tournament: ${tournamentName}\n`
        log.value += `| Game: ${game}\n`
        log.value += `| Stage: ${stage}\n`
        log.value += `| Date: ${date}`
    }
    
    const generatePlayersList = (playersData) => {
        log.value += "\n\n"
        log.value += "---[PLAYERS]---\n"
        playersData.forEach((player) => {
            log.value += `| ${player.name} - #${player.number}: ${player.role}\n`
        })
    }

    const downloadGameLog = () => {
        const blob = new Blob([log.value], { type: 'text/plain' });
        
        const link = document.createElement('a');
        link.download = 'gameLog.txt';
        link.href = window.URL.createObjectURL(blob);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return { downloadGameLog, generateLogHeader, generatePlayersList }
})
