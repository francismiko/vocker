import { ChatOpenAI } from "langchain/chat_models/openai";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "langchain/prompts";

export default defineEventHandler(async (event) => {
	const { message } = await readBody(event);

	const parser = new HttpResponseOutputParser();
	const chatModel = new ChatOpenAI(
		{
			openAIApiKey: process.env.OPENAI_API_KEY,
			streaming: true,
		},
		{
			baseURL: process.env.OPENAI_API_PROXY_URL,
		},
	);

	const systemTemplate = "";

	const promptTemplate = ChatPromptTemplate.fromMessages([
		["system", systemTemplate],
		["human", message],
	]);

	const chain = promptTemplate.pipe(chatModel).pipe(parser);
	const stream = await chain.stream({});

	return sendStream(event, stream);
});
