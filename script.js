document.getElementById('generateBtn').addEventListener('click', function() {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    const resultArea = document.getElementById('resultArea');
    
    // 清空上次的結果
    resultArea.innerHTML = '';

    // 1. 驗證輸入
    if (!startDateInput || !endDateInput) {
        alert("請選擇開始與結束日期");
        return;
    }

    const start = new Date(startDateInput);
    const end = new Date(endDateInput);

    if (start > end) {
        alert("開始日期不能晚於結束日期");
        return;
    }

    // 2. 獲取使用者勾選的星期 (轉為數字陣列, 0=Sun, 1=Mon...)
    const checkboxes = document.querySelectorAll('input[name="weekday"]:checked');
    const selectedDays = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (selectedDays.length === 0) {
        alert("請至少選擇一個星期");
        return;
    }

    // 3. 定義星期名稱對照表 (對應 0-6)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 4. 迴圈遍歷日期
    // 為了避免時區問題導致日期偏移，我們將時間設為中午 12:00
    let current = new Date(start);
    current.setHours(12, 0, 0, 0); 
    
    // 結束日期也設為中午以確保比較正確
    const endCompare = new Date(end);
    endCompare.setHours(12, 0, 0, 0);

    while (current <= endCompare) {
        const dayIndex = current.getDay(); // 0-6

        // 檢查當天是否為勾選的星期
        if (selectedDays.includes(dayIndex)) {
            // 格式化日期
            const dayName = dayNames[dayIndex]; // e.g., Sat
            const dateNum = current.getDate();  // e.g., 17
            const monthNum = current.getMonth() + 1; // e.g., 1 (JS月份是0-11，所以要+1)
            
            // 組合顯示字串: e.g., 17/1
            const dateStr = `${dateNum}/${monthNum}`;

            // 創建 Excel 格子 HTML
            const cell = document.createElement('div');
            cell.className = 'excel-cell';
            cell.innerHTML = `
                <span class="day-name">${dayName}</span>
                <span class="date-text">${dateStr}</span>
            `;

            resultArea.appendChild(cell);
        }

        // 加一天
        current.setDate(current.getDate() + 1);
    }

    // 如果沒有結果
    if (resultArea.children.length === 0) {
        resultArea.innerHTML = '<div style="padding:20px; width:100%;">在此日期範圍內找不到符合的星期。</div>';
    }
});