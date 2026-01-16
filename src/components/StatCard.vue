<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string | number;
  unit?: string;
  icon: any; // Lucide icon component
  accentColor?: string; // e.g. 'text-orange-500'
  subtext?: string;
}>();

const cardClasses = computed(() => {
    return `relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:shadow-[0_8px_30px_rgb(246,173,85,0.15)] transition-all duration-300 group`;
});
</script>

<template>
  <div :class="cardClasses">
    <!-- Decorative Giant Icon -->
    <component 
        :is="icon" 
        class="absolute -top-10 -right-10 w-40 h-40 opacity-5 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" 
        :class="accentColor"
    />

    <div class="relative z-10 flex flex-col h-full justify-between">
       <!-- Header -->
       <div class="flex items-center gap-3 mb-4">
            <div class="p-3 rounded-2xl bg-gray-50/80 shadow-sm ring-1 ring-black/5">
                <component :is="icon" class="w-5 h-5" :class="accentColor" />
            </div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">{{ title }}</span>
       </div>

       <!-- Value -->
       <div class="flex items-baseline gap-2">
            <h3 class="text-5xl font-black tracking-tight text-gray-800">
                {{ value }}
            </h3>
            <span v-if="unit" class="text-lg font-medium text-gray-400">{{ unit }}</span>
       </div>

       <!-- Subtext -->
       <div v-if="subtext" class="mt-4 pt-4 border-t border-gray-100/50">
            <p class="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                {{ subtext }}
            </p>
       </div>
    </div>
  </div>
</template>
