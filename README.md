# The Cabinet of Curiosities

Three.js 三维私人书斋最小原型：木地板、墙壁、拱窗、书架、书桌与可点击的浑天仪。保留 HTML、CSS、JavaScript 结构，无 React。

## 运行与构建

需要 Node.js 20.19+ 或 22.12+：

```sh
npm ci
npm run dev
```

生产构建与预览：

```sh
npm run build
npm run preview
```

发布时部署 `dist/` 内容；不能再以 Python 服务器直接运行源码。构建采用相对资源路径，适合 GitHub Pages 子目录。仓库提供 `.github/workflows/pages.yml`，在 main 更新时自动安装依赖、构建并发布 `dist/`。

首次启用：进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。合并后在 **Actions → Build and deploy GitHub Pages** 查看运行结果；必要时点击 **Run workflow** 手动部署 main。部署成功后再刷新站点。不要选择从 main 根目录直接发布，否则浏览器不能解析 `three` 导入，画面会停在「正在布置书斋」。

## 操作

鼠标或单指拖动旋转，滚轮或双指捏合缩放。相机限制在房间开放的一侧，不能穿墙或平移。点击桌上浑天仪打开问题，编辑后点击「保存札记」。下方同名按钮提供键盘操作入口。关闭或 Escape 不会保存未保存的内容。

## 实现原理

- `index.html`：画布容器与原生 dialog 研究卡片。
- `style.css`：页面排版和羊皮纸卡片；仅画布禁止浏览器默认触控滚动。
- `study.js`：Three.js 场景、透视相机、简单几何家具及黄铜圆环模型。OrbitControls 控制观察角度；Raycaster 将屏幕点击转换为三维射线，命中浑天仪才打开札记。移动超过 8 像素或使用多指时视为手势，不触发选择。
- `script.js`：窗口和保存逻辑。仍使用 `cabinet-question-sphere`，旧版札记可继续读取；贝壳和摆锤的旧数据不会删除。

为 iPad 限制像素比到 1.5，不加载外部模型、纹理或字体，不使用实时阴影或后期处理。仅在视角或尺寸变化时渲染，没有持续动画循环。需要支持 WebGL 2 的浏览器；失败时显示提示，研究卡片仍可使用。自动化检查不能替代真实 iPad Safari 的设备验证。

数据保存在当前浏览器、当前站点的 localStorage，不跨设备同步。清除站点数据将删除札记。
