<script setup lang="ts">
import type { ElTable } from 'element-plus';
import { Refresh, Delete, MoreFilled } from '@element-plus/icons-vue'
import type { DockerContainer } from '~/server/api/docker-container/query/list.get';
import type { Filters } from 'element-plus/es/components/table/src/table-column/defaults';


const { data: dockerInfo, pending: dockerInfoPending, refresh: dockerInfoRefresh } = await useLazyFetch('/api/docker/query/info')
const { data: dockerContainerList, pending: dockerContainerListPending, refresh: dockerContainerListRefresh } = await useLazyFetch('/api/docker-container/query/list')

const search = ref<string>('')
const mutatingContainers = ref<string[]>([])
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<DockerContainer[]>([])

const stateType = (state: "exited" | "running" | "paused") => {
  if (state === "exited") return "info"
  if (state === "running") return "success"
  if (state === "paused") return "warning"
};

const stateFilters: Filters = [
  { text: 'Running', value: 'running' },
  { text: 'Paused', value: 'paused' },
  { text: 'Exited', value: 'exited' }
]

const handleSelectionChange = (val: DockerContainer[]) => {
  multipleSelection.value = val
}

const handleStartContainer = async (containerId: string) => {
  mutatingContainers.value.push(containerId)
  const res = await $fetch('/api/docker-container/mutate/start', {
    method: 'POST',
    body: {
      containerId
    },
  })
  mutatingContainers.value.shift()

  if (res.success) {
    dockerContainerListRefresh()
  }
}

const handlePauseContainer = () => {
  return
}

const handleStopContainer = async (containerId: string) => {
  mutatingContainers.value.push(containerId)
  const res = await $fetch('/api/docker-container/mutate/stop', {
    method: 'POST',
    body: {
      containerId
    },
  })
  mutatingContainers.value.shift()

  if (res.success) {
    dockerContainerListRefresh()
  }
}

const filterState = (value: string, row: DockerContainer) => {
  return row.state === value
}
</script>

<template>
  <el-empty v-if="isEmpty(dockerInfo)" description="检测到Docker service并未开启, 请启动相关服务." v-loading="dockerInfoPending" />
  <div v-else>
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
    <el-tabs @tab-click="">
      <el-tab-pane label="所有容器" name="first" />
      <el-tab-pane label="2" name="second" />
      <el-tab-pane label="3" name="third" />
      <el-tab-pane label="4" name="fourth" />
    </el-tabs>
    <el-table ref="multipleTableRef" :data="dockerContainerList!" height="600" style="width: 100%"
      @selection-change="handleSelectionChange" v-loading="dockerContainerListPending || dockerInfoPending">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="state" label="状态" :filters="stateFilters" :filter-method="filterState"
        filter-placement="right-start">
        <template #default="scope">
          <el-tag :type="stateType(scope.row.state)" v-loading="mutatingContainers.includes(scope.row.id)">
            {{ useStartCase(scope.row.state) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="镜像源" />
      <el-table-column prop="platform" label="平台"
        :formatter="(row, column, cellValue, index) => useStartCase(cellValue)" />
      <el-table-column prop="started" label="上次运行" sortable
        :formatter="(row, column, cellValue, index) => $dayjs.unix(cellValue).fromNow()" />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="default" placeholder="搜索容器..." />
        </template>
        <template #default="scope">
          <el-button v-if="scope.row.state === 'exited'" size="small" type="primary" plain circle
            @click="handleStartContainer(scope.row.id)">
            <Icon size="16" name="material-symbols:play-arrow-rounded" />
          </el-button>
          <el-button v-if="scope.row.state === 'running'" size="small" type="primary" plain circle
            @click="handleStopContainer(scope.row.id)">
            <Icon size="16" name="material-symbols:stop-rounded" />
          </el-button>
          <el-button size="small" type="primary" :icon="MoreFilled" plain circle />
          <el-button size="small" type="danger" :icon="Delete" plain circle />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>