<script lang="ts" setup>
import { ref } from 'vue'
import {
  CopyDocument,
  Odometer,
  Box,
  Reading,
  Clock,
  ChatLineSquare,
  Files,
  Monitor,
  CreditCard
} from '@element-plus/icons-vue'

const isCollapse = ref<boolean>(true)
const router = useRouter()
</script>

<template>
  <el-scrollbar height="90vh">
    <el-menu unique-opened class="el-menu-vertical-demo" :collapse="isCollapse">
      <li class="text-center">
        <el-button size="small" @click="() => isCollapse = !isCollapse">
          {{ isCollapse ? "展开" : "折叠" }}
        </el-button>
      </li>

      <el-sub-menu index="monitor">
        <template #title>
          <el-icon>
            <Odometer />
          </el-icon>
          <span>性能监控</span>
        </template>
        <el-menu-item disabled index="monitor-overview" @click="router.push('/monitor/overview')">概览</el-menu-item>
        <el-menu-item index="monitor-host" @click="router.push('/monitor/host')">主机信息</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="docker-container">
        <template #title>
          <el-icon>
            <Box />
          </el-icon>
          <span>容器管理</span>
        </template>
        <el-menu-item index="docker-container-list" @click="router.push('/docker-container/list')">容器列表</el-menu-item>
        <el-menu-item disabled index="docker-container-logs"
          @click="router.push('/docker-container/logs')">日志消息</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="docker-image">
        <template #title>
          <el-icon>
            <CopyDocument />
          </el-icon>
          <span>镜像管理</span>
        </template>
        <el-menu-item index="docker-image-list" @click="router.push('/docker-image/list')">镜像列表</el-menu-item>
        <el-menu-item disabled index="docker-image-logs" @click="router.push('/docker-image/logs')">日志消息</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="network">
        <template #title>
          <el-icon>
            <Monitor />
          </el-icon>
          <span>网络管理</span>
        </template>
        <el-menu-item disabled index="">概览</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="Volume">
        <template #title>
          <el-icon>
            <Files />
          </el-icon>
          <span>数据卷</span>
        </template>
        <el-menu-item disabled index="">概览</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="cron">
        <template #title>
          <el-icon>
            <Clock />
          </el-icon>
          <span>定时任务</span>
        </template>
        <el-menu-item disabled index="">概览</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="command">
        <el-icon>
          <CreditCard />
        </el-icon>
        <template #title>命令行</template>
      </el-menu-item>

      <el-menu-item-group>
        <template #title>其他</template>
        <el-menu-item index="help">
          <el-icon>
            <Reading />
          </el-icon>
          <template #title>帮助文档</template>
        </el-menu-item>

        <el-menu-item index="feedback">
          <el-icon>
            <ChatLineSquare />
          </el-icon>
          <template #title>反馈</template>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </el-scrollbar>
</template>

<style>
.el-menu-vertical-demo {
  min-height: 90vh;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
