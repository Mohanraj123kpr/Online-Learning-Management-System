<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from 'lucide-vue-next'

interface Props {
  videoUrl: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const showControls = ref(true)
let controlsTimeout: ReturnType<typeof setTimeout> | null = null

const togglePlay = () => {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const toggleMute = () => {
  if (!videoRef.value) return
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
}

const toggleFullscreen = () => {
  if (!videoRef.value) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    videoRef.value.requestFullscreen()
  }
}

const skip = (seconds: number) => {
  if (!videoRef.value) return
  videoRef.value.currentTime += seconds
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
}

const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

const handleSeek = (event: Event) => {
  if (!videoRef.value) return
  const target = event.target as HTMLInputElement
  videoRef.value.currentTime = parseFloat(target.value)
}

const handleVolumeChange = (event: Event) => {
  if (!videoRef.value) return
  const target = event.target as HTMLInputElement
  const newVolume = parseFloat(target.value)
  videoRef.value.volume = newVolume
  volume.value = newVolume
  isMuted.value = newVolume === 0
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleMouseMove = () => {
  showControls.value = true
  if (controlsTimeout) clearTimeout(controlsTimeout)
  controlsTimeout = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

onMounted(() => {
  if (props.autoplay && videoRef.value) {
    videoRef.value.play()
    isPlaying.value = true
  }
})

watch(
  () => props.videoUrl,
  () => {
    isPlaying.value = false
    currentTime.value = 0
  },
)
</script>

<template>
  <div
    class="group relative aspect-video w-full overflow-hidden rounded-lg bg-black"
    @mousemove="handleMouseMove"
    @mouseleave="showControls = false"
  >
    <!-- Video Element -->
    <video
      ref="videoRef"
      class="size-full object-contain"
      :src="videoUrl"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @click="togglePlay"
    >
      Your browser does not support the video tag.
    </video>

    <!-- Play/Pause Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!isPlaying"
        class="absolute inset-0 flex items-center justify-center bg-black/30"
        @click="togglePlay"
      >
        <button
          class="flex size-20 items-center justify-center rounded-full bg-white/90 text-black transition-transform hover:scale-110"
        >
          <Play class="size-10" :style="{ marginLeft: '4px' }" />
        </button>
      </div>
    </Transition>

    <!-- Controls -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="showControls || !isPlaying"
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      >
        <!-- Progress Bar -->
        <input
          type="range"
          min="0"
          :max="duration"
          :value="currentTime"
          class="mb-3 w-full cursor-pointer"
          @input="handleSeek"
        />

        <!-- Control Buttons -->
        <div class="flex items-center justify-between text-white">
          <div class="flex items-center gap-3">
            <!-- Play/Pause -->
            <button
              class="rounded-full p-2 transition-colors hover:bg-white/20"
              @click="togglePlay"
            >
              <Pause v-if="isPlaying" class="size-6" />
              <Play v-else class="size-6" />
            </button>

            <!-- Skip Back -->
            <button class="rounded-full p-2 transition-colors hover:bg-white/20" @click="skip(-10)">
              <SkipBack class="size-5" />
            </button>

            <!-- Skip Forward -->
            <button class="rounded-full p-2 transition-colors hover:bg-white/20" @click="skip(10)">
              <SkipForward class="size-5" />
            </button>

            <!-- Volume -->
            <div class="flex items-center gap-2">
              <button
                class="rounded-full p-2 transition-colors hover:bg-white/20"
                @click="toggleMute"
              >
                <Volume2 v-if="!isMuted && volume > 0" class="size-5" />
                <VolumeX v-else class="size-5" />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                :value="volume"
                class="w-20 cursor-pointer"
                @input="handleVolumeChange"
              />
            </div>

            <!-- Time -->
            <span class="text-sm">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </span>
          </div>

          <!-- Fullscreen -->
          <button
            class="rounded-full p-2 transition-colors hover:bg-white/20"
            @click="toggleFullscreen"
          >
            <Maximize class="size-5" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type='range']::-webkit-slider-track {
  background: rgba(255, 255, 255, 0.3);
  height: 4px;
  border-radius: 2px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  margin-top: -5px;
}

input[type='range']::-moz-range-track {
  background: rgba(255, 255, 255, 0.3);
  height: 4px;
  border-radius: 2px;
}

input[type='range']::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
}
</style>
