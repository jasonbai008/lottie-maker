export default {
    /**
     * Cloudflare Worker 入口函数
     * 处理上传 JSON 到 GitHub 并返回 CDN 地址
     */
    async fetch(request, env) {
        // 处理 CORS 预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // 仅允许 POST 请求
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        try {
            const { filename, content } = await request.json();

            if (!filename || !content) {
                return new Response('Missing filename or content', { status: 400 });
            }

            // GitHub 配置 (建议在 Cloudflare 控制台设置 GITHUB_TOKEN 环境变量)
            const GITHUB_TOKEN = env.GITHUB_TOKEN;
            const OWNER = 'jasonbai008';
            const REPO = 'lottie-maker';
            const PATH = `assets/${filename}`;

            if (!GITHUB_TOKEN) {
                return new Response('GITHUB_TOKEN not configured in Worker environment', { status: 500 });
            }

            // 1. 尝试获取文件信息 (如果文件已存在，需要 SHA 才能更新)
            let sha;
            const getFileResponse = await fetch(
                `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
                {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'User-Agent': 'Cloudflare-Worker-Lottie-Maker',
                    },
                }
            );

            if (getFileResponse.status === 200) {
                const fileData = await getFileResponse.json();
                sha = fileData.sha;
            }

            // 2. 将内容上传/更新到 GitHub 仓库
            // GitHub API 要求 content 为 Base64 编码
            const base64Content = btoa(unescape(encodeURIComponent(content)));

            const uploadResponse = await fetch(
                `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'User-Agent': 'Cloudflare-Worker-Lottie-Maker',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: `Upload ${filename} from Lottie Maker`,
                        content: base64Content,
                        sha: sha, // 如果是更新操作，此字段必填
                    }),
                }
            );

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                return new Response(JSON.stringify({ error: 'GitHub API error', detail: errorData }), {
                    status: uploadResponse.status,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }

            // 3. 返回最终的 CDN 地址
            const cdnUrl = `https://lottie.jasonbai.dpdns.org/assets/${filename}`;

            return new Response(JSON.stringify({
                success: true,
                url: cdnUrl,
                filename: filename
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
    },
};
