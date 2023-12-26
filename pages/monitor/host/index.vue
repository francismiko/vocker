<script setup lang="ts">
const { data: hostInfo, pending: hostInfoPending } = await useLazyFetch('/api/monitor/query/host')

const hardwareInfoMap: Record<string, string> = {
  manufacturer: '制造商',
  model: '型号',
  brand: 'CPU 型号',
  vendor: '供应商',
  memMax: '内存',
  speed: '频率',
  speedMin: '最小频率',
  speedMax: '最大频率',
  cores: '核心数',
  processors: '处理器数量',
  gpuModel: '显卡型号',
  diskSize: '磁盘大小',
  diskType: '磁盘类型',
  diskVendor: '磁盘供应商',
};

const softwareInfoMap: Record<string, string> = {
  platform: '操作系统平台',
  distro: '发行版',
  release: '系统版本',
  kernel: '内核版本',
  arch: '系统架构',
  systemOpenssl: 'OpenSSL 版本',
  docker: 'Docker 版本',
  node: 'Node 版本',
  gcc: 'GCC 版本',
  python3: 'Python 版本',
  java: 'Java 版本',
  virtualbox: 'VirtualBox 版本',
}

const networkInfoMap: Record<string, string> = {
  iface: '接口名称',
  ip4: 'IPv4 地址',
  ip4subnet: 'IPv4 子网掩码',
  ip6: 'IPv6 地址',
  ip6subnet: 'IPv6 子网掩码',
  mac: 'MAC 地址',
  internal: '内部接口',
  virtual: '虚拟接口',
  type: '接口类型',
  speed: '接口速度',
  dhcp: 'DHCP',
}
</script>

<template>
  <el-descriptions title="硬件信息：" class="mb-4" v-loading="hostInfoPending">
    <el-descriptions-item v-for="(value, key) in hostInfo?.hardwareInfo" :label="hardwareInfoMap[key] + ':'">
      <el-tag>{{ value }}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions title="软件信息：" class="mb-4" v-loading="hostInfoPending">
    <el-descriptions-item v-for="(value, key) in hostInfo?.softwareInfo" :label="softwareInfoMap[key] + ':'">
      <el-tag v-if="value" type="success">{{ value }}</el-tag>
      <el-tag v-else type="danger">未安装</el-tag>
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions title="默认网络接口信息：" v-loading="hostInfoPending">
    <el-descriptions-item v-for="(value, key) in hostInfo?.networkInfo" :label="networkInfoMap[key] + ':'">
      <el-tag>{{ value }}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>
