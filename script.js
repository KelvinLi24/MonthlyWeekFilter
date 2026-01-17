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
const resetBtn = document.getElementById('resetBtn'); // 新增
const resultArea = document.getElementById('resultArea');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

// 初始化
renderCheckboxes(parseInt(weekStartSelect.value));

weekStartSelect.addEventListener('change', function() {
    renderCheckboxes(parseInt(this.value));
});

function renderCheckboxes(startDay) {
    // 這裡會清空舊的並生成新的 checkbox (預設是不勾選狀態)
    weekdayContainer.innerHTML = '';
    let orderedDays = [];
    if (startDay === 1) {
        const monToSat = allWeekdays.filter(d => d.val !== 0);
        const sun = allWeekdays.find(d => d.val === 0);
        orderedDays = [...monToSat, sun];
    } else {
        orderedDays = [...allWeekdays];
    }

    orderedDays.forEach(day => {
        const label = document.createElement('label');
        // 注意：這裡生成的 checkbox 預設沒有 checked 屬性
        label.innerHTML = `<input type="checkbox" name="weekday" value="${day.val}"> ${day.label}`;
        weekdayContainer.appendChild(label);
    });
}

// --- 重設功能 (新增部分) ---
resetBtn.addEventListener('click', function() {
    // 1. 清空結果區
    resultArea.innerHTML = '';
    
    // 2. 清空日期輸入
    startDateInput.value = '';
    endDateInput.value = '';
    
    // 3. 恢復下拉選單到預設值 (Monday Start)
    weekStartSelect.value = "1";
    
    // 4. 重新渲染複選框 (這會自動清除所有勾選狀態並排回 Monday Start 順序)
    renderCheckboxes(1);
});

// --- 生成功能 ---
generateBtn.addEventListener('click', function() {
    resultArea.innerHTML = '';

    if (!startDateInput.value || !endDateInput.value) {
        alert("請選擇開始與結束日期");
        return;
    }

    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);

    if (start > end) {
        alert("開始日期不能晚於結束日期");
        return;
    }

    const checkboxes = document.querySelectorAll('input[name="weekday"]:checked');
    const selectedDays = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (selectedDays.length === 0) {
        alert("請至少選擇一個星期");
        return;
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekStartDay = parseInt(weekStartSelect.value);

    let current = new Date(start);
    current.setHours(12, 0, 0, 0);
    const endCompare = new Date(end);
    endCompare.setHours(12, 0, 0, 0);

    let weekCount = 1;
    let currentWeekSection = null;
    let currentWeekGrid = null;

    function createNewWeek(count) {
        const section = document.createElement('div');
        section.className = 'week-section';
        const header = document.createElement('div');
        header.className = 'week-header';
        header.innerText = `Week ${count}:`;
        section.appendChild(header);
        const grid = document.createElement('div');
        grid.className = 'week-grid';
        section.appendChild(grid);
        resultArea.appendChild(section);
        return { section, grid };
    }

    let weekObj = createNewWeek(weekCount);
    currentWeekGrid = weekObj.grid;

    let isFirstDay = true;

    while (current <= endCompare) {
        const dayIndex = current.getDay();

        if (dayIndex === weekStartDay && !isFirstDay) {
            weekCount++;
            weekObj = createNewWeek(weekCount);
            currentWeekGrid = weekObj.grid;
        }

        if (selectedDays.includes(dayIndex)) {
            const dayName = dayNames[dayIndex];
            const dateNum = current.getDate();
            const monthNum = current.getMonth() + 1;
            const dateStr = `${dateNum}/${monthNum}`;

            const cell = document.createElement('div');
            cell.className = 'excel-cell';
            
            if (dayIndex === 0 || dayIndex === 6) {
                cell.style.backgroundColor = "#fff9f9";
                cell.style.color = "#d93025";
            }

            cell.innerHTML = `
                <span class="day-name">${dayName}</span>
                <span class="date-text">${dateStr}</span>
            `;

            currentWeekGrid.appendChild(cell);
        }

        current.setDate(current.getDate() + 1);
        isFirstDay = false;
    }

    const allSections = document.querySelectorAll('.week-section');
    allSections.forEach(sec => {
        const grid = sec.querySelector('.week-grid');
        if (grid.children.length === 0) {
            sec.remove();
        }
    });

    if (resultArea.children.length === 0) {
        resultArea.innerHTML = '<div style="padding:20px;">在此日期範圍內找不到符合的星期。</div>';
    }
});