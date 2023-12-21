<script lang="ts" setup>
const drawer = ref<boolean>(false)
const inputText = ref<string>('')

const templateQuestions: string[] = [
  '你好',
  '你好',
  '你好',
  '你好',
]

const handleSubmit = async () => {
  if (!inputText.value) return
  const message = inputText.value.trim()
  inputText.value = ''

  const res = await $fetch('/api/chatbot/stream', {
    method: 'POST',
    body: {
      message,
    }
  })
}
</script>

<template>
  <div
    class="fixed box-border bottom-4 right-8 rounded-full border-4 border-[#16a34a] w-16 h-16 transition duration-300 ease-in-out transform hover:border-4 hover:border-[#83D691] cursor-pointer"
    @click="drawer = true">
    <NuxtImg src="bot-removebg.png" class="rounded-full" />
  </div>

  <el-drawer v-model="drawer" title="OpenAI 驱动的 Chat Bot">
    <div class="h-full">
      <main class="h-4/5 w-full">Main</main>
      <footer class="h-1/5 w-full">
        <div :class="'grid grid-cols-2 grid-rows-3 gap-4 h-full'">
          <div v-for="question in templateQuestions"
            class="flex items-center cursor-pointer justify-center p-4 outline rounded outline-slate-300 hover:outline-slate-500 hover:bg-gray-100"
            @click="() => { inputText = question }">
            {{ question }}
          </div>
          <div class="col-span-2 row-span-1 h-full">
            <el-input v-model="inputText" size="large" autosize placeholder="输入你想问的问题..." @keyup.enter="handleSubmit">
              <template #prefix>
                <Icon size="24px" name="logos:openai-icon" />
              </template>
              <template #suffix>
                <el-tooltip class="box-item" effect="light" content="点击发送" placement="top">
                  <div class="cursor-pointer" @click="handleSubmit">
                    <Icon size="20px" name="ion:paper-plane" />
                  </div>
                </el-tooltip>
              </template>
            </el-input>
          </div>
        </div>
      </footer>
    </div>
  </el-drawer>
</template>