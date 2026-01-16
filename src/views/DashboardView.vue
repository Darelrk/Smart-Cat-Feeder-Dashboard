<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { supabase, type SensorData } from '@/lib/supabase';
import { UtensilsCrossed, Ruler, Activity } from 'lucide-vue-next';

// Components
import NavBar from '@/components/NavBar.vue';
import StatCard from '@/components/StatCard.vue';
import ActivityChart from '@/components/ActivityChart.vue';
import LogFeed from '@/components/LogFeed.vue';

// State
const sensorData = ref<SensorData[]>([]);
const isConnected = ref(false);
const selectedDate = ref(new Date().toISOString().split('T')[0] ?? '');

// Computed
const latestData = computed(() => sensorData.value[sensorData.value.length - 1] || null);
const feedCount = computed(() => sensorData.value.filter((d: SensorData) => d.servo_status === 'OPEN').length);
const sensorDistance = computed(() => latestData.value?.distance ?? '--');
const servoStatus = computed(() => latestData.value?.servo_status ?? 'MENUNGGU...');

const hourlyData = computed(() => {
    const counts = new Array(24).fill(0);
    sensorData.value.forEach((d: SensorData) => {
        if (d.servo_status === 'OPEN') {
            const hour = new Date(d.created_at).getHours();
            counts[hour]++;
        }
    });
    return counts;
});

const chartLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

// Fetch Logic
const fetchData = async () => {
    const start = `${selectedDate.value}T00:00:00`;
    const end = `${selectedDate.value}T23:59:59`;

    const { data } = await supabase
        .from('sensor_data')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: true });
    
    if (data) {
        sensorData.value = data;
        // Don't set isConnected=true here. Wait for heartbeat.
    }
}


// Watchdog & Ping Logic
const pingInterval = 60000; // 60 seconds
const pingTimeout = 10000; // 10s wait for pong
let pingTimer: ReturnType<typeof setInterval>;
let responseTimer: ReturnType<typeof setTimeout>;

const sendPing = async () => {
    // 1. Send PING to DB
    const { error } = await supabase
        .from('device_commands')
        .insert({ command: 'PING' });
    
    if (error) console.error('Ping falied:', error);

    // 2. Wait for response (PONG) logic is handled by realtime subscription
    // If responseTimer triggers, it means NO PONG received -> OFFLINE
    responseTimer = setTimeout(() => {
        console.log("Ping Timeout: No response from device.");
        isConnected.value = false; 
    }, pingTimeout);
}

// Realtime
onMounted(() => {
    fetchData();

    // Start Ping Loop
    pingTimer = setInterval(sendPing, pingInterval);
    sendPing(); // Initial ping

    // 1. Listen for REAL SENSOR DATA (Logs & Chart)
    supabase.channel('public:sensor_data')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_data' }, (payload: any) => {
            const newRecord = payload.new as SensorData;
            if (newRecord.created_at.startsWith(selectedDate.value)) {
                sensorData.value.push(newRecord);
                // Note: We no longer auto-set isConnected here to avoid false positives from stale data,
                // BUT getting realtime data effectively means we are online.
                // However, let's rely on the Heartbeat channel for strict status.
            }
        })
        .subscribe();

    // 2. Listen for DEVICE STATUS Updates (Online Status)
    // Listens for UPDATE because IoT device is UPSERTING (overwriting) the row
    supabase.channel('public:device_status')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'device_status' }, (_payload: any) => {
            // Status updated -> Device is ONLINE
            isConnected.value = true;
            clearTimeout(responseTimer);
        })
        .subscribe();
});

onUnmounted(() => {
    clearInterval(pingTimer);
    clearTimeout(responseTimer);
});

watch(selectedDate, () => {
    fetchData();
});
</script>

<template>
  <div class="min-h-screen pb-20 pt-32 px-6 md:px-12 max-w-[1600px] mx-auto">
    <!-- Floating Nav -->
    <NavBar v-model:selectedDate="selectedDate" :isConnected="isConnected" />

    <!-- Welcome -->
    <div class="mb-10 text-center md:text-left transition-all duration-700 ease-out transform translate-y-0 opacity-100">
        <h2 class="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mb-4">
            Halo, Pemilik Kucing! <span class="animate-waving-hand inline-block">👋</span>
        </h2>
        <p class="text-lg text-gray-500 font-medium max-w-2xl">
            Pantau aktivitas makan anabul tersayang secara realtime dengan tampilan yang lebih fresh.
        </p>
    </div>

    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Card 1 -->
        <StatCard 
            title="Total Porsi" 
            :value="feedCount" 
            unit="Kali" 
            :icon="UtensilsCrossed" 
            accentColor="text-orange-500"
            subtext="Akumulasi hari ini"
        />

        <!-- Card 2 -->
        <StatCard 
            title="Jarak Sensor" 
            :value="sensorDistance" 
            unit="cm" 
            :icon="Ruler" 
            accentColor="text-purple-500"
            :subtext="latestData ? `Update: ${new Date(latestData.created_at).toLocaleTimeString()}` : '-'"
        />

        <!-- Card 3 -->
        <StatCard 
            title="Status Alat" 
            :value="servoStatus" 
            :icon="Activity" 
            accentColor="text-green-500"
            subtext="Kondisi servo saat ini"
        />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <!-- Chart Area -->
        <div class="lg:col-span-2 relative bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/40 shadow-sm p-10 md:p-12 flex flex-col">
             <div class="mb-8 flex items-center justify-between">
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 tracking-tight">Grafik Aktivitas</h3>
                    <p class="text-gray-400 text-sm font-medium">Frekuensi makan per jam</p>
                </div>
             </div>
             <div class="flex-1 w-full min-h-0">
                 <ActivityChart :data="hourlyData" :labels="chartLabels" />
             </div>
        </div>

        <!-- Logs Area -->
        <div class="h-full min-h-[500px]">
            <LogFeed :logs="[...sensorData].reverse()" />
        </div>
    </div>

  </div>
</template>

<style>
@keyframes wave {
  0% { transform: rotate(0.0deg) }
  10% { transform: rotate(14.0deg) }
  20% { transform: rotate(-8.0deg) }
  30% { transform: rotate(14.0deg) }
  40% { transform: rotate(-4.0deg) }
  50% { transform: rotate(10.0deg) }
  60% { transform: rotate(0.0deg) }
  100% { transform: rotate(0.0deg) }
}
.animate-waving-hand {
  animation-name: wave;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  transform-origin: 70% 70%; 
}
</style>
