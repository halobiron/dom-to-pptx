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
        name: '📊 Business Report (5 slides)',
        description: 'Professional business presentation with charts and tables',
        html: `<div class="slides-container" style="width: 1280px;">
    <!-- Slide 1: Title -->
    <div class="slide" data-transition="fade" style="width: 1280px; height: 720px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; color: white;">
            <h1 style="font-size: 64px; font-weight: 800; margin-bottom: 20px;">Q4 Business Report</h1>
            <p style="font-size: 28px; opacity: 0.9;">Fiscal Year 2024</p>
            <div class="fragment fade-up" style="margin-top: 40px; background: rgba(255,255,255,0.2); padding: 20px 40px; border-radius: 30px; backdrop-filter: blur(10px);">
                <p style="font-size: 20px; margin: 0;">Prepared by: Finance Team</p>
            </div>
        </div>
    </div>

    <!-- Slide 2: Executive Summary -->
    <div class="slide" data-transition="slide" style="width: 1280px; height: 720px; background: white; font-family: Arial, sans-serif; padding: 60px;">
        <h2 style="font-size: 48px; font-weight: 700; color: #1e293b; margin-bottom: 40px;">Executive Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div class="fragment fade-right" style="background: #f8fafc; padding: 40px; border-radius: 20px; border-left: 6px solid #3b82f6;">
                <h3 style="font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 20px;">Key Highlights</h3>
                <ul style="list-style: none; padding: 0; font-size: 18px; line-height: 2;">
                    <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">✓ Revenue increased by <strong>24.5%</strong></li>
                    <li style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">✓ New customer acquisition: <strong>+15%</strong></li>
                    <li style="padding: 12px 0;">✓ Market share expanded to <strong>18.3%</strong></li>
                </ul>
            </div>
            <div class="fragment fade-left" style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px; border-radius: 20px; color: white;">
                <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Total Revenue</h3>
                <p style="font-size: 56px; font-weight: 800; margin: 20px 0;">$2.4M</p>
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                    <p style="font-size: 16px; margin: 0;">↑ 24.5% vs Q3</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Slide 3: Revenue Breakdown -->
    <div class="slide" data-transition="convex" style="width: 1280px; height: 720px; background: white; font-family: Arial, sans-serif; padding: 60px;">
        <h2 style="font-size: 48px; font-weight: 700; color: #1e293b; margin-bottom: 40px;">Revenue Breakdown</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 18px;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th style="padding: 20px; text-align: left; font-weight: 600; color: #475569; border-bottom: 3px solid #cbd5e1;">Quarter</th>
                    <th style="padding: 20px; text-align: right; font-weight: 600; color: #475569; border-bottom: 3px solid #cbd5e1;">Revenue</th>
                    <th style="padding: 20px; text-align: right; font-weight: 600; color: #475569; border-bottom: 3px solid #cbd5e1;">Growth</th>
                </tr>
            </thead>
            <tbody>
                <tr class="fragment fade-in" style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 20px; color: #1e293b; font-weight: 500;">Q1 2024</td>
                    <td style="padding: 20px; text-align: right; color: #1e293b;">$485,000</td>
                    <td style="padding: 20px; text-align: right; color: #10b981; font-weight: 600;">+8.2%</td>
                </tr>
                <tr class="fragment fade-in" style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 20px; color: #1e293b; font-weight: 500;">Q2 2024</td>
                    <td style="padding: 20px; text-align: right; color: #1e293b;">$612,000</td>
                    <td style="padding: 20px; text-align: right; color: #10b981; font-weight: 600;">+26.2%</td>
                </tr>
                <tr class="fragment fade-in" style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 20px; color: #1e293b; font-weight: 500;">Q3 2024</td>
                    <td style="padding: 20px; text-align: right; color: #1e293b;">$758,000</td>
                    <td style="padding: 20px; text-align: right; color: #10b981; font-weight: 600;">+23.9%</td>
                </tr>
                <tr class="fragment fade-in" style="background: #eff6ff;">
                    <td style="padding: 20px; color: #1e40af; font-weight: 600;">Total</td>
                    <td style="padding: 20px; text-align: right; color: #1e40af; font-weight: 700;">$1,855,000</td>
                    <td style="padding: 20px; text-align: right; color: #10b981; font-weight: 700;">+19.4%</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Slide 4: Charts -->
    <div class="slide" data-transition="concave" style="width: 1280px; height: 720px; background: #f8fafc; font-family: Arial, sans-serif; padding: 60px;">
        <h2 style="font-size: 48px; font-weight: 700; color: #1e293b; margin-bottom: 40px;">Growth Trends</h2>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
            <div class="fragment fade-up" style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h3 style="font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 30px;">Monthly Revenue</h3>
                <div style="display: flex; align-items: flex-end; gap: 20px; height: 300px;">
                    <div style="flex: 1; text-align: center;"><div style="height: 120px; background: #3b82f6; border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 10px; color: #64748b;">Jan</p></div>
                    <div style="flex: 1; text-align: center;"><div style="height: 150px; background: #3b82f6; border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 10px; color: #64748b;">Feb</p></div>
                    <div style="flex: 1; text-align: center;"><div style="height: 180px; background: #3b82f6; border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 10px; color: #64748b;">Mar</p></div>
                    <div style="flex: 1; text-align: center;"><div style="height: 200px; background: #8b5cf6; border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 10px; color: #64748b;">Apr</p></div>
                    <div style="flex: 1; text-align: center;"><div style="height: 220px; background: #3b82f6; border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 10px; color: #64748b;">May</p></div>
                    <div style="flex: 1; text-align: center;"><div style="height: 250px; background: #3b82f6; border-radius: 8px 8px 0 0;"></div><p style="font-size: 14px; margin-top: 10px; color: #64748b;">Jun</p></div>
                </div>
            </div>
            <div class="fragment fade-left" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; border-radius: 20px; color: white;">
                <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Top Product</h3>
                <p style="font-size: 48px; font-weight: 800; margin: 20px 0;">Enterprise</p>
                <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px;">
                    <p style="font-size: 14px; margin: 0;">65% of total revenue</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Slide 5: Conclusion -->
    <div class="slide" data-transition="zoom" style="width: 1280px; height: 720px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; color: white;">
            <h1 class="fragment fade-up" style="font-size: 64px; font-weight: 800; margin-bottom: 20px;">Thank You!</h1>
            <p class="fragment fade-up" style="font-size: 28px; margin-bottom: 40px; opacity: 0.9;">Questions & Discussion</p>
            <div class="fragment fade-up" style="background: rgba(255,255,255,0.2); padding: 30px 50px; border-radius: 40px; backdrop-filter: blur(10px);">
                <p style="font-size: 18px; margin: 0;">contact@company.com</p>
            </div>
        </div>
    </div>
</div>`
    },
    {
        id: 'product-launch',
        name: '🚀 Product Launch (4 slides)',
        description: 'Product presentation with modern design and animations',
        html: `<div class="slides-container" style="width: 1280px;">
    <!-- Slide 1: Hero -->
    <div class="slide" data-transition="fade" style="width: 1280px; height: 720px; background: #0f172a; font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -100px; left: -100px; width: 500px; height: 500px; background: radial-gradient(circle, #8b5cf6 0%, transparent 70%); opacity: 0.3; filter: blur(100px);"></div>
        <div style="position: absolute; bottom: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, #06b6d4 0%, transparent 70%); opacity: 0.3; filter: blur(100px);"></div>
        <div style="position: relative; z-index: 1; text-align: center; color: white;">
            <div class="fragment fade-up" style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 80px; font-weight: 800;">NEW PRODUCT</div>
            <p class="fragment fade-up" style="font-size: 28px; margin-top: 20px; opacity: 0.8;">Revolutionizing the way you work</p>
        </div>
    </div>

    <!-- Slide 2: Features -->
    <div class="slide" data-transition="slide" style="width: 1280px; height: 720px; background: white; font-family: Arial, sans-serif; padding: 60px;">
        <h2 style="font-size: 48px; font-weight: 700; color: #1e293b; margin-bottom: 50px;">Powerful Features</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <div class="fragment fade-up" style="text-align: center; padding: 40px 20px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">⚡</div>
                <h3 style="font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 10px;">Lightning Fast</h3>
                <p style="font-size: 16px; color: #64748b; line-height: 1.6;">Built for speed and efficiency</p>
            </div>
            <div class="fragment fade-up" style="text-align: center; padding: 40px 20px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">🎨</div>
                <h3 style="font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 10px;">Beautiful Design</h3>
                <p style="font-size: 16px; color: #64748b; line-height: 1.6;">Stunning user interface</p>
            </div>
            <div class="fragment fade-up" style="text-align: center; padding: 40px 20px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ec4899, #f43f5e); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">🔒</div>
                <h3 style="font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 10px;">Secure by Default</h3>
                <p style="font-size: 16px; color: #64748b; line-height: 1.6;">Enterprise-grade security</p>
            </div>
        </div>
    </div>

    <!-- Slide 3: How It Works -->
    <div class="slide" data-transition="convex" style="width: 1280px; height: 720px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); font-family: Arial, sans-serif; padding: 60px; color: white;">
        <h2 style="font-size: 48px; font-weight: 700; margin-bottom: 50px;">How It Works</h2>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="fragment fade-right" style="flex: 1; text-align: center; padding: 20px;">
                <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 800;">1</div>
                <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Sign Up</h3>
                <p style="font-size: 16px; opacity: 0.8;">Create your account</p>
            </div>
            <div style="font-size: 40px; opacity: 0.5;">→</div>
            <div class="fragment fade-up" style="flex: 1; text-align: center; padding: 20px;">
                <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 800;">2</div>
                <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Configure</h3>
                <p style="font-size: 16px; opacity: 0.8;">Set your preferences</p>
            </div>
            <div style="font-size: 40px; opacity: 0.5;">→</div>
            <div class="fragment fade-left" style="flex: 1; text-align: center; padding: 20px;">
                <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 800;">3</div>
                <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Launch</h3>
                <p style="font-size: 16px; opacity: 0.8;">Start using immediately</p>
            </div>
        </div>
    </div>

    <!-- Slide 4: CTA -->
    <div class="slide" data-transition="zoom" style="width: 1280px; height: 720px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; color: white;">
            <h1 class="fragment fade-up" style="font-size: 64px; font-weight: 800; margin-bottom: 20px;">Get Started Today</h1>
            <p class="fragment fade-up" style="font-size: 24px; margin-bottom: 40px; opacity: 0.9;">Join thousands of happy customers</p>
            <div class="fragment fade-up">
                <div style="background: white; color: #8b5cf6; padding: 20px 50px; border-radius: 50px; font-size: 20px; font-weight: 600; display: inline-block; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">Start Free Trial</div>
            </div>
        </div>
    </div>
</div>`
    }
];
