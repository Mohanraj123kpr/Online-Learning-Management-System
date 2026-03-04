<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-vue-next'
import type { QuizQuestion } from '@/types'

interface Props {
  questions: QuizQuestion[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  complete: [score: number]
}>()

const currentQuestionIndex = ref(0)
const selectedAnswers = ref<number[]>([])
const showResults = ref(false)
const quizCompleted = ref(false)

const currentQuestion = computed(() => props.questions[currentQuestionIndex.value])
const progress = computed(() => ((currentQuestionIndex.value + 1) / props.questions.length) * 100)

const score = computed(() => {
  return props.questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers.value[idx] === q.correctAnswer ? 1 : 0)
  }, 0)
})

const percentage = computed(() => Math.round((score.value / props.questions.length) * 100))

function selectAnswer(optionIndex: number) {
  selectedAnswers.value[currentQuestionIndex.value] = optionIndex
}

function nextQuestion() {
  if (currentQuestionIndex.value < props.questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    showResults.value = true
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function submitQuiz() {
  quizCompleted.value = true
  emit('complete', percentage.value)
}

function retakeQuiz() {
  currentQuestionIndex.value = 0
  selectedAnswers.value = []
  showResults.value = false
  quizCompleted.value = false
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <!-- Quiz Header -->
    <div v-if="!showResults" class="space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
        </h3>
        <span class="text-sm text-gray-600">{{ Math.round(progress) }}% Complete</span>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div class="h-full bg-blue-600 transition-all" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <!-- Question -->
    <div v-if="!showResults" class="rounded-lg border bg-white p-6 shadow-sm">
      <h4 class="mb-6 text-xl font-medium">{{ currentQuestion.question }}</h4>

      <div class="space-y-3">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          @click="selectAnswer(index)"
          :class="[
            'w-full rounded-lg border-2 p-4 text-left transition-all',
            selectedAnswers[currentQuestionIndex] === index
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300',
          ]"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'flex size-6 items-center justify-center rounded-full border-2',
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300',
              ]"
            >
              <div
                v-if="selectedAnswers[currentQuestionIndex] === index"
                class="size-3 rounded-full bg-white"
              ></div>
            </div>
            <span>{{ option }}</span>
          </div>
        </button>
      </div>

      <!-- Navigation -->
      <div class="mt-6 flex items-center justify-between">
        <button
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          class="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextQuestion"
          :disabled="selectedAnswers[currentQuestionIndex] === undefined"
          class="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ currentQuestionIndex === questions.length - 1 ? 'Review Answers' : 'Next' }}
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-else class="space-y-6">
      <!-- Score Card -->
      <div class="rounded-lg border bg-white p-8 text-center shadow-sm">
        <div
          :class="[
            'mx-auto mb-4 flex size-24 items-center justify-center rounded-full',
            percentage >= 70 ? 'bg-green-100' : 'bg-red-100',
          ]"
        >
          <span
            :class="['text-3xl font-bold', percentage >= 70 ? 'text-green-600' : 'text-red-600']"
          >
            {{ percentage }}%
          </span>
        </div>
        <h3 class="mb-2 text-2xl font-bold">
          {{ percentage >= 70 ? 'Great Job!' : 'Keep Practicing!' }}
        </h3>
        <p class="text-gray-600">
          You scored {{ score }} out of {{ questions.length }} questions correctly
        </p>
      </div>

      <!-- Answer Review -->
      <div class="space-y-4">
        <h4 class="text-lg font-semibold">Review Your Answers</h4>
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div class="mb-4 flex items-start gap-3">
            <component
              :is="selectedAnswers[index] === question.correctAnswer ? CheckCircle : XCircle"
              :class="[
                'size-6 flex-shrink-0',
                selectedAnswers[index] === question.correctAnswer
                  ? 'text-green-600'
                  : 'text-red-600',
              ]"
            />
            <div class="flex-1">
              <h5 class="mb-2 font-medium">{{ question.question }}</h5>
              <div class="space-y-2 text-sm">
                <p>
                  <span class="font-medium">Your answer:</span>
                  <span
                    :class="
                      selectedAnswers[index] === question.correctAnswer
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{ question.options[selectedAnswers[index]] }}
                  </span>
                </p>
                <p v-if="selectedAnswers[index] !== question.correctAnswer">
                  <span class="font-medium">Correct answer:</span>
                  <span class="text-green-600">
                    {{ question.options[question.correctAnswer] }}
                  </span>
                </p>
                <p v-if="question.explanation" class="text-gray-600">
                  <span class="font-medium">Explanation:</span>
                  {{ question.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <button
          @click="retakeQuiz"
          class="flex items-center gap-2 rounded-md border px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          <RotateCcw class="size-4" />
          Retake Quiz
        </button>
        <button
          v-if="!quizCompleted"
          @click="submitQuiz"
          class="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Complete Lesson
        </button>
      </div>
    </div>
  </div>
</template>
