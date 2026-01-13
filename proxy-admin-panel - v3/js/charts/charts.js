/**
 * ECharts图表模块
 */
const Charts = {
    // 图表实例
    trendChart: null,
    salesPieChart: null,
    ordersPieChart: null,

    // 颜色配置 (集中管理)
    colors: {
        sales: '#1890ff',
        orders: '#52c41a',
        users: '#fa8c16'
    },

    // 当前选中的系列状态 (用于保持切换时间段时的状态一致)
    currentSeries: {
        '总销售额': true,
        '总订单量': true,
        '总注册用户': true
    },

    /**
     * 初始化所有图表
     */
    init: function() {
        this.initTrendChart(30);
        this.initSalesPieChart(30);
        this.initOrdersPieChart(30);
    },

    /**
     * 初始化趋势折线图
     */
    initTrendChart: function(days) {
        const chartDom = document.getElementById('trendChart');
        if (!chartDom) return;
        
        if (!this.trendChart) {
            this.trendChart = echarts.init(chartDom);
        }
        
        const data = ChartMockData.trend[days];
        
        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderColor: '#e5e5e5',
                borderWidth: 1,
                textStyle: { color: '#333' },
                formatter: function(params) {
                    let res = '<div style="font-weight:bold;margin-bottom:8px;">' + params[0].name + '</div>';
                    params.forEach(item => {
                        let val = item.value;
                        if (item.seriesName === '总销售额') {
                            val = '¥' + val.toLocaleString();
                        } else if (item.seriesName === '总订单量') {
                            val += ' 单';
                        } else {
                            val += ' 人';
                        }
                        // 仅显示有数据的系列 tooltip
                        if (item.value !== undefined) {
                             res += '<div style="margin:4px 0;">' + item.marker + ' ' + item.seriesName + ': <strong>' + val + '</strong></div>';
                        }
                    });
                    return res;
                }
            },
            // [修复Bug] 这里将当前的状态应用到图表中
            legend: {
                show: false, // 隐藏原生图例
                selected: this.currentSeries // 关键：读取当前保存的选中状态
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '5%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.dates,
                axisLine: { show: true, lineStyle: { color: '#e5e5e5' } },
                axisLabel: { color: '#999' }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额 (元)',
                    position: 'left',
                    alignTicks: true,
                    nameTextStyle: { color: '#999', padding: [0, 0, 0, 20] },
                    axisLabel: { color: '#999' },
                    axisLine: { show: true, lineStyle: { color: '#e5e5e5' } },
                    // 左轴网格线
                    splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f0f0f0' } },
                    min: 0
                },
                {
                    type: 'value',
                    name: '数量',
                    position: 'right',
                    alignTicks: true,
                    nameTextStyle: { color: '#999', padding: [0, 20, 0, 0] },
                    axisLabel: { color: '#999' },
                    axisLine: { show: true, lineStyle: { color: '#e5e5e5' } },
                    // 右轴网格线 (防止背景消失)
                    splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f0f0f0' } }, 
                    min: 0
                }
            ],
            series: [
                {
                    name: '总销售额',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: this.colors.sales }, // 使用变量
                    areaStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(24,144,255,0.3)' },
                            { offset: 1, color: 'rgba(24,144,255,0.02)' }
                        ])
                    },
                    data: data.sales
                },
                {
                    name: '总订单量',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: this.colors.orders }, // 使用变量
                    data: data.orders
                },
                {
                    name: '总注册用户',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: this.colors.users }, // 使用变量
                    data: data.users
                }
            ]
        };
        
        this.trendChart.setOption(option, true);
    },

    /**
     * 初始化销售额饼图
     */
    initSalesPieChart: function(days) {
        const chartDom = document.getElementById('salesPieChart');
        if (!chartDom) return;
        
        if (!this.salesPieChart) {
            this.salesPieChart = echarts.init(chartDom);
        }
        
        const pieData = ChartMockData.salesPie[days];
        const _this = this; // 保存引用
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: ¥{c} ({d}%)'
            },
            series: [{
                name: '销售额构成',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '50%'],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 3
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function(params) {
                        return params.name + '\n¥' + params.value.toLocaleString() + '\n(' + params.percent.toFixed(1) + '%)';
                    },
                    fontSize: 12,
                    color: '#333'
                },
                labelLine: { show: true, length: 15, length2: 10 },
                data: [
                    { value: pieData[0].value, name: pieData[0].name, itemStyle: { color: _this.colors.sales } },
                    { value: pieData[1].value, name: pieData[1].name, itemStyle: { color: _this.colors.orders } }
                ]
            }]
        };
        
        this.salesPieChart.setOption(option, true);
    },

    /**
     * 初始化订单量饼图
     */
    initOrdersPieChart: function(days) {
        const chartDom = document.getElementById('ordersPieChart');
        if (!chartDom) return;
        
        if (!this.ordersPieChart) {
            this.ordersPieChart = echarts.init(chartDom);
        }
        
        const pieData = ChartMockData.ordersPie[days];
        const _this = this;
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}单 ({d}%)'
            },
            series: [{
                name: '订单量构成',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '50%'],
                itemStyle: { borderColor: '#fff', borderWidth: 3 },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function(params) {
                        return params.name + '\n' + params.value + '单\n(' + params.percent.toFixed(1) + '%)';
                    },
                    fontSize: 12,
                    color: '#333'
                },
                labelLine: { show: true, length: 15, length2: 10 },
                data: [
                    { value: pieData[0].value, name: pieData[0].name, itemStyle: { color: _this.colors.sales } },
                    { value: pieData[1].value, name: pieData[1].name, itemStyle: { color: _this.colors.orders } }
                ]
            }]
        };
        
        this.ordersPieChart.setOption(option, true);
    },

    /**
     * 更新趋势图
     */
    updateTrend: function(days) {
        this.initTrendChart(days);
    },

    /**
     * 切换系列显示 (已修复状态同步问题)
     */
    toggleSeries: function(index, checked) {
        const seriesNames = ['总销售额', '总订单量', '总注册用户'];
        const name = seriesNames[index];
        
        // [修复Bug] 更新内部状态记录
        this.currentSeries[name] = checked;
        
        // 更新图表显示
        if (this.trendChart) {
            this.trendChart.dispatchAction({
                type: checked ? 'legendSelect' : 'legendUnSelect',
                name: name
            });
        }
        
        // 更新按钮UI样式
        const inputs = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
        if (inputs[index]) {
            const label = inputs[index].parentElement;
            if (checked) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        }
    },

    /**
     * 重新调整图表尺寸
     */
    resize: function() {
        if (this.trendChart) this.trendChart.resize();
        if (this.salesPieChart) this.salesPieChart.resize();
        if (this.ordersPieChart) this.ordersPieChart.resize();
    }
};

// 窗口大小改变时重绘图表 (添加了防抖优化，性能更好)
window.addEventListener('resize', function() {
    if (Helpers && Helpers.debounce) {
        Helpers.debounce(function() { Charts.resize(); }, 200)();
    } else {
        Charts.resize();
    }
});

// 全局函数 - 销售额饼图时间段切换
function changeSalesPiePeriod(el, days) {
    document.querySelectorAll('#salesPieTabs span').forEach(function(s) {
        s.classList.remove('active');
    });
    el.classList.add('active');
    Charts.initSalesPieChart(days);
}

// 全局函数 - 订单量饼图时间段切换
function changeOrdersPiePeriod(el, days) {
    document.querySelectorAll('#ordersPieTabs span').forEach(function(s) {
        s.classList.remove('active');
    });
    el.classList.add('active');
    Charts.initOrdersPieChart(days);
}