<template>
  <div class="bg-gray-50 rounded-lg p-5">
    <h2 class="text-xl text-gray-700 mb-5 text-center">Resultado del Cálculo</h2>

    <div class="bg-green-50 p-4 rounded-md mb-5 text-center">
      <h3 class="m-0 text-green-800">Coste Final por Hora: <span class="text-2xl font-bold text-green-800">{{ formatCurrency(result.results.finalCost) }}</span></h3>
    </div>

    <div class="mt-5">
      <h3 class="text-lg text-gray-700 mb-4 border-b border-gray-200 pb-2.5">Desglose del Cálculo</h3>

      <CalculationBreakdown
        title="Tarifa Base Ajustada"
        :formula="`${formatCurrency(result.calculation.baseRate)} × ${result.calculation.projectMultiplier} × ${result.calculation.scheduleMultiplier}`"
        :result="formatCurrency(result.results.adjustedBase)"
        explanation="Tarifa base según experiencia, ajustada por los multiplicadores de proyecto y horario"
      />

      <CalculationBreakdown
        title="Coste con Gastos Indirectos"
        :formula="`${formatCurrency(result.results.adjustedBase)} + ${formatCurrency(result.calculation.indirectCostPerHour)}`"
        :result="formatCurrency(result.results.costBeforeMargin)"
        :explanation="`Se añade el coste indirecto por hora (${formatCurrency(result.calculation.indirectCostPerMonth)}/mes ÷ ${result.calculation.billableHoursPerMonth} horas)`"
      />

      <CalculationBreakdown
        title="Coste con Margen de Beneficio"
        :formula="`${formatCurrency(result.results.costBeforeMargin)} × (1 + ${formatPercentage(result.calculation.profitMargin)})`"
        :result="formatCurrency(result.results.costWithMargin)"
        explanation="Se aplica el margen de beneficio para este tipo de proyecto"
      />

      <CalculationBreakdown
        title="Coste Final con IVA"
        :formula="`${formatCurrency(result.results.costWithMargin)} × (1 + ${formatPercentage(result.calculation.taxRate)})`"
        :result="formatCurrency(result.results.finalCost)"
        explanation="Se aplica el IVA (21%)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CalculationBreakdown from './CalculationBreakdown.vue'
import type { CalculationResult } from '@/types/calculator'
import { formatCurrency, formatPercentage } from '@/helpers/currency'

defineProps<{
  result: CalculationResult
}>()
</script>
