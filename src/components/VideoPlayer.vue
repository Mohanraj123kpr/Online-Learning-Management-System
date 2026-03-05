<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from 'lucide-vue-next'

interface Props {
  videoUrl: string
  autoplay?: boolean
  startTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  startTime: 0,
})

const emit = defineEmits<{
  timeUpdate: [currentTime: number]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const volumeBarRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const buffered = ref(0)
const showControls = ref(true)
const isDraggingProgress = ref(false)
const isDraggingVolume = ref(false)
const hoverTime = ref(0)
const hoverPosition = ref(0)
const isHoveringProgress = ref(false)
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
  if (!videoRef.value || isDraggingProgress.value) return
  currentTime.value = videoRef.value.currentTime
  emit('timeUpdate', videoRef.value.currentTime)

  // Update buffered
  if (videoRef.value.buffered.length > 0) {
    buffered.value = videoRef.value.buffered.end(videoRef.value.buffered.length - 1)
  }
}

const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
  if (props.startTime > 0 && props.startTime < videoRef.value.duration) {
    videoRef.value.currentTime = props.startTime
    currentTime.value = props.startTime
  }
}

// Progress bar interactions
const seekToPosition = (clientX: number) => {
  if (!progressBarRef.value || !videoRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const time = percent * duration.value
  videoRef.value.currentTime = time
  currentTime.value = time
}

const handleProgressMouseDown = (e: MouseEvent) => {
  isDraggingProgress.value = true
  seekToPosition(e.clientX)
  document.addEventListener('mousemove', handleProgressMouseMove)
  document.addEventListener('mouseup', handleProgressMouseUp)
}

const handleProgressMouseMove = (e: MouseEvent) => {
  if (isDraggingProgress.value) {
    seekToPosition(e.clientX)
  }
}

const handleProgressMouseUp = () => {
  isDraggingProgress.value = false
  document.removeEventListener('mousemove', handleProgressMouseMove)
  document.removeEventListener('mouseup', handleProgressMouseUp)
}

const handleProgressHover = (e: MouseEvent) => {
  if (!progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  hoverTime.value = percent * duration.value
  hoverPosition.value = percent * 100
  isHoveringProgress.value = true
}

// Volume bar interactions
const setVolumeFromPosition = (clientX: number) => {
  if (!volumeBarRef.value || !videoRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const newVolume = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  videoRef.value.volume = newVolume
  volume.value = newVolume
  isMuted.value = newVolume === 0
}

const handleVolumeMouseDown = (e: MouseEvent) => {
  isDraggingVolume.value = true
  setVolumeFromPosition(e.clientX)
  document.addEventListener('mousemove', handleVolumeMouseMove)
  document.addEventListener('mouseup', handleVolumeMouseUp)
}

const handleVolumeMouseMove = (e: MouseEvent) => {
  if (isDraggingVolume.value) {
    setVolumeFromPosition(e.clientX)
  }
}

const handleVolumeMouseUp = () => {
  isDraggingVolume.value = false
  document.removeEventListener('mousemove', handleVolumeMouseMove)
  document.removeEventListener('mouseup', handleVolumeMouseUp)
}

const progressPercent = () => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
}

const bufferedPercent = () => {
  if (duration.value === 0) return 0
  return (buffered.value / duration.value) * 100
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
          class="flex items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110"
          style="width: 80px; height: 80px; color: black"
        >
          <Play :size="40" :style="{ marginLeft: '4px' }" />
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
        <div
          ref="progressBarRef"
          class="progress-bar-container"
          @mousedown="handleProgressMouseDown"
          @mousemove="handleProgressHover"
          @mouseleave="isHoveringProgress = false"
        >
          <!-- Hover tooltip -->
          <div
            v-if="isHoveringProgress"
            class="progress-tooltip"
            :style="{ left: hoverPosition + '%' }"
          >
            {{ formatTime(hoverTime) }}
          </div>
          <!-- Track background -->
          <div class="progress-track">
            <!-- Buffered -->
            <div class="progress-buffered" :style="{ width: bufferedPercent() + '%' }"></div>
            <!-- Played -->
            <div class="progress-filled" :style="{ width: progressPercent() + '%' }"></div>
          </div>
          <!-- Thumb -->
          <div class="progress-thumb" :style="{ left: progressPercent() + '%' }"></div>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center justify-between text-white" style="color: white">
          <div class="flex items-center gap-3">
            <!-- Play/Pause -->
            <button
              class="video-control-btn rounded-full p-2 transition-colors hover:bg-white/20"
              @click="togglePlay"
            >
              <Pause v-if="isPlaying" :size="24" />
              <Play v-else :size="24" />
            </button>

            <!-- Skip Back -->
            <button
              class="video-control-btn rounded-full p-2 transition-colors hover:bg-white/20"
              @click="skip(-10)"
            >
              <SkipBack :size="20" />
            </button>

            <!-- Skip Forward -->
            <button
              class="video-control-btn rounded-full p-2 transition-colors hover:bg-white/20"
              @click="skip(10)"
            >
              <SkipForward :size="20" />
            </button>

            <!-- Volume -->
            <div class="flex items-center gap-2">
              <button
                class="video-control-btn rounded-full p-2 transition-colors hover:bg-white/20"
                @click="toggleMute"
              >
                <Volume2 v-if="!isMuted && volume > 0" :size="20" />
                <VolumeX v-else :size="20" />
              </button>
              <div
                ref="volumeBarRef"
                class="volume-bar-container"
                @mousedown="handleVolumeMouseDown"
              >
                <div class="volume-track">
                  <div class="volume-filled" :style="{ width: volume * 100 + '%' }"></div>
                </div>
                <div class="volume-thumb" :style="{ left: volume * 100 + '%' }"></div>
              </div>
            </div>

            <!-- Time -->
            <span class="text-sm" style="color: white">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </span>
          </div>

          <!-- Fullscreen -->
          <button
            class="video-control-btn rounded-full p-2 transition-colors hover:bg-white/20"
            @click="toggleFullscreen"
          >
            <Maximize :size="20" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.video-control-btn {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}

.video-control-btn :deep(svg) {
  color: white;
  stroke: white;
}

/* Progress Bar */
.progress-bar-container {
  position: relative;
  width: 100%;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.progress-bar-container:hover .progress-track {
  height: 6px;
}

.progress-bar-container:hover .progress-thumb {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.progress-track {
  position: absolute;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  transition: height 0.15s ease;
  overflow: hidden;
}

.progress-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 2px;
}

.progress-filled {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
}

.progress-thumb {
  position: absolute;
  width: 14px;
  height: 14px;
  background: #3b82f6;
  border: 2px solid white;
  border-radius: 50%;
  transform: translateX(-50%) scale(0);
  opacity: 0;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  pointer-events: none;
  z-index: 2;
}

.progress-tooltip {
  position: absolute;
  bottom: 22px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 3;
}

/* Volume Bar */
.volume-bar-container {
  position: relative;
  width: 80px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.volume-bar-container:hover .volume-thumb {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.volume-track {
  position: absolute;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.volume-filled {
  height: 100%;
  background: white;
  border-radius: 2px;
}

.volume-thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  transform: translateX(-50%) scale(0);
  opacity: 0;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  pointer-events: none;
  z-index: 2;
}
</style>
