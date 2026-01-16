<script setup lang="ts">
import { Wifi, WifiOff, Cat } from 'lucide-vue-next';

defineProps<{
  isConnected: boolean;
  selectedDate: string;
}>();

defineEmits<{
  (e: 'update:selectedDate', value: string): void
}>();
</script>

<template>
  <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
    <div class="flex items-center gap-4 px-2 py-2 pr-6 bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-full transition-all duration-300 hover:scale-[1.02]">
        
        <!-- Logo / Brand -->
        <div class="flex items-center gap-3 pl-2">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Cat class="w-5 h-5 text-white" />
            </div>
            <div class="hidden md:block">
                <h1 class="text-sm font-bold text-gray-800 leading-tight">Smart Feeder</h1>
                <p class="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Live Monitor</p>
            </div>
        </div>

        <div class="w-px h-8 bg-gray-200 mx-2"></div>

        <!-- Controls -->
        <input 
            type="date" 
            :value="selectedDate"
            @input="$emit('update:selectedDate', ($event.target as HTMLInputElement).value)"
            class="bg-transparent border-none text-sm font-semibold text-gray-600 focus:ring-0 cursor-pointer"
        />

        <!-- Status Pill -->
        <div 
            class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-300"
            :class="isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
        >
            <Wifi v-if="isConnected" class="w-3.5 h-3.5" />
            <WifiOff v-else class="w-3.5 h-3.5" />
            <span class="text-xs font-bold">{{ isConnected ? 'Online' : 'Offline' }}</span>
        </div>

    </div>
  </nav>
</template>
