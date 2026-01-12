# proxy-admin-panel---v2[README.md](https://github.com/user-attachments/files/24559567/README.md)
# ProxyAdmin - 代理服务销售管理后台

一个用于代理服务销售管理的后台演示面板，包含完整的订单管理、会员管理、数据统计和系统配置功能。

## 📁 项目结构
```
proxy-admin-panel/
├── index.html                    # 主入口文件
├── css/
│   └── style.css                 # 样式文件
├── js/
│   ├── app.js                    # 主应用入口
│   ├── data/
│   │   ├── mock-data.js          # 所有模拟数据（便于修改）
│   │   └── config.js             # 配置常量
│   ├── modules/
│   │   ├── navigation.js         # 导航与页面切换
│   │   ├── modal.js              # 弹窗控制
│   │   ├── dashboard.js          # 仪表盘功能
│   │   ├── orders.js             # 订单管理
│   │   ├── members.js            # 会员管理
│   │   └── settings.js           # 系统设置
│   ├── utils/
│   │   └── helpers.js            # 工具函数
│   └── charts/
│       └── charts.js             # ECharts图表
└── README.md                     # 项目说明
```

## 📋 功能模块

1. **仪表盘** - 数据概览与可视化分析
2. **订单总表** - 订单管理与查询
3. **会员管理** - 用户账户管理
4. **每日数据概览** - 日度经营数据统计
5. **系统设置** - 套餐配置与管理员管理

## 🛠️ 技术栈

- HTML5 / CSS3 / JavaScript (ES6+)
- ECharts 5.4.3 - 数据可视化
- Font Awesome 6.4.0 - 图标库

## 📝 数据修改指南

所有模拟数据集中在 `js/data/mock-data.js` 文件中，包括：

| 数据项 | 说明 |
|--------|------|
| `MockData.cardData` | 仪表盘数据卡片 |
| `MockData.orders` | 订单列表 |
| `MockData.members` | 会员列表 |
| `MockData.userOrders` | 用户订单历史 |
| `MockData.userResources` | 用户资源余额（创建订单查询用） |
| `MockData.dailyData` | 每日数据统计 |
| `MockData.residentialPackages` | 动态住宅代理套餐配置 |
| `MockData.unlimitedPackages` | 无限量代理套餐配置 |
| `MockData.admins` | 管理员账户 |
| `ChartMockData` | 图表数据（趋势图、饼图） |

## 🚀 快速开始

1. 下载所有文件并保持目录结构
2. 使用浏览器打开 `index.html`
3. 或使用本地服务器运行（推荐）
```bash
# 使用 Python 启动本地服务器
python -m http.server 8080

# 或使用 Node.js
npx serve .
```

## ⚠️ 注意事项

- 本项目为**演示Demo**，所有数据均为模拟数据
- 所有操作仅触发 `alert()` 提示，未对接后端API
- 建议使用 Chrome、Firefox、Edge 等现代浏览器访问
- 最佳显示分辨率：1920×1080 或更高

## 📋 后续开发建议

如需进行实际开发，建议：

1. 接入后端API实现数据持久化
2. 添加用户认证与权限管理
3. 集成真实的日期选择器组件
4. 实现表格排序与高级筛选
5. 添加数据导出（Excel/CSV）功能
6. 引入状态管理（如Vue/React）提升可维护性

## 📄 许可证

MIT License

---

**ProxyAdmin** © 2025
