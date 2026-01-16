<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Clock } from 'lucide-vue-next';
import type { SensorData } from '@/lib/supabase';

const props = defineProps<{
  logs: SensorData[];
}>();

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
    timer = setInterval(() => {
        now.value = Date.now();
    }, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});

const formatTimeAgo = (iso: string) => {
    const diff = now.value - new Date(iso).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 10) return 'Baru saja';
    if (seconds < 60) return `${seconds} detik yang lalu`;
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    return `${days} hari yang lalu`;
}

const formatTime = (iso: string) => {
    return new Date(iso).toLocaleString('id-ID', { 
        day: 'numeric', month: 'short', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'OPEN': return 'bg-green-500 shadow-green-500/50';
        case 'CLOSED': return 'bg-gray-300';
        case 'COOLDOWN': return 'bg-yellow-400 shadow-yellow-400/50';
        default: return 'bg-gray-200';
    }
}
</script>

<template>
  <div class="h-full flex flex-col bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-100/50 bg-white/40 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <h3 class="font-bold text-gray-700 flex items-center gap-2">
            <Clock class="w-4 h-4 text-orange-500" />
            Riwayat Aktivitas
        </h3>
        <span class="text-xs px-2 py-1 rounded-md bg-white border border-gray-100 text-gray-400 font-medium">Live</span>
    </div>

    <!-- Timeline Feed -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div v-for="(log, i) in logs" :key="log.id" class="relative pl-6 group">
            <!-- Connector Line -->
            <div v-if="i !== logs.length - 1" class="absolute left-[5px] top-2 bottom-[-24px] w-0.5 bg-gray-100 group-hover:bg-gray-200 transition-colors"></div>
            
            <!-- Use absolute positioning for the dot to perfectly align with text -->
            <div 
                class="absolute left-0 top-1.5 w-3 h-3 rounded-full shadow-sm ring-4 ring-white transition-all duration-300 group-hover:scale-125"
                :class="getStatusColor(log.servo_status)"
            ></div>

            <div class="flex items-center justify-between">
                <div>
                    <div class="mb-1">
                        <span class="text-xs font-bold text-gray-600 block">{{ formatTime(log.created_at) }}</span>
                        <span class="text-[10px] font-medium text-orange-500 block relative -top-0.5">
                            {{ formatTimeAgo(log.created_at) }}
                        </span>
                    </div>
                    <p class="text-sm font-medium text-gray-700">
                        {{ log.servo_status === 'OPEN' ? 'Pemberian Makan' : log.servo_status }}
                    </p>
                </div>
                <div class="text-right">
                    <span class="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                        {{ log.distance }} cm
                    </span>
                </div>
            </div>
        </div>

        <div v-if="logs.length === 0" class="text-center py-10 text-gray-400">
            <p class="text-sm">Belum ada data hari ini.</p>
        </div>
    </div>
  </div>
</template>
