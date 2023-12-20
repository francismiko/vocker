<script setup lang="ts">
import type { ElTable } from 'element-plus';
import { Refresh, Delete, CaretRight, MoreFilled } from '@element-plus/icons-vue'
import type { DockerContainer } from '~/server/api/docker-container/list';

const { data: dockerInfo, pending: dockerInfoPending, refresh: dockerInfoRefresh } = await useLazyFetch('/api/docker/info')
const { data: dockerContainerList, pending: dockerContainerListPending, refresh: dockerContainerListRefresh } = await useLazyFetch('/api/docker-container/list')

const search = ref<string>('')
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<DockerContainer[]>([])

const stateType = (state: string) => {
  if (state === "exited") return "info"
  if (state === "running") return "success"
  if (state === "paused") return "warning"
};

const handleSelectionChange = (val: DockerContainer[]) => {
  multipleSelection.value = val
}

</script>

<template>
  <div class="flex w-full">
    <el-button type="primary" :icon="Refresh" plain @click="() => {
      dockerInfoRefresh()
      dockerContainerListRefresh()
    }" :loading="dockerContainerListPending || dockerInfoPending">
      刷新
    </el-button>
    <el-button-group v-show="!isEmpty(multipleSelection)" class="ml-auto mr-4">
      <el-button type="primary">
        <Icon size="24px" name="material-symbols:play-arrow-rounded" />
      </el-button>
      <el-button type="primary">
        <Icon size="24px" name="material-symbols:pause" />
      </el-button>
      <el-button type="primary">
        <Icon size="24px" name="material-symbols:stop-rounded" />
      </el-button>
      <el-button type="danger">
        <Icon size="24px" name="material-symbols:delete" />
      </el-button>
    </el-button-group>
  </div>
  <el-empty v-if="isEmpty(dockerInfo)" description="检测到Docker service并未开启, 请启动相关服务." v-loading="dockerInfoPending" />
  <el-table v-else ref="multipleTableRef" :data="dockerContainerList!" height="600" style="width: 100%"
    @selection-change="handleSelectionChange" v-loading="dockerContainerListPending || dockerInfoPending">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="state" label="状态">
      <template #default="scope">
        <el-tag :type="stateType(scope.row.state)">{{ useStartCase(scope.row.state) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="image" label="镜像源" />
    <el-table-column prop="platform" label="平台" :formatter="(row, column, cellValue, index) => useStartCase(cellValue)" />
    <el-table-column prop="created" label="创建时间"
      :formatter="(row, column, cellValue, index) => $dayjs.unix(cellValue).format('YYYY-MM-DD')" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="default" placeholder="搜索容器..." />
      </template>
      <template #default="scope">
        <el-button size="small" type="primary" :icon="CaretRight" plain circle />
        <el-button size="small" type="primary" :icon="MoreFilled" plain circle />
        <el-button size="small" type="danger" :icon="Delete" plain circle />
      </template>
    </el-table-column>
  </el-table>
</template>