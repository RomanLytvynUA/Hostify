<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from '@/store.js'

const songs = {
    'Jazz': [
        { name: 'Blue Mood', path: 'music/jazz/Blue Mood.mp3' },
        { name: 'City Walk', path: 'music/jazz/City Walk.mp3' },
        { name: 'The Moon Drops', path: 'music/jazz/The Moon Drops.mp3' },
    ],
    'Rock': [
        { name: 'Here it Comes', path: 'music/rock/Here it Comes.mp3' },
        { name: 'Break Your Lock and Key', path: 'music/rock/Break Your Lock and Key.mp3' },
        { name: 'Buckeye Bonzai', path: 'music/rock/Buckeye Bonzai.mp3' },
    ],
    'Ukrainian Jazz': [
        { name: 'Roses on the platform', path: 'music/uajaz/Roses on the platform.mp3' },
        { name: 'Red rue', path: 'music/uajaz/Red rue.mp3' },
        { name: 'Paint me the night', path: 'music/uajaz/Paint me the night.mp3' },
    ],
}

const playing = computed(() => useStore().musicPlaying)
const selectedSong = ref(songs.Jazz[0].name)

watch(() => playing.value, () => {
    const player = document.getElementById(selectedSong.value)
    playing.value ? player?.play() : player?.pause()
})

watch(() => selectedSong.value, (newSong, oldSong) => {
    // stop playing current song when song change
    const oldSongElem = document.getElementById(oldSong)
    if (oldSongElem) {
        oldSongElem.pause()
        oldSongElem.currentTime = 0
    }
    playing.value ? document.getElementById(newSong).play() : {}
})

</script>

<template>
    <div>
        <div class="d-flex align-items-center">
            <select v-model="selectedSong" style="width: 100px;" class="form-select form-select-sm">
                <optgroup v-for="group in Object.keys(songs)" :label="group">
                    <option v-for="song in songs[group]">{{ song.name }}</option>
                </optgroup>
            </select>
            <i style="font-size: 25px;" @click="useStore().musicPlaying = !useStore().musicPlaying"
                :class="playing ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
        </div>
        <div id="songs" style="display: none;">
            <audio v-for="song in Object.values(songs).flatMap(song => song)" :id="song.name" controls loop>
                <source :src="song.path" type="audio/mp3">
            </audio>
        </div>
    </div>
</template>

<style scoped>
select {
    background-color: #333334 !important;
}

i:hover {
    cursor: pointer;
}
</style>