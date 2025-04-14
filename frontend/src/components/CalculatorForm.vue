<template>
  <div class="bg-gray-50 rounded-lg p-5 mb-8" v-if="config">
    <div class="mb-5 pb-4 border-b border-gray-200">
      <h2 class="text-lg mb-4 text-gray-700">Datos del Consultor y Proyecto</h2>
      <div class="mb-4">
        <label for="experience" class="block mb-1 font-semibold text-gray-600">Experiencia del Consultor:</label>
        <select id="experience" v-model="localFormData.experienceLevel" @change="updateFormData" class="w-full p-2.5 border border-gray-300 rounded-md text-base">
          <option v-for="exp in config.experienceLevels" :key="exp.name" :value="exp.name">
            {{ exp.name }} ({{ exp.baseRate }}€/h)
          </option>
        </select>
        <small class="block text-gray-500 text-sm mt-1">Nivel de experiencia del consultor que determina la tarifa base.</small>
      </div>

      <div class="mb-4">
        <label for="project" class="block mb-1 font-semibold text-gray-600">Tipo de Proyecto:</label>
        <select id="project" v-model="localFormData.projectType" @change="updateFormData" class="w-full p-2.5 border border-gray-300 rounded-md text-base">
          <option v-for="proj in config.projectTypes" :key="proj.name" :value="proj.name">
            {{ proj.name }} (x{{ proj.multiplier }})
          </option>
        </select>
        <small class="block text-gray-500 text-sm mt-1">Tipo de proyecto que define su prioridad y multiplicador.</small>
      </div>

      <div class="mb-4">
        <label for="schedule" class="block mb-1 font-semibold text-gray-600">Horario:</label>
        <select id="schedule" v-model="localFormData.scheduleType" @change="updateFormData" class="w-full p-2.5 border border-gray-300 rounded-md text-base">
          <option v-for="sch in config.scheduleTypes" :key="sch.name" :value="sch.name">
            {{ sch.name }} (x{{ sch.multiplier }})
          </option>
        </select>
        <small class="block text-gray-500 text-sm mt-1">Horario en que se realiza el trabajo.</small>
      </div>
    </div>

    <AdvancedParameters
      :config="config"
      :custom-indirect-cost="localFormData.customIndirectCost"
      :custom-billable-hours="localFormData.customBillableHours"
      @update:custom-indirect-cost="updateIndirectCost"
      @update:custom-billable-hours="updateBillableHours"
    />

    <div class="flex gap-3 mt-5">
      <button
        class="py-3 px-5 border-none rounded-md text-base cursor-pointer bg-green-500 hover:bg-green-600 text-white flex-grow-2 disabled:bg-green-300 disabled:cursor-not-allowed"
        @click="calculate"
        :disabled="!isFormValid"
      >
        Calcular Coste
      </button>
      <button
        class="py-3 px-5 border-none rounded-md text-base cursor-pointer bg-red-500 hover:bg-red-600 text-white flex-grow-1"
        @click="resetLocal"
      >
        Reiniciar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, reactive } from 'vue'
import AdvancedParameters from './AdvancedParameters.vue'
import type { Config, FormData } from '@/types/calculator'

const props = defineProps<{
  config: Config | null
  formData: FormData
}>()

const emit = defineEmits<{
  calculate: []
  reset: []
  'update:formData': [formData: FormData]
}>()

// Crear una copia local de los datos del formulario para evitar mutar los props
const localFormData = reactive<FormData>({
  experienceLevel: '',
  projectType: '',
  scheduleType: '',
  customIndirectCost: null,
  customBillableHours: null
})

// Sincronizar los datos locales con los props cuando cambian
onMounted(() => {
  syncFromProps()
})

watch(() => props.formData, () => {
  syncFromProps()
}, { deep: true })

function syncFromProps() {
  if (props.formData) {
    localFormData.experienceLevel = props.formData.experienceLevel
    localFormData.projectType = props.formData.projectType
    localFormData.scheduleType = props.formData.scheduleType
    localFormData.customIndirectCost = props.formData.customIndirectCost
    localFormData.customBillableHours = props.formData.customBillableHours
  }
}

// Validación del formulario
const isFormValid = computed(() => {
  return localFormData.experienceLevel &&
         localFormData.projectType &&
         localFormData.scheduleType
})

// Funciones para actualizar el estado del formulario
function updateFormData() {
  emit('update:formData', { ...localFormData })
}

function updateIndirectCost(value: number | null) {
  localFormData.customIndirectCost = value
  updateFormData()
}

function updateBillableHours(value: number | null) {
  localFormData.customBillableHours = value
  updateFormData()
}

function calculate() {
  emit('calculate')
}

function resetLocal() {
  emit('reset')
}
</script>
