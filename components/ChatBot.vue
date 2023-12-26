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

const systemTemplate = `你是一名问答助手,精通各种Linux运行维护以及Docker相关的技术;
你的职责是: 回答用户提出的技术问题,用通俗易懂的话术讲解技术要点,并给出相关命令行操作的演示;
你必须做到以下要求:
1. 给出的命令行内容或者代码片段要整洁易读,并且相关说明在前,代码在后, 例如: "Linux切换到指定的路径命令如下: \`\`\`bash cd [dirName]\`\`\`";
2. 如果是输出的是代码块,要有相关注释,涉及命令行的输出,请使用代码块进行包裹, 例如: "\`\`\`bash";
3. 杜绝回答与技术问题无关的内容,例如:<人性考验>,<哲学思考>,<违反生活常识>,<无意义的客套话>等.如果遇到无关的提问,则进行统一回复为:"请提出有价值的问题,不要浪费自己的人生";
4. 如果提出的问题涉及相关命令操作,在回答后的末尾另起一行加上一句:"以上内容仅供参考,造成严重后果概不负责";`;

const templateQuestions: string[] = [
  '用无序列表列举一些常用Linux命令',
  '如何备份和恢复Docker容器和镜像?',
  '输出一个Python & Redis 集成环境的Docker file 模版',
  '以Nginx为例, 列举Docker常用命令',
];

const typewriter = (textRef: Ref<string>, text: string, delay: number) => {
  let index = 0;

  const typingInterval = setInterval(() => {
    if (index >= text.length - 1) clearInterval(typingInterval);
    textRef.value += text[index];
    index++;
  }, delay);
};

const typewriterQueue = async (textRef: Ref<string>, stream: AsyncIterable<string>, delay: number) => {
  const streamQueue: string[] = [];

  const typingInterval = setInterval(() => {
    if (isEmpty(streamQueue)) return;
    textRef.value += streamQueue.shift();
  }, delay);

  for await (const chunk of stream) {
    streamQueue.push(chunk);
  }

  if (isEmpty(streamQueue)) clearInterval(typingInterval);
}

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

    await typewriterQueue(answer, stream, 20);
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
    <NuxtImg src="/bot-removebg.png" class="rounded-full" />
  </div>

  <el-drawer :size="width < 600 ? '100%' : 500" v-model="drawer" title="OpenAI 驱动的 Chat Bot">
    <div class="h-full">
      <main class="flex flex-col relative h-4/5 w-full px-2 pb-6">
        <div class="absolute inset-0 flex items-center justify-center">
          <NuxtImg width="300px" src="/chat-vocker-removebg.png" />
        </div>
        <span class="text-center shrink-0 w-full px-8 mb-4 text-lg italic truncate">{{ question }}</span>
        <div v-show="answer"
          class="rounded-xl whitespace-pre-wrap backdrop-blur-sm w-full overflow-auto text-wrap drop-shadow-md p-4 bg-slate-100/80">
          <section id="document" v-html="marked.parse(answer)" />
        </div>
        <div class="flex-1 basis-0" />
      </main>
      <footer class="h-1/5 w-full">
        <div :class="'grid grid-cols-2 grid-rows-3 gap-4 h-full'">
          <div v-for="templateQuestion in templateQuestions"
            class="flex shadow-md text-xs items-center text-center cursor-pointer justify-center px-2 ring-1 rounded ring-slate-300 transition duration-300 ease-in-out transform hover:ring-[#83D691]  hover:ring-1 hover:ring-offset-2 hover:underline hover:shadow-[0px_0px_12px_2px] hover:shadow-[#68ab73]"
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

<style>
#document .hljs {
  border-radius: 8px;
  margin-top: 0rem;
  margin-bottom: 1rem;
  padding-top: 0.675rem;
  padding-bottom: 0.675rem;
}

#document ol,
#document ul {
  margin-top: -1.2rem;
  margin-bottom: -2.4rem;
  padding-left: 0.8rem;
  list-style-position: outside;
}

#document ol {
  list-style-type: decimal;
}

#document ul {
  list-style-image: url("docker-black.svg");
}

#document li {
  margin-top: -0.475rem;
  margin-bottom: -0.125rem;
}
</style>