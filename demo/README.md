# DOM to PPTX - Web Demo

Demo website cho package @halobiron/dom-to-pptx - Công cụ chuyển đổi HTML thành PowerPoint với độ chính xác cao.

## 🚀 Quick Start

### Cách 1: Mở trực tiếp (Simple)

Đơn giản chỉ cần mở file `index.html` trong trình duyệt:

```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### Cách 2: Sử dụng Local Server (Recommended)

Sử dụng Python hoặc Node.js để chạy local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (nếu đã có http-server cài sẵn)
npx http-server -p 8000
```

Sau đó mở trình duyệt tại: `http://localhost:8000`

## 📁 Cấu Trúc Project

```
demo/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom styles
├── js/
│   ├── app.js          # Main app logic
│   ├── templates.js    # Pre-built templates
│   └── editor.js       # CodeMirror editor logic
└── README.md           # This file
```

## ✨ Tính Năng

### 1. **Preview Area**
- Hiển thị HTML preview real-time
- Auto-scale để fit viewport
- Hỗ trợ multi-slide preview

### 2. **Code Editor**
- CodeMirror với syntax highlighting
- Hỗ trợ HTML và CSS editing
- Auto-update preview (có thể toggle)
- Line numbers và auto-close tags

### 3. **Options Panel**
- **File Name**: Tùy chỉnh tên file export
- **Auto Embed Fonts**: Tự động nhúng fonts vào PPTX
- **SVG as Vector**: Giữ SVG dạng vector (có thể edit trong PowerPoint)
- **Transition Type**: Hiệu ứng chuyển slide (fade, slide, zoom, etc.)
- **Margin**: Tùy chỉnh lề slide (0-20%)
- **List Spacing**: Khoảng cách trước/sau bullet points

### 4. **Templates**
5 template mẫu có sẵn:
- **Basic Slide**: Slide đơn giản với text và gradient
- **Dashboard**: Business dashboard với cards và stats
- **Multi-slide**: Presentation với 3 slides
- **Report Layout**: Report với bảng và biểu đồ
- **Creative Design**: Slide với gradients và animations

## 🎯 Hướng Dẫn Sử Dụng

### 1. Chọn Template
- Click vào template ở sidebar bên trái
- Preview sẽ tự động cập nhật

### 2. Chỉnh Sửa Code
- Chỉnh sửa HTML/CSS trong editor ở dưới cùng
- Switch giữa HTML và CSS tabs
- Toggle "Auto update" để preview tự động cập nhật
- Hoặc click "Cập nhật Preview" để update thủ công

### 3. Tùy Chỉnh Options
- Đổi tên file export
- Bật/tắt auto embed fonts
- Chọn hiệu ứng transition
- Tùy chỉnh margin và list spacing

### 4. Export PPTX
- Click nút "Export PPTX" ở góc trên bên phải
- File sẽ tự động được tải về

## 🔧 Dependencies

### CDN Libraries
- **Tailwind CSS**: Styling
- **CodeMirror**: Code editor
- **Google Fonts**: Typography
- **@halobiron/dom-to-pptx**: Main package

### Version
- dom-to-pptx: Latest from CDN (jsDelivr)

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## 📝 Notes

### CORS Issues
- External images cần CORS headers để được xử lý đúng
- Google Fonts cần thêm `crossorigin="anonymous"`

### Performance
- Large HTML có thể mất thời gian xử lý
- Complex gradients và shadows có thể tăng file size

### Limitations
- Một số CSS features nâng cao có thể không được hỗ trợ đầy đủ
- Canvas elements được convert thành images
- Videos không được support

## 🐛 Troubleshooting

### Preview không hiển thị
- Kiểm tra console JavaScript
- Đảm bảo không có syntax errors trong HTML/CSS
- Thử refresh lại trang

### Export thất bại
- Kiểm tra xem dom-to-pptx bundle đã load đúng chưa
- Đảm bảo HTML structure hợp lệ
- Thử với template đơn giản trước

### Images không hiển thị
- Kiểm tra CORS headers của images
- Thử dùng base64 encoded images
- Sử dụng images từ cùng origin

## 🚀 Future Enhancements

- [ ] Save/Load custom templates
- [ ] Export history
- [ ] Share URL
- [ ] More templates
- [ ] Theme colors customization
- [ ] Multi-slide editor
- [ ] Drag & drop elements
- [ ] Live preview with changes highlight

## 📄 License

Demo này là phần của package @halobiron/dom-to-pptx
License: MIT

## 🤝 Contributing

Contributions are welcome! Vui lòng tạo issue hoặc pull request tại GitHub repository.

## 📧 Support

Nếu bạn có bất kỳ questions hoặc feedback, vui lòng tạo issue tại:
https://github.com/halobiron/dom-to-pptx/issues
