<script lang="ts" setup>
import { ChatOpenAI } from "langchain/chat_models/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatPromptTemplate } from "langchain/prompts";

const { public: { openAi } } = useRuntimeConfig();
const { width } = useWindowSize()

const drawer = ref<boolean>(false)
const inputText = ref<string>('')
const question = ref<string>('如何备份和恢复Docker容器和镜像?')

const templateQuestions: string[] = [
  '如何解决Docker容器之间网络通信的问题?',
  '如何备份和恢复Docker容器和镜像?',
  '如何使用Dockerfile创建自定义镜像?',
  '请列举一些Docker常用命令',
]

const handleChat = async () => {
  if (!inputText.value) return
  const message = inputText.value.trim()
  inputText.value = ''

  const parser = new StringOutputParser();
  const chatModel = new ChatOpenAI(
    {
      openAIApiKey: openAi.secretKey,
      streaming: true,
    },
    {
      baseURL: openAi.proxyUrl,
    },
  );

  const systemTemplate = "";

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["human", message],
  ]);

  const chain = promptTemplate.pipe(chatModel).pipe(parser);
  const stream = await chain.stream({});

  for await (const chunk of stream) {
    console.log(chunk);
  }
}
</script>

<template>
  <div
    class="fixed box-border bottom-4 right-8 rounded-full border-4 border-[#16a34a] w-16 h-16 transition duration-300 ease-in-out transform hover:border-4 hover:border-[#83D691] cursor-pointer"
    @click="drawer = true">
    <NuxtImg src="bot-removebg.png" class="rounded-full" />
  </div>

  <el-drawer :size="width < 600 ? '100%' : 500" v-model="drawer" title="OpenAI 驱动的 Chat Bot">
    <div class="h-full">
      <main class="h-4/5 w-full px-2 pb-8">
        <div class="rounded-xl h-full w-full bg-slate-100">
          <el-scrollbar height="200px">
            <p class="text-center">{{ question }}</p>
          </el-scrollbar>
        </div>
      </main>
      <footer class="h-1/5 w-full">
        <div :class="'grid grid-cols-2 grid-rows-3 gap-4 h-full'">
          <div v-for="templateQuestion in templateQuestions"
            class="flex text-xs items-center cursor-pointer justify-center px-2 outline rounded outline-slate-300 hover:outline-slate-500 hover:bg-gray-100 hover:underline hover:underline-offset-2 hover:decoration-dotted"
            @click="() => { inputText = templateQuestion }">
            {{ templateQuestion }}
          </div>
          <div class="col-span-2 row-span-1 h-full">
            <el-input v-model="inputText" size="large" autosize placeholder="输入你想问的问题..." @keyup.enter="handleChat">
              <template #prefix>
                <Icon size="24px" name="logos:openai-icon" />
              </template>
              <template #suffix>
                <el-tooltip class="box-item" effect="light" content="点击发送" placement="top">
                  <div class="cursor-pointer" @click="handleChat">
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