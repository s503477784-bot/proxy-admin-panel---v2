/**
 * 模拟数据存储
 * 所有演示用的假数据集中管理
 */
const MockData = {
    // ==================== 仪表盘数据卡片 ====================
    cardData: {
        sales: {
            week: { value: '¥45,678.90', label: '本周数据', trend: '↑ 12.5% 较上周', trendClass: 'trend-up' },
            month: { value: '¥123,456.78', label: '本月数据', trend: '↑ 15.2% 较上月', trendClass: 'trend-up' },
            year: { value: '¥1,234,567.89', label: '本年数据', trend: '↑ 25.8% 较去年', trendClass: 'trend-up' },
            all: { value: '¥3,456,789.00', label: '全部数据', trend: '', trendClass: '' }
        },
        orders: {
            week: { value: '356 单', label: '本周数据', trend: '↓ 3.2% 较上周', trendClass: 'trend-down' },
            month: { value: '1,234 单', label: '本月数据', trend: '↓ 5.8% 较上月', trendClass: 'trend-down' },
            year: { value: '12,345 单', label: '本年数据', trend: '↑ 18.6% 较去年', trendClass: 'trend-up' },
            all: { value: '45,678 单', label: '全部数据', trend: '', trendClass: '' }
        },
        users: {
            week: { value: '128 人', label: '本周新增', trend: '↑ 6.8% 较上周', trendClass: 'trend-up' },
            month: { value: '5,678 人', label: '本月新增', trend: '↑ 8.2% 较上月', trendClass: 'trend-up' },
            year: { value: '23,456 人', label: '本年新增', trend: '↑ 32.5% 较去年', trendClass: 'trend-up' },
            all: { value: '56,789 人', label: '全部数据', trend: '', trendClass: '' }
        }
    },

    // ==================== 订单列表数据 ====================
    orders: [
        { id: 1, username: 'Proxy_001', email: 'user001@example.com', orderNo: 'ORD20241220001', type: 'residential', serverConfig: '/', resource: '500 GB', orderAmount: 1234.56, payAmount: 1234.56, status: 'paid', payTime: '2024-12-20 14:30', source: '官网' },
        { id: 2, username: 'Proxy_002', email: 'alice@email.com', orderNo: 'ORD20241220002', type: 'unlimited', serverConfig: '400MB + 8核16GB', resource: '30 天', orderAmount: 2000.00, payAmount: 0.00, status: 'unpaid', payTime: '--', source: '后台' },
        { id: 3, username: 'Proxy_003', email: 'bob2024@mail.com', orderNo: 'ORD20241219003', type: 'residential', serverConfig: '/', resource: '200 GB', orderAmount: 500.00, payAmount: 500.00, status: 'paid', payTime: '2024-12-19 10:15', source: '官网' },
        { id: 4, username: 'Proxy_004', email: 'charlie@test.com', orderNo: 'ORD20241218004', type: 'unlimited', serverConfig: '800MB + 16核32GB', resource: '60 天', orderAmount: 5500.00, payAmount: 5500.00, status: 'paid', payTime: '2024-12-18 16:45', source: '官网' }
    ],

    // ==================== 会员列表数据 ====================
    members: [
        { id: 1, username: 'Proxy_001', email: 'user001@example.com', password: 'Abc123456', residentialBalance: '500 GB', unlimitedBalance: '0 天', totalSpent: 1234.56, registerTime: '2024-12-01 10:00', status: 'active' },
        { id: 2, username: 'Proxy_002', email: 'alice@email.com', password: 'Pass789xyz', residentialBalance: '0 GB', unlimitedBalance: '30 天', totalSpent: 2000.00, registerTime: '2024-12-05 14:20', status: 'disabled' },
        { id: 3, username: 'Proxy_003', email: 'bob2024@mail.com', password: 'Qwerty2024', residentialBalance: '200 GB', unlimitedBalance: '15 天', totalSpent: 3500.00, registerTime: '2024-11-20 09:30', status: 'active' },
        { id: 4, username: 'Proxy_004', email: 'charlie@test.com', password: 'Zl@888888', residentialBalance: '1000 GB', unlimitedBalance: '0 天', totalSpent: 5500.00, registerTime: '2024-10-15 16:45', status: 'active' }
    ],

    // ==================== 用户订单历史（按用户名索引） ====================
    userOrders: {
        'Proxy_001': [
            { orderNo: 'ORD20241220001', type: '动态住宅代理', resource: '500 GB', amount: '¥1,234.56', time: '2024-12-20 14:30' }
        ],
        'Proxy_002': [
            { orderNo: 'ORD20241215005', type: '无限量代理', resource: '30 天', amount: '¥2,000.00', time: '2024-12-15 10:00' }
        ],
        'Proxy_003': [
            { orderNo: 'ORD20241119003', type: '动态住宅代理', resource: '200 GB', amount: '¥500.00', time: '2024-11-19 10:15' },
            { orderNo: 'ORD20241105008', type: '无限量代理', resource: '15 天', amount: '¥1,500.00', time: '2024-11-05 16:20' },
            { orderNo: 'ORD20241020012', type: '动态住宅代理', resource: '300 GB', amount: '¥1,500.00', time: '2024-10-20 09:45' }
        ],
        'Proxy_004': [
            { orderNo: 'ORD20241218004', type: '无限量代理', resource: '60 天', amount: '¥5,500.00', time: '2024-12-18 16:45' }
        ]
    },

    // ==================== 用户资源查询（用于创建订单时） ====================
    userResources: {
        'user001': { residential: '500', unlimited: '15', unlimitedConfig: '400MB + 8核16GB' },
        'user002': { residential: '120', unlimited: '0', unlimitedConfig: '无' },
        'test@example.com': { residential: '250', unlimited: '30', unlimitedConfig: '600MB + 16核32GB' }
    },

    // ==================== 每日数据概览 ====================
    dailyData: [
        { date: '2024-12-20', isToday: true, totalOrders: 125, totalSales: 12345.67, newUsers: 38, residentialOrders: 75, residentialSales: 7890.00, unlimitedOrders: 50, unlimitedSales: 4455.67 },
        { date: '2024-12-19', isToday: false, totalOrders: 110, totalSales: 10123.00, newUsers: 30, residentialOrders: 60, residentialSales: 6000.00, unlimitedOrders: 50, unlimitedSales: 4123.00 },
        { date: '2024-12-18', isToday: false, totalOrders: 98, totalSales: 9800.00, newUsers: 25, residentialOrders: 58, residentialSales: 5800.00, unlimitedOrders: 40, unlimitedSales: 4000.00 },
        { date: '2024-12-17', isToday: false, totalOrders: 105, totalSales: 10500.00, newUsers: 28, residentialOrders: 65, residentialSales: 6500.00, unlimitedOrders: 40, unlimitedSales: 4000.00 },
        { date: '2024-12-16', isToday: false, totalOrders: 115, totalSales: 11500.00, newUsers: 35, residentialOrders: 65, residentialSales: 6500.00, unlimitedOrders: 50, unlimitedSales: 5000.00 },
        { date: '2024-12-15', isToday: false, totalOrders: 88, totalSales: 8500.00, newUsers: 18, residentialOrders: 55, residentialSales: 5500.00, unlimitedOrders: 33, unlimitedSales: 3000.00 },
        { date: '2024-12-14', isToday: false, totalOrders: 102, totalSales: 10200.00, newUsers: 28, residentialOrders: 62, residentialSales: 6200.00, unlimitedOrders: 40, unlimitedSales: 4000.00 },
        { date: '2024-12-13', isToday: false, totalOrders: 95, totalSales: 9200.00, newUsers: 25, residentialOrders: 58, residentialSales: 5800.00, unlimitedOrders: 37, unlimitedSales: 3400.00 },
        { date: '2024-12-12', isToday: false, totalOrders: 78, totalSales: 7800.00, newUsers: 20, residentialOrders: 48, residentialSales: 4800.00, unlimitedOrders: 30, unlimitedSales: 3000.00 },
        { date: '2024-12-11', isToday: false, totalOrders: 115, totalSales: 11500.00, newUsers: 32, residentialOrders: 70, residentialSales: 7000.00, unlimitedOrders: 45, unlimitedSales: 4500.00 },
        { date: '2024-12-10', isToday: false, totalOrders: 92, totalSales: 9100.00, newUsers: 24, residentialOrders: 56, residentialSales: 5600.00, unlimitedOrders: 36, unlimitedSales: 3500.00 },
        { date: '2024-12-09', isToday: false, totalOrders: 68, totalSales: 6800.00, newUsers: 15, residentialOrders: 40, residentialSales: 4000.00, unlimitedOrders: 28, unlimitedSales: 2800.00 },
        { date: '2024-12-08', isToday: false, totalOrders: 85, totalSales: 8500.00, newUsers: 22, residentialOrders: 52, residentialSales: 5200.00, unlimitedOrders: 33, unlimitedSales: 3300.00 }
    ],

    // ==================== 动态住宅代理套餐配置 ====================
    residentialPackages: [
        { id: 1, name: '10GB套餐', gb: 10, price: 1.40, total: 14.00, days: 30, createTime: '2024-12-20 14:30', status: 'active' },
        { id: 2, name: '50GB套餐', gb: 50, price: 1.20, total: 60.00, days: 30, createTime: '2024-12-20 14:30', status: 'active' },
        { id: 3, name: '100GB套餐', gb: 100, price: 1.00, total: 100.00, days: 30, createTime: '2024-12-20 14:30', status: 'active' },
        { id: 4, name: '300GB套餐', gb: 300, price: 0.90, total: 270.00, days: 30, createTime: '2024-12-20 14:30', status: 'active' },
        { id: 5, name: '500GB套餐', gb: 500, price: 0.80, total: 400.00, days: 30, createTime: '2024-12-20 14:30', status: 'active' },
        { id: 6, name: '1000GB套餐', gb: 1000, price: 0.70, total: 700.00, days: 30, createTime: '2024-12-20 14:30', status: 'active' }
    ],

    // ==================== 无限量代理套餐配置 ====================
    unlimitedPackages: [
        { id: 1, name: '7 Days', days: 7, basePrice: 810, baseConfig: '200Mbps + 8vCPU/16GiB', cpuUpgrade: 200, bandwidthUpgrade: 500, updateTime: '2024-12-20 14:30', status: 'active' },
        { id: 2, name: '30 Days', days: 30, basePrice: 2250, baseConfig: '200Mbps + 8vCPU/16GiB', cpuUpgrade: 200, bandwidthUpgrade: 500, updateTime: '2024-12-18 10:15', status: 'active' },
        { id: 3, name: '60 Days', days: 60, basePrice: 4050, baseConfig: '200Mbps + 8vCPU/16GiB', cpuUpgrade: 200, bandwidthUpgrade: 500, updateTime: '2024-12-15 09:00', status: 'active' }
    ],

    // ==================== 管理员账户数据 ====================
    admins: [
        { id: 1, username: 'Admin', email: 'admin@proxyadmin.com', password: 'Admin@2024', role: 'super', createTime: '2024-01-01 00:00', status: 'active', isCurrent: true },
        { id: 2, username: 'Support_01', email: 'support01@proxyadmin.com', password: 'Sup01@2024', role: 'normal', createTime: '2024-06-15 10:30', status: 'active', isCurrent: false },
        { id: 3, username: 'Support_02', email: 'support02@proxyadmin.com', password: 'Sup02@2024', role: 'normal', createTime: '2024-08-20 14:00', status: 'disabled', isCurrent: false }
    ]
};

