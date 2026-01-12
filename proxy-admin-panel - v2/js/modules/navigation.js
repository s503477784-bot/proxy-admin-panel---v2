/**
 * 导航与页面切换模块
 */
const Navigation = {
    currentTab: 'dashboard',

    /**
     * 切换页面标签
     */
    switchTab: function(tabId) {
        this.currentTab = tabId;
        
        // 切换菜单激活状态
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        document.getElementById('nav-' + tabId).classList.add('active');
        
        // 切换视图显示
        document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId + '-view').classList.add('active');

        // 如果是仪表盘页面，重新渲染图表
        if (tabId === 'dashboard') {
            setTimeout(() => {
                if (typeof Charts !== 'undefined') {
                    Charts.resize();
                }
            }, 100);
        }
    },

    /**
     * 初始化
     */
    init: function() {
        // 默认显示仪表盘
        this.switchTab('dashboard');
    }
};

// 全局函数
function switchTab(tabId) {
    Navigation.switchTab(tabId);
}