<script setup lang="ts">
import type { ElTable } from 'element-plus';
import type { DockerContainer } from '~/server/api/docker-container/list';

const { data: dockerContainerList, pending: dockerContainerListPending } = await useLazyFetch('/api/docker-container/list')

const containers = ref<DockerContainer[]>()
const search = ref<string>('')
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

watchEffect(() => {
  if (dockerContainerList) {
    containers.value = dockerContainerList.value!
  }
})

</script>

<template>
  <el-table ref="multipleTableRef" :data="containers" max-height="600" style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="image" label="镜像源" />
    <el-table-column prop="status" label="状态" />
    <el-table-column prop="platform" label="平台" />
    <el-table-column prop="created" label="创建时间"
      :formatter="(row, column, cellValue, index) => $dayjs.unix(cellValue).format('YYYY-MM-DD')" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="default" placeholder="搜索容器..." />
      </template>
    </el-table-column>
  </el-table>
</template>