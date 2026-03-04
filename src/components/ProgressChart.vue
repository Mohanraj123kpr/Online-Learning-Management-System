<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  data: Array<{ name: string; progress: number }>
}

const props = defineProps<Props>()

const getColor = (progress: number) => {
  if (progress >= 75) return '#10b981' // green
  if (progress >= 50) return '#3b82f6' // blue
  if (progress >= 25) return '#f59e0b' // amber
  return '#ef4444' // red
}

const chartData = computed(() => ({
  labels: props.data.map((item) => item.name),
  datasets: [
    {
      label: 'Progress',
      data: props.data.map((item) => item.progress),
      backgroundColor: props.data.map((item) => getColor(item.progress)),
      borderRadius: 8,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function (tickValue) {
          return `${tickValue}%`
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `Progress: ${context.parsed.y}%`,
      },
    },
  },
}
</script>

<template>
  <div class="h-[300px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
