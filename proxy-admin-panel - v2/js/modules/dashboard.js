/**
 * 仪表盘模块
 */
const Dashboard = {
    /**
     * 更新数据卡片
     */
    updateCardData: function(selectEl, type) {
        const period = selectEl.value;
        const data = MockData.cardData[type]?.[period];
        if (!data) return;
        
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
     * 初始化
     */
    init: function() {
        // 绑定复选框事件
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', function() {
                if (typeof Charts !== 'undefined') {
                    Charts.toggleSeries(index, this.checked);
                }
            });
        });
    }
};

// 全局函数
function updateCardData(selectEl, type) { Dashboard.updateCardData(selectEl, type); }
function changeTrendPeriod(el, days) { Dashboard.changeTrendPeriod(el, days); }