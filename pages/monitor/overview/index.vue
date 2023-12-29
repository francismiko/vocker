<script setup lang="ts">
import * as echarts from 'echarts';
import numeral from 'numeral';

const timer = ref<NodeJS.Timeout>()
const charts = ref<echarts.ECharts[]>([])

onMounted(async () => {
  const currentLoadChart = echarts.init(document.getElementById('currentLoad'), null, { renderer: 'svg' });
  const currentMemChart = echarts.init(document.getElementById('currentMem'), null, { renderer: 'svg' });
  const currentDiskIOChart = echarts.init(document.getElementById('currentDiskIO'), null, { renderer: 'svg' });

  charts.value.push(currentLoadChart, currentMemChart, currentDiskIOChart)

  const xAxisDates: string[] = new Array(20).fill(null).map((_, index) => new Date(Date.now() - index * 1000).toLocaleTimeString().replace(/^\D*/, ''));
  const yAxisCurrentLoads: number[] = new Array(20).fill(0);
  const yAxisCurrentMems: number[] = new Array(20).fill(0);
  const yAxisCurrentDiskInput: number[] = new Array(20).fill(0);
  const yAxisCurrentDiskOutput: number[] = new Array(20).fill(0);

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

  const currentDiskIOOption: echarts.EChartsOption = {
    title: {
      text: '磁盘IO'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#283b56'
        }
      },
      formatter: (params: any) => `${params[0].name}<br>${params.map((item: any) => `${item.seriesName}: ${numeral(item.value).format('0.00b')}<br>`).join('')}`
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
        name: '读写速率',
        min: 0,
        boundaryGap: [0.2, 0.2],
        axisLabel: {
          formatter: (value: number) => numeral(value).format('0.00b') + '/秒'
        }
      }
    ],
    series: [
      {
        name: '输入',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        areaStyle: {},
        data: yAxisCurrentDiskInput,
        itemStyle: {
          color: '#8b5cf6'
        }
      },
      {
        name: '输出',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        areaStyle: {},
        data: yAxisCurrentDiskOutput,
        itemStyle: {
          color: '#fbbf24'
        }
      }
    ]
  }

  currentLoadChart.setOption(currentLoadOption)
  currentMemChart.setOption(currentMemOption)
  currentDiskIOChart.setOption(currentDiskIOOption)

  timer.value = setInterval(async () => {
    const { currentLoad, usedMemMb, rx_sec, wx_sec } = await $fetch('/api/monitor/query/overview')
    if (!currentLoad || !usedMemMb || !rx_sec || !wx_sec) return;

    const currentDate = new Date().toLocaleTimeString().replace(/^\D*/, '');

    xAxisDates.shift();
    yAxisCurrentLoads.shift();
    yAxisCurrentMems.shift();
    yAxisCurrentDiskInput.shift();
    yAxisCurrentDiskOutput.shift();

    xAxisDates.push(currentDate);
    yAxisCurrentLoads.push(parseFloat(currentLoad.toFixed(2)));
    yAxisCurrentMems.push(parseFloat((usedMemMb / 1024).toFixed(2)));
    yAxisCurrentDiskInput.push(parseFloat(rx_sec.toFixed(2)));
    yAxisCurrentDiskOutput.push(parseFloat(wx_sec.toFixed(2)));

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

    currentDiskIOChart.setOption<echarts.EChartsOption>({
      xAxis: [{
        data: xAxisDates
      }],
      series: [{
        data: yAxisCurrentDiskInput
      }, {
        data: yAxisCurrentDiskOutput
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
    <section class="flex-auto basis-1/2 p-4">
      <div id="currentDiskIO" class="w-full h-[35vh]" />
    </section>
  </main>
</template>