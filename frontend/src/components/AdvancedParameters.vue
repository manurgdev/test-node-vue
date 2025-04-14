<template>
  <div class="mb-5 pb-4 border-b border-gray-200">
    <h2 class="flex justify-between items-center text-lg mb-4 text-gray-700">
      Parámetros Avanzados
      <button class="bg-transparent border-none text-green-500 cursor-pointer text-sm" @click="showAdvanced = !showAdvanced">
        {{ showAdvanced ? 'Ocultar' : 'Mostrar' }}
      </button>
    </h2>

    <div v-if="showAdvanced" class="advanced-options">
      <div class="mb-4">
        <label for="indirectCost" class="block mb-1 font-semibold text-gray-600">Coste Indirecto Mensual (€):</label>
        <input
          type="number"
          id="indirectCost"
          :value="customIndirectCost"
          @input="updateIndirectCost($event)"
          placeholder="Personalizar coste indirecto"
          class="w-full p-2.5 border border-gray-300 rounded-md text-base"
        >
        <small class="block text-gray-500 text-sm mt-1">Coste fijo mensual por consultor (infraestructura, licencias, gastos generales). Por defecto: {{ config.indirectCostPerMonth }}€</small>
      </div>

      <div class="mb-4">
        <label for="billableHours" class="block mb-1 font-semibold text-gray-600">Horas Facturables Mensuales:</label>
        <input
          type="number"
          id="billableHours"
          :value="customBillableHours"
          @input="updateBillableHours($event)"
          placeholder="Personalizar horas facturables"
          class="w-full p-2.5 border border-gray-300 rounded-md text-base"
        >
        <small class="block text-gray-500 text-sm mt-1">Horas facturables al mes por consultor. Por defecto: {{ config.billableHoursPerMonth }} horas</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Config } from '@/types/calculator'

defineProps<{
  config: Config
  customIndirectCost: number | null
  customBillableHours: number | null
}>()

const emit = defineEmits<{
  'update:custom-indirect-cost': [value: number | null]
  'update:custom-billable-hours': [value: number | null]
}>()

const showAdvanced = ref(false)

function updateIndirectCost(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? null : Number(target.value)
  emit('update:custom-indirect-cost', value)
}

function updateBillableHours(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? null : Number(target.value)
  emit('update:custom-billable-hours', value)
}
</script>
