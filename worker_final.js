export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 如果请求根路径，返回 index.html
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(index_html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // 其他路径返回 404
    return new Response('Not Found', { status: 404 });
  }
};

const index_html = ``;
