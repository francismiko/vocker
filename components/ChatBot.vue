<script lang="ts" setup>
import { ChatOpenAI } from "langchain/chat_models/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatPromptTemplate } from "langchain/prompts";
import { marked } from "~/lib/marked";
import 'highlight.js/styles/github.min.css';
import 'katex/dist/katex.min.css';


const { public: { openAi } } = useRuntimeConfig();
const { width } = useWindowSize();

const drawer = ref<boolean>(false);
const inputText = ref<string>('');
const inputStatus = ref<boolean>(false);
const question = ref<string>('');
const answer = ref<string>('');

const systemTemplate = "";

const templateQuestions: string[] = [
  '如何解决Docker容器之间网络通信的问题?',
  '如何备份和恢复Docker容器和镜像?',
  '如何使用Dockerfile创建自定义镜像?',
  '请列举一些Docker常用命令',
];

const typewriter = (textRef: Ref<string>, text: string, delay: number) => {
  let index = 0;

  const typingInterval = setInterval(() => {
    if (index >= text.length - 1) clearInterval(typingInterval);
    textRef.value += text[index];
    index++;
  }, delay);
};

const handleChat = async () => {
  if (!inputText.value) return;
  const message = inputText.value.trim();
  inputStatus.value = true;
  question.value = ''
  answer.value = '';
  inputText.value = '';
  typewriter(question, message, 24);

  try {
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

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["human", message],
    ]);

    const chain = promptTemplate.pipe(chatModel).pipe(parser);
    const stream = await chain.stream({});

    for await (const chunk of stream) {
      answer.value += chunk;
    }
  } catch (error) {
    ElMessage({
      message: '网络异常',
      type: 'error',
    })
  } finally {
    inputStatus.value = false;
  }
}
</script>

<template>
  <div
    class="fixed bottom-4 right-8 ring-4 rounded-full w-16 h-16 transition duration-300 ease-in-out transform hover:ring-[#83D691] cursor-pointer"
    @click="drawer = true">
    <NuxtImg src="bot-removebg.png" class="rounded-full" />
  </div>

  <el-drawer :size="width < 600 ? '100%' : 500" v-model="drawer" title="OpenAI 驱动的 Chat Bot">
    <div class="h-full">
      <main class="flex flex-col relative h-4/5 w-full px-2 pb-8">
        <div class="absolute inset-0 flex items-center justify-center">
          <NuxtImg width="300px" src="chat-vocker-removebg.png" />
        </div>
        <p class="text-center px-8 py-2 text-lg italic">{{ question }}</p>
        <span v-show="answer" v-html="marked.parse(answer)"
          class="rounded-xl backdrop-blur-sm w-full overflow-auto inline-block text-wrap drop-shadow-md p-4 bg-slate-100/80" />
      </main>
      <footer class="h-1/5 w-full">
        <div :class="'grid grid-cols-2 grid-rows-3 gap-4 h-full'">
          <div v-for="templateQuestion in templateQuestions"
            class="flex shadow-md text-xs items-center cursor-pointer justify-center px-2 ring-1 rounded ring-slate-300 transition duration-300 ease-in-out transform hover:ring-[#83D691]  hover:ring-1 hover:ring-offset-2 hover:underline hover:shadow-[0px_0px_12px_2px] hover:shadow-[#68ab73]"
            @click="() => { inputText = templateQuestion }">
            {{ templateQuestion }}
          </div>
          <div class="col-span-2 row-span-1 h-full">
            <el-input v-model="inputText" size="large" autosize :disabled="inputStatus" placeholder="输入你想问的问题..."
              @keyup.enter="handleChat">
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