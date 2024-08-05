<script setup>
import { ref, watch } from 'vue'

const songs = {
    'Standart': [
        { name: '1975', path: '/music/standart/1975.mp3' },
        { name: 'River Blues', path: '/music/standart/River Blues.mp3' },
        { name: 'We Ride!', path: '/music/standart/We Ride!.mp3' },
    ],
    'Jazz': [
        { name: 'Blue Mood', path: '/music/jazz/Blue Mood.mp3' },
        { name: 'City Walk', path: '/music/jazz/City Walk.mp3' },
        { name: 'The Moon Drops', path: '/music/jazz/The Moon Drops.mp3' },
    ],
    'Rock': [
        { name: 'Here it Comes', path: '/music/rock/Here it Comes.mp3' },
        { name: 'Break Your Lock and Key', path: '/music/rock/Break Your Lock and Key.mp3' },
        { name: 'Buckeye Bonzai', path: '/music/rock/Buckeye Bonzai.mp3' },
    ],
}

const playing = ref(false)
const selectedSong = ref(songs[0])

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
            <i style="font-size: 25px;" @click="playing = !playing"
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