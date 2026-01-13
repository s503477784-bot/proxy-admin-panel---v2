/**
 * 仪表盘模块
 */
const Dashboard = {
    /**
     * 更新数据卡片
     */
    updateCardData: async function(selectEl, type) {
        const period = selectEl.value;
        
        try {
            // 调用API获取数据
            const result = await ApiService.getDashboardStats(type, period);
            
            if (!result.success || !result.data) {
                console.error('获取仪表盘数据失败');
                return;
            }
            
            const data = result.data;
            const card = document.getElementById('card-' + type);
            if (!card) return;
            
            const valueEl = card.querySelector('.card-value');
            const labelEl = card.querySelector('.period-label');
            const trendEl = card.querySelector('[class^="trend"]');
            
            if (valueEl) valueEl.innerText = data.value;
            if (labelEl) labelEl.innerText = data.label;
            if (trendEl) {
                if (data.trend) {
                    trendEl.innerText = data.trend;
                    trendEl.className = data.trendClass;
                    trendEl.style.display = 'inline';
                } else {
                    trendEl.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('更新卡片数据失败:', error);
        }
    },

    /**
     * 切换趋势图时间段
     */
    changeTrendPeriod: function(el, days) {
        document.querySelectorAll('#trendTimeTabs span').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
        
        if (typeof Charts !== 'undefined') {
            Charts.updateTrend(days);
        }
    },
    
    /**
     * 获取钱包余额
     */
    loadWalletBalance: async function() {
        try {
            const result = await ApiService.getWalletBalance();
            
            if (result.success && result.data) {
                // 更新钱包余额显示
                const walletCard = document.querySelector('.data-card:last-child .card-value');
                if (walletCard) {
                    walletCard.innerText = Helpers.formatMoney(result.data.balance);
                }
            }
        } catch (error) {
            console.error('获取钱包余额失败:', error);
        }
    },

    /**
     * 初始化
     */
    init: function() {
        // 加载钱包余额
        this.loadWalletBalance();
    }
};

// 全局函数
function updateCardData(selectEl, type) { Dashboard.updateCardData(selectEl, type); }
function changeTrendPeriod(el, days) { Dashboard.changeTrendPeriod(el, days); }