'use client';

import { useState, useEffect } from 'react';
import { supabase, SensorData } from '@/lib/supabase';
import { Cat, Wifi, WifiOff, UtensilsCrossed, Ruler, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [latestData, setLatestData] = useState<SensorData | null>(null);
  const [feedCount, setFeedCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch data for selected date
  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('sensor_data_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_data' },
        (payload) => {
          const newData = payload.new as SensorData;
          setSensorData((prev) => [...prev, newData]);
          setLatestData(newData);
          setIsConnected(true);

          // Update feed count if this is an OPEN event
          if (newData.servo_status === 'OPEN') {
            setFeedCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const fetchData = async () => {
    const startOfDay = `${selectedDate}T00:00:00`;
    const endOfDay = `${selectedDate}T23:59:59`;

    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching data:', JSON.stringify(error, null, 2));
      return;
    }

    if (data) {
      setSensorData(data);
      if (data.length > 0) {
        setLatestData(data[data.length - 1]);
        setIsConnected(true);
      }

      // Count feeding events (OPEN status)
      const openEvents = data.filter(d => d.servo_status === 'OPEN').length;
      setFeedCount(openEvents);
    }
  };

  // Process data for hourly chart
  const getHourlyData = () => {
    const hourlyCount = new Array(24).fill(0);

    sensorData.forEach((d) => {
      if (d.servo_status === 'OPEN') {
        const hour = new Date(d.created_at).getHours();
        hourlyCount[hour]++;
      }
    });

    return hourlyCount;
  };

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Pemberian Makan',
        data: getHourlyData(),
        // Soft Pastel Orange Gradient
        borderColor: '#F6AD55',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(246, 173, 85, 0.4)');
          gradient.addColorStop(1, 'rgba(246, 173, 85, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBackgroundColor: '#ED8936',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#2D3748',
        bodyColor: '#718096',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        callbacks: {
          title: (context: any) => `Jam ${context[0].label}`,
          label: (context: any) => `${context.raw} kali makan`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#A0AEC0' },
      },
      y: {
        grid: { color: '#F7FAFC', borderDash: [5, 5] },
        ticks: { color: '#A0AEC0', stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-[var(--status-open-text)] bg-[var(--status-open-bg)]';
      case 'CLOSED': return 'text-[var(--status-closed-text)] bg-[var(--status-closed-bg)]';
      case 'COOLDOWN': return 'text-[var(--status-cooldown-text)] bg-[var(--status-cooldown-bg)]';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-level-0)] text-[var(--text-primary)] font-sans py-8 px-4 flex justify-center items-start">

      {/* THE BEZEL CONTAINER (Giving depth & frame) */}
      <div className="bezel-container max-w-6xl w-full mx-auto relative overflow-hidden">

        {/* Header inside the bezel */}
        <header className="header-glass sticky top-0 z-50 mb-12 border-b border-gray-100/50">
          <div className="px-8 py-7 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl shadow-sm">
                <Cat className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Smart Cat Feeder</h1>
                <p className="text-sm text-gray-500 font-medium">Monitoring Harian</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="shadow-sm border-gray-200"
              />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors shadow-sm ${isConnected ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-semibold">{isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 pb-6">

          {/* Helper/Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Halo, Pemilik Kucing! 👋</h2>
            <p className="text-gray-500">Berikut aktivitas makan kucingmu hari ini.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Total Makan */}
            <div className="card-depth p-8 relative overflow-hidden group border border-white">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <UtensilsCrossed className="w-24 h-24 text-[var(--accent-primary)]" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-orange-100 rounded-xl shadow-sm">
                  <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Total Porsi</span>
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <p className="text-5xl font-bold text-gray-800">{feedCount}</p>
                <span className="text-gray-400 font-medium">kali</span>
              </div>
            </div>

            {/* Jarak Terakhir */}
            <div className="card-depth p-8 relative overflow-hidden group border border-white">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Ruler className="w-24 h-24 text-purple-400" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-100 rounded-xl shadow-sm">
                  <Ruler className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">JARAK SENSOR</span>
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <p className="text-5xl font-bold text-gray-800">
                  {latestData?.distance ?? '--'}
                </p>
                <span className="text-gray-400 font-medium">cm</span>
              </div>
              <p className="text-gray-400 text-xs mt-3 font-medium flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Update: {latestData ? formatTime(latestData.created_at) : '-'}
              </p>
            </div>

            {/* Status Servo */}
            <div className="card-depth p-8 border border-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-100 rounded-xl shadow-sm">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Status Alat</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className={`max-w-max px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-sm border border-black/5 ${getStatusColor(latestData?.servo_status ?? '')}`}>
                  {latestData?.servo_status ?? 'MENUNGGU...'}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {latestData?.servo_status === 'OPEN' && 'Sedang menuangkan makanan... 🍽️'}
                  {latestData?.servo_status === 'CLOSED' && 'Standby. Menunggu kucing mendekat. 🐱'}
                  {latestData?.servo_status === 'COOLDOWN' && 'Istirahat sejenak (5 detik). ⏳'}
                  {!latestData && 'Belum ada data yang diterima hari ini.'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts & Logs Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Chart Section */}
            <div className="lg:col-span-2 card-depth p-8 border border-white">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Grafik Aktivitas
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md font-normal">Per Jam</span>
                </h2>
              </div>
              <div className="h-[320px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Log Section */}
            <div className="card-depth p-0 overflow-hidden flex flex-col h-[400px] border border-white">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">Riwayat Terkini</h2>
              </div>

              <div className="overflow-y-auto flex-1 p-0">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-white sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Waktu</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Jarak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...sensorData].reverse().slice(0, 50).map((data) => (
                      <tr key={data.id} className="hover:bg-orange-50/30 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-600 group-hover:text-orange-600 transition-colors">
                          {formatTime(data.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(data.servo_status)}`}>
                            {data.servo_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500">
                          {data.distance} cm
                        </td>
                      </tr>
                    ))}
                    {sensorData.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                          Belum ada data hari ini...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
