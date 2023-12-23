<template>
  <el-container class="h-full common-layout">
    <el-header height="8vh">
      <Header />
    </el-header>
    <el-container>
      <el-aside width="auto">
        <Sidebar />
      </el-aside>
      <el-main>
        <el-scrollbar height="80vh">
          <slot />
          <ChatBot />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
