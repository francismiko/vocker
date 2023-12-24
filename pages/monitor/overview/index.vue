<script setup lang="ts">
import * as echarts from 'echarts';

const timer = ref<NodeJS.Timeout>()

onMounted(() => {
  const currentLoadChartDom = document.getElementById('currentLoad')!;
  const currentLoadChart = echarts.init(currentLoadChartDom, null, { renderer: 'svg' });

  const xAxisDates: string[] = new Array(20).fill(null).map((_, index) => new Date(Date.now() - index * 1000).toLocaleTimeString().replace(/^\D*/, ''));
  const yAxisCurrentLoads: number[] = new Array(20).fill(0);

  const currentLoadOption: echarts.EChartsOption = {
    title: {
      text: 'CPU'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#283b56'
        }
      },
      formatter: (params: any) => `${params[0].name}<br>${params.map((item: any) => `${item.seriesName}: ${item.value.toFixed(2)}%<br>`).join('')}`
    },
    legend: {},
    dataZoom: {
      show: false,
      start: 0,
      end: 100
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisDates,
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: '占用率',
        max: 100,
        min: 0,
        boundaryGap: [0.2, 0.2],
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        areaStyle: {},
        data: yAxisCurrentLoads
      }
    ]
  }

  currentLoadChart.setOption(currentLoadOption)

  timer.value = setInterval(async () => {
    const { currentLoad } = await $fetch('/api/monitor/query/overview')
    if (!currentLoad) return;

    const currentDate = new Date().toLocaleTimeString().replace(/^\D*/, '');

    xAxisDates.shift();
    xAxisDates.push(currentDate);

    yAxisCurrentLoads.shift();
    yAxisCurrentLoads.push(parseFloat(currentLoad.toFixed(2)));

    currentLoadChart.setOption<echarts.EChartsOption>({
      xAxis: [{
        data: xAxisDates
      }],
      series: [{
        data: yAxisCurrentLoads
      }],
    });
  }, 1000);
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <main class="flex flex-wrap h-full w-full">
    <section class="flex-auto p-4">
      <div id="currentLoad" class="w-[600px] h-[35vh]" />
    </section>
  </main>
</template>