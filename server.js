import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

// 从环境变量读取豆包配置（务必在终端或 .env 中设置）
const DOUBAO_API_KEY = "ark-e2661a51-95b2-4012-a13e-f03ac8a56c8b-cb8d6";
const DOUBAO_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";
const DOUBAO_MODEL = "ep-20260419203137-tznml";

if (!DOUBAO_API_KEY || !DOUBAO_BASE_URL) {
    console.error('错误：请设置环境变量 DOUBAO_API_KEY 和 DOUBAO_BASE_URL');
    process.exit(1);
}

// 初始化 OpenAI 客户端（指向豆包兼容端点）
const openai = new OpenAI({
    apiKey: DOUBAO_API_KEY,
    baseURL: DOUBAO_BASE_URL, 
    timeout: 60000,
});

app.post('/api/doubao', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: DOUBAO_MODEL,             // 你的接入点 ID 或模型名
            messages: req.body.messages,     // 前端发来的对话数组
            temperature: 0.1,
            max_tokens: 150,
            stream: false,
        });
        res.json(completion);
    } catch (error) {
        console.error('豆包 API 调用失败：', error);
        res.status(500).json({
            error: error.message || 'Internal server error',
            detail: error.error || null
        });
    }
});

// 托管静态页面
app.use(express.static('./'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` AI 代理已启动: http://localhost:${PORT}`);
});