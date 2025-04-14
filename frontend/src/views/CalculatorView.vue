<template>
  <div class="max-w-4xl mx-auto p-5">
    <h1 class="text-2xl text-gray-700 text-center mb-8">Calculadora de Coste/Hora TramiTech</h1>

    <CalculatorForm
      v-if="config"
      :config="config"
      :formData="formData"
      @update:formData="formData = $event"
      @calculate="calculateCost"
      @reset="resetForm"
    />

    <div v-if="loading" class="text-center my-5 text-gray-500">
      Cargando...
    </div>

    <div v-if="error" class="text-red-600 bg-red-50 p-2.5 rounded-md my-5">
      {{ error }}
    </div>

    <CalculatorResults
      v-if="result"
      :result="result"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CalculatorForm from '@/components/CalculatorForm.vue'
import CalculatorResults from '@/components/CalculatorResults.vue'
import type { Config, FormData, CalculationResult } from '@/types/calculator'

// Estado de la aplicación
const config = ref<Config | null>(null)
const formData = ref<FormData>({
  experienceLevel: '',
  projectType: '',
  scheduleType: '',
  customIndirectCost: null,
  customBillableHours: null
})
const loading = ref(false)
const error = ref('')
const result = ref<CalculationResult | null>(null)

// API URL
const apiUrl = import.meta.env.VITE_API_URL || '/api'

// Cargar configuración inicial
onMounted(async () => {
  try {
    loading.value = true
    const response = await fetch(`${apiUrl}/config`)
    if (!response.ok) {
      throw new Error('Error al cargar la configuración')
    }
    config.value = await response.json()

    // Establecer valores predeterminados
    if (config.value && config.value.experienceLevels.length > 0) {
      formData.value.experienceLevel = config.value.experienceLevels[0].name
    }
    if (config.value && config.value.projectTypes.length > 0) {
      formData.value.projectType = config.value.projectTypes[0].name
    }
    if (config.value && config.value.scheduleTypes.length > 0) {
      formData.value.scheduleType = config.value.scheduleTypes[0].name
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
    error.value = `No se pudo cargar la configuración: ${errorMsg}`
  } finally {
    loading.value = false
  }
})

// Calcular coste
async function calculateCost() {
  try {
    loading.value = true
    error.value = ''
    result.value = null

    const response = await fetch(`${apiUrl}/calculator/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        experienceLevel: formData.value.experienceLevel,
        projectType: formData.value.projectType,
        scheduleType: formData.value.scheduleType,
        customIndirectCost: formData.value.customIndirectCost,
        customBillableHours: formData.value.customBillableHours
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al calcular el coste')
    }

    result.value = await response.json()
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
    error.value = `Error: ${errorMsg}`
  } finally {
    loading.value = false
  }
}

// Reiniciar formulario
function resetForm() {
  if (!config.value) return

  formData.value = {
    experienceLevel: config.value.experienceLevels[0].name,
    projectType: config.value.projectTypes[0].name,
    scheduleType: config.value.scheduleTypes[0].name,
    customIndirectCost: null,
    customBillableHours: null
  }
  result.value = null
  error.value = ''
}
</script>

<style scoped>
.calculator-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.loading {
  text-align: center;
  margin: 20px 0;
  color: #777;
}

.error-message {
  color: #e74c3c;
  background-color: #fde9e8;
  padding: 10px;
  border-radius: 4px;
  margin: 20px 0;
}
</style>
