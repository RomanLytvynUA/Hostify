<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({ time: { default: '01:00' } })

const maxTime = ref(props.time)
const time = ref(maxTime.value)
const percentage = ref(100)

const counting = ref(false)


const getTimeValue = (timeStr) => {
    const parts = timeStr.split(':')
    return Number(parts[0]) * 60 + Number(parts[1])
}

const setTime = (newTime) => {
    let minutes = Math.floor(newTime / 60)
    let seconds = newTime % 60
    time.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

let interval = null
const startTimer = () => {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
        const currentTime = getTimeValue(time.value)
        if (currentTime > 0) {
            setTime(currentTime - 1)
        } else {
            counting.value = false
            clearInterval(interval)
        }
    }, 1000)
}

watch(counting, (newValue) => {
    if (newValue) {
        startTimer()
    } else {
        if (interval) clearInterval(interval)
    }
})

watch(() => time.value, () => {
    percentage.value = getTimeValue(time.value) / getTimeValue(maxTime.value) * 100
})

</script>

<template>
    <div>
        <div style="border-bottom-left-radius: 0; border-bottom-right-radius: 0; height: 20px;"
            class="progress position-relative">
            <div class="progress-bar " :style="`width: ${percentage}%;`"></div>
            <p class="justify-content-center d-flex position-absolute w-100">{{ time }}</p>
        </div>
        <div style="width: 100%;" class="btn-group">
            <button style="border-top-left-radius: 0;"
                @click="getTimeValue(time) - 10 >= 0 ? setTime(getTimeValue(time) - 10) : {}"
                class="btn btn-dark btn-sm">-10</button>
            <button @click="counting = !counting" class="btn btn-dark btn-sm">
                <i style="font-size: 15px;" :class="counting ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
            </button>
            <button style="border-top-right-radius: 0;"
                @click="getTimeValue(time) + 10 <= getTimeValue(maxTime) ? setTime(getTimeValue(time) + 10) : {}"
                class="btn btn-dark btn-sm">+10</button>
        </div>
    </div>
</template>

<style scoped>
.progress {
    background-color: #565658;
}

.btn-dark {
    border-color: #454547;
    background-color: #454547;
    color: white;
}

.btn-dark:active {
    border-color: #454547;
    background-color: #565658;
    color: white;
}
</style>
