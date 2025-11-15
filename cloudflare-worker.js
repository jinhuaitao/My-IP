/**
 * Cloudflare Worker - IP 信息查询服务
 * 
 * 功能：提供用户IP地址、地理位置、网络信息等查询服务
 * 支持多种数据格式输出
 */

addEventListener('fetch', event => {
      event.respondWith(handleRequest(event.request));
    });
    
    async function handleRequest(request) {
      const url = new URL(request.url);
      
      // 主页面 - 显示完整的IP信息
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return handleMainPage(request);
      }
      
      // API端点 - 返回特定信息
      switch (true) {
        case url.pathname.match('/myipv4addr'):
          return handleIPv4Address(request);
        case url.pathname.match('/mycfedge'):
          return handleCFEdge(request);
        case url.pathname.match('/asn'):
          return handleASN(request);
        case url.pathname.match('/colo'):
          return handleColo(request);
        case url.pathname.match('/ip'):
          return handleIP(request);
        case url.pathname.match('/generate_204'):
          return handle204();
        default:
          return new Response('Not found', { status: 404 });
      }
    }
    
    /**
     * 处理主页面请求
     */
    function handleMainPage(request) {
      const {
        continent,    // 洲
        asn,          // 自治系统号
        country,      // 国家
        tlsVersion,   // TLS版本
        city,         // 城市
        timezone,     // 时区
        colo,         // Cloudflare节点
        region,       // 省份
        httpProtocol, // HTTP协议
        regionCode,   // 地区代码
        asOrganization // 运营商
      } = request.cf;
    
      const ip = request.headers.get("cf-connecting-ip");
      const ua = request.headers.get("user-agent") || '';
      
      // 构建地址信息
      const addr = [city, region, country]
        .filter(value => value !== null && value !== undefined && value !== "")
        .join(", ");
    
      // 检测是否是curl命令
      const isCurl = ua.toLowerCase().includes('curl');
    
      if (isCurl) {
        // 为curl命令返回美观的格式化文本
        const text = `
    🌐 IP 信息查询工具
    ==================
    
    🔗 IP 地址:      ${ip}
    📍 地理位置:    ${addr}
    🏢 运营商:      AS${asn} / ${asOrganization}
    ⚡ 网络节点:    ${colo}
    🕐 时区:        ${timezone}
    🌍 大陆:        ${continent}
    🔒 TLS 版本:    ${tlsVersion}
    📡 HTTP 协议:   ${httpProtocol}
    
    📱 用户代理:    ${ua}
    
    ==================
    © 2025 IP 信息查询工具 | 基于 Cloudflare Workers
    `;
    
        return new Response(text, {
          status: 200,
          headers: { 
            "Content-Type": "text/plain;charset=UTF-8",
            "X-Service": "IP-Info-Worker"
          }
        });
      } else {
        // 为浏览器返回美观的HTML页面
        const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌐 IP 信息查询工具</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            body {
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #2d3436;
                line-height: 1.6;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
    
            .container {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                max-width: 800px;
                width: 100%;
            }
    
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f1f3f4;
            }
    
            .header h1 {
                font-size: 2.5rem;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #74b9ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
                font-weight: 700;
            }
    
            .info-grid {
                display: grid;
                gap: 15px;
                margin-bottom: 30px;
            }
    
            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 12px;
                border-left: 4px solid #667eea;
                transition: transform 0.3s ease;
            }
    
            .info-item:hover {
                transform: translateX(5px);
            }
    
            .info-label {
                font-weight: 600;
                color: #636e72;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1.1rem;
            }
    
            .info-value {
                font-weight: 700;
                color: #2d3436;
                text-align: right;
                background: linear-gradient(45deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                padding: 8px 16px;
                border-radius: 10px;
                background-color: rgba(102, 126, 234, 0.1);
                font-size: 1.1rem;
            }
    
            .user-agent {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 12px;
                border-left: 4px solid #4ecdc4;
                margin-top: 20px;
            }
    
            .user-agent h3 {
                color: #2d3436;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
    
            .user-agent code {
                background: #e9ecef;
                padding: 10px;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                color: #495057;
                word-break: break-all;
                font-size: 0.9rem;
            }
    
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #f1f3f4;
                color: #6c757d;
                font-size: 0.9rem;
            }
    
            @media (max-width: 768px) {
                .container {
                    padding: 20px;
                    margin: 10px;
                }
    
                .header h1 {
                    font-size: 2rem;
                }
    
                .info-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
    
                .info-value {
                    text-align: left;
                    width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌐 IP 信息查询工具</h1>
                <p>实时获取您的网络连接信息</p>
            </div>
    
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">🔗 IP 地址</span>
                    <span class="info-value">${ip}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📍 地理位置</span>
                    <span class="info-value">${addr}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🏢 运营商</span>
                    <span class="info-value">AS${asn} / ${asOrganization}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">⚡ 网络节点</span>
                    <span class="info-value">${colo}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🕐 时区</span>
                    <span class="info-value">${timezone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🌍 大陆</span>
                    <span class="info-value">${continent}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🔒 TLS 版本</span>
                    <span class="info-value">${tlsVersion}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📡 HTTP 协议</span>
                    <span class="info-value">${httpProtocol}</span>
                </div>
            </div>

            <div class="footer">
                <p>© 2025 IP 信息查询工具 | 基于 Cloudflare Workers</p>
                <a href="https://github.com/jinhuaitao/My-IP" class="github-link" target="_blank">GitHub</a>
            </div>
        </div>
    </body>
    </html>`;
    
        return new Response(html, {
          status: 200,
          headers: { 
            "Content-Type": "text/html;charset=UTF-8",
            "X-Service": "IP-Info-Worker"
          }
        });
      }
    }
    
    /**
     * 处理IPv4地址查询
     */
    function handleIPv4Address(request) {
      const ip = request.headers.get("cf-connecting-ip");
      const colo = request.cf.colo;
      
      const body = `var ipv4addr = document.getElementById("ipv4addr"); 
    ipv4addr.innerHTML = 'IP: ${ip} via ${colo}';
    `;
    
      return new Response(body, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain;charset=UTF-8",
          "X-Data-Type": "JavaScript"
        }
      });
    }
    
    /**
     * 处理Cloudflare节点信息
     */
    function handleCFEdge(request) {
      const colo = request.cf.colo;
      
      const body = `var cfedge = document.getElementById("cfedge"); 
    cfedge.innerHTML = '${colo}';
    `;
    
      return new Response(body, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain;charset=UTF-8",
          "X-Data-Type": "JavaScript"
        }
      });
    }
    
    /**
     * 处理ASN信息
     */
    function handleASN(request) {
      return new Response(request.cf.asn, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain;charset=UTF-8",
          "X-Data-Type": "ASN"
        }
      });
    }
    
    /**
     * 处理节点信息
     */
    function handleColo(request) {
      return new Response(request.cf.colo, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain;charset=UTF-8",
          "X-Data-Type": "Cloudflare-Node"
        }
      });
    }
    
    /**
     * 处理IP地址查询
     */
    function handleIP(request) {
      return new Response(request.headers.get('CF-Connecting-IP'), {
        status: 200,
        headers: { 
          "Content-Type": "text/plain;charset=UTF-8",
          "X-Data-Type": "IP-Address"
        }
      });
    }
    
    /**
     * 处理204状态码请求
     */
    function handle204() {
      return new Response(null, {
        status: 204
      });
    }
