# ContactWidget 浮动社交通道模块复用说明

## 模块目标

新增一个独立的右侧浮动联系组件，不改动现有 Header/Footer 社交按钮。组件通过页面级开关控制是否显示，便于在首页或其它页面按需启用。

## 当前通道设计

组件包含 5 个社交通道：

1. WhatsApp：链接暂时留空
2. Telegram：`https://t.me/medinsh01`
3. X：`https://x.com/medinsh`
4. Facebook：链接暂时留空
5. WeChat：使用二维码弹窗，图片为 `/images/wechat-qr-placeholder.png`

## 文件结构

```text
src/components/ContactWidget.astro
src/pages/index.astro
```

## 首页接入方式

在首页 frontmatter 中引入组件，并增加本地显示开关：

```astro
---
import ContactWidget from '../components/ContactWidget.astro';

const showContactWidget = true;
---
```

在页面结构中渲染：

```astro
{showContactWidget && <ContactWidget />}
```

如需临时关闭：

```astro
const showContactWidget = false;
```

## 组件 Props

组件内部也支持 `enabled` 参数，默认开启：

```astro
<ContactWidget enabled={true} />
```

组件顶部代码：

```astro
---
const { enabled = true } = Astro.props;
---

{enabled && (
  <div id="contact-widget" class="contact-widget" aria-label="Contact channels">
    ...
  </div>
)}
```

## 关键 HTML 结构

```astro
<div id="contact-widget" class="contact-widget" aria-label="Contact channels">
  <button
    id="contact-toggle-btn"
    type="button"
    class="contact-toggle"
    aria-label="Collapse contact widget"
    aria-expanded="true"
    aria-controls="contact-panel"
  >
    <svg id="contact-toggle-icon" class="contact-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5l7 7-7 7"></path>
    </svg>
  </button>

  <div id="contact-panel" class="contact-panel">
    <span class="contact-label">contact us</span>
    <div class="contact-links">
      <a href="" target="_blank" rel="noopener noreferrer" title="Join WhatsApp Group" class="contact-link whatsapp">
        <span class="sr-only">WhatsApp</span>
      </a>

      <a href="https://t.me/medinsh01" target="_blank" rel="noopener noreferrer" title="Join Telegram Group" class="contact-link telegram">
        <span class="sr-only">Telegram</span>
      </a>

      <a href="https://x.com/medinsh" target="_blank" rel="noopener noreferrer" title="Follow us on X" class="contact-link x-link">
        <span class="sr-only">X</span>
      </a>

      <a href="" target="_blank" rel="noopener noreferrer" title="Follow us on Facebook" class="contact-link facebook">
        <span class="sr-only">Facebook</span>
      </a>

      <div class="wechat-wrap">
        <button type="button" title="WeChat Work Group" class="contact-link wechat">
          <span class="sr-only">WeChat</span>
        </button>
        <div class="wechat-popover">
          <img src="/images/wechat-qr-placeholder.png" alt="Scan to join WeChat group" />
        </div>
      </div>
    </div>
  </div>
</div>
```

实际项目中需要把每个通道的 SVG 图标放回对应按钮内。

## 关键 CSS

```css
.contact-widget {
  position: fixed;
  right: 0;
  bottom: 3rem;
  z-index: 50;
  display: flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-right: 0;
  border-radius: 24px 0 0 24px;
  box-shadow: -8px 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.contact-widget.is-collapsed {
  transform: translateX(calc(100% - 2rem));
}

.contact-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  color: #94a3b8;
  background: transparent;
  border: 0;
  border-right: 1px solid #f1f5f9;
  border-radius: 24px 0 0 24px;
  cursor: pointer;
}

.contact-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: max-content;
  padding: 0.75rem 1rem;
}

.contact-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 999px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.contact-link:hover {
  transform: translateY(-1px);
}

.whatsapp {
  color: #25d366;
  background: rgba(37, 211, 102, 0.1);
}

.telegram {
  color: #0088cc;
  background: rgba(0, 136, 204, 0.1);
}

.x-link {
  color: #0f172a;
  background: rgba(15, 23, 42, 0.08);
}

.facebook {
  color: #1877f2;
  background: rgba(24, 119, 242, 0.1);
}

.wechat {
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
}

.wechat-wrap {
  position: relative;
}

.wechat-popover {
  position: absolute;
  right: 0;
  bottom: calc(100% + 1rem);
  width: 9rem;
  padding: 0.5rem;
  pointer-events: none;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
  opacity: 0;
  transform: scale(0.95);
  transform-origin: bottom right;
  transition: opacity 0.2s, transform 0.2s;
}

.wechat-wrap:hover .wechat-popover,
.wechat-wrap:focus-within .wechat-popover {
  opacity: 1;
  transform: scale(1);
}

.wechat-popover img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
}
```

## 折叠交互 JS

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const widget = document.getElementById('contact-widget');
    const toggle = document.getElementById('contact-toggle-btn');
    if (!widget || !toggle) return;

    toggle.addEventListener('click', () => {
      const isCollapsed = widget.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!isCollapsed));
      toggle.setAttribute('aria-label', isCollapsed ? 'Expand contact widget' : 'Collapse contact widget');
    });
  });
</script>
```

## 复用注意事项

- 不依赖 Tailwind，适合 Astro 或普通 HTML/CSS 项目迁移。
- 如果另一个项目已有 Tailwind，可以保留原设计 class，但本版本更通用。
- 空链接 `href=""` 后续上线前应替换为真实地址，或改成 `button` 避免点击跳转当前页。
- WeChat 二维码路径需要确保目标项目中存在对应图片。
- 如果全站都要显示，建议放到公共 Layout；如果只首页显示，保留页面级开关即可。

## 验证命令

```bash
npm run build
```

当前项目已通过构建验证。
