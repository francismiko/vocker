<script setup lang="ts">
import type { ElTable } from 'element-plus';
import { Refresh, Delete, CaretRight, MoreFilled } from '@element-plus/icons-vue'
import type { DockerImage } from '~/server/api/docker-image/list';
import numeral from 'numeral';

const { data: dockerInfo, pending: dockerInfoPending, refresh: dockerInfoRefresh } = await useLazyFetch('/api/docker/info')
const { data: dockerImageList, pending: dockerImageListPending, refresh: dockerImageListRefresh } = await useLazyFetch('/api/docker-image/list')

const search = ref<string>('')
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<DockerImage[]>([])

const handleSelectionChange = (val: DockerImage[]) => {
  multipleSelection.value = val
}

</script>

<template>
  <div class="flex w-full">
    <el-button type="primary" :icon="Refresh" plain @click="() => {
      dockerInfoRefresh()
      dockerImageListRefresh()
    }" :loading="dockerImageListPending || dockerInfoPending">
      刷新
    </el-button>
    <el-button-group v-show="!isEmpty(multipleSelection)" class="ml-auto mr-4">
      <el-button type="danger">
        <Icon size="24px" name="material-symbols:delete" />
      </el-button>
    </el-button-group>
  </div>
  <el-empty v-if="isEmpty(dockerInfo)" description="检测到Docker service并未开启, 请启动相关服务." v-loading="dockerInfoPending" />
  <el-table v-else ref="multipleTableRef" :data="dockerImageList!" height="600" style="width: 100%"
    @selection-change="handleSelectionChange" v-loading="dockerImageListPending || dockerInfoPending">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="tag" label="标签" />
    <el-table-column prop="size" label="大小"
      :formatter="(row, column, cellValue, index) => numeral(cellValue).format('0.00 b')" />
    <el-table-column prop="created" label="创建时间"
      :formatter="(row, column, cellValue, index) => $dayjs.unix(cellValue).fromNow()" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="default" placeholder="搜索镜像..." />
      </template>
      <template #default="scope">
        <el-button size="small" type="primary" :icon="CaretRight" plain circle />
        <el-button size="small" type="primary" :icon="MoreFilled" plain circle />
        <el-button size="small" type="danger" :icon="Delete" plain circle />
      </template>
    </el-table-column>
  </el-table>
</template>