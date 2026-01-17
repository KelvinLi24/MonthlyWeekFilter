// 定義所有星期的資料 (JS中 0=Sun, 1=Mon, ..., 6=Sat)
const allWeekdays = [
    { val: 0, label: "Sun (日)" },
    { val: 1, label: "Mon (一)" },
    { val: 2, label: "Tue (二)" },
    { val: 3, label: "Wed (三)" },
    { val: 4, label: "Thu (四)" },
    { val: 5, label: "Fri (五)" },
    { val: 6, label: "Sat (六)" }
];

const weekStartSelect = document.getElementById('weekStartSelect');
const weekdayContainer = document.getElementById('weekdayContainer');
const generateBtn = document.getElementById('generateBtn');
const resultArea = document.getElementById('resultArea');

// 初始化：頁面載入時先渲染一次
renderCheckboxes(parseInt(weekStartSelect.value));

// 監聽：當使用者改變「週起始日」時，重新排列複選框
weekStartSelect.addEventListener('change', function() {
    renderCheckboxes(parseInt(this.value));
});

// 函數：渲染複選框
function renderCheckboxes(startDay) {
    weekdayContainer.innerHTML = ''; // 清空現有選項
    
    // 決定順序
    let orderedDays = [];
    if (startDay === 1) {
        // 週一開始: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
        // 陣列過濾：先拿 1-6，再拿 0
        const monToSat = allWeekdays.filter(d => d.val !== 0);
        const sun = allWeekdays.find(d => d.val === 0);
        orderedDays = [...monToSat, sun];
    } else {
        // 週日開始: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
        // 原本的順序就是 0-6，直接用即可 (因為 allWeekdays[0] 就是 Sun)
        orderedDays = [...allWeekdays];
    }

    // 建立 HTML
    orderedDays.forEach(day => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" name="weekday" value="${day.val}"> ${day.label}`;
        weekdayContainer.appendChild(label);
    });
}

// 主功能：生成日期
generateBtn.addEventListener('click', function() {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    
    resultArea.innerHTML = '';

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

    // 獲取使用者勾選的星期
    const checkboxes = document.querySelectorAll('input[name="weekday"]:checked');
    const selectedDays = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (selectedDays.length === 0) {
        alert("請至少選擇一個星期");
        return;
    }

    // 為了顯示用，建立一個簡單的查找表
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let current = new Date(start);
    // 設定時間為中午，避免時區導致日期跳動
    current.setHours(12, 0, 0, 0);
    
    const endCompare = new Date(end);
    endCompare.setHours(12, 0, 0, 0);

    while (current <= endCompare) {
        const dayIndex = current.getDay(); // 0-6

        if (selectedDays.includes(dayIndex)) {
            const dayName = dayNames[dayIndex];
            const dateNum = current.getDate();
            const monthNum = current.getMonth() + 1;
            const dateStr = `${dateNum}/${monthNum}`;

            const cell = document.createElement('div');
            cell.className = 'excel-cell';
            // 根據是否為週末給予不同顏色樣式 (可選)
            if (dayIndex === 0 || dayIndex === 6) {
                cell.style.backgroundColor = "#fff9f9"; // 週末微微泛紅
                cell.style.color = "#d93025";
            }
            
            cell.innerHTML = `
                <span class="day-name">${dayName}</span>
                <span class="date-text">${dateStr}</span>
            `;

            resultArea.appendChild(cell);
        }
        current.setDate(current.getDate() + 1);
    }

    if (resultArea.children.length === 0) {
        resultArea.innerHTML = '<div style="padding:20px;">在此日期範圍內找不到符合的星期。</div>';
    }
});