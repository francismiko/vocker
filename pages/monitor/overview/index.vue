<script setup lang="ts">
import * as echarts from 'echarts';

const timer = ref<NodeJS.Timeout>()
const charts = ref<echarts.ECharts[]>([])

onMounted(async () => {
  const currentLoadChart = echarts.init(document.getElementById('currentLoad'), null, { renderer: 'svg' });
  const currentMemChart = echarts.init(document.getElementById('currentMem'), null, { renderer: 'svg' });

  charts.value.push(currentLoadChart, currentMemChart)

  const xAxisDates: string[] = new Array(20).fill(null).map((_, index) => new Date(Date.now() - index * 1000).toLocaleTimeString().replace(/^\D*/, ''));
  const yAxisCurrentLoads: number[] = new Array(20).fill(0);
  const yAxisCurrentMems: number[] = new Array(20).fill(0);

  const { totalMemMb } = await $fetch('/api/monitor/query/overview')

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
        data: yAxisCurrentLoads,
      }
    ]
  }

  const currentMemOption: echarts.EChartsOption = {
    title: {
      text: '运行内存'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#283b56'
        }
      },
      formatter: (params: any) => `${params[0].name}<br>${params.map((item: any) => `${item.seriesName}: ${item.value} GB<br>`).join('')}`
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
        name: '内存量',
        max: (totalMemMb as number / 1024).toFixed(2),
        min: 0,
        splitNumber: 8,
        boundaryGap: [0.2, 0.2],
        axisLabel: {
          formatter: '{value} GB'
        }
      }
    ],
    series: [
      {
        name: '内存使用量',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        areaStyle: {},
        data: yAxisCurrentLoads,
        itemStyle: {
          color: '#3CB371'
        }
      }
    ]
  }

  currentLoadChart.setOption(currentLoadOption)
  currentMemChart.setOption(currentMemOption)

  timer.value = setInterval(async () => {
    const { currentLoad, userMemMb } = await $fetch('/api/monitor/query/overview')
    if (!currentLoad || !userMemMb) return;

    const currentDate = new Date().toLocaleTimeString().replace(/^\D*/, '');

    xAxisDates.shift();
    xAxisDates.push(currentDate);

    yAxisCurrentLoads.shift();
    yAxisCurrentLoads.push(parseFloat(currentLoad.toFixed(2)));

    yAxisCurrentMems.shift();
    yAxisCurrentMems.push(parseFloat((userMemMb / 1024).toFixed(2)));

    currentLoadChart.setOption<echarts.EChartsOption>({
      xAxis: [{
        data: xAxisDates
      }],
      series: [{
        data: yAxisCurrentLoads
      }],
    });

    currentMemChart.setOption<echarts.EChartsOption>({
      xAxis: [{
        data: xAxisDates
      }],
      series: [{
        data: yAxisCurrentMems
      }],
    });
  }, 1000);
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  charts.value.forEach(chart => chart.dispose())
})
</script>

<template>
  <main class="flex flex-wrap h-full w-full">
    <section class="flex-auto basis-1/2 p-4">
      <div id="currentLoad" class="w-full h-[35vh]" />
    </section>
    <section class="flex-auto basis-1/2 p-4">
      <div id="currentMem" class="w-full h-[35vh]" />
    </section>
  </main>
</template>