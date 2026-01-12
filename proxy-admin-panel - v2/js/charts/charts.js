/**
 * ECharts图表模块
 */
const Charts = {
    // 图表实例
    trendChart: null,
    salesPieChart: null,
    ordersPieChart: null,

    // 当前选中的系列
    currentSeries: {
        sales: true,
        orders: true,
        users: true
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
                        res += '<div style="margin:4px 0;">' + item.marker + ' ' + item.seriesName + ': <strong>' + val + '</strong></div>';
                    });
                    return res;
                }
            },
            legend: {
                data: ['总销售额', '总订单量', '总注册用户'],
                bottom: 0,
                textStyle: { color: '#666' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '12%',
                top: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.dates,
                axisLine: { lineStyle: { color: '#e5e5e5' } },
                axisLabel: { color: '#999' }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '金额 (元)',
                    position: 'left',
                    nameTextStyle: { color: '#999' },
                    axisLabel: { color: '#999' },
                    splitLine: { lineStyle: { type: 'dashed', color: '#e5e5e5' } }
                },
                {
                    type: 'value',
                    name: '数量',
                    position: 'right',
                    nameTextStyle: { color: '#999' },
                    axisLabel: { color: '#999' },
                    splitLine: { show: false }
                }
            ],
            series: [
                {
                    name: '总销售额',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    itemStyle: { color: '#1890ff' },
                    areaStyle: { color: 'rgba(24,144,255,0.1)' },
                    data: data.sales
                },
                {
                    name: '总订单量',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    itemStyle: { color: '#52c41a' },
                    data: data.orders
                },
                {
                    name: '总注册用户',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    itemStyle: { color: '#fa8c16' },
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
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                data: [
                    { value: pieData[0].value, name: pieData[0].name, itemStyle: { color: '#1890ff' } },
                    { value: pieData[1].value, name: pieData[1].name, itemStyle: { color: '#52c41a' } }
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
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 3
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function(params) {
                        return params.name + '\n' + params.value + '单\n(' + params.percent.toFixed(1) + '%)';
                    },
                    fontSize: 12,
                    color: '#333'
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                data: [
                    { value: pieData[0].value, name: pieData[0].name, itemStyle: { color: '#1890ff' } },
                    { value: pieData[1].value, name: pieData[1].name, itemStyle: { color: '#52c41a' } }
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
     * 切换系列显示
     */
    toggleSeries: function(index, checked) {
        const seriesNames = ['sales', 'orders', 'users'];
        const legendNames = ['总销售额', '总订单量', '总注册用户'];
        this.currentSeries[seriesNames[index]] = checked;
        
        if (this.trendChart) {
            this.trendChart.dispatchAction({
                type: checked ? 'legendSelect' : 'legendUnSelect',
                name: legendNames[index]
            });
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

// 窗口大小改变时重绘图表
window.addEventListener('resize', function() {
    Charts.resize();
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