<script setup lang="ts">
import * as echarts from 'echarts';

onMounted(() => {
  const chartDom = document.getElementById('main')!;
  const myChart = echarts.init(chartDom, null, {
    renderer: 'svg'
  });

  const categories = (() => {
    let now = new Date();
    let res = [];
    let len = 10;
    while (len--) {
      res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
      now = new Date(+now - 1000);
    }
    return res;
  })();

  const data: number[] = (() => {
    let res = [];
    let len = 10;
    while (len--) {
      res.push(Math.round(Math.random() * 100));
    }
    return res;
  })();

  const option1 =
  {
    title: {
      text: 'CPU'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#283b56'
        }
      }
    },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: {
      show: false,
      start: 0,
      end: 100
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: categories
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: '占用率',
        max: 100,
        min: 0,
        boundaryGap: [0.2, 0.2]
      }
    ],
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: data
      }
    ]
  }

  setInterval(() => {
    let axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');

    data.shift();
    data.push(Math.round(Math.random() * 100));

    categories.shift();
    categories.push(axisData);


    myChart.setOption<echarts.EChartsOption>({
      xAxis: [
        {
          data: categories
        }
      ],
      series: [
        {
          data: data
        }
      ]
    });
  }, 1000);

  myChart.setOption(option1)
})
</script>

<template>
  <main class="flex flex-wrap h-full w-full">
    <section class="flex-auto p-4">
      <div id="main" class="w-[600px] h-[35vh]" />
    </section>
  </main>
</template>