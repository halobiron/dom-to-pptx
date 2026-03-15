// ============================================
// Presentation Templates with Animations & Fragments
// ============================================

const templates = [
    {
        id: 'python-intro',
        name: '🐍 Python Intro (7 slides)',
        description: 'Reveal.js presentation with animations, fragments & transitions',
        html: `<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="utf-8">
  <title>Giới thiệu Python - Cho người mới bắt đầu</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Reveal.js Styles -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reset.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/theme/black.min.css" id="theme">

  <!-- Google Fonts -->
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;600;800&family=Fira+Code:wght@400;700&display=swap"
    rel="stylesheet">

  <style>
    /* --- CUSTOM PREMIUM CSS --- */
    :root {
      --py-blue: #306998;
      --py-yellow: #FFD43B;
      --text-main: #ffffff;
      --glass-bg: rgba(255, 255, 255, 0.08);
      --glass-border: rgba(255, 255, 255, 0.15);
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: #0a0a0a;
    }

    .reveal h1,
    .reveal h2,
    .reveal h3 {
      font-family: 'Inter', sans-serif;
      font-weight: 800;
      text-transform: none;
      letter-spacing: -0.02em;
    }

    /* Gradient Text */
    .gradient-text {
      background: linear-gradient(135deg, var(--py-blue), #4B8BBE, var(--py-yellow));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Glassmorphism Card */
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      margin: 20px 0;
    }

    /* Code Block Styling */
    .code-window {
      background: #1e1e1e;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      text-align: left;
      font-family: 'Fira Code', monospace;
      overflow: hidden;
      border: 1px solid #333;
    }

    .code-header {
      background: #2d2d2d;
      padding: 10px 15px;
      display: flex;
      gap: 8px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .red {
      background: #ff5f56;
    }

    .yellow {
      background: #ffbd2e;
    }

    .green {
      background: #27c93f;
    }

    .code-content {
      padding: 20px;
      color: #d4d4d4;
      font-size: 0.8em;
      line-height: 1.5;
    }

    .kw {
      color: #569cd6;
    }

    /* Keyword */
    .str {
      color: #ce9178;
    }

    /* String */
    .func {
      color: #dcdcaa;
    }

    /* Function */

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }

    /* Utility */
    .text-left {
      text-align: left;
    }

    .highlight {
      color: var(--py-yellow);
      font-weight: bold;
    }

    .reveal ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    .reveal ul li {
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .reveal ul li::before {
      content: "▹";
      color: var(--py-yellow);
      margin-right: 10px;
    }
  </style>
</head>

<body>
  <div class="reveal" style="width: 1280px; height: 720px;">
    <div class="slides" style="width: 1280px; height: 720px;">

      <!-- SLIDE 1: TITLE -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center;"
        data-background-image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
        data-background-opacity="0.3">
        <div style="margin-top: 10%;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
            style="width: 120px; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(48, 105, 152, 0.6));">
          <h1 class="r-fit-text gradient-text">PYTHON</h1>
          <h3 style="font-weight: 300; color: #ddd;">Ngôn ngữ lập trình của Tương lai</h3>
          <p style="font-size: 0.6em; margin-top: 50px; opacity: 0.7;">Dành cho người mới bắt đầu</p>
        </div>
      </section>

      <!-- SLIDE 2: WHAT IS PYTHON? -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center;" data-auto-animate>
        <h2 class="text-left gradient-text">Python là gì?</h2>
        <div class="grid-2">
          <div class="text-left">
            <p style="font-size: 1.2em; line-height: 1.6;">
              Python là ngôn ngữ lập trình <span class="highlight">đa năng</span>, ra đời năm 1991 bởi Guido van Rossum.
            </p>
            <div class="glass-card fragment fade-up">
              <ul>
                <li>Dễ đọc như Tiếng Anh</li>
                <li>Mã nguồn mở (Miễn phí)</li>
                <li>Cộng đồng hỗ trợ khổng lồ</li>
              </ul>
            </div>
          </div>
          <div class="fragment fade-left">
            <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
              style="border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
          </div>
        </div>
      </section>

      <!-- SLIDE 3: WHY PYTHON (COMPARISON) -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center;" data-auto-animate>
        <h2 class="gradient-text">Tại sao chọn Python?</h2>
        <p style="margin-bottom: 40px;">Sự khác biệt nằm ở sự <span class="highlight">Đơn giản</span></p>

        <div class="grid-2">
          <!-- Java/C++ Example -->
          <div class="code-window fragment fade-right" style="opacity: 0.6; transform: scale(0.9);">
            <div class="code-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div><span style="font-size:12px; margin-left:10px; color:#888">Java/C++ (Phức
                tạp)</span>
            </div>
            <div class="code-content">
              <span class="kw">public class</span> HelloWorld {<br>
              &nbsp;&nbsp;<span class="kw">public static void</span> main(String[] args) {<br>
              &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span class="str">"Hello World"</span>);<br>
              &nbsp;&nbsp;}<br>
              }
            </div>
          </div>

          <!-- Python Example -->
          <div class="code-window fragment fade-left" style="border: 2px solid var(--py-yellow);">
            <div class="code-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div><span style="font-size:12px; margin-left:10px; color:#888">Python (Đơn
                giản)</span>
            </div>
            <div class="code-content" style="font-size: 1.2em;">
              <span class="func">print</span>(<span class="str">"Hello World"</span>)
            </div>
          </div>
        </div>
        <p class="fragment fade-up" style="margin-top: 30px; font-size: 0.8em; color: #aaa;">Python giúp bạn tập trung
          vào giải pháp, không phải cú pháp.</p>
      </section>

      <!-- SLIDE 4: APPLICATIONS -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center;">
        <h2 class="gradient-text" style="margin-bottom: 50px;">Python làm được gì?</h2>
        <div class="grid-3">
          <div class="glass-card fragment fade-up" data-fragment-index="1">
            <div style="font-size: 3em; margin-bottom: 20px;">🤖</div>
            <h4>Trí tuệ nhân tạo (AI)</h4>
            <p style="font-size: 0.6em; color: #ccc;">Machine Learning, Deep Learning, Chatbots (ChatGPT).</p>
          </div>
          <div class="glass-card fragment fade-up" data-fragment-index="2">
            <div style="font-size: 3em; margin-bottom: 20px;">📊</div>
            <h4>Phân tích dữ liệu</h4>
            <p style="font-size: 0.6em; color: #ccc;">Xử lý Big Data, vẽ biểu đồ tài chính, chứng khoán.</p>
          </div>
          <div class="glass-card fragment fade-up" data-fragment-index="3">
            <div style="font-size: 3em; margin-bottom: 20px;">🌐</div>
            <h4>Lập trình Web</h4>
            <p style="font-size: 0.6em; color: #ccc;">Xây dựng backend cho các website lớn (Instagram, Pinterest).</p>
          </div>
        </div>
      </section>

      <!-- SLIDE 5: BIG TECH -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center;" data-background-color="#050505">
        <h3>Ai đang sử dụng Python?</h3>
        <div
          style="display: flex; justify-content: center; align-items: center; gap: 50px; margin-top: 50px; flex-wrap: wrap;">
          <div class="fragment zoom-in" style="text-align: center;">
            <h1 style="font-size: 2.5em; color: #4285F4;">Google</h1>
            <p style="font-size: 0.5em;">Tìm kiếm & AI</p>
          </div>
          <div class="fragment zoom-in" style="text-align: center;">
            <h1 style="font-size: 2.5em; color: #E50914;">NETFLIX</h1>
            <p style="font-size: 0.5em;">Gợi ý phim</p>
          </div>
          <div class="fragment zoom-in" style="text-align: center;">
            <h1 style="font-size: 2.5em; color: #1DB954;">Spotify</h1>
            <p style="font-size: 0.5em;">Phân tích nhạc</p>
          </div>
          <div class="fragment zoom-in" style="text-align: center;">
            <h1 style="font-size: 2.5em; color: #FFFFFF;">NASA</h1>
            <p style="font-size: 0.5em;">Xử lý ảnh vũ trụ</p>
          </div>
        </div>
      </section>

      <!-- SLIDE 6: ROADMAP -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center;">
        <h2 class="gradient-text">Lộ trình cho người mới</h2>
        <div style="position: relative; margin-top: 40px; max-width: 800px; margin-left: auto; margin-right: auto;">
          <!-- Timeline Line -->
          <div style="position: absolute; left: 50px; top: 0; bottom: 0; width: 4px; background: var(--py-blue);"></div>

          <div class="fragment fade-right" style="display: flex; align-items: center; margin-bottom: 30px;">
            <div
              style="width: 100px; text-align: right; padding-right: 20px; font-weight: bold; color: var(--py-yellow);">
              Tuần 1</div>
            <div class="glass-card" style="flex: 1; margin: 0; padding: 15px;">
              <h5>Cơ bản</h5>
              <p style="font-size: 0.6em; margin: 0;">Cài đặt Python, Biến, Kiểu dữ liệu, Lệnh If/Else.</p>
            </div>
          </div>

          <div class="fragment fade-right" style="display: flex; align-items: center; margin-bottom: 30px;">
            <div
              style="width: 100px; text-align: right; padding-right: 20px; font-weight: bold; color: var(--py-yellow);">
              Tuần 2</div>
            <div class="glass-card" style="flex: 1; margin: 0; padding: 15px;">
              <h5>Cấu trúc & Hàm</h5>
              <p style="font-size: 0.6em; margin: 0;">Vòng lặp (Loop), Hàm (Function), List, Dictionary.</p>
            </div>
          </div>

          <div class="fragment fade-right" style="display: flex; align-items: center;">
            <div
              style="width: 100px; text-align: right; padding-right: 20px; font-weight: bold; color: var(--py-yellow);">
              Tuần 3+</div>
            <div class="glass-card" style="flex: 1; margin: 0; padding: 15px;">
              <h5>Dự án thực tế</h5>
              <p style="font-size: 0.6em; margin: 0;">Làm máy tính bỏ túi, Game rắn săn mồi, hoặc Web đơn giản.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 7: CONCLUSION -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center;"
        data-background-image="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=2070&auto=format&fit=crop"
        data-background-opacity="0.4">
        <h1 class="r-fit-text gradient-text">BẮT ĐẦU NGAY!</h1>
        <p style="font-size: 1.2em; margin-top: 20px;">"Hành trình ngàn dặm bắt đầu từ một dòng code."</p>
        <div style="margin-top: 50px;">
          <a href="#"
            style="background: var(--py-blue); color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 0.8em;">Tải
            Python tại python.org</a>
        </div>
      </section>

    </div>
  </div>


</body>

  <!-- Reveal.js Library & Init -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.js"></script>
  <script>
    // Reveal.js will be initialized by the preview system if needed
    (function() {
      if (typeof Reveal !== 'undefined') {
        Reveal.initialize({
          embedded: true,
          hash: false,
          history: false,
          keyboard: false,
          overview: false,
          progress: false,
          controls: false,
          transition: 'convex',
          backgroundTransition: 'fade',
          autoAnimateEasing: 'ease-out',
          autoAnimateDuration: 0.8,
          width: 1280,
          height: 720
        }).then(() => {
          // Sync current slide after init
          if (window.currentSlideIndex !== undefined) {
             Reveal.slide(window.currentSlideIndex);
          }
        });
      }
    })();
  </script>
</html>`
    },
    {
        id: 'business-report',
        name: '📊 Business Report (6 slides)',
        description: 'Premium business presentation with glassmorphism & animations',
        html: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Q4 Business Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reset.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/theme/black.min.css" id="theme">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --success-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
      --glass-bg: rgba(255, 255, 255, 0.1);
      --glass-border: rgba(255, 255, 255, 0.2);
    }
    body { font-family: 'Inter', sans-serif; background: #0f172a; }
    .reveal h1, .reveal h2, .reveal h3 { font-family: 'Inter', sans-serif; font-weight: 800; }
    .gradient-text {
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .metric-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 30px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    .stat-highlight {
      font-size: 64px;
      font-weight: 800;
      background: linear-gradient(135deg, #10b981, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .progress-bar {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      height: 8px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      border-radius: 10px;
    }
    .reveal ul { list-style: none; padding: 0; }
    .reveal ul li {
      padding: 15px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.9em;
    }
    .reveal ul li::before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
      margin-right: 15px;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="reveal" style="width: 1280px; height: 720px;">
    <div class="slides" style="width: 1280px; height: 720px;">

      <!-- SLIDE 1: TITLE -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center;"
        data-background-gradient="linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)">
        <div style="text-align: center;">
          <div class="glass-card fragment fade-up" style="margin-bottom: 30px;">
            <p style="font-size: 20px; color: #a5b4fc; margin: 0; letter-spacing: 3px;">FY 2024</p>
          </div>
          <h1 class="gradient-text r-fit-text">Q4 BUSINESS<br>REPORT</h1>
          <p style="font-size: 28px; color: #e0e7ff; margin-top: 30px; font-weight: 300;">Quarterly Performance Review</p>
          <div class="fragment fade-up" style="margin-top: 50px;">
            <div style="display: inline-flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.1); padding: 15px 30px; border-radius: 50px; backdrop-filter: blur(10px);">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">📊</div>
              <span style="font-size: 16px; color: #e0e7ff;">Finance Team</span>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 2: KEY METRICS -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center; padding: 60px;" data-background-color="#0f172a">
        <h2 class="gradient-text" style="margin-bottom: 50px;">Key Performance Metrics</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
          <div class="glass-card fragment fade-up" style="text-align: center;">
            <p style="font-size: 16px; color: #a5b4fc; margin-bottom: 15px;">Total Revenue</p>
            <p class="stat-highlight">$2.4M</p>
            <div style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600; margin-top: 15px;">↑ 24.5%</div>
          </div>
          <div class="glass-card fragment fade-up" style="text-align: center;">
            <p style="font-size: 16px; color: #a5b4fc; margin-bottom: 15px;">New Customers</p>
            <p class="stat-highlight">+1,847</p>
            <div style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600; margin-top: 15px;">↑ 15.2%</div>
          </div>
          <div class="glass-card fragment fade-up" style="text-align: center;">
            <p style="font-size: 16px; color: #a5b4fc; margin-bottom: 15px;">Market Share</p>
            <p class="stat-highlight">18.3%</p>
            <div style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600; margin-top: 15px;">↑ 2.1%</div>
          </div>
        </div>
      </section>

      <!-- SLIDE 3: REVENUE BREAKDOWN -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center; padding: 60px;" data-background-color="#0f172a">
        <h2 class="gradient-text" style="margin-bottom: 40px;">Revenue Breakdown</h2>
        <div class="glass-card">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid rgba(255,255,255,0.1);">
                <th style="padding: 20px; text-align: left; color: #a5b4fc; font-weight: 600;">Quarter</th>
                <th style="padding: 20px; text-align: right; color: #a5b4fc; font-weight: 600;">Revenue</th>
                <th style="padding: 20px; text-align: right; color: #a5b4fc; font-weight: 600;">Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr class="fragment fade-in" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 20px; color: #e0e7ff;">Q1 2024</td>
                <td style="padding: 20px; text-align: right; color: #e0e7ff; font-weight: 600;">$485,000</td>
                <td style="padding: 20px; text-align: right;"><span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 14px; border-radius: 15px; font-size: 14px; font-weight: 600;">+8.2%</span></td>
              </tr>
              <tr class="fragment fade-in" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 20px; color: #e0e7ff;">Q2 2024</td>
                <td style="padding: 20px; text-align: right; color: #e0e7ff; font-weight: 600;">$612,000</td>
                <td style="padding: 20px; text-align: right;"><span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 14px; border-radius: 15px; font-size: 14px; font-weight: 600;">+26.2%</span></td>
              </tr>
              <tr class="fragment fade-in" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 20px; color: #e0e7ff;">Q3 2024</td>
                <td style="padding: 20px; text-align: right; color: #e0e7ff; font-weight: 600;">$758,000</td>
                <td style="padding: 20px; text-align: right;"><span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 14px; border-radius: 15px; font-size: 14px; font-weight: 600;">+23.9%</span></td>
              </tr>
              <tr class="fragment fade-in" style="background: rgba(102, 126, 234, 0.1);">
                <td style="padding: 20px; color: #a5b4fc; font-weight: 700;">Total</td>
                <td style="padding: 20px; text-align: right; color: #a5b4fc; font-weight: 800;">$1,855,000</td>
                <td style="padding: 20px; text-align: right;"><span style="background: rgba(16, 185, 129, 0.3); color: #10b981; padding: 6px 14px; border-radius: 15px; font-size: 14px; font-weight: 700;">+19.4%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- SLIDE 4: MONTHLY TRENDS -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center; padding: 60px;" data-background-color="#0f172a">
        <h2 class="gradient-text" style="margin-bottom: 40px;">Monthly Revenue Trends</h2>
        <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 40px;">
          <div class="glass-card fragment fade-up">
            <div style="display: flex; align-items: flex-end; gap: 25px; height: 280px;">
              <div style="flex: 1; text-align: center;"><div style="height: 120px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 12px; color: #a5b4fc;">Jan</p></div>
              <div style="flex: 1; text-align: center;"><div style="height: 150px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 12px; color: #a5b4fc;">Feb</p></div>
              <div style="flex: 1; text-align: center;"><div style="height: 180px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 12px; color: #a5b4fc;">Mar</p></div>
              <div style="flex: 1; text-align: center;"><div style="height: 200px; background: linear-gradient(180deg, #f093fb, #f5576c); border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 12px; color: #a5b4fc;">Apr</p></div>
              <div style="flex: 1; text-align: center;"><div style="height: 220px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 12px; color: #a5b4fc;">May</p></div>
              <div style="flex: 1; text-align: center;"><div style="height: 250px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 12px; color: #a5b4fc;">Jun</p></div>
            </div>
          </div>
          <div class="fragment fade-left" style="background: var(--success-gradient); border-radius: 24px; padding: 35px; color: white; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">🏆</div>
            <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Best Month</h3>
            <p style="font-size: 42px; font-weight: 800; margin: 20px 0;">June</p>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 12px;">
              <p style="font-size: 14px; margin: 0;">$850K Revenue</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 5: KEY HIGHLIGHTS -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center; padding: 60px;" data-background-color="#0f172a">
        <h2 class="gradient-text" style="margin-bottom: 40px;">Key Highlights</h2>
        <div class="glass-card">
          <ul style="font-size: 0.7em;">
            <li class="fragment fade-right">Revenue increased by <strong style="color: #10b981;">24.5%</strong> compared to Q3</li>
            <li class="fragment fade-right">New customer acquisition grew by <strong style="color: #10b981;">+15%</strong> across all regions</li>
            <li class="fragment fade-right">Market share expanded to <strong style="color: #10b981;">18.3%</strong> in our target segment</li>
            <li class="fragment fade-right">Product launches exceeded targets by <strong style="color: #10b981;">32%</strong></li>
            <li class="fragment fade-right">Customer retention rate improved to <strong style="color: #10b981;">94.2%</strong></li>
          </ul>
        </div>
      </section>

      <!-- SLIDE 6: CONCLUSION -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center;"
        data-background-gradient="linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)">
        <div style="text-align: center;">
          <div class="fragment fade-up">
            <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
          </div>
          <h1 class="fragment fade-up" style="font-size: 72px; font-weight: 800; margin-bottom: 30px; color: white;">Thank You!</h1>
          <p class="fragment fade-up" style="font-size: 28px; margin-bottom: 50px; opacity: 0.9; color: white;">Questions & Discussion</p>
          <div class="fragment fade-up" style="background: rgba(255,255,255,0.2); padding: 25px 45px; border-radius: 50px; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.3);">
            <p style="font-size: 18px; margin: 0; color: white;">📧 contact@company.com</p>
          </div>
        </div>
      </section>

    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.js"></script>
  <script>
    (function() {
      if (typeof Reveal !== 'undefined') {
        Reveal.initialize({
          embedded: true, hash: false, history: false, keyboard: false, overview: false,
          progress: false, controls: false, transition: 'convex', backgroundTransition: 'fade',
          autoAnimateEasing: 'ease-out', autoAnimateDuration: 0.8, width: 1280, height: 720
        });
      }
    })();
  </script>
</body>
</html>`
    },
    {
        id: 'product-launch',
        name: '🚀 Product Launch (5 slides)',
        description: 'Premium product presentation with glassmorphism & animations',
        html: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Product Launch</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reset.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/theme/black.min.css" id="theme">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --secondary-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      --glass-bg: rgba(255, 255, 255, 0.08);
      --glass-border: rgba(255, 255, 255, 0.15);
    }
    body { font-family: 'Inter', sans-serif; background: #0a0a0a; }
    .reveal h1, .reveal h2, .reveal h3 { font-family: 'Inter', sans-serif; font-weight: 800; }
    .gradient-text {
      background: linear-gradient(135deg, #f093fb, #f5576c, #ff9a9e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 28px;
      padding: 45px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      transition: all 0.3s ease;
    }
    .glass-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    }
    .feature-icon {
      width: 90px;
      height: 90px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 25px;
      font-size: 44px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .step-circle {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 25px;
      font-size: 56px;
      font-weight: 900;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    .cta-button {
      background: linear-gradient(135deg, #f093fb, #f5576c);
      color: white;
      padding: 25px 60px;
      border-radius: 60px;
      font-size: 22px;
      font-weight: 700;
      display: inline-block;
      box-shadow: 0 15px 40px rgba(245, 87, 108, 0.4);
      border: 2px solid rgba(255, 255, 255, 0.2);
      text-decoration: none;
    }
    .floating-particle {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.4;
    }
  </style>
</head>
<body>
  <div class="reveal" style="width: 1280px; height: 720px;">
    <div class="slides" style="width: 1280px; height: 720px;">

      <!-- SLIDE 1: HERO TITLE -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;"
        data-background-gradient="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)">
        <div class="floating-particle" style="top: -100px; left: -100px; background: radial-gradient(circle, #f093fb 0%, transparent 70%);"></div>
        <div class="floating-particle" style="bottom: -100px; right: -100px; background: radial-gradient(circle, #4facfe 0%, transparent 70%);"></div>
        <div style="position: relative; z-index: 1; text-align: center;">
          <div class="fragment fade-up" style="margin-bottom: 30px;">
            <div style="font-size: 72px;">🚀</div>
          </div>
          <h1 class="gradient-text r-fit-text fragment fade-up">INTRODUCING<br>THE FUTURE</h1>
          <p class="fragment fade-up" style="font-size: 26px; margin-top: 30px; color: #e0e7ff; font-weight: 300;">Revolutionizing the way you work</p>
          <div class="fragment fade-up" style="margin-top: 50px;">
            <div class="glass-card" style="display: inline-block; padding: 20px 40px;">
              <p style="font-size: 18px; margin: 0; color: #f093fb; font-weight: 600;">✨ Now Available Worldwide</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 2: FEATURES -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center; padding: 60px;" data-background-color="#0a0a0a">
        <h2 class="gradient-text" style="margin-bottom: 50px; font-size: 56px;">Powerful Features</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px;">
          <div class="glass-card fragment fade-up" data-fragment-index="1" style="text-align: center;">
            <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">⚡</div>
            <h3 style="font-size: 26px; font-weight: 700; margin-bottom: 12px; color: #e0e7ff;">Lightning Fast</h3>
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.6;">Built for speed and efficiency</p>
          </div>
          <div class="glass-card fragment fade-up" data-fragment-index="2" style="text-align: center;">
            <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">🎨</div>
            <h3 style="font-size: 26px; font-weight: 700; margin-bottom: 12px; color: #e0e7ff;">Beautiful Design</h3>
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.6;">Stunning user interface</p>
          </div>
          <div class="glass-card fragment fade-up" data-fragment-index="3" style="text-align: center;">
            <div class="feature-icon" style="background: linear-gradient(135deg, #fa709a, #fee140);">🔒</div>
            <h3 style="font-size: 26px; font-weight: 700; margin-bottom: 12px; color: #e0e7ff;">Secure by Default</h3>
            <p style="font-size: 16px; color: #94a3b8; line-height: 1.6;">Enterprise-grade security</p>
          </div>
        </div>
      </section>

      <!-- SLIDE 3: MORE FEATURES -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center; padding: 60px;" data-background-color="#0a0a0a">
        <h2 class="gradient-text" style="margin-bottom: 50px; font-size: 56px;">Why Choose Us?</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 35px;">
          <div class="glass-card fragment fade-right">
            <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 20px;">
              <div style="font-size: 48px;">🎯</div>
              <h3 style="font-size: 28px; font-weight: 700; color: #e0e7ff; margin: 0;">Smart Automation</h3>
            </div>
            <p style="font-size: 18px; color: #94a3b8; line-height: 1.6; margin: 0;">AI-powered workflows that learn and adapt to your needs</p>
          </div>
          <div class="glass-card fragment fade-left">
            <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 20px;">
              <div style="font-size: 48px;">🔄</div>
              <h3 style="font-size: 28px; font-weight: 700; color: #e0e7ff; margin: 0;">Real-time Sync</h3>
            </div>
            <p style="font-size: 18px; color: #94a3b8; line-height: 1.6; margin: 0;">Seamless collaboration across all your devices</p>
          </div>
          <div class="glass-card fragment fade-right">
            <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 20px;">
              <div style="font-size: 48px;">📊</div>
              <h3 style="font-size: 28px; font-weight: 700; color: #e0e7ff; margin: 0;">Advanced Analytics</h3>
            </div>
            <p style="font-size: 18px; color: #94a3b8; line-height: 1.6; margin: 0;">Deep insights into your productivity and performance</p>
          </div>
          <div class="glass-card fragment fade-left">
            <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 20px;">
              <div style="font-size: 48px;">🌍</div>
              <h3 style="font-size: 28px; font-weight: 700; color: #e0e7ff; margin: 0;">Global Network</h3>
            </div>
            <p style="font-size: 18px; color: #94a3b8; line-height: 1.6; margin: 0;">Connect with teams and customers worldwide</p>
          </div>
        </div>
      </section>

      <!-- SLIDE 4: HOW IT WORKS -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; flex-direction: column; justify-content: center; padding: 60px;"
        data-background-gradient="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)">
        <h2 class="gradient-text" style="margin-bottom: 60px; font-size: 56px;">How It Works</h2>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="fragment fade-right" style="flex: 1; text-align: center; padding: 20px;">
            <div class="step-circle">1</div>
            <h3 style="font-size: 28px; font-weight: 700; margin-bottom: 12px; color: #e0e7ff;">Sign Up</h3>
            <p style="font-size: 18px; color: #94a3b8;">Create your account in seconds</p>
          </div>
          <div style="font-size: 48px; color: #f093fb; opacity: 0.6;">→</div>
          <div class="fragment fade-up" style="flex: 1; text-align: center; padding: 20px;">
            <div class="step-circle">2</div>
            <h3 style="font-size: 28px; font-weight: 700; margin-bottom: 12px; color: #e0e7ff;">Configure</h3>
            <p style="font-size: 18px; color: #94a3b8;">Set your preferences</p>
          </div>
          <div style="font-size: 48px; color: #f093fb; opacity: 0.6;">→</div>
          <div class="fragment fade-left" style="flex: 1; text-align: center; padding: 20px;">
            <div class="step-circle">3</div>
            <h3 style="font-size: 28px; font-weight: 700; margin-bottom: 12px; color: #e0e7ff;">Launch</h3>
            <p style="font-size: 18px; color: #94a3b8;">Start using immediately</p>
          </div>
        </div>
      </section>

      <!-- SLIDE 5: CTA -->
      <section class="slide" style="width: 1280px; height: 720px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;"
        data-background-gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff9a9e 100%)">
        <div class="floating-particle" style="top: -150px; left: -150px; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);"></div>
        <div class="floating-particle" style="bottom: -150px; right: -150px; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);"></div>
        <div style="position: relative; z-index: 1; text-align: center;">
          <div class="fragment fade-up" style="margin-bottom: 30px;">
            <div style="font-size: 80px;">🎉</div>
          </div>
          <h1 class="fragment fade-up" style="font-size: 72px; font-weight: 900; margin-bottom: 30px; color: white; text-shadow: 0 4px 20px rgba(0,0,0,0.2);">Get Started Today</h1>
          <p class="fragment fade-up" style="font-size: 28px; margin-bottom: 50px; opacity: 0.95; color: white;">Join thousands of happy customers</p>
          <div class="fragment fade-up">
            <div class="cta-button">Start Free Trial →</div>
          </div>
          <div class="fragment fade-up" style="margin-top: 40px;">
            <p style="font-size: 18px; color: rgba(255,255,255,0.8);">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.js"></script>
  <script>
    (function() {
      if (typeof Reveal !== 'undefined') {
        Reveal.initialize({
          embedded: true, hash: false, history: false, keyboard: false, overview: false,
          progress: false, controls: false, transition: 'convex', backgroundTransition: 'fade',
          autoAnimateEasing: 'ease-out', autoAnimateDuration: 0.8, width: 1280, height: 720
        });
      }
    })();
  </script>
</body>
</html>`
    }
];