// ==================== 图表模拟数据 ====================
const ChartMockData = {
    // 趋势图数据
    trend: {
        7: { dates: [], sales: [], orders: [], users: [] },
        14: { dates: [], sales: [], orders: [], users: [] },
        30: { dates: [], sales: [], orders: [], users: [] }
    },

    // 销售额饼图数据
    salesPie: {
        7: [{ value: 28500, name: '动态住宅代理' }, { value: 12800, name: '无限量代理' }],
        14: [{ value: 52300, name: '动态住宅代理' }, { value: 24500, name: '无限量代理' }],
        30: [{ value: 85432, name: '动态住宅代理' }, { value: 38024, name: '无限量代理' }]
    },

    // 订单量饼图数据
    ordersPie: {
        7: [{ value: 285, name: '动态住宅代理' }, { value: 98, name: '无限量代理' }],
        14: [{ value: 520, name: '动态住宅代理' }, { value: 186, name: '无限量代理' }],
        30: [{ value: 900, name: '动态住宅代理' }, { value: 334, name: '无限量代理' }]
    },

    // 初始化趋势图数据
    init: function() {
        [7, 14, 30].forEach(days => {
            this.trend[days].dates = this.generateDates(days);
            this.trend[days].sales = this.generateRandomData(days, 5000, days === 30 ? 25000 : 15000);
            this.trend[days].orders = this.generateRandomData(days, 40, days === 30 ? 350 : 150);
            this.trend[days].users = this.generateRandomData(days, 10, days === 30 ? 100 : 60);
        });
    },

    // 生成日期数组
    generateDates: function(days) {
        const dates = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            dates.push((d.getMonth() + 1) + '-' + d.getDate());
        }
        return dates;
    },

    // 生成随机数据
    generateRandomData: function(count, min, max) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }
};

// 初始化图表数据
ChartMockData.init();