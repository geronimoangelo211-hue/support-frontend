console.log("%cSTOP!", "color: red; font-size: 50px; font-weight: bold; font-family: sans-serif; text-shadow: 2px 2px 0 #000;");
console.log("%cBawal ka dito panget", "color: white; background: red; font-size: 16px; padding: 5px 10px; border-radius: 5px;");

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5NWblcfFNB3_IaTWwV5JtNC6_bF_yKTJynQg0DaB1R6aqv97ps8PjZT63Z32bvjA/exec";
const _0x2fa9a7=_0x4f8d;function _0x4bd3(){const _0x1f549f=['https://su','18vHIYot','776392Xswqni','96819geORhM','513813vrczOm','pport-back','1791356xjUtIy','nrender.co','m/api','226025AEmOFc','1550840Oxfldb','end-ldos.o','1601336LJhNlC','30FoVJRF','2sKiQhg'];_0x4bd3=function(){return _0x1f549f;};return _0x4bd3();}function _0x4f8d(_0x54d66a,_0x3b44fc){_0x54d66a=_0x54d66a-(0xf4*0x10+0x4d8+-0x1276);const _0x3223a8=_0x4bd3();let _0x48ccf8=_0x3223a8[_0x54d66a];return _0x48ccf8;}(function(_0x173bde,_0xc02fef){const _0x441190=_0x4f8d,_0xddaf85=_0x173bde();while(!![]){try{const _0x4ac0be=-parseInt(_0x441190(0x1aa))/(-0x4*0x1c1+-0x1021+0x1726)+parseInt(_0x441190(0x1a6))/(0x1f0d+-0x4*0xe5+-0x4f*0x59)*(-parseInt(_0x441190(0x1ab))/(-0x5*0x569+0xd*0x4e+0x171a*0x1))+parseInt(_0x441190(0x1a9))/(-0xab*0x8+-0x1*0xd39+0x1295)+parseInt(_0x441190(0x1b0))/(-0x4d7+-0xcb*0x2f+-0xf*-0x2cf)*(-parseInt(_0x441190(0x1a5))/(0x4*0x814+0x7*0x26+-0x2154))+parseInt(_0x441190(0x1ad))/(0x7bb*-0x2+0x1811+-0x12*0x7a)+-parseInt(_0x441190(0x1a4))/(0x23a1+-0x2175*-0x1+-0x450e)*(-parseInt(_0x441190(0x1a8))/(-0x2330+0x15f3+0xd46))+-parseInt(_0x441190(0x1a2))/(-0x42c+0x2131*-0x1+0x2567);if(_0x4ac0be===_0xc02fef)break;else _0xddaf85['push'](_0xddaf85['shift']());}catch(_0x713fe){_0xddaf85['push'](_0xddaf85['shift']());}}}(_0x4bd3,0xd86d+-0x41a44+0x6538c));const API_BASE_URL=_0x2fa9a7(0x1a7)+_0x2fa9a7(0x1ac)+_0x2fa9a7(0x1a3)+_0x2fa9a7(0x1ae)+_0x2fa9a7(0x1af);

let globalTimeOffset = 0;
let globalDayOverride = "";
let adminMathAns = 0; 
let pendingTimeOutStudent = null;
let pendingTimeOutAction = null;
let pendingTimeOutDate = null;
let settingsClickCount = 0; 
let pendingExemptId = null;
let pendingExemptDate = null;
let pendingExemptCheckbox = null;
let isSyncing = false;
let isBackendLocked = false; 

setInterval(async () => {
    await pullFromCloud(); 
    await checkBackendLockStatus(); 
    checkDeviceLock(); 

    if (isAuthenticated()) {
        if (typeof sendHeartbeat === 'function') await sendHeartbeat(); 
        
        autoRestoreServerData();

        if (document.getElementById('admin-dashboard-view').classList.contains('active')) {
            renderStudents();
            renderSchedule();
            renderDashboardSummary();
            renderLogs();
            renderMainDashboard();
            renderDutyToday();
            
            if (document.getElementById('sec-settings').classList.contains('active')) {
                fetchAdminAccounts(); 
            }
            
            const secHist = document.getElementById('sec-history');
            if (secHist && secHist.classList.contains('active')) {
                if (document.getElementById('history-table-container').style.display === 'none') {
                    renderHistoryView();
                }
            }
        }
    }
}, 15000);

const isAuthenticated = function() {
    const tk = sessionStorage.getItem('_auth_tkn_x92');
    if(!tk) return false;
    try {
        const parsed = JSON.parse(atob(tk));
        return parsed.valid === true && (Date.now() - parsed.timestamp < 12 * 60 * 60 * 1000); 
    } catch(e) {
        return false;
    }
};

function applyVisitorMode() {
    let tk = sessionStorage.getItem('_auth_tkn_x92');
    if (!tk) return;
    
    let userRole = 'ADMIN';
    try { 
        userRole = JSON.parse(atob(tk)).role || 'ADMIN'; 
    } catch(e) {}

    if (userRole === 'VISITOR') {
        document.querySelectorAll('.remove-btn, .history-trash-btn, button[onclick^="openEditStudentModal"], .admin-edit-icon').forEach(btn => {
            btn.style.display = 'none';
        });

        const createStudentBtn = document.querySelector('button[onclick="createStudent()"]');
        if (createStudentBtn) createStudentBtn.style.display = 'none';

        const sheetBtn = document.getElementById('history-sheet-btn');
        const exportBtn = document.getElementById('history-export-btn');
        if (sheetBtn) sheetBtn.style.display = 'none';
        if (exportBtn) exportBtn.style.display = 'none';

        const exemptAllBtn = document.getElementById('history-exempt-all-btn');
        if (exemptAllBtn) exemptAllBtn.style.display = 'none';
        
        document.querySelectorAll('input[onchange^="toggleExempt"]').forEach(chk => {
            chk.disabled = true;
            chk.style.cursor = 'not-allowed';
        });

        document.querySelectorAll('.day-toggle').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = 'none'; 
        });

        const createDateCardBtn = document.querySelector('button[onclick="createManualHistoryDate()"]');
        if (createDateCardBtn) createDateCardBtn.style.display = 'none';

        const settingsSection = document.getElementById('sec-settings');
        if (settingsSection) {
            settingsSection.querySelectorAll('button').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.3';
                btn.style.cursor = 'not-allowed';
            });
            settingsSection.querySelectorAll('input[type="checkbox"]').forEach(chk => {
                chk.disabled = true;
                chk.style.cursor = 'not-allowed';
            });
        }
    }
}

async function checkBackendLockStatus() {
    let config;
    try {
        config = JSON.parse(localStorage.getItem('sys_config') || '{"locked":false}');
    } catch(e) {
        config = { locked: false };
    }
    isBackendLocked = config.locked;
}

async function toggleAttendanceState(checkbox) {
    if(!isAuthenticated()) return;
    let tk = sessionStorage.getItem('_auth_tkn_x92');
    let userRole = 'ADMIN';
    try { userRole = JSON.parse(atob(tk)).role || 'ADMIN'; } catch(e) {}
    
    if (userRole === 'VISITOR') { checkbox.checked = !checkbox.checked; alert("Access Denied."); return; }

    const isLocked = checkbox.checked;
    await directDatabaseUpdate("System Config", () => {
        let config;
        try { config = JSON.parse(localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}'); } 
        catch(e) { config = { locked: false, regOpen: false }; }
        config.locked = isLocked;
        localStorage.setItem('sys_config', JSON.stringify(config));
    });
}

function applyUIRestrictions() {
    applySystemConfig();
}

function promptSyncConflict(studentCount) {
    if (document.getElementById('ghost-sync-modal')) return;

    const modalHtml = `
    <div id="ghost-sync-modal" class="modal-overlay" style="display: flex; z-index: 999999;">
        <div class="modal-content" style="max-width: 400px; text-align: left; border-color: #f59e0b;">
            <h3 style="color: #f59e0b; margin-top: 0; font-size: 1.5rem;">⚠️ Server Restart Detected</h3>
            <p style="color: var(--text-main); font-size: 14px; line-height: 1.5;">The cloud server went to sleep and its memory was cleared. Your device currently has <strong>${studentCount} students</strong> saved locally.</p>
            <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 25px;">If this is old "ghost" data, destroy it. If you want to restore the live system, upload it.</p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="resolveSync('push')" style="background: var(--success); color: #000; font-weight: bold; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">RESTORE CLOUD DATA</button>
                <button onclick="resolveSync('wipe')" style="background: var(--error); color: #fff; font-weight: bold; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">DESTROY LOCAL GHOSTS</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

window.resolveSync = async function(action) {
    document.getElementById('ghost-sync-modal').remove();
    sessionStorage.setItem('sync_conflict_resolved', 'true');
    sessionStorage.setItem('sync_action', action);

    if (action === 'push') {
        await directDatabaseUpdate("Ghost Data Restore", () => { return true; });
        alert('Cloud restored successfully!');
    } else {
        localStorage.setItem('students', JSON.stringify([]));
        localStorage.setItem('attendanceLogs', JSON.stringify([]));
        localStorage.setItem('deletedDates', JSON.stringify([]));
        forceInstantUIRefresh();
        alert('Local ghost data destroyed!');
    }
}

let lastConfigPushTime = 0;

async function pullFromCloud() {
    if (isSyncing) return; 
    isSyncing = true;
    try {
        const response = await fetch(`${API_BASE_URL}/sync/pull?t=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.students && data.students !== "null") localStorage.setItem('students', data.students);
            if (data.logs && data.logs !== "null") localStorage.setItem('attendanceLogs', data.logs);
            if (data.config && data.config !== "{}" && data.config !== "null") {
                localStorage.setItem('sys_config', data.config);
                applySystemConfig();
            }
            if (document.getElementById('admin-dashboard-view').classList.contains('active')) {
                forceInstantUIRefresh();
            }
        }
    } catch (e) {} finally {
        isSyncing = false;
    }
}

async function pushDataToCloud() {
    lastDataPushTime = Date.now();
    const studentsData = localStorage.getItem('students') || "[]";
    const logsData = localStorage.getItem('attendanceLogs') || "[]";
    const configData = localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}';
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); 
        await fetch(`${API_BASE_URL}/sync/push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: studentsData, logs: logsData, config: configData }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
    } catch (e) {}
}

let lastDataPushTime = 0;

async function directDatabaseUpdate(actionName, modifierCallback) {
    showLoadingOverlay(`Syncing ${actionName}...`);
    try {
        // 1. FORCE ABSOLUTE LATEST DATA FROM DB FIRST
        const timestamp = Date.now();
        const [studentsRes, logsRes, configRes] = await Promise.all([
            fetch(`${API_BASE_URL}/students?t=${timestamp}`, { cache: 'no-store' }).catch(() => null),
            fetch(`${API_BASE_URL}/logs?t=${timestamp}`, { cache: 'no-store' }).catch(() => null),
            fetch(`${API_BASE_URL}/config/status?t=${timestamp}`, { cache: 'no-store' }).catch(() => null)
        ]);

        if (studentsRes && studentsRes.ok) localStorage.setItem('students', JSON.stringify(await studentsRes.json()));
        if (logsRes && logsRes.ok) localStorage.setItem('attendanceLogs', JSON.stringify(await logsRes.json()));
        if (configRes && configRes.ok) {
            const configData = await configRes.json();
            let localConfig = JSON.parse(localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}');
            localConfig.locked = configData.isLocked;
            localStorage.setItem('sys_config', JSON.stringify(localConfig));
            applySystemConfig();
        }

        // 2. APPLY YOUR SPECIFIC EDIT LOCALLY TO THE FRESH DATA
        const shouldPush = modifierCallback();
        if (shouldPush === false) { 
            hideLoadingOverlay(); 
            return; 
        }

        // 3. PUSH THE UPDATED, SYNCED DATA BACK
        const studentsData = localStorage.getItem('students') || "[]";
        const logsData = localStorage.getItem('attendanceLogs') || "[]";
        const configData = localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); 
        const pushRes = await fetch(`${API_BASE_URL}/sync/push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: studentsData, logs: logsData, config: configData }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!pushRes.ok) throw new Error("Database rejected update.");
        
        lastDataPushTime = Date.now();
        forceInstantUIRefresh();
    } catch (e) {
        console.error(e);
        alert(`Network Error: ${actionName} failed. Please try again.`);
    } finally {
        hideLoadingOverlay();
    }
}

function getShiftDateDetails() {
    let now = new Date();
    let simSettings = null;

    try {
        const simStr = localStorage.getItem('dev_sim_settings');
        if (simStr) simSettings = JSON.parse(simStr);
    } catch(e) {}

    if (simSettings && simSettings.active) {
        if (simSettings.date && simSettings.time) {
            now = new Date(`${simSettings.date}T${simSettings.time}`);
        } else if (simSettings.date) {
            const timeString = now.toTimeString().split(' ')[0];
            now = new Date(`${simSettings.date}T${timeString}`);
        } else if (simSettings.time) {
            const dateString = now.toISOString().split('T')[0];
            now = new Date(`${dateString}T${simSettings.time}`);
        }
    }

    // --- SHIFT ROLLOVER LOGIC (4:01 AM) ---
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    let shiftDateObj = new Date(now.getTime());
    // If it is between 12:00 AM (0) and 4:00 AM, subtract 1 day.
    if (hours < 4 || (hours === 4 && minutes === 0)) {
        shiftDateObj.setDate(shiftDateObj.getDate() - 1);
    }

    const optionsDate = { timeZone: 'Asia/Manila', year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateStr = shiftDateObj.toLocaleDateString('en-US', optionsDate);

    const optionsTime = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const realTimeStr = now.toLocaleTimeString('en-US', optionsTime);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayStr = dayNames[shiftDateObj.getDay()];

    if (simSettings && simSettings.active && simSettings.day) {
        dayStr = simSettings.day;
    }

    return { 
        dateStr, 
        realTimeStr, 
        dayStr, 
        nowObj: now, 
        shiftObj: shiftDateObj, 
        isSimulated: !!simSettings 
    };
}

function getCurrentTimeWindow() {
    const shift = getShiftDateDetails();
    const hrs = shift.nowObj.getHours();
    const mins = shift.nowObj.getMinutes();
    let totalMins = (hrs * 60) + mins; 

    if (totalMins <= 240) { 
        totalMins += 1440; 
    }

    if (totalMins >= 241 && totalMins <= 299) return "TOO_EARLY";
    
    if (totalMins >= 300 && totalMins <= 480) return "TIME_IN_NORMAL";
    
    if (totalMins >= 481 && totalMins <= 720) return "TIME_IN_LATE";
    
    if (totalMins >= 721 && totalMins <= 1019) return "LOCKOUT";
    
    if (totalMins >= 1020 && totalMins <= 1439) return "TIME_OUT_NORMAL";
    
    if (totalMins >= 1440 && totalMins <= 1680) return "TIME_OUT_LATE";

    return "UNKNOWN";
}

const ACCENT_COLORS = {
    'Red': { hex: '#ef4444', rgb: '239, 68, 68' },
    'Yellow': { hex: '#f59e0b', rgb: '245, 158, 11' },
    'Green': { hex: '#22c55e', rgb: '34, 197, 94' },
    'Blue': { hex: '#66fcf1', rgb: '102, 252, 241' },
    'Pink': { hex: '#ec4899', rgb: '236, 72, 153' },
    'Purple': { hex: '#a855f7', rgb: '168, 85, 247' },
    'White': { hex: '#ffffff', rgb: '255, 255, 255' }
};

if (!localStorage.getItem('students')) localStorage.setItem('students', JSON.stringify([]));
if (!localStorage.getItem('attendanceLogs')) localStorage.setItem('attendanceLogs', JSON.stringify([]));
if (!localStorage.getItem('deletedDates')) localStorage.setItem('deletedDates', JSON.stringify([]));

let _studentsInit = JSON.parse(localStorage.getItem('students')) || [];
let _needsSave = false;
_studentsInit.forEach(s => {
    if (s.assignedDay !== undefined) {
        s.assignedDays = s.assignedDay === 'Unassigned' ? [] : [s.assignedDay];
        delete s.assignedDay;
        _needsSave = true;
    }
    if (!s.assignedDays) { s.assignedDays = []; _needsSave = true; }
    if (!s.gcHandle) { s.gcHandle = ''; _needsSave = true; }
    if (!s.classLevel) { s.classLevel = 'Freshmen'; _needsSave = true; }
});

if (_needsSave) {
    localStorage.setItem('students', JSON.stringify(_studentsInit));
}

document.addEventListener('DOMContentLoaded', () => {
    loadAccentColor();
    document.body.classList.add('portal-mode');

    updateDailyMascot();

    checkBackendLockStatus().then(() => {
        applyUIRestrictions();
        initDevUI();
    });
    
    setTimeout(initSliderCaptcha, 50);

    checkServerStatus();

    isIncognito().then(isPrivate => {
        if (isPrivate) {
            const form = document.getElementById('turn-in-form');
            const locked = document.getElementById('locked-screen');
            const incognito = document.getElementById('incognito-screen');
            const sysLock = document.getElementById('student-lock-overlay');
            
            if(form) form.style.display = 'none';
            if(locked) locked.style.display = 'none';
            if(sysLock) sysLock.style.display = 'none';
            if(incognito) incognito.style.display = 'flex'; 
        }
    });

    generateAdminCaptcha();

    const adminCanvas = document.getElementById('admin-captcha-canvas');
    if (adminCanvas) adminCanvas.addEventListener('click', generateAdminCaptcha);

    const thumb = document.getElementById('studentSliderThumb');
    if (thumb) {
        thumb.addEventListener('mousedown', onDragStart);
        thumb.addEventListener('touchstart', onDragStart, {passive: true});
        window.addEventListener('mousemove', onDragMove, {passive: false});
        window.addEventListener('touchmove', onDragMove, {passive: false});
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchend', onDragEnd);
    }

    const refreshBtn = document.getElementById('studentRefreshCaptcha');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if(!isCaptchaSolved) initSliderCaptcha();
        });
    }

    if (isAuthenticated()) {
        switchView('admin-dashboard-view');
        const savedSec = sessionStorage.getItem('currentAdminSec') || 'sec-dashboard';
        const navItems = document.querySelectorAll('.admin-nav-item');
        let targetNav = navItems[0];
        navItems.forEach(item => {
            if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(savedSec)) {
                targetNav = item;
            }
        });
        switchAdminSection(savedSec, targetNav);
    }

    pullFromCloud().then(() => {
        checkDeviceLock(); 
        if (document.getElementById('admin-dashboard-view').classList.contains('active')) {
            renderStudents();
            renderLogs();
            renderMainDashboard();
            renderDutyToday();
            renderSchedule();
        }
    });
});

async function loginAdmin(event) {
    if (event) event.preventDefault();
    const usernameInput = document.getElementById('admin-user').value;
    const passwordInput = document.getElementById('admin-pass').value;
    const captchaInput = document.getElementById('admin-captcha-input').value;
    const errorMsg = document.getElementById('login-message');
    
    const loginBtn = document.querySelector('#admin-login-view .btn-primary');

    if (!captchaInput || captchaInput !== currentAdminCaptchaString) {
        errorMsg.textContent = "Security check failed. Please enter the correct text.";
        errorMsg.style.display = 'block';
        generateAdminCaptcha(); 
        return;
    }

    loginBtn.textContent = "AUTHENTICATING...";
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.7";

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        
        const textResponse = await response.text();
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (err) {
            throw new Error("Server returned an HTML error page.");
        }

        if (data.success) {
            const userRole = data.role || 'ADMIN'; 
            const tokenPayload = btoa(JSON.stringify({ valid: true, timestamp: Date.now(), role: userRole, username: usernameInput }));
            sessionStorage.setItem('_auth_tkn_x92', tokenPayload);
            
            sessionStorage.setItem('adminSessionToken', data.sessionToken); 
            
            switchView('admin-dashboard-view');
            
            document.getElementById('admin-user').value = '';
            document.getElementById('admin-pass').value = '';
            document.getElementById('admin-captcha-input').value = '';
            errorMsg.textContent = '';
            
            await pullFromCloud();
            fetchAdminAccounts();
            renderStudents();
            renderLogs(); 
            renderMainDashboard();
            renderSchedule();
            renderDutyToday();
        } else {
            errorMsg.textContent = data.message || "Invalid credentials.";
            errorMsg.style.display = 'block';
            generateAdminCaptcha(); 
        }
    } catch (error) {
        errorMsg.textContent = "Server error. Please try again.";
        errorMsg.style.display = 'block';
    } finally {
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
        loginBtn.style.opacity = "1";
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('_auth_tkn_x92');
    sessionStorage.removeItem('currentAdminSec');
    sessionStorage.removeItem('adminLoggedIn'); 
    sessionStorage.removeItem('adminSessionToken');
    switchView('student-view');
}

function generateAdminMathCaptcha() {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    adminMathAns = n1 + n2;
    const qEl = document.getElementById('admin-math-q');
    if (qEl) qEl.textContent = `${n1} + ${n2}`;
    const aEl = document.getElementById('admin-math-a');
    if (aEl) aEl.value = '';
}

async function createAdminAccount() {
    const user = document.getElementById('new-admin-user').value.trim();
    const pass = document.getElementById('new-admin-pass').value;
    const role = document.getElementById('new-admin-role').value;
    const mathQ = document.getElementById('admin-math-q').textContent; 
    const mathAInput = document.getElementById('admin-math-a').value;
    const msg = document.getElementById('acc-message');

    if (!user || !pass) {
        msg.textContent = "Username and Password are required.";
        msg.className = "message error";
        return;
    }

    if (mathAInput === "") {
        msg.textContent = "Please answer the security math check.";
        msg.className = "message error";
        return;
    }

    const parts = mathQ.split('+');
    const expected = parseInt(parts[0].trim()) + parseInt(parts[1].trim());

    if (parseInt(mathAInput) !== expected) {
        msg.textContent = "Security math check failed.";
        msg.className = "message error";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/add-account`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Admin-Key': sessionStorage.getItem('adminSessionToken')
            },
            body: JSON.stringify({ username: user, password: pass, role: role })
        });

        const data = await response.json();
        if (response.ok) {
            msg.textContent = "Account created successfully!";
            msg.className = "message success";
            
            document.getElementById('new-admin-user').value = '';
            document.getElementById('new-admin-pass').value = '';
            document.getElementById('admin-math-a').value = '';

            let backup = JSON.parse(localStorage.getItem('cloud_accounts_backup')) || [];
            backup = backup.filter(a => a.username !== user); 
            backup.push({ username: user, password: pass, role: role });
            localStorage.setItem('cloud_accounts_backup', JSON.stringify(backup));
            
            await pushLogsToCloud(); 
            
            fetchAdminAccounts();
        } else {
            msg.textContent = data.message || "Failed to create account.";
            msg.className = "message error";
        }
    } catch (err) {
        msg.textContent = "Server connection error.";
        msg.className = "message error";
    }
}

async function fetchAdminAccounts() {
    if(!isAuthenticated()) return;
    const list = document.getElementById('admin-accounts-list');
    if (!list) return;
    list.innerHTML = '<li style="padding: 10px; text-align: center;">Loading accounts...</li>';

    const token = sessionStorage.getItem('adminSessionToken');

    try {
        const response = await fetch(`${API_BASE_URL}/accounts`, { 
            cache: 'no-store',
            headers: {
                'X-Admin-Key': token 
            }
        });
        
        if (!response.ok) throw new Error("Unauthorized");
        
        const data = await response.json();
        list.innerHTML = '';
        data.forEach(account => {
            const user = account.username;
            const role = account.role || 'ADMIN';
            const lastOnlineText = timeSinceEpoch(account.lastOnline);

            const li = document.createElement('li');
            li.style.padding = '10px 15px';
            li.style.borderBottom = '1px solid #2d313c';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            
            let delBtn = (user !== 'DEVELOPER') 
                ? `<button onclick="deleteAdminAccount('${user}')" class="remove-btn" style="background: transparent; color: var(--error); border: 1px solid var(--error); padding: 4px 8px; font-size: 10px; cursor: pointer;">DELETE</button>` 
                : `<span style="font-size: 10px; color: var(--text-muted);">DEFAULT</span>`;

            li.innerHTML = `
                <div style="display: flex; flex-direction: column;">
                    <span style="color: var(--text-main); font-weight: bold;">${user} <span style="font-size: 9px; color: var(--text-muted); background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 3px; margin-left: 5px;">${role}</span></span>
                    <span style="font-size: 10px; color: #f59e0b; margin-top: 3px;">Last Online: ${lastOnlineText}</span>
                </div>
                ${delBtn}
            `;
            list.appendChild(li);
        });
        applyVisitorMode();
    } catch (err) {
        list.innerHTML = `<li style="color: var(--error); padding: 10px; text-align: center;">Unable to load accounts.</li>`;
    }
}

function timeSinceEpoch(epochMillis) {
    if (!epochMillis) return "Never logged in";
    const seconds = Math.floor((Date.now() - epochMillis) / 1000);
    
    // Buffer of 60 seconds to ensure the 15-sec heartbeat always says "Just now"
    if (seconds < 60) return "Just now"; 
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " year(s) ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " month(s) ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    
    return Math.floor(seconds) + "s ago";
}

async function deleteAdminAccount(user) {
    if (!confirm(`Are you sure you want to permanently delete the account: ${user}?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/delete-account/${user}`, {
            method: 'DELETE',
            headers: { 'X-Admin-Key': sessionStorage.getItem('adminSessionToken') }
        });

        if (response.ok) {
            let backup = JSON.parse(localStorage.getItem('cloud_accounts_backup')) || [];
            backup = backup.filter(a => a.username !== user);
            localStorage.setItem('cloud_accounts_backup', JSON.stringify(backup));
            try { await pushLogsToCloud(); } catch(e){}

            fetchAdminAccounts();
        } else {
            alert("Failed to delete account.");
        }
    } catch (err) {
        alert("Server connection error.");
    }
}

async function generateRegistrationLink() {
    if(!isAuthenticated()) return;
    try {
        const response = await fetch(`${API_BASE_URL}/register/generate`, { 
            method: 'POST',
            headers: { 'X-Admin-Key': sessionStorage.getItem('adminSessionToken') }
        });
        const data = await response.json();
        const link = `https://os-register.vercel.app/?token=${data.token}`;
        document.getElementById('reg-link-container').style.display = 'block';
        document.getElementById('reg-link-output').value = link;
    } catch (err) {
        alert("Failed to generate link. Server might be offline.");
    }
}

async function safeDatabaseUpdate(actionMessage, updateLogic) {
    showLoadingOverlay(`Syncing ${actionMessage}...`);
    try {
        // 1. STRICT PULL: Force the device to download the absolute latest truth from the database first
        const pullRes = await fetch(`${API_BASE_URL}/sync/pull?t=${Date.now()}`, { cache: 'no-store' });
        if (pullRes.ok) {
            const data = await pullRes.json();
            if (data.students && data.students !== "null") localStorage.setItem('students', data.students);
            if (data.logs && data.logs !== "null") localStorage.setItem('attendanceLogs', data.logs);
            if (data.config && data.config !== "{}" && data.config !== "null") localStorage.setItem('sys_config', data.config);
        } else {
            throw new Error("Could not fetch latest database state.");
        }

        // 2. APPLY EDIT: Run your local change on the freshly downloaded data
        const proceed = updateLogic();
        if (proceed === false) {
            hideLoadingOverlay();
            return;
        }

        // 3. STRICT PUSH: Upload the safely merged data back to the database
        const studentsData = localStorage.getItem('students') || "[]";
        const logsData = localStorage.getItem('attendanceLogs') || "[]";
        const configData = localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}';

        const pushRes = await fetch(`${API_BASE_URL}/sync/push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: studentsData, logs: logsData, config: configData })
        });

        if (!pushRes.ok) throw new Error("Database rejected update.");

        forceInstantUIRefresh();
    } catch (e) {
        console.error(e);
        alert(`Network Error during ${actionMessage}. Please try again.`);
    } finally {
        hideLoadingOverlay();
    }
}

async function pushDataToCloud() {
    lastDataPushTime = Date.now();
    const studentsData = localStorage.getItem('students') || "[]";
    const logsData = localStorage.getItem('attendanceLogs') || "[]";
    const configData = localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}';
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); 
        await fetch(`${API_BASE_URL}/sync/push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students: studentsData, logs: logsData, config: configData }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
    } catch (e) {}
}

async function createStudent() {
    if(!isAuthenticated()) return;
    const nameInput = document.getElementById('new-student-name').value.trim();
    const idInput = document.getElementById('new-student-id').value.trim();
    const classLvl = document.getElementById('new-student-class').value;
    let gcHandle = document.getElementById('new-student-gc').value;
    const selectedDays = Array.from(document.querySelectorAll('.new-stu-day:checked')).map(cb => cb.value);

    if (!nameInput || !idInput || !classLvl || !gcHandle) return;
    if (gcHandle === 'Other') {
        const otherInput = document.getElementById('new-student-gc-other');
        if (otherInput) gcHandle = otherInput.value.trim();
    }

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.find(s => String(s.id) === idInput)) return;
    
    students.push({ name: nameInput, id: idInput, classLevel: classLvl, gcHandle: gcHandle, assignedDays: selectedDays });
    localStorage.setItem('students', JSON.stringify(students));
    pushDataToCloud();
    
    document.getElementById('new-student-name').value = '';
    document.getElementById('new-student-id').value = '';
    document.getElementById('new-student-class').value = '';
    document.getElementById('new-student-gc').value = '';
    document.querySelectorAll('.new-stu-day').forEach(cb => cb.checked = false);
    forceInstantUIRefresh();
}

async function saveStudentEdit() {
    if(!isAuthenticated()) return;
    const origId = document.getElementById('edit-stu-orig-id').value;
    const newName = document.getElementById('edit-stu-name').value.trim();
    const newId = document.getElementById('edit-stu-id').value.trim();
    const newClass = document.getElementById('edit-stu-class').value;
    let newGc = document.getElementById('edit-stu-gc').value;
    if (newGc === 'Other') newGc = document.getElementById('edit-stu-gc-other').value.trim();

    if (!newName || !newId) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];

    if (origId !== newId && students.some(s => String(s.id) === newId)) return;

    const studentIndex = students.findIndex(s => String(s.id) === origId);
    if (studentIndex > -1) {
        students[studentIndex].name = newName;
        students[studentIndex].id = newId;
        students[studentIndex].classLevel = newClass;
        students[studentIndex].gcHandle = newGc; 
    }

    logs.forEach(l => { if (String(l.id) === origId) { l.id = newId; l.name = newName; } });
    
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    closeEditStudentModal();
    forceInstantUIRefresh();
}

async function updateStudentGC() {
    if(!isAuthenticated()) return;
    const idNum = document.getElementById('edit-student-id').value.trim();
    const newGc = document.getElementById('edit-student-gc').value.trim();

    if (!idNum) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(s => String(s.id) === String(idNum));

    if (studentIndex === -1) return;
    
    students[studentIndex].gcHandle = newGc;
    localStorage.setItem('students', JSON.stringify(students));
    pushDataToCloud();
    
    document.getElementById('edit-student-id').value = '';
    document.getElementById('edit-student-gc').value = '';
    forceInstantUIRefresh();
}

async function deleteStudent(idNum) {
    if(!isAuthenticated()) return;
    if (!confirm("Are you sure you want to permanently delete this student?")) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(s => String(s.id) !== String(idNum));
    
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    logs = logs.filter(l => String(l.id) !== String(idNum));
    
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    forceInstantUIRefresh();
}

async function toggleAssignedDay(studentId, dayStr, btnElement) {
    if(!isAuthenticated()) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(s => String(s.id) === String(studentId));
    
    if (studentIndex > -1) {
        if (!students[studentIndex].assignedDays) students[studentIndex].assignedDays = [];
        const hasDay = students[studentIndex].assignedDays.includes(dayStr);
        if (hasDay) {
            students[studentIndex].assignedDays = students[studentIndex].assignedDays.filter(d => d !== dayStr);
            btnElement.classList.remove('active');
        } else {
            students[studentIndex].assignedDays.push(dayStr);
            btnElement.classList.add('active');
        }
        localStorage.setItem('students', JSON.stringify(students));
        pushDataToCloud();
        forceInstantUIRefresh();
    }
}

async function removeStudent(idNum) {
    if(!isAuthenticated()) return;
    if (!confirm(`Are you sure you want to permanently delete student ID ${idNum}?`)) return;

    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(s => String(s.id) !== String(idNum));
    localStorage.setItem('students', JSON.stringify(students));

    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    logs = logs.filter(l => String(l.id) !== String(idNum));
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));

    await pushLogsToCloud();

    renderStudents();
    renderSchedule();
    const dateStr = document.getElementById('history-table-title')?.getAttribute('data-date');
    if (dateStr) renderHistoryTable(dateStr);
    renderMainDashboard();
}

async function updateStudentGC() {
    if(!isAuthenticated()) return;
    const idNum = document.getElementById('edit-student-id').value.trim();
    const newGc = document.getElementById('edit-student-gc').value.trim();

    if (!idNum) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(s => String(s.id) === String(idNum));

    if (studentIndex === -1) return;
    
    students[studentIndex].gcHandle = newGc;
    localStorage.setItem('students', JSON.stringify(students));
    pushDataToCloud();
    
    document.getElementById('edit-student-id').value = '';
    document.getElementById('edit-student-gc').value = '';
    forceInstantUIRefresh();
}

function openEditStudentModal(id) {
    if(!isAuthenticated()) return;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const s = students.find(x => String(x.id) === String(id));
    if (!s) return;
    
    document.getElementById('edit-stu-orig-id').value = s.id;
    document.getElementById('edit-stu-name').value = s.name || '';
    document.getElementById('edit-stu-id').value = s.id;
    
    const gcSelect = document.getElementById('edit-stu-gc');
    const gcOther = document.getElementById('edit-stu-gc-other');
    const classSelect = document.getElementById('edit-stu-class');
    
    gcSelect.value = '';
    gcOther.style.display = 'none';
    gcOther.value = '';
    
    classSelect.value = s.classLevel || 'Freshmen';

    if (s.gcHandle) {
        const optionExists = Array.from(gcSelect.options).some(opt => opt.value === s.gcHandle);
        if (optionExists) {
            gcSelect.value = s.gcHandle;
        } else {
            gcSelect.value = 'Other';
            gcOther.style.display = 'block';
            gcOther.value = s.gcHandle;
        }
    }

    document.getElementById('edit-student-modal').style.display = 'flex';
}

function toggleEditStudentOtherGC(val) {
    const otherInput = document.getElementById('edit-stu-gc-other');
    if (val === 'Other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
}

function closeEditStudentModal() {
    document.getElementById('edit-student-modal').style.display = 'none';
}

async function saveStudentEdit() {
    if(!isAuthenticated()) return;
    const origId = document.getElementById('edit-stu-orig-id').value;
    const newName = document.getElementById('edit-stu-name').value.trim();
    const newId = document.getElementById('edit-stu-id').value.trim();
    const newClass = document.getElementById('edit-stu-class').value;
    let newGc = document.getElementById('edit-stu-gc').value;
    if (newGc === 'Other') newGc = document.getElementById('edit-stu-gc-other').value.trim();

    if (!newName || !newId) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];

    if (origId !== newId && students.some(s => String(s.id) === newId)) return;

    const studentIndex = students.findIndex(s => String(s.id) === origId);
    if (studentIndex > -1) {
        students[studentIndex].name = newName;
        students[studentIndex].id = newId;
        students[studentIndex].classLevel = newClass;
        students[studentIndex].gcHandle = newGc; 
    }

    logs.forEach(l => { if (String(l.id) === origId) { l.id = newId; l.name = newName; } });
    
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    closeEditStudentModal();
    forceInstantUIRefresh();
}

async function deleteStudent(idNum) {
    if(!isAuthenticated()) return;
    if (!confirm("Are you sure you want to permanently delete this student?")) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(s => String(s.id) !== String(idNum));
    
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    logs = logs.filter(l => String(l.id) !== String(idNum));
    
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    forceInstantUIRefresh();
}

async function toggleAssignedDay(studentId, dayStr, btnElement) {
    if(!isAuthenticated()) return;

    await pullFromCloud();
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(s => String(s.id) === String(studentId));
    
    if (studentIndex > -1) {
        if (!students[studentIndex].assignedDays) students[studentIndex].assignedDays = [];
        const hasDay = students[studentIndex].assignedDays.includes(dayStr);
        if (hasDay) {
            students[studentIndex].assignedDays = students[studentIndex].assignedDays.filter(d => d !== dayStr);
            btnElement.classList.remove('active');
        } else {
            students[studentIndex].assignedDays.push(dayStr);
            btnElement.classList.add('active');
        }
        localStorage.setItem('students', JSON.stringify(students));
        pushDataToCloud();
        forceInstantUIRefresh();
    }
}

async function logAttendanceAction(student, action, endOfShiftDetails = null, overrideDateStr = null) {
    if(isBackendLocked) {
        alert("The system is currently locked. Attendance cannot be recorded.");
        throw new Error("System locked");
    }

    const shift = getShiftDateDetails();
    const dateStr = overrideDateStr || shift.dateStr;
    
    const newLog = {
        name: student.name || 'Unknown',
        id: student.id,
        action: action,
        time: shift.realTimeStr,
        date: dateStr,
        details: endOfShiftDetails 
    };

    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    if(logs.some(l => l.id === 'SYS_DELETED_DATE' && l.date === dateStr)) {
        logs = logs.filter(l => !(l.id === 'SYS_DELETED_DATE' && l.date === dateStr));
    }

    const tempLogs = [...logs, newLog];
    const studentsData = localStorage.getItem('students') || "[]";
    const logsData = JSON.stringify(tempLogs);
    const configData = localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); 

    // 1. PUSH TO DATABASE
    const response = await fetch(`${API_BASE_URL}/sync/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: studentsData, logs: logsData, config: configData }),
        signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Server rejected the database insertion.");

    // 🟢 2. THE DOUBLE CHECK (Verification)
    const verifyRes = await fetch(`${API_BASE_URL}/sync/pull?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });

    if (!verifyRes.ok) throw new Error("Could not verify database entry.");
    
    const verifyData = await verifyRes.json();
    const serverLogs = JSON.parse(verifyData.logs || "[]");

    // Physically check the database
    const isActuallySaved = serverLogs.some(l => 
        String(l.id) === String(student.id) && 
        l.date === dateStr && 
        l.action === action
    );

    if (!isActuallySaved) {
        throw new Error("Verification failed: The database dropped the data.");
    }

    // 🟢 3. ONLY ON VERIFIED SUCCESS: Update UI
    localStorage.setItem('attendanceLogs', verifyData.logs); // Overwrite with DB truth
    lastDataPushTime = Date.now();
    forceInstantUIRefresh();
}

async function deleteLog(idNum, dateStr) {
    if(!isAuthenticated()) return;
    if (!confirm("Are you sure you want to delete this attendance record?")) return;

    await pullFromCloud();
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    logs = logs.filter(l => !(String(l.id).trim() === String(idNum).trim() && String(l.date).trim() === String(dateStr).trim()));
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    forceInstantUIRefresh();
}

async function deleteHistoryDate(dateStr, event) {
    if(!isAuthenticated()) return;
    if (event) event.stopPropagation(); 
    
    if(confirm(`⚠️ WARNING ⚠️\n\nAre you sure you want to completely delete ALL attendance logs for ${dateStr}?`)) {
        await pullFromCloud();
        let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
        logs = logs.filter(l => l.date !== dateStr);
        logs.push({ name: 'SYSTEM_DELETED', id: 'SYS_DELETED_DATE', action: 'DELETED', time: '00:00 AM', date: dateStr, details: null });
        localStorage.setItem('attendanceLogs', JSON.stringify(logs));
        pushDataToCloud();
        forceInstantUIRefresh();
        
        const titleEl = document.getElementById('history-table-title');
        if (titleEl && titleEl.textContent.includes(dateStr)) {
            document.getElementById('history-table-container').style.display = 'none';
        }
    }
}

function toggleExempt(idNum, dateStr, checkbox) {
    if(!isAuthenticated()) return;
    if (checkbox.checked) {
        pendingExemptId = idNum;
        pendingExemptDate = dateStr;
        pendingExemptCheckbox = checkbox;
        const modal = document.getElementById('exempt-modal');
        if (modal) modal.style.display = 'flex';
    } else {
        removeExemptions(idNum, dateStr);
    }
}

function closeExemptModal() {
    const modal = document.getElementById('exempt-modal');
    if (modal) modal.style.display = 'none';
    if (pendingExemptCheckbox) pendingExemptCheckbox.checked = false;
    pendingExemptId = null;
    pendingExemptDate = null;
    pendingExemptCheckbox = null;
}

async function applyExempt(type) {
    if(!isAuthenticated()) return;

    await pullFromCloud();
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const s = students.find(x => String(x.id) === String(pendingExemptId));
    
    if (s) {
        const existingInLog = logs.find(l => String(l.id) === String(pendingExemptId) && l.date === pendingExemptDate && l.action.includes('Time In') && !l.action.includes('Exempted'));
        const existingOutLog = logs.find(l => String(l.id) === String(pendingExemptId) && l.date === pendingExemptDate && l.action.includes('Time Out') && !l.action.includes('Exempted'));

        if (type === 'IN' || type === 'BOTH') {
            logs = logs.filter(l => !(String(l.id) === String(pendingExemptId) && l.date === pendingExemptDate && l.action.includes('Time In')));
            logs.push({ name: s.name, id: s.id, action: 'Time In (Exempted)', time: 'Exempted', date: pendingExemptDate, details: null, originalLog: existingInLog || null });
        }
        if (type === 'OUT' || type === 'BOTH') {
            logs = logs.filter(l => !(String(l.id) === String(pendingExemptId) && l.date === pendingExemptDate && l.action.includes('Time Out')));
            logs.push({ name: s.name, id: s.id, action: 'Time Out (Exempted)', time: 'Exempted', date: pendingExemptDate, details: { gcHandle: '-', announcement: '-', whoPosted: '-' }, originalLog: existingOutLog || null });
        }
        localStorage.setItem('attendanceLogs', JSON.stringify(logs));
        pushDataToCloud();
    }

    const modal = document.getElementById('exempt-modal');
    if (modal) modal.style.display = 'none';
    pendingExemptId = null; pendingExemptDate = null; pendingExemptCheckbox = null;
    forceInstantUIRefresh();
}

async function removeExemptions(idNum, dateStr) {
    if(!isAuthenticated()) return;

    await pullFromCloud();
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const exemptLogs = logs.filter(l => String(l.id) === String(idNum) && l.date === dateStr && l.action.includes('Exempted'));
    logs = logs.filter(l => !(String(l.id) === String(idNum) && l.date === dateStr && l.action.includes('Exempted')));
    
    exemptLogs.forEach(el => { if (el.originalLog) logs.push(el.originalLog); });
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    forceInstantUIRefresh();
}

async function exemptAllForDate(dateStr) {
    if(!isAuthenticated()) return;
    const verificationText = prompt(`⚠️ WARNING ⚠️\n\nThis will mark EVERYONE on ${dateStr} as Exempted.\n\nTo confirm, type exactly:\nExempt Everyone`);
    
    if (verificationText === "Exempt Everyone") {
        await pullFromCloud();
        let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const targetDateObj = new Date(dateStr);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const targetDayStr = dayNames[targetDateObj.getDay()];
        
        const scheduledStudents = students.filter(s => s.assignedDays && s.assignedDays.includes(targetDayStr) && s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');

        scheduledStudents.forEach(s => {
            const idNum = s.id;
            const existingInLog = logs.find(l => String(l.id) === String(idNum) && l.date === dateStr && l.action.includes('Time In') && !l.action.includes('Exempted'));
            const existingOutLog = logs.find(l => String(l.id) === String(idNum) && l.date === dateStr && l.action.includes('Time Out') && !l.action.includes('Exempted'));

            logs = logs.filter(l => !(String(l.id) === String(idNum) && l.date === dateStr));
            logs.push({ name: s.name, id: s.id, action: 'Time In (Exempted)', time: 'Exempted', date: dateStr, details: null, originalLog: existingInLog || null });
            logs.push({ name: s.name, id: s.id, action: 'Time Out (Exempted)', time: 'Exempted', date: dateStr, details: { gcHandle: '-', announcement: '-', whoPosted: '-' }, originalLog: existingOutLog || null });
        });
        localStorage.setItem('attendanceLogs', JSON.stringify(logs));
        pushDataToCloud();
        forceInstantUIRefresh();
    }
}

async function createManualHistoryDate() {
    if(!isAuthenticated()) return;
    const dateInput = prompt("Enter the date for the new History Card (e.g., 5/4/2026):");
    if (!dateInput || dateInput.trim() === "") return;

    let dateStr;
    try {
        const parsed = new Date(dateInput.trim());
        if(isNaN(parsed)) throw new Error("");
        dateStr = parsed.toLocaleDateString('en-US'); 
    } catch(e) { return; }

    await pullFromCloud();
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const isTombstoned = logs.some(l => l.id === 'SYS_DELETED_DATE' && l.date === dateStr);
    const hasActualLogs = logs.some(l => l.date === dateStr && l.id !== 'SYS_DELETED_DATE');

    if (hasActualLogs && !isTombstoned) return;

    logs = logs.filter(l => !(l.id === 'SYS_DELETED_DATE' && l.date === dateStr));
    logs.push({ name: 'SYSTEM_INIT', id: 'SYS_INIT_DATE', action: 'INIT', time: '00:00 AM', date: dateStr, details: null });
    
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    forceInstantUIRefresh();
}

async function devClearLogs() {
    if(!isAuthenticated()) return;
    if(confirm("This will permanently delete ALL attendance logs from the cloud database ACROSS ALL DEVICES. Continue?")) {
        localStorage.setItem('attendanceLogs', JSON.stringify([]));
        localStorage.setItem('deletedDates', JSON.stringify([])); 
        
        try {
            await fetch(`${API_BASE_URL}/logs/clear`, {
                method: 'DELETE',
                headers: { 'X-Admin-Key': sessionStorage.getItem('adminSessionToken') }
            });
        } catch(e) {}
        
        if (document.getElementById('admin-dashboard-view').classList.contains('active')) {
            renderLogs();
            renderHistoryView();
            renderMainDashboard();
            renderDutyToday();
        }
        showMessage('dev-message', 'All logs cleared globally!', 'success');
    }
}

async function factoryReset() {
    if(!isAuthenticated()) return;
    const firstConfirm = confirm("⚠️ DANGER ⚠️\n\nThis will permanently delete ALL registered students, attendance logs, custom UI settings, and custom Admin accounts ACROSS ALL DEVICES.\n\nAre you absolutely sure you want to do this?");
    
    if (firstConfirm) {
        const verificationText = prompt("To confirm GLOBAL Factory Reset, type exactly:\n\nRESET EVERYTHING");
        
        if (verificationText === "RESET EVERYTHING") {
            
            try {
                await fetch(`${API_BASE_URL}/students/factory-reset`, {
                    method: 'DELETE',
                    headers: { 'X-Admin-Key': sessionStorage.getItem('adminSessionToken') }
                });
                await fetch(`${API_BASE_URL}/logs/factory-reset`, {
                    method: 'DELETE',
                    headers: { 'X-Admin-Key': sessionStorage.getItem('adminSessionToken') }
                });
            } catch(e) {}

            localStorage.clear();
            sessionStorage.clear();
            
            alert("System wiped globally. All other connected devices will automatically erase their data within 15 seconds. The page will now reload.");
            window.location.reload();
            
        } else if (verificationText !== null) {
            alert("Factory Reset canceled. The text did not match exactly.");
        }
    }
}

async function handleTimeIn() {
    if (typeof isServerKnownAwake !== 'undefined' && !isServerKnownAwake) return;

    const btnIn = document.querySelector('.btn-in');
    let animInterval;

    if (btnIn) {
        if (btnIn.disabled) return;
        btnIn.disabled = true;
        btnIn.style.opacity = "0.8";
        let dots = 0;
        animInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            btnIn.textContent = "SAVING" + ".".repeat(dots);
        }, 500);
    }

    const stopAnim = () => {
        if (btnIn) {
            clearInterval(animInterval);
            btnIn.textContent = "Time In";
            btnIn.disabled = false;
            btnIn.style.opacity = "1";
        }
    };

    try {
        await pullFromCloud();
        const idInput = document.getElementById('student-id-input'); 
        const messageEl = document.getElementById('student-message');

        if (!idInput || !messageEl) { stopAnim(); return; }
        const studentId = idInput.value.trim();

        if (!studentId) { messageEl.textContent = "Please enter your Student ID Number."; messageEl.className = "message error"; stopAnim(); return; }

        const timeWindow = getCurrentTimeWindow();
        if (timeWindow === "TOO_EARLY") { messageEl.textContent = "Shift has not started yet. Time In opens at 5:00 AM."; messageEl.className = "message error"; stopAnim(); return; }
        if (timeWindow === "LOCKOUT") { messageEl.textContent = "System Locked. If you missed Time In, you are marked Absent."; messageEl.className = "message error"; stopAnim(); return; }
        if (timeWindow === "TIME_OUT_NORMAL" || timeWindow === "TIME_OUT_LATE") { messageEl.textContent = "Time In is closed for this shift."; messageEl.className = "message error"; stopAnim(); return; }

        let actionStr = "Time In";
        if (timeWindow === "TIME_IN_LATE") actionStr = "Time In (Late)";

        const students = JSON.parse(localStorage.getItem('students')) || [];
        let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
        const shift = getShiftDateDetails();

        const student = students.find(s => String(s.id).toLowerCase() === studentId.toLowerCase());
        
        if (!student) { messageEl.textContent = "Student ID not found. Please register first."; messageEl.className = "message error"; stopAnim(); return; }
        if (!student.assignedDays || !student.assignedDays.includes(shift.dayStr)) { messageEl.textContent = `You are not scheduled for duty today (${shift.dayStr}).`; messageEl.className = "message error"; stopAnim(); return; }

        const alreadyTimedIn = logs.some(l => String(l.id).toLowerCase() === studentId.toLowerCase() && l.date === shift.dateStr && l.action.includes('Time In'));
        if (alreadyTimedIn) { messageEl.textContent = "You have already timed in for this shift."; messageEl.className = "message error"; stopAnim(); return; }

        logs.push({
            name: student.name,
            id: student.id,
            action: actionStr,
            time: shift.realTimeStr,
            date: shift.dateStr,
            details: null
        });

        localStorage.setItem('attendanceLogs', JSON.stringify(logs));
        localStorage.setItem('activeDeviceStudent', student.id);
        
        pushDataToCloud();
        
        messageEl.textContent = `Success: ${student.name} - ${actionStr} at ${shift.realTimeStr}`;
        messageEl.className = "message success";
        idInput.value = ''; 

        checkDeviceLock(); 
        forceInstantUIRefresh();
        stopAnim(); 

    } catch (error) {
        stopAnim(); 
    }
}

function getShiftDateDetails() {
    let now = new Date();
    let simSettings = null;

    try {
        const simStr = localStorage.getItem('dev_sim_settings');
        if (simStr) simSettings = JSON.parse(simStr);
    } catch(e) {}

    let manualDayOverride = null;

    if (simSettings && simSettings.active) {
        if (simSettings.date && simSettings.time) {
            now = new Date(`${simSettings.date}T${simSettings.time}`);
        } else if (simSettings.date) {
            now = new Date(`${simSettings.date}T${now.toTimeString().split(' ')[0]}`);
        } else if (simSettings.time) {
            now = new Date(`${now.toISOString().split('T')[0]}T${simSettings.time}`);
        }
        if (simSettings.day) manualDayOverride = simSettings.day;
    }

    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    let shiftDateObj = new Date(now.getTime());
    let isRollover = false;
    
    if (hours < 4 || (hours === 4 && minutes === 0)) {
        shiftDateObj.setDate(shiftDateObj.getDate() - 1);
        isRollover = true; 
    }

    const optionsDate = { timeZone: 'Asia/Manila', year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateStr = shiftDateObj.toLocaleDateString('en-US', optionsDate);

    const optionsTime = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const realTimeStr = now.toLocaleTimeString('en-US', optionsTime);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayStr = dayNames[shiftDateObj.getDay()];

    if (manualDayOverride && !simSettings.date) {
        let forcedDayIndex = dayNames.indexOf(manualDayOverride);
        if (isRollover) {
            forcedDayIndex -= 1;
            if (forcedDayIndex < 0) forcedDayIndex = 6; 
        }
        dayStr = dayNames[forcedDayIndex];
    } 

    return { 
        dateStr, 
        realTimeStr, 
        dayStr, 
        nowObj: now, 
        shiftObj: shiftDateObj, 
        isSimulated: !!simSettings 
    };
}

async function finalizeTimeOut() {
    if(isBackendLocked) {
        alert("The system is currently locked. Attendance cannot be recorded.");
        return;
    }

    let gcHandle = document.getElementById('gc-handle').value;
    const announcement = document.querySelector('input[name="announcement"]:checked');
    const whoPosted = document.querySelector('input[name="who-posted"]:checked');

    if (gcHandle === 'Other') {
        const otherVal = document.getElementById('gc-handle-other').value.trim();
        if (!otherVal) { showMessage('timeout-modal-message', 'Please type your specific GC Handle.', 'error'); return; }
        gcHandle = otherVal;
    }

    if (!gcHandle || !announcement || !whoPosted) {
        showMessage('timeout-modal-message', 'Please answer all questions before submitting.', 'error');
        return;
    }

    const submitBtn = document.querySelector('#timeout-modal .btn-primary');
    if(submitBtn) {
        submitBtn.textContent = "SAVING...";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
    }

    try {
        await logAttendanceAction(pendingTimeOutStudent, pendingTimeOutAction, {
            gcHandle: gcHandle,
            announcement: announcement.value,
            whoPosted: whoPosted.value
        }, pendingTimeOutDate);

        const modal = document.getElementById('timeout-modal');
        if (modal) modal.style.display = 'none';
        showMessage('student-message', `Successfully logged ${pendingTimeOutAction}`, 'success');

        pendingTimeOutStudent = null;
        pendingTimeOutAction = null;
        pendingTimeOutDate = null;
        
        localStorage.removeItem('activeDeviceStudent');
        
        initSliderCaptcha(); 
        checkDeviceLock(); 
    } finally {
        if(submitBtn) {
            submitBtn.textContent = "Submit & Time Out";
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }
    }
}

function enforceHistoryLimit() {}

function renderStudents() {
    if (!isAuthenticated()) return;
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    const listContainer = document.getElementById('registered-students-list');
    if (!listContainer) return;

    const searchInput = document.getElementById('search-student');
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filterSelect = document.getElementById('filter-sort-students');
    const filterVal = filterSelect ? filterSelect.value : 'ALL';

    let validStudents = students
        .map((s, index) => ({ ...s, originalIndex: index }))
        .filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');

    if (query) {
        validStudents = validStudents.filter(s => 
            (s.name && s.name.toLowerCase().includes(query)) || 
            (s.id && String(s.id).toLowerCase().includes(query))
        );
    }

    if (filterVal === 'UPPER') {
        validStudents = validStudents.filter(s => (s.classLevel || 'UpperClassmen').toLowerCase() !== 'freshmen');
    } else if (filterVal === 'FRESH') {
        validStudents = validStudents.filter(s => (s.classLevel || 'UpperClassmen').toLowerCase() === 'freshmen');
    }

    if (filterVal === 'AZ') {
        validStudents.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (filterVal === 'ZA') {
        validStudents.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (filterVal === 'NEWEST') {
        validStudents.sort((a, b) => b.originalIndex - a.originalIndex); // Largest index first
    } else if (filterVal === 'OLDEST') {
        validStudents.sort((a, b) => a.originalIndex - b.originalIndex); // Smallest index first
    }

    listContainer.innerHTML = '';
    
    if (validStudents.length === 0) {
        listContainer.innerHTML = `<li style="text-align: center; padding: 20px; color: var(--text-muted); font-style: italic;">No students found matching this criteria.</li>`;
        return;
    }

    validStudents.forEach(student => {
        const safeId = String(student.id).replace(/'/g, "\\'");
        const lvl = student.classLevel || 'UpperClassmen';
        const days = student.assignedDays && student.assignedDays.length > 0 ? student.assignedDays.join(', ') : 'None';
        
        const li = document.createElement('li');
        li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px 10px; border-bottom: 1px solid #2d313c; transition: background 0.2s;";
        
        li.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <span style="font-weight: bold; color: var(--text-main); font-size: 14px;">
                    ${student.name || 'Unknown'} 
                    <span style="font-size: 11px; color: var(--text-muted); font-weight: normal; margin-left: 5px;">(${student.id})</span>
                </span>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="background: rgba(102, 252, 241, 0.1); color: var(--accent); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">${lvl}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">Days: ${days}</span>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="admin-edit-icon" onclick="openEditStudentModal('${safeId}')" style="background: transparent; border: 1px solid #f59e0b; color: #f59e0b; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 10px; transition: 0.2s;">EDIT</button>
                <button class="remove-btn" onclick="deleteStudent('${safeId}')" style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--error); color: var(--error); padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 10px; transition: 0.2s;">REMOVE</button>
            </div>
        `;
        listContainer.appendChild(li);
    });

    if (typeof applyVisitorMode === 'function') applyVisitorMode(); 
}

function searchStudents() {
    renderStudents();
}

function changeAccentColor(colorName) {
    const colorData = ACCENT_COLORS[colorName];
    if (colorData) {
        const root = document.documentElement;
        root.style.setProperty('--accent', colorData.hex);
        root.style.setProperty('--accent-rgb', colorData.rgb);
        localStorage.setItem('uiAccentColor', colorName);

        let g1, g2;
        switch(colorName) {
            case 'Red':    g1 = '#2d0a0a'; g2 = '#4a1010'; break;
            case 'Yellow': g1 = '#2d210a'; g2 = '#4a3610'; break;
            case 'Green':  g1 = '#0a2d16'; g2 = '#104a23'; break;
            case 'Blue':   g1 = '#0a282d'; g2 = '#103d4a'; break;
            case 'Pink':   g1 = '#2d0a1f'; g2 = '#4a1033'; break;
            case 'Purple': g1 = '#1a0a2d'; g2 = '#2b104a'; break;
            case 'White':  g1 = '#1e2128'; g2 = '#333a45'; break;
            default:       g1 = '#1a1c23'; g2 = '#2d313c';
        }
        
        root.style.setProperty('--grad-1', g1);
        root.style.setProperty('--grad-2', g2);
        // -----------------------------------------

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.style.outline = 'none';
            btn.style.transform = 'scale(1)';
        });
        const activeBtn = document.getElementById('btn-color-' + colorName.toLowerCase());
        if(activeBtn) {
            activeBtn.style.outline = '2px solid white';
            activeBtn.style.outlineOffset = '2px';
            activeBtn.style.transform = 'scale(1.1)';
        }
    }
}

function loadAccentColor() {
    const savedColor = localStorage.getItem('uiAccentColor') || 'Blue';
    changeAccentColor(savedColor);
}

function togglePortal() {
    const currentView = document.querySelector('.view.active');
    if (!currentView) return;
    if (currentView.id === 'student-view') {
        switchView('admin-login-view');
    } else {
        switchView('student-view');
    }
}

async function switchView(viewId) {
    if (viewId === 'admin-dashboard-view' && !isAuthenticated()) {
        alert("Security Violation: Unauthorized access attempt blocked.");
        logoutAdmin();
        return;
    }

    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    const targetView = document.getElementById(viewId);
    if(targetView) targetView.classList.add('active');
    
    document.querySelectorAll('.message').forEach(msg => msg.textContent = '');
    
    if (viewId === 'student-view') {
        const isPrivate = await isIncognito();
        if (isPrivate) {
            const form = document.getElementById('turn-in-form');
            const locked = document.getElementById('locked-screen');
            const incognito = document.getElementById('incognito-screen');
            const sysLock = document.getElementById('student-lock-overlay');
            
            if(form) form.style.display = 'none';
            if(locked) locked.style.display = 'none';
            if(sysLock) sysLock.style.display = 'none';
            if(incognito) incognito.style.display = 'flex';
        } else {
            const form = document.getElementById('turn-in-form');
            const locked = document.getElementById('locked-screen');
            const incognito = document.getElementById('incognito-screen');
            if(incognito) incognito.style.display = 'none';
            if(form) form.style.display = 'block';
            
            checkDeviceLock(); 
            setTimeout(initSliderCaptcha, 50); 
        }
        checkBackendLockStatus(); 
    } 
    if (viewId === 'admin-login-view' || viewId === 'student-view') {
        checkServerStatus(); 
    }
    
    generateAdminCaptcha();
    
    if (viewId === 'admin-dashboard-view') {
        document.body.classList.remove('portal-mode'); 
        const mh = document.getElementById('main-header');
        const moh = document.getElementById('mobile-header');
        if(mh) mh.style.display = 'none';
        if(moh) moh.style.display = 'none';

        try {
            const tk = sessionStorage.getItem('_auth_tkn_x92');
            if (tk) {
                const parsedTk = JSON.parse(atob(tk));
                const displayUser = document.getElementById('display-username');
                const displayRole = document.getElementById('display-role');
                if (displayUser) displayUser.textContent = parsedTk.username || 'Admin';
                if (displayRole) displayRole.textContent = parsedTk.role === 'VISITOR' ? 'VISITOR' : 'ADMIN';
            }
        } catch(e) {}
        
        enforceHistoryLimit();
        forceInstantUIRefresh(); // Refreshes all active dashboard tabs instantly
        checkBackendLockStatus(); 
    } else {
        document.body.classList.add('portal-mode'); 
        const mh = document.getElementById('main-header');
        const moh = document.getElementById('mobile-header');
        if(mh) mh.style.display = 'flex';
        if(moh) moh.style.display = 'flex';
        
        document.querySelectorAll('.portal-toggle-btn').forEach(btn => {
            btn.textContent = viewId === 'student-view' ? 'Support Head Portal' : 'Student Portal';
        });
    }
}

function openDevPasswordModal() {
    document.getElementById('dev-password-input').value = '';
    document.getElementById('dev-password-message').textContent = '';
    document.getElementById('dev-password-modal').style.display = 'flex';
}

function closeDevPasswordModal() {
    document.getElementById('dev-password-modal').style.display = 'none';
    settingsClickCount = 0; 
}

function verifyDevPassword() {
    const pwd = document.getElementById('dev-password-input').value;
    if (pwd === "PowerSettings@099") {
        document.getElementById('dev-password-modal').style.display = 'none';
        document.getElementById('dev-tools-panel').style.display = 'flex';
        showMessage('dev-message', 'Developer Tools Unlocked.', 'success');
        settingsClickCount = 0;
    } else {
        document.getElementById('dev-password-message').textContent = "Incorrect password.";
    }
}

let settingsClickTimer = null;

function switchAdminSection(sectionId, element) {
    document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    
    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
    const targetSec = document.getElementById(sectionId);
    if (targetSec) targetSec.classList.add('active');

    // 🟢 THIS IS THE MISSING PIECE! Save the current tab to memory 🟢
    sessionStorage.setItem('currentAdminSec', sectionId);

    if (sectionId === 'sec-settings') {
        settingsClickCount++;
        
        clearTimeout(settingsClickTimer);
        settingsClickTimer = setTimeout(() => {
            settingsClickCount = 0;
        }, 2000);

        if (settingsClickCount >= 20) {
            openDevPasswordModal();
            settingsClickCount = 0; 
        }
    } else {
        settingsClickCount = 0; 
    }

    if (sectionId === 'sec-dashboard') {
        renderDashboardSummary();
    } else if (sectionId === 'sec-attendance') {
        if (document.getElementById('tab-btn-summary') && document.getElementById('tab-btn-summary').classList.contains('active')) {
            renderAttendanceSummary();
        } else {
            renderLogs();
        }
        renderDutyToday();
    } else if (sectionId === 'sec-data') {
        renderStudents();
    } else if (sectionId === 'sec-schedule') {
        renderSchedule();
    } else if (sectionId === 'sec-history') {
        renderHistoryView();
    } else if (sectionId === 'sec-performance') {     
        renderPerfStudentList();
    } else if (sectionId === 'sec-settings') {
        fetchAdminAccounts();
        applySystemConfig();
    }
}

function switchAttendanceTab(tab) {
    document.querySelectorAll('.sr-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('tab-btn-' + tab).classList.add('active');
    
    const sortDropdown = document.getElementById('sort-attendance-global');

    if (tab === 'summary') {
        document.getElementById('att-pane-summary').style.display = 'flex';
        document.getElementById('att-pane-logs').style.display = 'none';
        if (sortDropdown) sortDropdown.style.display = 'block'; 
        renderAttendanceSummary();
    } else {
        document.getElementById('att-pane-summary').style.display = 'none';
        document.getElementById('att-pane-logs').style.display = 'flex';
        if (sortDropdown) sortDropdown.style.display = 'none'; 
        renderLogs();
    }
}

function handleGlobalSearch() {
    const attPane = document.getElementById('att-pane-summary');
    
    if (attPane && attPane.style.display !== 'none') {
        renderAttendanceSummary(); 
    } else {
        renderLogs();
    }
}

function renderLogs() {
    if(!isAuthenticated()) return;
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const tbody = document.getElementById('attendance-logs-body');
    
    const searchInput = document.getElementById('search-attendance-global');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    if (!tbody) return;
    tbody.innerHTML = '';
    
    const shift = getShiftDateDetails();
    const todayStr = shift.dateStr;
    const currentDay = shift.dayStr;
    
    let logsWithIndex = logs.map((log, index) => ({ ...log, originalIndex: index }));

    let filteredLogs = logsWithIndex.filter(log => {
        if (log.id === 'SYS_WIPE_ALL' || log.id === 'SYS_WIPE_LOGS') return false;
        
        const student = validStudents.find(s => String(s.id) === String(log.id));
        const isScheduledToday = student && student.assignedDays && student.assignedDays.includes(currentDay);
        
        return log.date === todayStr &&
               isScheduledToday &&
               ((log.name || '').toLowerCase().includes(query) || String(log.id).toLowerCase().includes(query));
    });

    filteredLogs.sort((a, b) => {
        return b.originalIndex - a.originalIndex; 
    });

    if (filteredLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 20px; font-style: italic;">No logs found.</td></tr>`;
        updateLiveAttendanceCounters();
        return;
    }

    filteredLogs.forEach(log => {
        const safeId = String(log.id).replace(/'/g, "\\'");
        const tr = document.createElement('tr');
        
        let statusColor = 'var(--text-main)';
        if (log.action.includes('Late')) statusColor = '#f59e0b'; 
        else if (log.action.includes('In')) statusColor = 'var(--success)';
        else if (log.action.includes('Out')) statusColor = 'var(--error)';
        else if (log.action === 'No Attendance') statusColor = '#6b7280';
        else if (log.action.includes('Exempted')) statusColor = '#66fcf1';

        let todayShiftBtn = '';
        if ((log.action.includes('Out') || log.action.includes('Exempted')) && log.details) {
            todayShiftBtn = `<button onclick="viewTodayShift('${safeId}', '${log.date}')" style="background: rgba(var(--accent-rgb), 0.1); color: var(--accent); padding: 5px 10px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid var(--accent); margin-right: 8px; cursor: pointer;">TODAY SHIFT</button>`;
        }

        tr.innerHTML = `
            <td>${log.name || 'Unknown'}</td>
            <td>${log.id}</td>
            <td style="color: ${statusColor}; font-weight: bold;">${log.action}</td>
            <td>${log.time}</td>
            <td>
                <div class="button-cell-wrap">
                    ${todayShiftBtn}
                    <button class="remove-btn" onclick="deleteLog('${safeId}', '${log.date}')">REMOVE</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updateLiveAttendanceCounters(); 
    applyVisitorMode();
}

function renderDutyToday() {
    if(!isAuthenticated()) return;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const dutyList = document.getElementById('duty-today-list');
    if (!dutyList) return;

    const shift = getShiftDateDetails();
    const currentDay = shift.dayStr;
    const todayStr = shift.dateStr;

    const scheduledToday = validStudents.filter(student => student.assignedDays && student.assignedDays.includes(currentDay));
    scheduledToday.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    dutyList.innerHTML = '';

    if (scheduledToday.length === 0) {
        dutyList.innerHTML = '<p class="placeholder-text" style="text-align:center; padding: 20px;">No one is scheduled for duty today.</p>';
        return;
    }

    scheduledToday.forEach(student => {
        const hasTimedIn = logs.some(l => String(l.id) === String(student.id) && l.date === todayStr && l.action.includes('Time In'));
        const hasTimedOut = logs.some(l => String(l.id) === String(student.id) && l.date === todayStr && l.action.includes('Time Out'));

        let statusDot = '#f59e0b'; 
        if (hasTimedOut) {
            statusDot = '#6b7280'; 
        } else if (hasTimedIn) {
            statusDot = '#22c55e'; 
        } else {
            statusDot = 'var(--error)'; 
        }

        const card = document.createElement('div');
        card.className = 'duty-card';
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${statusDot}; flex-shrink: 0;"></div>
                <strong style="color: var(--text-main); font-size: 13px;">${student.name || 'Unknown'}</strong>
            </div>
            <span style="font-size: 11px; color: var(--text-muted);">${student.gcHandle || ''}</span>
        `;
        dutyList.appendChild(card);
    });
}

function exportToExcel(dateStr = null) {
    if(!isAuthenticated()) return;
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const shift = getShiftDateDetails();
    const targetDate = dateStr || shift.dateStr;
    const targetLogs = logs.filter(l => l.date === targetDate);

    const targetDateObj = new Date(targetDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayStr = dayNames[targetDateObj.getDay()];

    const data = [
        ["NAME", "ID NUMBER", "GROUP", "TIME IN", "TIME OUT", "DATE", "GC HANDLE", "ANNOUNCEMENT", "POSTED BY"]
    ];

    const sortedStudents = [...validStudents].sort((a, b) => {
        const classA = (a.classLevel || 'zzzz').toLowerCase().trim();
        const classB = (b.classLevel || 'zzzz').toLowerCase().trim();
        const nameA = (a.name || '').toLowerCase().trim();
        const nameB = (b.name || '').toLowerCase().trim();

        if (classA === 'upperclassmen' && classB !== 'upperclassmen') return -1;
        if (classA !== 'upperclassmen' && classB === 'upperclassmen') return 1;
        
        return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
    });

    sortedStudents.forEach(student => {
        const studentLogs = targetLogs.filter(l => String(l.id) === String(student.id));
        
        let isScheduled = student.assignedDays && student.assignedDays.includes(targetDayStr);
        if (studentLogs.some(l => l.action.includes('Time In') || l.action.includes('Time Out') || l.action === 'No Attendance')) {
            isScheduled = true;
        }

        let inText = isScheduled ? 'Absent' : 'No Duty Today';
        let outText = isScheduled ? 'Absent' : 'No Duty Today';
        let gc = '-';
        let ann = '-';
        let post = '-';

        if (studentLogs.length > 0) {
            const timeInLog = studentLogs.find(l => l.action.includes('Time In'));
            const timeOutLog = studentLogs.find(l => l.action.includes('Time Out'));
            const noAttLog = studentLogs.find(l => l.action === 'No Attendance');
            
            const inExempted = timeInLog && timeInLog.action.includes('Exempted');
            const outExempted = timeOutLog && timeOutLog.action.includes('Exempted');
            const hasAnyExemption = inExempted || outExempted;

            if (noAttLog && !hasAnyExemption) {
                inText = 'Absent';
                outText = 'Absent';
            } else {
                if (inExempted) {
                    inText = 'Exempted';
                } else if (timeInLog) {
                    const status = timeInLog.action.includes('Late') ? 'Time in(Late)' : 'Time in';
                    inText = `${timeInLog.time} - ${status}`;
                } else {
                    inText = 'Absent';
                }

                if (outExempted) {
                    outText = 'Exempted';
                } else if (timeOutLog) {
                    const status = timeOutLog.action.includes('Late') ? 'Time out(Late)' : 'Time out';
                    outText = `${timeOutLog.time} - ${status}`;
                    
                    // FIX: Smart Extraction Logic for Excel
                    const det = timeOutLog.details;
                    if (det) {
                        if (typeof det === 'object') {
                            gc = det.gcHandle || '-';
                            ann = det.announcement || '-';
                            post = det.whoPosted || det.postedBy || '-';
                        } else if (typeof det === 'string') {
                            const gcMatch = det.match(/GC Handle:\s*(.+)/);
                            const annMatch = det.match(/Announcement:\s*(.+)/);
                            const nameMatch = det.match(/Posted By:\s*(.+)/);
                            if (gcMatch) gc = gcMatch[1].trim();
                            if (annMatch) ann = annMatch[1].trim();
                            if (nameMatch) post = nameMatch[1].trim();
                        }
                    }
                } else {
                    outText = 'Absent';
                }
            }
        }

        data.push([student.name || 'Unknown', student.id, student.classLevel || 'Freshmen', inText, outText, targetDate, gc, ann, post]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);

    for (let i = 0; i < 9; i++) {
        const cellRef = XLSX.utils.encode_cell({c:i, r:0});
        if (ws[cellRef]) {
            ws[cellRef].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "334155" } }
            };
        }
    }

    ws['!cols'] = [
        { wpx: 180 }, { wpx: 120 }, { wpx: 120 }, { wpx: 150 }, { wpx: 150 },
        { wpx: 100 }, { wpx: 150 }, { wpx: 120 }, { wpx: 200 } 
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const dateFileName = targetDate.replace(/\//g, '-');
    XLSX.writeFile(wb, `Support_Attendance_${dateFileName}.xlsx`);
}

async function recordToGoogleSheets(dateStr) {
    if(!isAuthenticated()) return;
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const targetLogs = logs.filter(l => l.date === dateStr);

    if (validStudents.length === 0) {
        alert("No registered students found.");
        return;
    }

    const sheetBtn = document.getElementById('history-sheet-btn');
    const originalText = sheetBtn ? sheetBtn.textContent : "Record Today Google Sheets";
    
    if (sheetBtn) {
        sheetBtn.textContent = "SENDING...";
        sheetBtn.disabled = true;
        sheetBtn.style.opacity = "0.5";
    }

    const targetDateObj = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayStr = dayNames[targetDateObj.getDay()];

    const payload = [];
    const sortedStudents = [...validStudents].sort((a, b) => {
        const classA = (a.classLevel || 'zzzz').toLowerCase().trim();
        const classB = (b.classLevel || 'zzzz').toLowerCase().trim();
        const nameA = (a.name || '').toLowerCase().trim();
        const nameB = (b.name || '').toLowerCase().trim();

        if (classA === 'upperclassmen' && classB !== 'upperclassmen') return -1;
        if (classA !== 'upperclassmen' && classB === 'upperclassmen') return 1;
        
        return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
    });

    sortedStudents.forEach(student => {
        const studentLogs = targetLogs.filter(l => String(l.id) === String(student.id));
        
        let isScheduled = student.assignedDays && student.assignedDays.includes(targetDayStr);
        if (studentLogs.some(l => l.action.includes('Time In') || l.action.includes('Time Out') || l.action === 'No Attendance')) {
            isScheduled = true;
        }

        let inText = isScheduled ? 'Absent' : 'No Duty Today';
        let outText = isScheduled ? 'Absent' : 'No Duty Today';
        let gc = '-';
        let ann = '-';
        let post = '-';

        if (studentLogs.length > 0) {
            const timeInLog = studentLogs.find(l => l.action.includes('Time In'));
            const timeOutLog = studentLogs.find(l => l.action.includes('Time Out'));
            const noAttLog = studentLogs.find(l => l.action === 'No Attendance');
            
            const inExempted = timeInLog && timeInLog.action.includes('Exempted');
            const outExempted = timeOutLog && timeOutLog.action.includes('Exempted');
            const hasAnyExemption = inExempted || outExempted;

            if (noAttLog && !hasAnyExemption) {
                inText = 'Absent';
                outText = 'Absent';
            } else {
                if (inExempted) {
                    inText = 'Exempted';
                } else if (timeInLog) {
                    const status = timeInLog.action.includes('Late') ? 'Time in(Late)' : 'Time in';
                    inText = `${timeInLog.time} - ${status}`;
                } else {
                    inText = 'Absent';
                }

                if (outExempted) {
                    outText = 'Exempted';
                } else if (timeOutLog) {
                    const status = timeOutLog.action.includes('Late') ? 'Time out(Late)' : 'Time out';
                    outText = `${timeOutLog.time} - ${status}`;
                    
                    // FIX: Smart Extraction Logic for Google Sheets
                    const det = timeOutLog.details;
                    if (det) {
                        if (typeof det === 'object') {
                            gc = det.gcHandle || '-';
                            ann = det.announcement || '-';
                            post = det.whoPosted || det.postedBy || '-';
                        } else if (typeof det === 'string') {
                            const gcMatch = det.match(/GC Handle:\s*(.+)/);
                            const annMatch = det.match(/Announcement:\s*(.+)/);
                            const nameMatch = det.match(/Posted By:\s*(.+)/);
                            if (gcMatch) gc = gcMatch[1].trim();
                            if (annMatch) ann = annMatch[1].trim();
                            if (nameMatch) post = nameMatch[1].trim();
                        }
                    }
                } else {
                    outText = 'Absent';
                }
            }
        }

        payload.push({
            name: student.name || 'Unknown',
            id: student.id,
            classLevel: student.classLevel || 'Freshmen', 
            timeIn: inText,
            timeOut: outText,
            date: dateStr,
            gcHandle: gc,
            announcement: ann,
            postedBy: post
        });
    });

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            body: JSON.stringify(payload)
        });

        const textResponse = await response.text();
        try {
            const result = JSON.parse(textResponse);
            if (result.success) {
                alert(`Successfully saved fresh logs for ${dateStr} to Google Sheets!`);
            } else {
                alert(`Error from sheet: ${result.error}`);
            }
        } catch(e) {
            alert(`Successfully saved fresh logs for ${dateStr} to Google Sheets!`);
        }
    } catch (error) {
        alert("Network error trying to contact Google Sheets. Please ensure you deployed the New Version in Apps Script.");
    } finally {
        if (sheetBtn) {
            sheetBtn.textContent = originalText;
            sheetBtn.disabled = false;
            sheetBtn.style.opacity = "1";
        }
    }
}

function showMessage(elementId, text, type) {
    const msgElement = document.getElementById(elementId);
    if(msgElement) {
        msgElement.textContent = text;
        msgElement.className = `message ${type}`;
        setTimeout(() => { msgElement.textContent = ''; }, 4000);
    }
}

function getPHT() {
    return new Date(Date.now() + globalTimeOffset);
}

function getPHTDayString() {
    if (globalDayOverride) return globalDayOverride;
    const pht = getPHT();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[pht.getDay()];
}

function getTodayLogs(idNum) {
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const shift = getShiftDateDetails();
    return logs.filter(l => String(l.id) === String(idNum) && l.date === shift.dateStr);
}

function showLockedScreen(message) {
    const form = document.getElementById('turn-in-form');
    const locked = document.getElementById('locked-screen');
    const msg = document.getElementById('locked-message');
    if(form) form.style.display = 'none';
    if(locked) locked.style.display = 'block';
    if(msg) msg.textContent = message;
}

async function resetStudentUI() {
    const isPrivate = await isIncognito();
    if (isPrivate) {
        const form = document.getElementById('turn-in-form');
        const locked = document.getElementById('locked-screen');
        const incognito = document.getElementById('incognito-screen');
        const sysLock = document.getElementById('student-lock-overlay');
        
        if(form) form.style.display = 'none';
        if(locked) locked.style.display = 'none';
        if(sysLock) sysLock.style.display = 'none';
        if(incognito) incognito.style.display = 'flex';
        return;
    }
    
    const form = document.getElementById('turn-in-form');
    const locked = document.getElementById('locked-screen');
    const incognito = document.getElementById('incognito-screen');
    const idInput = document.getElementById('student-id-input');
    const msg = document.getElementById('student-message');
    
    if(form) form.style.display = 'block';
    if(locked) locked.style.display = 'none';
    if(incognito) incognito.style.display = 'none';
    
    if(idInput) idInput.value = '';
    if(msg) msg.textContent = '';
    
    checkDeviceLock();
    initSliderCaptcha();
}

function renderSchedule() {
    if(!isAuthenticated()) return;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const tbody = document.getElementById('schedule-logs-body');
    
    const searchInput = document.getElementById('search-schedule');
    const filterSelect = document.getElementById('filter-schedule');
    const sortSelect = document.getElementById('sort-schedule');
    
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const filterVal = filterSelect ? filterSelect.value : 'ALL';
    const sortVal = sortSelect ? sortSelect.value.toUpperCase() : 'NAME_ASC';

    if (!tbody) return;
    tbody.innerHTML = '';
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayLabels = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
    
    let filteredStudents = validStudents.filter(student => 
        ((student.name || '').toLowerCase().includes(query)) || 
        (student.id && String(student.id).toLowerCase().includes(query)) ||
        ((student.gcHandle || '').toLowerCase().includes(query)) ||
        ((student.classLevel || '').toLowerCase().includes(query))
    );

    if (filterVal === 'UNASSIGNED') {
        filteredStudents = filteredStudents.filter(s => !s.assignedDays || s.assignedDays.length === 0);
    } else if (filterVal === 'ASSIGNED') {
        filteredStudents = filteredStudents.filter(s => s.assignedDays && s.assignedDays.length > 0);
    } else if (filterVal !== 'ALL') {
        filteredStudents = filteredStudents.filter(s => s.assignedDays && s.assignedDays.includes(filterVal));
    }

    filteredStudents.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase().trim();
        const nameB = (b.name || '').toLowerCase().trim();
        const idA = (a.id || '').toString().trim();
        const idB = (b.id || '').toString().trim();
        const classA = (a.classLevel || 'zzzz').toLowerCase().trim();
        const classB = (b.classLevel || 'zzzz').toLowerCase().trim();
        const tagA = (a.gcHandle || 'zzzz').toLowerCase().trim(); 
        const tagB = (b.gcHandle || 'zzzz').toLowerCase().trim();

        if (sortVal === 'NAME_ASC') return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
        if (sortVal === 'NAME_DESC') return nameA > nameB ? -1 : (nameA < nameB ? 1 : 0);
        if (sortVal === 'ID_ASC') return idA.localeCompare(idB, undefined, {numeric: true});
        if (sortVal === 'ID_DESC') return idB.localeCompare(idA, undefined, {numeric: true});
        if (sortVal === 'TAG_ASC') {
            if (tagA === tagB) return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0); 
            return tagA < tagB ? -1 : 1;
        }
        if (sortVal === 'CLASS_FRESH') {
            if (classA === 'freshmen' && classB !== 'freshmen') return -1;
            if (classA !== 'freshmen' && classB === 'freshmen') return 1;
            return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
        }
        if (sortVal === 'CLASS_UPPER') {
            if (classA === 'upperclassmen' && classB !== 'upperclassmen') return -1;
            if (classA !== 'upperclassmen' && classB === 'upperclassmen') return 1;
            return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
        }
        return 0; 
    });

    filteredStudents.forEach(student => {
        const tr = document.createElement('tr');
        const safeId = String(student.id).replace(/'/g, "\\'");
        
        let togglesHtml = days.map((day, index) => {
            const isActive = student.assignedDays && student.assignedDays.includes(day);
            // FIX: Pointing to the correct function name and passing 'this' button element
            return `<button class="day-toggle ${isActive ? 'active' : ''}" onclick="toggleAssignedDay('${safeId}', '${day}', this)">${dayLabels[index]}</button>`;
        }).join('');
        
        let gcTagHtml = student.gcHandle ? `<span class="gc-tag" style="margin: 0 4px 0 0; font-size: 10px; padding: 2px 6px;">${student.gcHandle}</span>` : '<span style="color: var(--text-muted); font-size: 11px; margin-right:4px;">None</span>';
        let classTagHtml = student.classLevel ? `<span class="gc-tag" style="margin: 0 4px 0 0; font-size: 10px; padding: 2px 6px; background: rgba(168, 85, 247, 0.2); color: #a855f7; border-color: #a855f7;">${student.classLevel}</span>` : '';

        tr.innerHTML = `
            <!-- FIX: Added width: 35% and min-width: 250px to stretch the Name column -->
            <td style="white-space: normal; width: 35%; min-width: 250px;"><strong style="color: var(--text-main); font-size: 14px;">${student.name || 'Unknown'}</strong></td>
            <td style="white-space: normal; width: 15%;">${classTagHtml}${gcTagHtml}</td>
            <td style="white-space: normal; color: var(--text-muted); width: 15%;">${student.id}</td>
            <td style="white-space: normal; width: 35%;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                    <div class="day-toggles">
                        ${togglesHtml}
                    </div>
                    <button class="remove-btn" onclick="deleteStudent('${safeId}')" style="padding: 6px 12px; font-size: 10px; flex-shrink: 0;">REMOVE</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    applyVisitorMode();
}

function renderHistoryView() {
    if(!isAuthenticated()) return;
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    
    const exemptAllBtn = document.getElementById('history-exempt-all-btn');
    if (exemptAllBtn) exemptAllBtn.style.display = 'none';

    const logSearchInput = document.getElementById('search-history-logs');
    if (logSearchInput) logSearchInput.value = '';

    const globalDeletedDates = logs.filter(l => l.id === 'SYS_DELETED_DATE').map(l => l.date);
    const validLogs = logs.filter(l => !globalDeletedDates.includes(l.date) && l.id !== 'SYS_WIPE_LOGS' && l.id !== 'SYS_WIPE_ALL');

    let uniqueDates = [...new Set(validLogs.map(l => l.date))];
    uniqueDates.sort((a, b) => new Date(b) - new Date(a)); 

    let displayDates = uniqueDates.slice(0, 12);

    const searchInput = document.getElementById('search-history-date');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    if (query) {
        displayDates = displayDates.filter(d => d.toLowerCase().includes(query));
    }

    const container = document.getElementById('history-cards-container');
    if(!container) return;
    container.innerHTML = '';

    if (displayDates.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No history available yet.</p>';
        const tbl = document.getElementById('history-table-container');
        if(tbl) tbl.style.display = 'none';
        return;
    }

    displayDates.forEach(dateStr => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.onclick = () => renderHistoryTable(dateStr);
        
        card.innerHTML = `
            <strong style="font-size: 1.1rem; color: var(--text-main);">${dateStr}</strong>
            <button onclick="deleteHistoryDate('${dateStr}', event)" class="history-trash-btn">✖</button>
        `;
        container.appendChild(card);
    });
    
    const tbl = document.getElementById('history-table-container');
    if(tbl) tbl.style.display = 'none';
    applyVisitorMode();
}

async function renderHistoryTable(dateStr) {
    if(!isAuthenticated()) return;
    
    let tk = sessionStorage.getItem('_auth_tkn_x92');
    let userRole = 'ADMIN';
    try { userRole = JSON.parse(atob(tk)).role || 'ADMIN'; } catch(e) {}
    
    const container = document.getElementById('history-table-container');
    const title = document.getElementById('history-table-title');
    if(container) container.style.display = 'flex';
    if(title) {
        title.textContent = `Logs for ${dateStr}`;
        title.setAttribute('data-date', dateStr); 
    }
    
    const exportBtn = document.getElementById('history-export-btn');
    if (exportBtn) exportBtn.onclick = () => exportToExcel(dateStr);
    
    const sheetBtn = document.getElementById('history-sheet-btn');
    if (sheetBtn) sheetBtn.onclick = () => recordToGoogleSheets(dateStr);
    
    const exemptAllBtn = document.getElementById('history-exempt-all-btn');
    if (exemptAllBtn) {
        exemptAllBtn.style.display = 'block'; 
        exemptAllBtn.onclick = () => exemptAllForDate(dateStr);
    }
    
    const tbody = document.getElementById('history-logs-body');
    if (!tbody) return;

    const searchInput = document.getElementById('search-history-logs');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    const allLogs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const dayLogs = allLogs.filter(l => l.date === dateStr);

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    
    const targetDateObj = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayStr = dayNames[targetDateObj.getDay()];

    const studentsToRender = validStudents.filter(student => {
        const isScheduled = student.assignedDays && student.assignedDays.includes(targetDayStr);
        const hasLogs = dayLogs.some(l => String(l.id) === String(student.id));
        return isScheduled || hasLogs;
    });

    if (query) {
        const filtered = studentsToRender.filter(s => 
            (s.name || '').toLowerCase().includes(query) || 
            String(s.id).toLowerCase().includes(query)
        );
        studentsToRender.length = 0;
        studentsToRender.push(...filtered);
    }

    studentsToRender.sort((a, b) => {
        const classA = (a.classLevel || 'zzzz').toLowerCase().trim();
        const classB = (b.classLevel || 'zzzz').toLowerCase().trim();
        const nameA = (a.name || '').toLowerCase().trim();
        const nameB = (b.name || '').toLowerCase().trim();

        if (classA === 'upperclassmen' && classB !== 'upperclassmen') return -1;
        if (classA !== 'upperclassmen' && classB === 'upperclassmen') return 1;
        return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
    });

    tbody.innerHTML = '';

    if (studentsToRender.length === 0) {
         tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No records found.</td></tr>';
         return;
    }

    studentsToRender.forEach(student => {
        const id = student.id;
        if (id === 'SYS_DELETED_DATE' || id === 'SYS_CONFIG_X99' || id === 'SYS_WIPE_ALL' || id === 'SYS_WIPE_LOGS' || id === 'SYS_INIT_DATE') return;

        const name = student.name || 'Unknown';
        const studentLogs = dayLogs.filter(l => String(l.id) === String(id));
        
        const timeInLog = studentLogs.find(l => l.action.includes('Time In'));
        const timeOutLog = studentLogs.find(l => l.action.includes('Time Out'));
        const noAttLog = studentLogs.find(l => l.action === 'No Attendance');
        
        const inExempted = timeInLog && timeInLog.action.includes('Exempted');
        const outExempted = timeOutLog && timeOutLog.action.includes('Exempted');
        const hasAnyExemption = inExempted || outExempted;

        let inText = '<span style="color: var(--error);">Absent</span>';
        let outText = '<span style="color: var(--error);">Absent</span>';
        let gc = '-';
        let ann = '-';
        let post = '-';

        if (noAttLog && !hasAnyExemption) {
            inText = '<span style="color: var(--error);">No Attendance</span>';
            outText = '<span style="color: var(--error);">No Attendance</span>';
        } else {
            if (inExempted) {
                inText = '<span style="color: #66fcf1;">Exempted</span>';
            } else if (timeInLog) {
                const color = timeInLog.action.includes('Late') ? '#f59e0b' : 'var(--success)';
                const cleanTime = timeInLog.time.replace('Exempted', '').trim();
                inText = `<span style="color: ${color};">${cleanTime}</span>`;
            }

            if (outExempted) {
                outText = '<span style="color: #66fcf1;">Exempted</span>';
            } else if (timeOutLog) {
                const color = timeOutLog.action.includes('Late') ? '#f59e0b' : 'var(--success)';
                const cleanTime = timeOutLog.time.replace('Exempted', '').trim();
                outText = `<span style="color: ${color};">${cleanTime}</span>`;
                
                // FIX: Smart Extraction Logic for History Table
                const det = timeOutLog.details;
                if (det) {
                    if (typeof det === 'object') {
                        gc = det.gcHandle || '-';
                        ann = det.announcement || '-';
                        post = det.whoPosted || det.postedBy || '-';
                    } else if (typeof det === 'string') {
                        const gcMatch = det.match(/GC Handle:\s*(.+)/);
                        const annMatch = det.match(/Announcement:\s*(.+)/);
                        const nameMatch = det.match(/Posted By:\s*(.+)/);
                        if (gcMatch) gc = gcMatch[1].trim();
                        if (annMatch) ann = annMatch[1].trim();
                        if (nameMatch) post = nameMatch[1].trim();
                    }
                }
            }
        }

        const checkedAttr = hasAnyExemption ? 'checked' : '';
        const editActionHtml = userRole === 'ADMIN' ? `<span onclick="openEditLogModal('${id}', '${dateStr}')" style="cursor: pointer; opacity: 0.8;" class="admin-edit-icon">✏️</span>` : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${name}</td>
            <td>${id}</td>
            <td style="font-weight: bold;">${inText}</td>
            <td style="font-weight: bold;">${outText}</td>
            <td style="color: var(--text-muted);">${gc}</td>
            <td style="color: var(--text-muted);">${ann}</td>
            <td style="color: var(--text-muted);">${post}</td>
            <td style="text-align: center;">${editActionHtml}</td>
            <td style="text-align: center;"><input type="checkbox" onchange="toggleExempt('${id}', '${dateStr}', this)" ${checkedAttr} style="margin: 0 auto; display: block; cursor: pointer;"></td>
        `;
        tbody.appendChild(tr);
    });
    applyVisitorMode();
}

function initDevUI() {}

function applyDevSettings() {
    const dDate = document.getElementById('dev-date').value;
    const dTime = document.getElementById('dev-time').value;
    const dDay = document.getElementById('dev-day').value;

    if (!dDate && !dTime && !dDay) {
        alert("Please select at least one simulated value.");
        return;
    }

    const simSettings = {
        active: true,
        date: dDate || null,
        time: dTime || null,
        day: dDay || null
    };

    localStorage.setItem('dev_sim_settings', JSON.stringify(simSettings));
    
    sessionStorage.removeItem('dev_time_travel');
    sessionStorage.removeItem('dev_sim_date');
    sessionStorage.removeItem('dev_sim_day');

    alert("Time Travel Applied! The system will stay in this time until you click 'Reset Reality'.");
    location.reload(); 
}

function resetDevSettings() {
    try {
        localStorage.setItem('dev_sim_settings', JSON.stringify({ active: false, date: null, time: null, day: null }));
        
        localStorage.removeItem('dev_sim_settings');
        sessionStorage.removeItem('dev_time_travel');
        sessionStorage.removeItem('dev_sim_date');
        sessionStorage.removeItem('dev_sim_day');
        
        const inputs = ['dev-date', 'dev-time', 'dev-day'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        const banner = document.getElementById('simulated-clock-container');
        if (banner) banner.style.display = 'none';

    } catch (e) {
        console.error("Error during reset, forcing reload anyway.", e);
    }

    alert("Reality Restored! The system is back to normal real-world time.");
    
    window.location.href = window.location.pathname + '?nocache=' + new Date().getTime();
}

function renderMainDashboard() {
    renderDashboardSummary(); 
}

function renderDashboardSummary() {
    if (!isAuthenticated()) return;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];

    const shift = getShiftDateDetails();
    const todayStr = shift.dateStr;
    const targetDayStr = shift.dayStr;
    const now = getPHT().getTime();

    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const total = validStudents.length;

    const scheduledStudents = validStudents.filter(s => s.assignedDays && s.assignedDays.includes(targetDayStr));
    const totalScheduled = scheduledStudents.length;
    const todayLogs = logs.filter(l => l.date === todayStr);

    let present = 0;
    let absent = 0;
    let late = 0;
    
    let freshPresent = 0;
    let expectedFreshmen = 0;
    let upperPresent = 0;
    let expectedUpper = 0;

    scheduledStudents.forEach(s => {
        const lvl = (s.classLevel || 'UpperClassmen').toLowerCase();
        
        if (lvl === 'freshmen') {
            expectedFreshmen++;
        } else {
            expectedUpper++;
        }

        const studentLogs = todayLogs.filter(l => String(l.id) === String(s.id));
        const hasIn = studentLogs.some(l => l.action.includes('Time In') && !l.action.includes('Exempted'));
        const isExempt = studentLogs.some(l => l.action.includes('Exempted'));
        const isLate = studentLogs.some(l => l.action.includes('Late'));

        if (hasIn || isExempt) {
            present++;
            if (isLate) late++;

            if (lvl === 'freshmen') freshPresent++;
            else upperPresent++;
        } else {
            absent++;
        }
    });

    if(document.getElementById('dash-total')) document.getElementById('dash-total').textContent = total;
    if(document.getElementById('dash-ratio')) document.getElementById('dash-ratio').textContent = `${present} / ${totalScheduled}`;
    if(document.getElementById('dash-rate')) document.getElementById('dash-rate').textContent = totalScheduled > 0 ? Math.round((present / totalScheduled) * 100) + '%' : '0%';
    if(document.getElementById('dash-present')) document.getElementById('dash-present').textContent = present;
    if(document.getElementById('dash-absent')) document.getElementById('dash-absent').textContent = absent;
    if(document.getElementById('dash-late')) document.getElementById('dash-late').textContent = late;
    
    if(document.getElementById('dash-fresh-present')) document.getElementById('dash-fresh-present').textContent = `${freshPresent} / ${expectedFreshmen}`;
    if(document.getElementById('dash-upper-present')) document.getElementById('dash-upper-present').textContent = `${upperPresent} / ${expectedUpper}`;

    const pieChart = document.getElementById('dash-pie-chart');
    if (totalScheduled > 0 && pieChart) {
        const onTimeCount = present - late;
        const onTimePct = (onTimeCount / totalScheduled) * 100;
        const latePct = (late / totalScheduled) * 100;
        const combinedPresentPct = onTimePct + latePct;

        pieChart.style.background = `conic-gradient(
            var(--success) 0% ${onTimePct}%,
            #f59e0b ${onTimePct}% ${combinedPresentPct}%,
            var(--error) ${combinedPresentPct}% 100%
        )`;
    } else if (pieChart) {
        pieChart.style.background = `conic-gradient(#334155 0% 100%)`;
    }

    const barChartEl = document.getElementById('dash-bar-chart');
    const barLabelsEl = document.getElementById('dash-bar-labels');
    if (barChartEl && barLabelsEl) {
        barChartEl.innerHTML = '';
        barLabelsEl.innerHTML = '';

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let maxPresent = 100;

        for (let i = 6; i >= 0; i--) {
            let d = new Date(getPHT());
            d.setDate(d.getDate() - i);
            let dStr = d.toLocaleDateString('en-US');
            let dayIdx = d.getDay();

            let pCount = logs.filter(l => l.date === dStr && (l.action.includes('Time In') || l.action.includes('Exempted')) && l.id !== 'SYS_DELETED_DATE').length;

            let heightPct = (pCount / maxPresent) * 100;
            if (heightPct > 100) heightPct = 100;
            if (heightPct < 5) heightPct = 5;

            barChartEl.innerHTML += `
                <div style="flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative;">
                    <span style="position: absolute; top: -20px; font-size: 11px; color: var(--text-main); font-weight: bold;">${pCount}</span>
                    <div style="width: 100%; max-width: 30px; height: ${heightPct}%; background: linear-gradient(180deg, var(--accent), transparent); border-radius: 4px 4px 0 0; transition: height 0.5s;"></div>
                </div>
            `;
            barLabelsEl.innerHTML += `<div style="flex: 1; text-align: center; font-weight: bold;">${dayNames[dayIdx]}</div>`;
        }
    }

    const timeInLogs = todayLogs.filter(l => l.action.includes('Time In') && !l.action.includes('Exempted'));
    const timeOutLogs = todayLogs.filter(l => l.action.includes('Time Out') && !l.action.includes('Exempted'));

    const hourlyInCounts = new Array(24).fill(0);
    const hourlyOutCounts = new Array(24).fill(0);

    const populateCounts = (targetLogs, arr) => {
        targetLogs.forEach(log => {
            if(log.time === 'Exempted') return;
            const timeMatch = log.time.match(/(\d+):(\d+)(?::\d+)?\s+(AM|PM)/i);
            if (timeMatch) {
                let h = parseInt(timeMatch[1]);
                const ampm = timeMatch[3].toUpperCase();
                if (ampm === 'PM' && h !== 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                if (h >= 0 && h < 24) arr[h]++;
            }
        });
    };

    populateCounts(timeInLogs, hourlyInCounts);
    populateCounts(timeOutLogs, hourlyOutCounts);

    const lineChartContainer = document.getElementById('dash-line-chart-container');
    if (lineChartContainer) {
        const maxLineVal = 25;
        let svgHTML = `<svg width="100%" height="100%" viewBox="-40 -20 1080 260" preserveAspectRatio="none" style="flex: 1; display: block; overflow: visible;">`;

        for(let val = 0; val <= 25; val += 5) {
            let yLine = 200 - ((val / maxLineVal) * 200);
            svgHTML += `<line x1="0" y1="${yLine}" x2="1000" y2="${yLine}" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />`;
            svgHTML += `<text x="-15" y="${yLine + 5}" fill="var(--text-muted)" font-size="14" font-weight="bold" text-anchor="end">${val}</text>`;
        }

        let inPoints = []; let outPoints = [];
        let inCircles = ''; let outCircles = '';

        for(let h = 0; h < 24; h++) {
            let chartIdx = (h >= 4) ? (h - 4) : (h + 20);
            let inCount = hourlyInCounts[h];
            let outCount = hourlyOutCounts[h];
            let x = (chartIdx / 23) * 1000;

            let inY = 200 - ((Math.min(inCount, maxLineVal) / maxLineVal) * 200);
            let outY = 200 - ((Math.min(outCount, maxLineVal) / maxLineVal) * 200);

            inPoints.push(`${x},${inY}`);
            outPoints.push(`${x},${outY}`);

            outCircles += `<circle cx="${x}" cy="${outY}" r="6" fill="#1e2128" stroke="var(--error)" stroke-width="2.5" />`;
            if (outCount > 0) outCircles += `<text x="${x}" y="${outY + 20}" fill="var(--error)" font-size="12" text-anchor="middle" font-weight="bold">${outCount}</text>`;

            inCircles += `<circle cx="${x}" cy="${inY}" r="6" fill="#1e2128" stroke="var(--accent)" stroke-width="2.5" />`;
            if (inCount > 0) inCircles += `<text x="${x}" y="${inY - 12}" fill="var(--accent)" font-size="12" text-anchor="middle" font-weight="bold">${inCount}</text>`;
        }

        svgHTML += `<polyline points="${outPoints.join(' ')}" fill="none" stroke="var(--error)" stroke-width="3.5" />`;
        svgHTML += `<polyline points="${inPoints.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="3.5" />`;
        svgHTML += outCircles + inCircles + `</svg>`;

        let labelsHTML = `<div style="display: flex; justify-content: space-between; margin-top: 15px; color: var(--text-muted); font-size: 11px; padding: 0;">`;
        ['4a','5a','6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p','12a','1a','2a','3a'].forEach(lbl => {
            labelsHTML += `<span style="flex: 1; text-align: center;">${lbl}</span>`;
        });

        lineChartContainer.innerHTML = svgHTML + labelsHTML + `</div>`;
    }

    const inactiveFreshmen = [];
    const inactiveUpper = [];
    const inactivePanel = document.getElementById('dash-inactive-freshmen')?.closest('.panel');

    if (inactivePanel) {
        let titleDiv = inactivePanel.querySelector('.inactive-header-wrap');
        if (!titleDiv) {
            const oldH3 = inactivePanel.querySelector('h3');
            const oldP = inactivePanel.querySelector('p');

            titleDiv = document.createElement('div');
            titleDiv.className = 'inactive-header-wrap';
            titleDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; flex-shrink: 0;';

            titleDiv.innerHTML = `
                <h3 style="margin: 0; color: #ef4444;">Inactive Students</h3>
                <button id="inactivity-toggle-btn" onclick="toggleInactivityTracker()" style="font-size: 10px; padding: 4px 10px; border-radius: 4px; border: 1px solid var(--accent); background: rgba(var(--accent-rgb), 0.1); color: var(--accent); cursor: pointer; font-weight: bold; transition: 0.3s;"></button>
            `;

            inactivePanel.insertBefore(titleDiv, oldH3);
            if (oldP) oldP.textContent = "Press START to count missed days. Students appear at Day 8.";
            if (oldH3) oldH3.remove();
        }
    }

    let tracker = JSON.parse(localStorage.getItem('inactivity_tracker') || '{"active": false, "startDate": null}');
    const toggleBtn = document.getElementById('inactivity-toggle-btn');

    let tk = sessionStorage.getItem('_auth_tkn_x92');
    let userRole = 'ADMIN';
    try { userRole = JSON.parse(atob(tk)).role || 'ADMIN'; } catch(e) {}
    if (toggleBtn) toggleBtn.style.display = userRole === 'VISITOR' ? 'none' : 'block';

    let trackerDays = 0;
    if (tracker.active && tracker.startDate) {
        const startMs = new Date(tracker.startDate).getTime();
        trackerDays = Math.floor((now - startMs) / (1000 * 60 * 60 * 24));
        if (trackerDays < 0) trackerDays = 0;

        if (toggleBtn) {
            toggleBtn.textContent = `STOP - DAY ${trackerDays}`;
            toggleBtn.style.color = "var(--error)";
            toggleBtn.style.borderColor = "var(--error)";
            toggleBtn.style.background = "rgba(239, 68, 68, 0.1)";
        }
    } else {
        if (toggleBtn) {
            toggleBtn.textContent = "START";
            toggleBtn.style.color = "var(--accent)";
            toggleBtn.style.borderColor = "var(--accent)";
            toggleBtn.style.background = "rgba(var(--accent-rgb), 0.1)";
        }
    }

    if (tracker.active) {
        validStudents.forEach(s => {
            const sLogs = logs.filter(l => String(l.id) === String(s.id) && (l.action.includes('Time In') || l.action.includes('Exempted')));

            let daysInactive = trackerDays;

            if (sLogs.length > 0) {
                const sortedLogs = sLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
                const lastLogMs = new Date(sortedLogs[0].date).getTime();
                const daysSinceLastLog = Math.floor((now - lastLogMs) / (1000 * 60 * 60 * 24));

                daysInactive = Math.min(daysSinceLastLog, trackerDays);
            }

            if (daysInactive >= 8) {
                const classLvl = (s.classLevel || 'UpperClassmen').toLowerCase();
                const obj = { name: s.name || 'Unknown', days: `${daysInactive} days` };
                if (classLvl === 'freshmen') inactiveFreshmen.push(obj); else inactiveUpper.push(obj);
            }
        });
    }

    const renderInactive = (id, list) => {
        const container = document.getElementById(id);
        if (!container) return;

        if (!tracker.active) {
            container.innerHTML = '<span style="font-size: 11px; color: var(--text-muted); font-style: italic;">Tracker is stopped.</span>';
            return;
        }

        container.innerHTML = list.length === 0 ? '<span style="font-size: 11px; color: var(--text-muted); font-style: italic;">No students at 8+ days yet.</span>' : '';

        list.forEach(item => {
            container.innerHTML += `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px 8px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 10px; color: var(--text-main); font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px;" title="${item.name}">${item.name}</span>
                    <span style="font-size: 9px; color: #ef4444; font-weight: bold; flex-shrink: 0; background: rgba(239,68,68,0.1); padding: 2px 4px; border-radius: 3px;">${item.days}</span>
                </div>`;
        });
    };

    renderInactive('dash-inactive-freshmen', inactiveFreshmen);
    renderInactive('dash-inactive-upper', inactiveUpper);

    let perfList = [];
    validStudents.forEach(student => {
        const studentLogs = logs.filter(l => String(l.id) === String(student.id));
        if (studentLogs.length === 0) return;

        let onTimeIn = 0; let lateIn = 0; let onTimeOut = 0; let lateOut = 0; let bonus = 0;

        studentLogs.forEach(log => {
            if (log.action === 'Time In') onTimeIn++;
            if (log.action === 'Time In (Late)') lateIn++;
            if (log.action === 'Time Out') onTimeOut++;
            if (log.action === 'Time Out (Late)') lateOut++;
            if (log.action.includes('Out') && log.details && log.details.announcement === 'Yes') bonus += 1.5;
        });

        const totalActions = onTimeIn + lateIn + onTimeOut + lateOut;
        let perfRate = totalActions > 0 ? (onTimeIn + onTimeOut) / totalActions * 100 : 0;
        perfRate = Math.min(perfRate + bonus, 100);

        perfList.push({ name: student.name || 'Unknown', id: student.id, rate: Math.round(perfRate) });
    });

    perfList.sort((a, b) => b.rate - a.rate);
    const bestPerfEl = document.getElementById('dash-best-perf');

    if (bestPerfEl) {
        bestPerfEl.innerHTML = '';
        if (perfList.length === 0) {
            bestPerfEl.innerHTML = '<p class="placeholder-text" style="text-align: center; padding: 20px;">No data available.</p>';
        } else {
            perfList.slice(0, 10).forEach((p, index) => {
                let color = p.rate >= 80 ? 'var(--success)' : (p.rate >= 50 ? '#f59e0b' : 'var(--error)');
                let rankBadge = ['🥇', '🥈', '🥉'][index] || `<span style="display:inline-block; width:20px; text-align:center; font-weight:bold; color:var(--text-muted); font-size:11px;">#${index+1}</span>`;

                bestPerfEl.innerHTML += `
                    <div style="padding: 10px; border-bottom: 1px solid #2d313c; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; background: rgba(0,0,0,0.2); flex-shrink: 0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${rankBadge}
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: var(--text-main); font-size: 13px; font-weight: bold;">${p.name}</span>
                                <span style="color: var(--text-muted); font-size: 10px;">ID: ${p.id}</span>
                            </div>
                        </div>
                        <span style="color: ${color}; font-weight: bold; font-size: 14px;">${p.rate}%</span>
                    </div>`;
            });
        }
    }
}


function closePerformanceModal() {
    const modal = document.getElementById('performance-modal');
    if(modal) modal.style.display = 'none';
}

function cancelTimeOut() {
    pendingTimeOutStudent = null;
    pendingTimeOutAction = null;
    const modal = document.getElementById('timeout-modal');
    if(modal) modal.style.display = 'none';
}

function toggleOtherGC(val) {
    const otherInput = document.getElementById('gc-handle-other');
    if(otherInput) {
        if (val === 'Other') {
            otherInput.style.display = 'block';
        } else {
            otherInput.style.display = 'none';
            otherInput.value = ''; 
        }
    }
}

function viewTodayShift(idNum, dateStr) {
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    
    const dayLogs = logs.filter(l => String(l.id) === String(idNum) && l.date === dateStr);
    const timeInLog = dayLogs.find(l => l.action.includes('Time In'));
    const timeOutLog = dayLogs.find(l => l.action.includes('Time Out'));
    
    if (!timeOutLog) return; 
    
    const tsName = document.getElementById('ts-name');
    if(tsName) tsName.textContent = timeOutLog.name || 'Unknown';
    
    const inEl = document.getElementById('ts-time-in');
    if(inEl) {
        if (timeInLog && timeInLog.action.includes('Exempted')) {
            inEl.textContent = 'Exempted';
            inEl.style.color = '#66fcf1';
        } else if (timeInLog) {
            inEl.textContent = `${timeInLog.time} (${timeInLog.action.includes('Late') ? 'LATE' : 'ON TIME'})`;
            inEl.style.color = timeInLog.action.includes('Late') ? '#f59e0b' : 'var(--success)';
        } else {
            inEl.textContent = 'No Record';
            inEl.style.color = 'var(--error)';
        }
    }

    const outEl = document.getElementById('ts-time-out');
    if(outEl) {
        if (timeOutLog.action.includes('Exempted')) {
            outEl.textContent = 'Exempted';
            outEl.style.color = '#66fcf1';
        } else {
            outEl.textContent = `${timeOutLog.time} (${timeOutLog.action.includes('Late') ? 'LATE' : 'ON TIME'})`;
            outEl.style.color = timeOutLog.action.includes('Late') ? '#f59e0b' : 'var(--success)';
        }
    }
    
    const details = timeOutLog.details || {};
    const tsGc = document.getElementById('ts-gc');
    const tsAnnounce = document.getElementById('ts-announce');
    const tsPosted = document.getElementById('ts-posted');
    
    if(tsGc) tsGc.textContent = details.gcHandle || 'Not Provided';
    if(tsAnnounce) tsAnnounce.textContent = details.announcement || 'Not Provided';
    if(tsPosted) tsPosted.textContent = details.whoPosted || 'Not Provided';
    
    const modal = document.getElementById('today-shift-modal');
    if(modal) modal.style.display = 'flex';
}

function closeTodayShiftModal() {
    const modal = document.getElementById('today-shift-modal');
    if(modal) modal.style.display = 'none';
}

let isCaptchaSolved = false;
let puzzleX = 0;
let puzzleY = 0;
let isDragging = false;
let startX = 0;
const l = 42; 
const r = 9;  

function drawAbstractBackground(ctx, w, h) {
    let grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#6ee7b7');
    grad.addColorStop(0.5, '#3b82f6');
    grad.addColorStop(1, '#9333ea');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath(); ctx.arc(w * 0.2, h * 0.3, 40, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(w * 0.8, h * 0.7, 60, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(w * 0.5, h * 0.9, 30, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath(); ctx.arc(w * 0.7, h * 0.2, 50, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(w * 0.1, h * 0.8, 45, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for(let i=0; i<w; i+=30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for(let i=0; i<h; i+=30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
}

function drawPuzzlePath(ctx, x, y, l, r) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + l / 2 - r, y);
    ctx.arc(x + l / 2, y, r, Math.PI, 0, false);
    ctx.lineTo(x + l, y);
    ctx.lineTo(x + l, y + l / 2 - r);
    ctx.arc(x + l, y + l / 2, r, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.lineTo(x + l, y + l);
    ctx.lineTo(x + l / 2 + r, y + l);
    ctx.arc(x + l / 2, y + l, r, 0, Math.PI, true);
    ctx.lineTo(x, y + l);
    ctx.lineTo(x, y + l / 2 + r);
    ctx.arc(x, y + l / 2, r, 0.5 * Math.PI, 1.5 * Math.PI, true);
    ctx.closePath();
}

function initSliderCaptcha() {
    const bgCanvas = document.getElementById('studentCaptchaBg');
    const pieceCanvas = document.getElementById('studentCaptchaPiece');
    const thumb = document.getElementById('studentSliderThumb');
    const fill = document.getElementById('studentSliderFill');
    const wrapper = document.getElementById('studentSliderWrapper');
    const errorMsg = document.getElementById('studentCaptchaError');
    const trackText = document.getElementById('studentSliderTrackText');

    if (!bgCanvas || !wrapper) return;

    const bgCtx = bgCanvas.getContext('2d');
    const pieceCtx = pieceCanvas.getContext('2d');

    isCaptchaSolved = false;
    if(errorMsg) errorMsg.style.display = 'none';
    if(thumb) {
        thumb.style.transition = 'none';
        thumb.style.transform = `translateX(0px)`;
        thumb.innerHTML = '➔';
        thumb.style.backgroundColor = '#1e2128';
        thumb.style.color = 'var(--accent)';
    }
    if(fill) {
        fill.style.transition = 'none';
        fill.style.width = `0px`;
        fill.style.backgroundColor = 'rgba(var(--accent-rgb), 0.2)';
    }
    if(pieceCanvas) {
        pieceCanvas.style.transition = 'none';
        pieceCanvas.style.transform = `translateX(0px)`;
    }
    if(trackText) trackText.style.display = 'block';

    const width = wrapper.clientWidth || 340; 
    const height = 120; 
    bgCanvas.width = width;
    bgCanvas.height = height;

    const sliderTargetX = Math.random() * (width - l - r*2 - 50) + 50; 
    puzzleX = sliderTargetX;
    puzzleY = Math.random() * (height - l - r*2) + r; 

    bgCtx.fillStyle = '#1e2128';
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#9ca3af';
    bgCtx.font = '14px Arial';
    bgCtx.fillText('Loading puzzle...', width/2 - 45, height/2);
    if(pieceCtx) pieceCtx.clearRect(0,0, pieceCanvas.width, pieceCanvas.height);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = `https://picsum.photos/${Math.floor(width)}/${Math.floor(height)}?random=${Math.random()}`;
    
    img.onload = () => {
        bgCtx.clearRect(0, 0, width, height);
        bgCtx.drawImage(img, 0, 0, width, height);

        bgCtx.save();
        drawPuzzlePath(bgCtx, sliderTargetX + r, puzzleY, l, r);
        bgCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        bgCtx.fill();
        bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        bgCtx.lineWidth = 2;
        bgCtx.stroke();
        bgCtx.restore();

        pieceCanvas.width = l + r * 2;
        pieceCanvas.height = l + r * 2;
        pieceCanvas.style.top = `${puzzleY - r}px`;
        pieceCanvas.style.left = `0px`;

        pieceCtx.clearRect(0,0, pieceCanvas.width, pieceCanvas.height);
        pieceCtx.save();
        drawPuzzlePath(pieceCtx, r, r, l, r);
        pieceCtx.clip();
        pieceCtx.drawImage(img, sliderTargetX, puzzleY - r, pieceCanvas.width, pieceCanvas.height, 0, 0, pieceCanvas.width, pieceCanvas.height);
        pieceCtx.restore();

        pieceCtx.save();
        drawPuzzlePath(pieceCtx, r, r, l, r);
        pieceCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        pieceCtx.lineWidth = 2;
        pieceCtx.stroke();
        pieceCtx.restore();
    };

    img.onerror = () => {
        drawAbstractBackground(bgCtx, width, height);
        const offscreen = document.createElement('canvas');
        offscreen.width = width; 
        offscreen.height = height;
        drawAbstractBackground(offscreen.getContext('2d'), width, height);
        
        bgCtx.save();
        drawPuzzlePath(bgCtx, sliderTargetX + r, puzzleY, l, r);
        bgCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        bgCtx.fill();
        bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        bgCtx.lineWidth = 2;
        bgCtx.stroke();
        bgCtx.restore();

        pieceCanvas.width = l + r * 2;
        pieceCanvas.height = l + r * 2;
        pieceCanvas.style.top = `${puzzleY - r}px`;
        pieceCanvas.style.left = `0px`;

        pieceCtx.clearRect(0,0, pieceCanvas.width, pieceCanvas.height);
        pieceCtx.save();
        drawPuzzlePath(pieceCtx, r, r, l, r);
        pieceCtx.clip();
        pieceCtx.drawImage(offscreen, sliderTargetX, puzzleY - r, pieceCanvas.width, pieceCanvas.height, 0, 0, pieceCanvas.width, pieceCanvas.height);
        pieceCtx.restore();

        pieceCtx.save();
        drawPuzzlePath(pieceCtx, r, r, l, r);
        pieceCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        pieceCtx.lineWidth = 2;
        pieceCtx.stroke();
        pieceCtx.restore();
    };
}

function onDragStart(e) {
    if (isCaptchaSolved) return;
    const trackText = document.getElementById('studentSliderTrackText');
    const thumb = document.getElementById('studentSliderThumb');
    const fill = document.getElementById('studentSliderFill');
    const pieceCanvas = document.getElementById('studentCaptchaPiece');

    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    if(thumb) thumb.style.transition = 'none';
    if(fill) fill.style.transition = 'none';
    if(pieceCanvas) pieceCanvas.style.transition = 'none';
    if(trackText) trackText.style.display = 'none';
}

function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault(); 
    
    const wrapper = document.getElementById('studentSliderWrapper');
    const thumb = document.getElementById('studentSliderThumb');
    const fill = document.getElementById('studentSliderFill');
    const pieceCanvas = document.getElementById('studentCaptchaPiece');

    if(!wrapper) return;

    let currentX = e.clientX || e.touches[0].clientX;
    let moveX = currentX - startX;
    const maxMove = wrapper.clientWidth - 42;
    
    if (moveX < 0) moveX = 0;
    if (moveX > maxMove) moveX = maxMove;

    if(thumb) thumb.style.transform = `translateX(${moveX}px)`;
    if(fill) fill.style.width = `${moveX + 21}px`;
    if(pieceCanvas) pieceCanvas.style.transform = `translateX(${moveX}px)`;
}

function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const wrapper = document.getElementById('studentSliderWrapper');
    const thumb = document.getElementById('studentSliderThumb');
    const fill = document.getElementById('studentSliderFill');
    const pieceCanvas = document.getElementById('studentCaptchaPiece');
    const errorMsg = document.getElementById('studentCaptchaError');
    const trackText = document.getElementById('studentSliderTrackText');

    if(!wrapper) return;

    let currentX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : startX);
    let moveX = currentX - startX;
    const maxMove = wrapper.clientWidth - 42;
    
    if (moveX < 0) moveX = 0;
    if (moveX > maxMove) moveX = maxMove;

    if (Math.abs(moveX - puzzleX) < 8) {
        isCaptchaSolved = true;
        if(thumb) {
            thumb.innerHTML = '✔';
            thumb.style.backgroundColor = 'var(--success)';
            thumb.style.color = '#000';
            thumb.style.transform = `translateX(${puzzleX}px)`;
        }
        if(fill) {
            fill.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
            fill.style.width = `${puzzleX + 21}px`;
        }
        if(pieceCanvas) pieceCanvas.style.transform = `translateX(${puzzleX}px)`;
        if(errorMsg) errorMsg.style.display = 'none';
        
    } else {
        if(thumb) {
            thumb.style.transition = 'transform 0.3s ease';
            thumb.style.transform = `translateX(0px)`;
        }
        if(fill) {
            fill.style.transition = 'width 0.3s ease';
            fill.style.width = `0px`;
        }
        if(pieceCanvas) {
            pieceCanvas.style.transition = 'transform 0.3s ease';
            pieceCanvas.style.transform = `translateX(0px)`;
        }
        
        if(errorMsg) errorMsg.style.display = 'block';
        if(trackText) trackText.style.display = 'block';
        setTimeout(initSliderCaptcha, 500);
    }
}

let currentAdminCaptchaString = "";

function generateAdminCaptcha() {
    const canvas = document.getElementById('admin-captcha-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let captchaText = "";
    for (let i = 0; i < 7; i++) { 
        captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentAdminCaptchaString = captchaText;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 150; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(102, 252, 241, 0.4)' : 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineWidth = Math.random() * 2;
        ctx.stroke();
    }

    ctx.font = "bold 28px monospace";
    ctx.textBaseline = "middle";
    for (let i = 0; i < captchaText.length; i++) {
        const char = captchaText[i];
        ctx.save();
        const x = 20 + i * 32;
        const y = canvas.height / 2 + (Math.random() * 10 - 5);
        ctx.translate(x, y);
        const angle = (Math.random() * 0.8) - 0.4; 
        ctx.rotate(angle);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 70%)`;
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(char, 0, 0);
        ctx.restore();
    }
    
    const inputEl = document.getElementById('admin-captcha-input');
    if (inputEl) inputEl.value = '';
}

function checkDeviceLock() {
    const activeId = localStorage.getItem('activeDeviceStudent');
    const idInput = document.getElementById('student-id-input');
    const btnIn = document.querySelector('.btn-in');
    const lockMsg = document.getElementById('device-lock-msg');
    
    if (!idInput || !btnIn || !lockMsg) return;

    if (activeId) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const student = students.find(s => String(s.id) === String(activeId));
        
        if (student) {
            const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
            const shift = getShiftDateDetails();
            const todayLogs = logs.filter(l => String(l.id) === String(activeId) && l.date === shift.dateStr);
            
            const timeInLog = todayLogs.find(l => l.action.includes('Time In'));
            const hasTimeOut = todayLogs.some(l => l.action.includes('Time Out'));
            
            if (timeInLog && !hasTimeOut) {
                idInput.value = activeId;
                idInput.disabled = true;
                btnIn.style.display = 'none'; 
                lockMsg.style.display = 'block';
                
                lockMsg.innerHTML = `✔️ Time In is saved! to <strong>${student.name || 'Unknown'}</strong>.<br>
                <span style="font-size: 0.85rem; color: var(--text-main);">Time In: <span style="color: var(--success); font-weight: bold;">${timeInLog.time}</span></span><br>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px; display: inline-block;">Continue your OS Duty till 5pm - 12am to time out</span>`;
                return; 
            }
        }
        localStorage.removeItem('activeDeviceStudent');
    }
    resetDeviceLockUI(idInput, btnIn, lockMsg);
}

function resetDeviceLockUI(idInput, btnIn, lockMsg) {
    if(idInput) {
        if (idInput.disabled) {
            idInput.value = '';
        }
        idInput.disabled = false;
    }
    if(btnIn) btnIn.style.display = 'inline-block'; 
    if(lockMsg) {
        lockMsg.style.display = 'none';
        lockMsg.innerHTML = '';
    }
}

async function isIncognito() {
    return new Promise((resolve) => {
        let isPrivate = false;

        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                if (estimate.quota < 500000000) { 
                    resolve(true); 
                    return; 
                }
                const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
                if (fs) {
                    fs(window.TEMPORARY, 100, 
                        () => { resolve(false); }, 
                        () => { resolve(true); }   
                    );
                } else {
                    resolve(false);
                }
            }).catch(() => resolve(false));
        } else {
            resolve(false);
        }
    });
}


function toggleEditLogOtherGC(val) {
    const otherInput = document.getElementById('edit-log-gc-other');
    if (val === 'Other') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
}

function openEditLogModal(idNum, dateStr) {
    document.getElementById('edit-log-id').value = idNum;
    document.getElementById('edit-log-date').value = dateStr;

    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const studentLogs = logs.filter(l => String(l.id) === String(idNum) && l.date === dateStr);

    const timeInLog = studentLogs.find(l => l.action.includes('Time In'));
    const timeOutLog = studentLogs.find(l => l.action.includes('Time Out'));

    let inTime = '';
    if (timeInLog && !timeInLog.action.includes('Exempted')) {
        inTime = timeInLog.time;
    }

    let outTime = '';
    let gc = '-';
    let ann = '-';
    let post = '-';

    if (timeOutLog && !timeOutLog.action.includes('Exempted')) {
        outTime = timeOutLog.time;
        if (timeOutLog.details) {
            gc = timeOutLog.details.gcHandle || '-';
            ann = timeOutLog.details.announcement || '-';
            post = timeOutLog.details.whoPosted || '-';
        }
    }

    document.getElementById('edit-log-in').value = inTime;
    document.getElementById('edit-log-out').value = outTime;

    const gcSelect = document.getElementById('edit-log-gc');
    const gcOther = document.getElementById('edit-log-gc-other');
    
    const knownGCs = ["-", "BSA", "BSIT", "BSED ENG", "BSPT", "BSHM", "BSTM", "BSCRIM", "BSPHARMA", "BSRESPI", "BSED FIL", "BSN", "BSPSYCH", "RAD", "BSRADTECH", "BEED", "BSBA-FM", "BSBA-MM", "BSMT"];
    if (knownGCs.includes(gc)) {
        gcSelect.value = gc;
        gcOther.style.display = 'none';
        gcOther.value = '';
    } else {
        gcSelect.value = 'Other';
        gcOther.style.display = 'block';
        gcOther.value = gc;
    }

    document.getElementById('edit-log-ann').value = ann;
    document.getElementById('edit-log-post').value = post;

    document.getElementById('edit-log-modal').style.display = 'flex';
}

function closeEditLogModal() {
    document.getElementById('edit-log-modal').style.display = 'none';
}

async function saveEditLogModal() {
    if(!isAuthenticated()) return;
    const idNum = document.getElementById('edit-log-id').value;
    const dateStr = document.getElementById('edit-log-date').value;
    const inVal = document.getElementById('edit-log-in').value.trim();
    const outVal = document.getElementById('edit-log-out').value.trim();
    let gcHandle = document.getElementById('edit-log-gc').value;
    if (gcHandle === 'Other') gcHandle = document.getElementById('edit-log-gc-other').value.trim() || '-';
    const ann = document.getElementById('edit-log-ann').value;
    const post = document.getElementById('edit-log-post').value;

    await pullFromCloud();
    let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => String(s.id) === String(idNum));
    if (!student) return;

    logs = logs.filter(l => !(String(l.id) === String(idNum) && l.date === dateStr));

    if (!inVal && !outVal) {
        logs.push({ name: student.name || 'Unknown', id: student.id, action: 'No Attendance', time: '00:00:00 AM', date: dateStr, details: null });
    } else {
        if (inVal) {
            const t = inVal.match(/(\d+):(\d+):(\d+)\s+(AM|PM)/i);
            let h = parseInt(t[1]); const m = parseInt(t[2]); const ampm = t[4].toUpperCase();
            if (ampm === 'PM' && h !== 12) h += 12; if (ampm === 'AM' && h === 12) h = 0;
            const newAction = (h > 8 || (h === 8 && m >= 1)) ? 'Time In (Late)' : 'Time In';
            logs.push({ name: student.name || 'Unknown', id: student.id, action: newAction, time: inVal.toUpperCase(), date: dateStr, details: null });
        }
        if (outVal) {
            const t = outVal.match(/(\d+):(\d+):(\d+)\s+(AM|PM)/i);
            let h = parseInt(t[1]); const ampm = t[4].toUpperCase();
            if (ampm === 'PM' && h !== 12) h += 12; if (ampm === 'AM' && h === 12) h = 0;
            const newAction = (h >= 0 && h <= 4) ? 'Time Out (Late)' : 'Time Out';
            logs.push({ name: student.name || 'Unknown', id: student.id, action: newAction, time: outVal.toUpperCase(), date: dateStr, details: { gcHandle: gcHandle, announcement: ann, whoPosted: post } });
        }
    }
    
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    pushDataToCloud();
    closeEditLogModal();
    forceInstantUIRefresh();
}

async function sendHeartbeat() {
    if (!isAuthenticated()) return;
    try {
        const tk = sessionStorage.getItem('_auth_tkn_x92');
        const parsed = JSON.parse(atob(tk));
        const sessionToken = sessionStorage.getItem('adminSessionToken'); // 🟢 Grab the VIP Pass

        if (parsed && parsed.username && sessionToken) {
            await fetch(`${API_BASE_URL}/heartbeat/${parsed.username}`, {
                method: 'POST',
                headers: {
                    'X-Admin-Key': sessionToken 
                }
            });
        }
    } catch (e) {}
}

(function() {
    // 1. Disable Right Click (Redundancy)
    document.addEventListener('contextmenu', event => event.preventDefault());

    // 2. Aggressive Keyboard Shortcut Blocker
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) || 
            (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))
        ) {
            e.preventDefault();
            return false;
        }
    });

    setInterval(function() {
        const start = performance.now();
        
        eval("debugger;"); 
        
        const end = performance.now();
        
        if (end - start > 100) {
            document.body.innerHTML = `
                <div style="background: #121419; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ef4444; font-family: sans-serif; text-align: center; padding: 20px;">
                    <span style="font-size: 5rem; margin-bottom: 10px;">⛔</span>
                    <h1 style="font-size: 2.5rem; text-transform: uppercase; margin: 0; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);">Security Violation</h1>
                    <p style="color: #94a3b8; margin-top: 15px; font-size: 1.2rem;">Developer tools detection triggered. System connection severed.</p>
                </div>
            `;
            sessionStorage.clear();
        }
    }, 1000);
})();

let isServerRebooting = false;

async function autoRestoreServerData() {
    if (isServerRebooting) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`);
        if (!response.ok) return;
        
        const serverAccounts = await response.json();
        
        if (serverAccounts.length === 1 && serverAccounts[0].username === 'DEVELOPER') {
            isServerRebooting = true;
            console.warn("⚠️ Server wipe detected! Restoring accounts from Cloud Backup...");
            
            try { await pullFromCloud(); } catch(e) {}
            
            const backup = JSON.parse(localStorage.getItem('cloud_accounts_backup')) || [];
            let restoredCount = 0;
            
            for (const acc of backup) {
                if (acc.username !== 'DEVELOPER') {
                    await fetch(`${API_BASE_URL}/add-account`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-Admin-Key': sessionStorage.getItem('adminSessionToken')
                        },
                        body: JSON.stringify({ username: acc.username, password: acc.password, role: acc.role })
                    });
                    restoredCount++;
                }
            }
            
            if (restoredCount > 0) {
                console.log(`✅ Successfully restored ${restoredCount} accounts to the server.`);
                // Force UI to update
                if (document.getElementById('sec-settings').classList.contains('active')) {
                    fetchAdminAccounts(); 
                }
            }
            isServerRebooting = false;
        }
    } catch (e) {
        isServerRebooting = false;
    }
}

async function toggleRegistrationState(checkbox) {
    if(!isAuthenticated()) return;
    let tk = sessionStorage.getItem('_auth_tkn_x92');
    let userRole = 'ADMIN';
    try { userRole = JSON.parse(atob(tk)).role || 'ADMIN'; } catch(e) {}
    
    if (userRole === 'VISITOR') { checkbox.checked = !checkbox.checked; alert("Access Denied."); return; }

    const isOpen = checkbox.checked;
    await directDatabaseUpdate("System Config", () => {
        let config;
        try { config = JSON.parse(localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}'); } 
        catch(e) { config = { locked: false, regOpen: false }; }
        config.regOpen = isOpen;
        localStorage.setItem('sys_config', JSON.stringify(config));
    });
}

function copyRegLink() {
    if(!isAuthenticated()) return;
    const linkInput = document.getElementById('reg-link-output');
    if (!linkInput) return;
    linkInput.select();
    document.execCommand("copy");
    alert("Permanent Registration Link copied to clipboard! Send this to the students.");
}

function applySystemConfig() {
    let config;
    try {
        config = JSON.parse(localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}');
    } catch(e) {
        config = { locked: false, regOpen: false };
    }

    const toggle = document.getElementById('sys-attendance-toggle');
    const lockKnob = document.getElementById('sys-toggle-knob');
    if (toggle) toggle.checked = config.locked;
    if (lockKnob) {
        lockKnob.style.transform = config.locked ? 'translateX(20px)' : 'translateX(0px)';
        lockKnob.parentElement.style.backgroundColor = config.locked ? 'var(--error)' : '#334155';
    }
    
    const regToggle = document.getElementById('sys-reg-toggle');
    const regKnob = document.getElementById('reg-toggle-knob');
    if (regToggle) regToggle.checked = config.regOpen || false;
    if (regKnob) {
        regKnob.style.transform = config.regOpen ? 'translateX(20px)' : 'translateX(0px)';
        regKnob.parentElement.style.backgroundColor = config.regOpen ? 'var(--success)' : '#334155'; 
    }
    
    const studentLockOverlay = document.getElementById('student-lock-overlay');
    if (studentLockOverlay) {
        studentLockOverlay.style.display = config.locked ? 'flex' : 'none';
    }

    const adminLiveLockOverlay = document.getElementById('admin-live-lock-overlay');
    if (adminLiveLockOverlay) {
        adminLiveLockOverlay.style.display = config.locked ? 'flex' : 'none';
    }

    // 🟢 THE FIX: Check if the server is still waking up before unlocking!
    const isServerStillSleeping = (typeof isServerKnownAwake !== 'undefined' && !isServerKnownAwake);

    document.querySelectorAll('.btn-in, .btn-out').forEach(btn => {
        if(!btn.getAttribute('onclick') || (!btn.getAttribute('onclick').includes('Modal') && !btn.getAttribute('onclick').includes('togglePortal'))) {
            
            if (isServerStillSleeping) {
                // Force lock if server is dead/waking, overriding Admin config
                btn.disabled = true;
                btn.style.opacity = '0.4';
                btn.style.cursor = 'not-allowed';
            } else {
                // Normal behavior controlled by Admin Settings
                btn.disabled = config.locked;
                btn.style.opacity = config.locked ? '0.5' : '1';
                btn.style.cursor = config.locked ? 'not-allowed' : 'pointer';
            }
        }
    });
}

function renderAttendanceSummary() {
    if (!isAuthenticated()) return;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const tbody = document.getElementById('summary-body');
    if (!tbody) return;

    const searchInput = document.getElementById('search-attendance-global');
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const sortSelect = document.getElementById('sort-attendance-global');
    const sortVal = sortSelect ? sortSelect.value : 'NAME_ASC';

    const shift = getShiftDateDetails();
    const targetDayStr = shift.dayStr;
    const todayStr = shift.dateStr;

    let scheduledStudents = validStudents.filter(s => s.assignedDays && s.assignedDays.includes(targetDayStr));
    const todayLogs = logs.filter(l => l.date === todayStr);

    if (query) {
        scheduledStudents = scheduledStudents.filter(s => (s.name || '').toLowerCase().includes(query) || String(s.id).toLowerCase().includes(query));
    }

    scheduledStudents.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase().trim();
        const nameB = (b.name || '').toLowerCase().trim();
        const idA = (a.id || '').toString().trim();
        const idB = (b.id || '').toString().trim();
        const classA = (a.classLevel || 'zzzz').toLowerCase().trim();
        const classB = (b.classLevel || 'zzzz').toLowerCase().trim();

        if (sortVal === 'NAME_ASC') return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
        if (sortVal === 'NAME_DESC') return nameA > nameB ? -1 : (nameA < nameB ? 1 : 0);
        if (sortVal === 'ID_ASC') return idA.localeCompare(idB, undefined, {numeric: true});
        if (sortVal === 'CLASS_FRESH') {
            if (classA === 'freshmen' && classB !== 'freshmen') return -1;
            if (classA !== 'freshmen' && classB === 'freshmen') return 1;
            return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
        }
        if (sortVal === 'CLASS_UPPER') {
            if (classA === 'upperclassmen' && classB !== 'upperclassmen') return -1;
            if (classA !== 'upperclassmen' && classB === 'upperclassmen') return 1;
            return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
        }
        return 0;
    });

    tbody.innerHTML = '';
    
    if (scheduledStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px; font-style: italic;">No students match this filter.</td></tr>`;
        updateLiveAttendanceCounters();
        return;
    }

    scheduledStudents.forEach(student => {
        const sLogs = todayLogs.filter(l => String(l.id) === String(student.id));
        
        const hasIn = sLogs.some(l => l.action.includes('Time In'));
        const hasOut = sLogs.some(l => l.action.includes('Time Out'));
        const isExempt = sLogs.some(l => l.action.includes('Exempted'));
        
        let performanceStr = '<span style="color: var(--error);">0 Logs</span>';
        if (hasIn && hasOut) {
            performanceStr = `<span style="color: var(--success); font-weight: bold;">With Time In and Time Out</span>`;
        } else if (hasIn) {
            performanceStr = `<span style="color: #f59e0b; font-weight: bold;">Time In Only</span>`;
        } else if (isExempt) {
            performanceStr = `<span style="color: #66fcf1; font-weight: bold;">Exempted</span>`;
        } else if (hasOut) {
            performanceStr = `<span style="color: #f59e0b; font-weight: bold;">Time Out Only</span>`;
        }

        const safeId = String(student.id).replace(/'/g, "\\'");
        
        const actionHtml = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                ${performanceStr}
                <button onclick="viewPerformance('${safeId}')" style="background: rgba(var(--accent-rgb), 0.1); color: var(--accent); padding: 5px 12px; border-radius: 4px; font-size: 10px; border: 1px solid var(--accent); cursor: pointer; margin-left: 15px; font-weight: bold; white-space: nowrap;">VIEW PERF</button>
            </div>
        `;

        let gcTagHtml = (student.gcHandle || student.tag) ? `<span class="gc-tag" style="margin: 0 4px 0 0; font-size: 10px; padding: 2px 6px;">${student.gcHandle || student.tag}</span>` : '<span style="color: var(--text-muted); font-size: 11px; margin-right:4px;">-</span>';
        let classTagHtml = student.classLevel ? `<span class="gc-tag" style="margin: 0 4px 0 0; font-size: 10px; padding: 2px 6px; background: rgba(168, 85, 247, 0.2); color: #a855f7; border-color: #a855f7;">${student.classLevel}</span>` : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold; color: var(--text-main); vertical-align: middle;">${student.name || 'Unknown'}</td>
            <td style="vertical-align: middle;">${classTagHtml}${gcTagHtml}</td>
            <td style="color: var(--text-muted); vertical-align: middle;">${student.id}</td>
            <td style="vertical-align: middle;">${actionHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    updateLiveAttendanceCounters(); 
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const simStr = localStorage.getItem('dev_sim_settings');
        if (simStr) {
            const simSettings = JSON.parse(simStr);
            if (simSettings.active) {
                if (simSettings.date && document.getElementById('dev-date')) document.getElementById('dev-date').value = simSettings.date;
                if (simSettings.time && document.getElementById('dev-time')) document.getElementById('dev-time').value = simSettings.time;
                if (simSettings.day && document.getElementById('dev-day')) document.getElementById('dev-day').value = simSettings.day;
                
                const banner = document.getElementById('simulated-clock-container');
                if (banner) banner.style.display = 'block';
            }
        }
    } catch(e) {}
});

setInterval(() => {
    try {
        const shift = getShiftDateDetails();
        const banner = document.getElementById('simulated-clock-container');
        const simDisplay = document.getElementById('simulated-time-display');
        
        if (shift.isSimulated) {
            if (banner) banner.style.display = 'block';
            if (simDisplay) simDisplay.textContent = `${shift.dayStr}, ${shift.dateStr} | ${shift.realTimeStr}`;
        } else {
            if (banner) banner.style.display = 'none';
        }
    } catch(e) {
    }
}, 1000);

function renderAttendanceLogs() {
    if (!isAuthenticated()) return;
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const tbody = document.getElementById('attendance-logs-body');
    if (!tbody) return;

    const shift = getShiftDateDetails();
    const todayStr = shift.dateStr;

    let todayLogs = logs.filter(l => l.date === todayStr && l.id !== 'SYS_INIT_DATE' && l.id !== 'SYS_DELETED_DATE');

    todayLogs.sort((a, b) => {
        const timeA = new Date(`${a.date} ${a.time}`).getTime();
        const timeB = new Date(`${b.date} ${b.time}`).getTime();
        if (!isNaN(timeA) && !isNaN(timeB)) {
            return timeB - timeA; 
        }
        return 0; 
    });

    tbody.innerHTML = '';

    if (todayLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 20px;">No logs recorded today.</td></tr>`;
        return;
    }

    todayLogs.forEach(log => {
        let actionColor = log.action.includes('Time In') ? 'var(--success)' : 'var(--error)';
        if (log.action.includes('Exempted')) actionColor = '#66fcf1';
        
        const safeId = String(log.id).replace(/'/g, "\\'");
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold; color: var(--text-main);">${log.name || 'Unknown'}</td>
            <td style="color: var(--text-muted);">${log.id}</td>
            <td style="color: ${actionColor}; font-weight: bold;">${log.action}</td>
            <td style="font-family: monospace; font-size: 13px;">${log.time}</td>
            <td>
                <button onclick="viewTodayShiftDetails('${safeId}')" style="background: rgba(var(--accent-rgb), 0.1); color: var(--accent); padding: 4px 10px; border-radius: 4px; font-size: 10px; border: 1px solid var(--accent); cursor: pointer; font-weight: bold;">DETAILS</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    try { applyVisitorMode(); } catch(e) {}
}

function openDetailsModal(studentId, dateStr) {
    const existing = document.getElementById('shift-details-modal');
    if (existing) existing.remove();

    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    const student = students.find(s => String(s.id) === String(studentId));
    const studentName = student ? student.name : 'Unknown Student';

    const sLogs = logs.filter(l => String(l.id) === String(studentId) && l.date === dateStr);
    
    const inLog = sLogs.find(l => l.action.includes('Time In'));
    const outLog = sLogs.find(l => l.action.includes('Time Out'));
    const exemptLog = sLogs.find(l => l.action.includes('Exempted'));

    let timeInStr = inLog ? `${inLog.time} (${inLog.action.includes('Late') ? 'LATE' : 'ON TIME'})` : 'No Record';
    let timeOutStr = outLog ? `${outLog.time} (${outLog.action.includes('Late') ? 'LATE' : 'ON TIME'})` : 'No Record';
    
    let timeInColor = inLog ? (inLog.action.includes('Late') ? '#f59e0b' : '#22c55e') : '#9ca3af';
    let timeOutColor = outLog ? (outLog.action.includes('Late') ? '#f59e0b' : '#22c55e') : '#9ca3af';

    if (exemptLog) {
        timeInStr = `${exemptLog.time} (EXEMPTED)`;
        timeOutStr = `${exemptLog.time} (EXEMPTED)`;
        timeInColor = '#66fcf1';
        timeOutColor = '#66fcf1';
    }

    // FIX: Safely extract data whether it is the new Object or the old Test String
    let gc = "Not Provided", ann = "Not Provided", postedBy = "Not Provided";
    const targetLog = outLog || exemptLog; 

    if (targetLog && targetLog.details) {
        const det = targetLog.details;
        if (typeof det === 'object') {
            gc = det.gcHandle || "Not Provided";
            ann = det.announcement || "Not Provided";
            postedBy = det.whoPosted || det.postedBy || "Not Provided";
        } else if (typeof det === 'string') {
            const gcMatch = det.match(/GC Handle:\s*(.+)/);
            const annMatch = det.match(/Announcement:\s*(.+)/);
            const nameMatch = det.match(/Posted By:\s*(.+)/);
            if (gcMatch) gc = gcMatch[1].trim();
            if (annMatch) ann = annMatch[1].trim();
            if (nameMatch) postedBy = nameMatch[1].trim();
        }
    }

    const overlay = document.createElement('div');
    overlay.id = 'shift-details-modal';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(15, 17, 21, 0.9)', backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
        backgroundColor: '#1e2128', padding: '30px', borderRadius: '12px',
        border: '1px solid #333a45', width: '90%', maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontFamily: 'sans-serif'
    });

    box.innerHTML = `
        <h3 style="color: #ef4444; margin: 0 0 15px 0; text-align: center; font-size: 1.2rem;">${studentName}</h3>
        <hr style="border-color: #333a45; margin-bottom: 20px;">
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span style="color: #9ca3af; font-weight: bold;">Time In:</span>
            <span style="color: ${timeInColor}; font-weight: bold;">${timeInStr}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <span style="color: #9ca3af; font-weight: bold;">Time Out:</span>
            <span style="color: ${timeOutColor}; font-weight: bold;">${timeOutStr}</span>
        </div>
        
        <hr style="border-color: #333a45; margin-bottom: 20px;">
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span style="color: #9ca3af; font-weight: bold;">GC Handle:</span>
            <span style="color: #f8fafc; font-weight: bold;">${gc}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span style="color: #9ca3af; font-weight: bold;">Announcement:</span>
            <span style="color: #f8fafc; font-weight: bold;">${ann}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
            <span style="color: #9ca3af; font-weight: bold;">Posted By:</span>
            <span style="color: #f8fafc; font-weight: bold;">${postedBy}</span>
        </div>
        
        <button id="close-details-btn" style="width: 100%; padding: 12px; background: #ef4444; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; letter-spacing: 1px;">CLOSE DETAILS</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById('close-details-btn').onclick = () => {
        overlay.remove();
    };
}

function viewTodayShift(idNum, dateStr) {
    openDetailsModal(idNum, dateStr);
}

function viewPerformance(studentId) {
    const shift = getShiftDateDetails();
    openDetailsModal(studentId, shift.dateStr);
}

function viewHistoryDetails(studentId, historyDateStr) {
    openDetailsModal(studentId, historyDateStr);
}

async function handleTimeOut() {
    if (typeof isServerKnownAwake !== 'undefined' && !isServerKnownAwake) return;

    const btnOut = document.querySelector('.btn-out');
    let animInterval;

    if (btnOut) {
        if (btnOut.disabled) return;
        btnOut.disabled = true;
        btnOut.style.opacity = "0.8";
        let dots = 0;
        animInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            btnOut.textContent = "CHECKING" + ".".repeat(dots);
        }, 500);
    }

    const stopAnim = () => {
        if (btnOut) {
            clearInterval(animInterval);
            btnOut.textContent = "Time Out";
            btnOut.disabled = false;
            btnOut.style.opacity = "1";
        }
    };

    try {
        await pullFromCloud();
        const idInput = document.getElementById('student-id-input'); 
        const messageEl = document.getElementById('student-message');

        if (!idInput || !messageEl) { stopAnim(); return; }
        const studentId = idInput.value.trim();

        if (!studentId) { messageEl.textContent = "Please enter your Student ID Number."; messageEl.className = "message error"; stopAnim(); return; }

        const timeWindow = getCurrentTimeWindow();
        if (timeWindow === "LOCKOUT") { messageEl.textContent = "System Locked. Time Out opens at 5:00 PM."; messageEl.className = "message error"; stopAnim(); return; }
        if (timeWindow === "TIME_IN_NORMAL" || timeWindow === "TIME_IN_LATE" || timeWindow === "TOO_EARLY") { messageEl.textContent = "It is too early to Time Out."; messageEl.className = "message error"; stopAnim(); return; }

        let actionStr = "Time Out";
        if (timeWindow === "TIME_OUT_LATE") actionStr = "Time Out (Late)";

        const students = JSON.parse(localStorage.getItem('students')) || [];
        let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
        const shift = getShiftDateDetails();

        const student = students.find(s => String(s.id).toLowerCase() === studentId.toLowerCase());
        
        if (!student) { messageEl.textContent = "Student ID not found. Please register first."; messageEl.className = "message error"; stopAnim(); return; }
        if (!student.assignedDays || !student.assignedDays.includes(shift.dayStr)) { messageEl.textContent = `You are not scheduled for duty today (${shift.dayStr}).`; messageEl.className = "message error"; stopAnim(); return; }

        const hasTimedIn = logs.some(l => String(l.id).toLowerCase() === studentId.toLowerCase() && l.date === shift.dateStr && l.action.includes('Time In'));
        if (!hasTimedIn) { messageEl.textContent = "You cannot Time Out because you have no Time In record for today."; messageEl.className = "message error"; stopAnim(); return; }

        const alreadyTimedOut = logs.some(l => String(l.id).toLowerCase() === studentId.toLowerCase() && l.date === shift.dateStr && l.action.includes('Time Out'));
        if (alreadyTimedOut) { messageEl.textContent = "You have already timed out for this shift."; messageEl.className = "message error"; stopAnim(); return; }

        stopAnim();

        const reportData = await askForShiftReport(student.gcHandle, student.name);
        if (!reportData) return; 

        logs.push({
            name: student.name,
            id: student.id,
            action: actionStr,
            time: shift.realTimeStr,
            date: shift.dateStr,
            details: { gcHandle: reportData.gc, announcement: reportData.ann, whoPosted: reportData.name } 
        });

        localStorage.setItem('attendanceLogs', JSON.stringify(logs));
        localStorage.removeItem('activeDeviceStudent'); 
        
        pushDataToCloud();
        
        messageEl.textContent = `Success: ${student.name} - ${actionStr} at ${shift.realTimeStr}`;
        messageEl.className = "message success";
        idInput.value = ''; 

        const modal = document.getElementById('shift-report-modal');
        if (modal) modal.remove(); 

        checkDeviceLock(); 
        forceInstantUIRefresh();

    } catch (error) {
        stopAnim();
    }
}

function askForShiftReport(defaultGc) {
    return new Promise((resolve) => {
        // Clear any old, stuck modals first
        const existing = document.getElementById('shift-report-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'shift-report-modal';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(15, 17, 21, 0.9)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            backgroundColor: '#1e2128', padding: '30px', borderRadius: '12px',
            border: '1px solid var(--accent, #66fcf1)', width: '90%', maxWidth: '400px',
            boxShadow: '0 0 30px rgba(102, 252, 241, 0.2)', textAlign: 'left',
            color: '#f8fafc', fontFamily: 'sans-serif'
        });

        box.innerHTML = `
            <h3 style="color: var(--accent, #66fcf1); margin-top: 0; text-align: center;">End of Shift Report</h3>
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 20px;">Please provide your final shift details to complete your Time Out.</p>
            
            <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 5px;">GC Handle:</label>
            <input type="text" id="rep-gc" value="${defaultGc || ''}" style="width: 100%; padding: 10px; margin-bottom: 15px; background: #121419; border: 1px solid #333a45; color: white; border-radius: 6px; box-sizing: border-box; outline: none;">
            
            <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 8px;">Announcement:</label>
            <div style="display: flex; gap: 20px; margin-bottom: 20px; background: #121419; padding: 10px; border: 1px solid #333a45; border-radius: 6px;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px;">
                    <input type="radio" name="rep-ann" value="Yes" style="accent-color: var(--accent, #66fcf1); width: 16px; height: 16px; cursor: pointer;"> Yes
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px;">
                    <input type="radio" name="rep-ann" value="No" style="accent-color: var(--accent, #66fcf1); width: 16px; height: 16px; cursor: pointer;"> No
                </label>
            </div>
            
            <label style="display: block; font-size: 12px; font-weight: bold; margin-bottom: 5px;">Posted By / Status:</label>
            <select id="rep-name" style="width: 100%; padding: 10px; margin-bottom: 25px; background: #121419; border: 1px solid #333a45; color: white; border-radius: 6px; box-sizing: border-box; outline: none; cursor: pointer; font-size: 13px;">
                <option value="" disabled selected>-- Select an option --</option>
                <option value="Me">Me</option>
                <option value="TL/ATL">TL/ATL</option>
                <option value="No Cascade/Pending Question Today">No Cascade/Pending Question Today</option>
                <option value="Co-Online Support">Co-Online Support</option>
            </select>
            
            <div style="display: flex; gap: 10px;">
                <button id="rep-cancel" style="flex: 1; padding: 14px; background: transparent; border: 1px solid #9ca3af; color: #9ca3af; border-radius: 6px; font-weight: bold; cursor: pointer; text-transform: uppercase; transition: 0.2s;">Cancel</button>
                <button id="rep-submit" style="flex: 2; padding: 14px; background: var(--accent, #66fcf1); color: #000; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; text-transform: uppercase; transition: 0.2s;">Submit</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Cancel Button Action
        document.getElementById('rep-cancel').onclick = () => {
            overlay.remove();
            resolve(null); // Returns null so the system knows they backed out
        };

        // Submit Button Action
        document.getElementById('rep-submit').onclick = () => {
            const gc = document.getElementById('rep-gc').value.trim();
            const name = document.getElementById('rep-name').value;
            const annRadio = document.querySelector('input[name="rep-ann"]:checked');
            const ann = annRadio ? annRadio.value : '';
            
            if (!gc || !ann || !name) {
                alert("Please complete all fields (GC Handle, Announcement Yes/No, and Dropdown) before timing out.");
                return;
            }

            const submitBtn = document.getElementById('rep-submit');
            const cancelBtn = document.getElementById('rep-cancel');
            
            cancelBtn.style.display = 'none'; // Hide cancel button so they can't break it
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.8";
            
            let dots = 0;
            setInterval(() => {
                dots = (dots + 1) % 4;
                submitBtn.textContent = "Submitting" + ".".repeat(dots);
            }, 500);

            // Pass the data back instantly. The main function handles the cleanup now!
            resolve({ gc, ann, name });
        };
    });
}

function updateDailyMascot() {
    const mascotImg = document.getElementById('portal-mascot-img');
    if (!mascotImg) return;

    const todayStr = new Date().toLocaleDateString(); 
    const savedDate = localStorage.getItem('mascot_date');
    let currentCatId = parseInt(localStorage.getItem('mascot_id')) || 1;

    if (savedDate !== todayStr) {
        let newCatId;
        
        do {
            newCatId = Math.floor(Math.random() * 16) + 1; 
        } while (newCatId === currentCatId);

        currentCatId = newCatId;
        localStorage.setItem('mascot_id', currentCatId);
        localStorage.setItem('mascot_date', todayStr);

        mascotImg.style.animation = 'none';
        mascotImg.offsetHeight; 
        mascotImg.style.animation = 'floatIn 0.5s ease-out forwards';
    }

    const newSrc = `images/cat${currentCatId}.gif`;
    if (!mascotImg.src.includes(newSrc)) {
        mascotImg.src = newSrc;
    }
}

function forceInstantUIRefresh() {
    if (document.getElementById('admin-dashboard-view').classList.contains('active')) {
        if (typeof renderStudents === 'function') renderStudents();
        if (typeof renderSchedule === 'function') renderSchedule();
        if (typeof renderLogs === 'function') renderLogs();
        if (typeof renderMainDashboard === 'function') renderMainDashboard();
        if (typeof renderDutyToday === 'function') renderDutyToday();
        
        const activeDate = document.getElementById('history-table-title')?.getAttribute('data-date');
        if (activeDate && document.getElementById('sec-history').classList.contains('active')) {
            renderHistoryTable(activeDate);
        }
    }
}

function showLoadingOverlay(message = "Processing...") {
    let overlay = document.getElementById('global-loading-overlay');
    if (!overlay) {
        // Create the blur background
        overlay = document.createElement('div');
        overlay.id = 'global-loading-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(6px); /* The Glass Blur Effect */
            -webkit-backdrop-filter: blur(6px);
            z-index: 9999; display: flex; justify-content: center;
            align-items: center; flex-direction: column;
            color: white; font-family: sans-serif;
        `;
        
        // Create the spinning circle
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #fff; border-radius: 50%;
            width: 50px; height: 50px; margin-bottom: 15px;
            animation: spin 1s linear infinite;
        `;
        const style = document.createElement('style');
        style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);

        // Create the text
        const text = document.createElement('div');
        text.id = 'global-loading-text';
        text.style.fontWeight = 'bold';
        text.style.fontSize = '1.2rem';

        overlay.appendChild(spinner);
        overlay.appendChild(text);
        document.body.appendChild(overlay);
    }
    document.getElementById('global-loading-text').innerText = message;
    overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('global-loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

function toggleInactivityTracker() {
    if (!isAuthenticated()) return;
    
    // Security Check: Only Admins can click this
    let tk = sessionStorage.getItem('_auth_tkn_x92');
    let userRole = 'ADMIN';
    try { userRole = JSON.parse(atob(tk)).role || 'ADMIN'; } catch(e) {}
    if (userRole === 'VISITOR') {
        alert("Access Denied: Only Support Heads can manage the tracker.");
        return;
    }

    let tracker = JSON.parse(localStorage.getItem('inactivity_tracker') || '{"active": false, "startDate": null}');
    
    if (tracker.active) {
        if (confirm("⚠️ WARNING ⚠️\n\nAre you sure you want to STOP the tracker?\n\nThis will reset all current tracking progress back to 0.")) {
            localStorage.setItem('inactivity_tracker', JSON.stringify({ active: false, startDate: null }));
            renderDashboardSummary();
            forceInstantUIRefresh();
        }
    } else {
        const shift = getShiftDateDetails();
        localStorage.setItem('inactivity_tracker', JSON.stringify({ active: true, startDate: shift.nowObj }));
        renderDashboardSummary();
        forceInstantUIRefresh();
    }
}

let serverStatusCheckTimer = null;
let serverTextCycleTimer = null;
let isServerKnownAwake = false; 

function checkServerStatus() {
    const adminDot = document.getElementById('server-status-dot');
    const adminText = document.getElementById('server-status-text');
    const loginBtn = document.querySelector('#admin-login-view .btn-primary');
    
    const studentDot = document.getElementById('student-server-dot');
    const studentText = document.getElementById('student-server-text');
    const btnIn = document.querySelector('.btn-in');
    const btnOut = document.querySelector('.btn-out');

    clearInterval(serverStatusCheckTimer);
    clearInterval(serverTextCycleTimer);

    // Helper function to instantly unlock and set the UI to Ready
    const setReadyUI = () => {
        if (adminDot) { adminDot.style.backgroundColor = 'var(--success)'; adminDot.style.animation = 'none'; }
        if (studentDot) { studentDot.style.backgroundColor = 'var(--success)'; studentDot.style.animation = 'none'; }
        if (adminText) { adminText.style.color = 'var(--success)'; adminText.textContent = 'Server Online'; }
        if (studentText) { studentText.style.color = 'var(--success)'; studentText.textContent = 'Ready for Attendance'; }
        
        if (loginBtn) { loginBtn.disabled = false; loginBtn.style.opacity = '1'; loginBtn.textContent = 'Login'; }
        
        if (btnIn) { btnIn.textContent = 'Time In'; }
        if (btnOut) { btnOut.textContent = 'Time Out'; }
        
        applySystemConfig(); 
    };

    if (isServerKnownAwake) {

        fetch(`${API_BASE_URL}/config/status`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                let config;
                try { config = JSON.parse(localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}'); } 
                catch(e) { config = { locked: false, regOpen: false }; }
                
                config.locked = data.isLocked; // Sync local storage to true database state
                localStorage.setItem('sys_config', JSON.stringify(config));
                isBackendLocked = data.isLocked;
                setReadyUI();
            }).catch(() => setReadyUI());
        return; 
    }
    
    const bootMessages = [
        "Waking Server...", 
        "Connecting to Database...", 
        "Please wait...", 
        "Almost ready..."
    ];
    let msgIndex = 0;

    const setWakingUI = () => {
        if (adminDot) { adminDot.style.backgroundColor = '#f59e0b'; adminDot.style.animation = 'pulse-server 1.5s infinite'; }
        if (studentDot) { studentDot.style.backgroundColor = '#f59e0b'; studentDot.style.animation = 'pulse-server 1.5s infinite'; }
        if (adminText) { adminText.style.color = '#f59e0b'; adminText.textContent = bootMessages[msgIndex]; }
        if (studentText) { studentText.style.color = '#f59e0b'; studentText.textContent = bootMessages[msgIndex]; }
        
        if (loginBtn) { loginBtn.disabled = true; loginBtn.style.opacity = '0.4'; loginBtn.textContent = 'WAKING SERVER...'; }
        
        if (btnIn) { btnIn.disabled = true; btnIn.style.opacity = '0.4'; btnIn.style.cursor = 'not-allowed'; btnIn.textContent = 'WAIT...'; }
        if (btnOut) { btnOut.disabled = true; btnOut.style.opacity = '0.4'; btnOut.style.cursor = 'not-allowed'; btnOut.textContent = 'WAIT...'; }
    };

    setWakingUI();

    serverTextCycleTimer = setInterval(() => {
        msgIndex = (msgIndex + 1) % bootMessages.length;
        if (adminText) adminText.textContent = bootMessages[msgIndex];
        if (studentText) studentText.textContent = bootMessages[msgIndex];
    }, 3000);

    const pingBackend = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const res = await fetch(`${API_BASE_URL}/config/status`, { 
                cache: 'no-store',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (res.ok) { 
                clearInterval(serverTextCycleTimer);
                clearInterval(serverStatusCheckTimer);
                isServerKnownAwake = true; 
                
                const statusData = await res.json();
                
                let config;
                try { config = JSON.parse(localStorage.getItem('sys_config') || '{"locked":false,"regOpen":false}'); } 
                catch(e) { config = { locked: false, regOpen: false }; }
                
                config.locked = statusData.isLocked; 
                localStorage.setItem('sys_config', JSON.stringify(config));
                isBackendLocked = statusData.isLocked;
                
                setReadyUI(); 
            }
        } catch (error) {
            console.log("Server still waking up...");
        }
    };

    pingBackend(); 
    serverStatusCheckTimer = setInterval(pingBackend, 5000); 
}

let selectedPerfStudentId = null;

function renderPerfStudentList() {
    if (!isAuthenticated()) return;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const validStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL');
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const listEl = document.getElementById('perf-students-list');
    
    const query = (document.getElementById('search-perf-student')?.value || '').toLowerCase();
    const filterVal = document.getElementById('filter-perf-student')?.value || 'ALL';

    if (!listEl) return;
    listEl.innerHTML = '';

    const globalDeletedDates = logs.filter(l => l.id === 'SYS_DELETED_DATE').map(l => l.date);
    const validLogs = logs.filter(l => !globalDeletedDates.includes(l.date) && l.id !== 'SYS_WIPE_LOGS' && l.id !== 'SYS_WIPE_ALL');
    let uniqueDates = [...new Set(validLogs.map(l => l.date))];

    let filtered = validStudents;

    if (query) {
        filtered = filtered.filter(s => (s.name || '').toLowerCase().includes(query) || String(s.id).toLowerCase().includes(query));
    }

    if (filterVal === 'UPPER') {
        filtered = filtered.filter(s => (s.classLevel || 'UpperClassmen').toLowerCase() !== 'freshmen');
    } else if (filterVal === 'FRESH') {
        filtered = filtered.filter(s => (s.classLevel || 'UpperClassmen').toLowerCase() === 'freshmen');
    }

    if (filterVal === 'ZA') {
        filtered.sort((a,b) => (b.name||'').localeCompare(a.name||''));
    } else {
        // Defaults to A-Z for everything else
        filtered.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    }

    if (filtered.length === 0) {
        listEl.innerHTML = `<li style="padding: 15px; text-align: center; color: var(--text-muted); font-style: italic; font-size: 12px;">No students found.</li>`;
        return;
    }

    filtered.forEach(s => {
        const sLogs = validLogs.filter(l => String(l.id) === String(s.id));
        let onIn=0, lateIn=0, onOut=0, lateOut=0, bonus=0, absents=0;

        sLogs.forEach(log => {
            if (log.action === 'Time In') onIn++;
            if (log.action === 'Time In (Late)') lateIn++;
            if (log.action === 'Time Out') onOut++;
            if (log.action === 'Time Out (Late)') lateOut++;
            if (log.action.includes('Out') && log.details && log.details.announcement === 'Yes') bonus += 1.5;
        });

        uniqueDates.forEach(dateStr => {
            const d = new Date(dateStr);
            const dayStr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            if (s.assignedDays && s.assignedDays.includes(dayStr)) {
                const hasIn = sLogs.some(l => l.date === dateStr && (l.action.includes('Time In') || l.action.includes('Exempted')));
                if (!hasIn) absents++;
            }
        });

        const totalActions = onIn + lateIn + onOut + lateOut;
        let perfRate = 0;
        if (totalActions === 0 && absents === 0) perfRate = 100; // Perfect clean slate
        else if (totalActions > 0) perfRate = ((onIn + onOut) / totalActions) * 100;
        else perfRate = 0;

        perfRate = Math.min(perfRate + bonus, 100);
        const finalRate = Math.round(perfRate);

        let bgColor = '';
        let borderColor = '';
        if (finalRate >= 80) {
            bgColor = 'rgba(34, 197, 94, 0.1)'; 
            borderColor = 'var(--success, #22c55e)';
        } else if (finalRate >= 50) {
            bgColor = 'rgba(245, 158, 11, 0.1)'; 
            borderColor = '#f59e0b';
        } else {
            bgColor = 'rgba(239, 68, 68, 0.1)'; 
            borderColor = 'var(--error, #ef4444)';
        }

        const isSelected = selectedPerfStudentId === s.id;
        if (isSelected) bgColor = bgColor.replace('0.1)', '0.3)'); 

        const li = document.createElement('li');
        li.style.cssText = `padding: 12px 15px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; transition: 0.2s; display: flex; justify-content: space-between; align-items: center; background: ${bgColor}; border-left: 4px solid ${borderColor};`;
        
        li.onclick = () => {
            selectedPerfStudentId = s.id;
            renderPerfStudentList(); 
            renderPerfStudentDetails(); 
        };
        
        li.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: bold; color: var(--text-main); font-size: 13px;">${s.name || 'Unknown'}</span>
                <span style="font-size: 11px; color: var(--text-muted); opacity: 0.8;">ID: ${s.id}</span>
            </div>
            <span style="font-weight: bold; font-size: 15px; color: ${borderColor};">${finalRate}%</span>
        `;
        listEl.appendChild(li);
    });
}

function renderPerfStudentDetails() {
    const contentEl = document.getElementById('perf-detail-content');
    if (!contentEl) return;
    
    if (!selectedPerfStudentId) {
        contentEl.innerHTML = `<p class="placeholder-text" style="text-align: center; margin-top: 80px; font-size: 1.1rem;">👈 Select a student from the list to generate their report.</p>`;
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const student = students.find(s => s.id === selectedPerfStudentId);

    if (!student) return;

    // 1. Get Operational Dates
    const globalDeletedDates = logs.filter(l => l.id === 'SYS_DELETED_DATE').map(l => l.date);
    const validLogs = logs.filter(l => !globalDeletedDates.includes(l.date) && l.id !== 'SYS_WIPE_LOGS' && l.id !== 'SYS_WIPE_ALL');
    let uniqueDates = [...new Set(validLogs.map(l => l.date))];
    uniqueDates.sort((a, b) => new Date(a) - new Date(b));

    // 2. Filter Logs for this student
    const sLogs = validLogs.filter(l => String(l.id) === String(student.id));

    let onTimeIn = 0; let lateIn = 0;
    let onTimeOut = 0; let lateOut = 0;
    let bonus = 0;

    sLogs.forEach(log => {
        if (log.action === 'Time In') onTimeIn++;
        if (log.action === 'Time In (Late)') lateIn++;
        if (log.action === 'Time Out') onTimeOut++;
        if (log.action === 'Time Out (Late)') lateOut++;
        if (log.action.includes('Out') && log.details && log.details.announcement === 'Yes') bonus += 1.5;
    });

    // 3. Calculate Absents based on Schedule
    let absents = 0;
    uniqueDates.forEach(dateStr => {
        const d = new Date(dateStr);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayStr = dayNames[d.getDay()];

        if (student.assignedDays && student.assignedDays.includes(dayStr)) {
            const hasIn = sLogs.some(l => l.date === dateStr && (l.action.includes('Time In') || l.action.includes('Exempted')));
            if (!hasIn) absents++;
        }
    });

    // 4. CORRECTED RATE MATH
    const totalActions = onTimeIn + lateIn + onTimeOut + lateOut;
    let perfRate = 0;
    
    if (totalActions === 0 && absents === 0) {
        perfRate = 100;
    } else if (totalActions > 0) {
        perfRate = ((onTimeIn + onTimeOut) / totalActions) * 100;
    } else {
        perfRate = 0;
    }
    
    perfRate = Math.min(perfRate + bonus, 100);
    const finalRoundedRate = Math.round(perfRate);

    // Track starting value for animation
    const startValue = currentPerfRateTracker;
    currentPerfRateTracker = finalRoundedRate; 
    const initialColor = startValue >= 80 ? 'var(--success)' : (startValue >= 50 ? '#f59e0b' : 'var(--error)');

    // 🟢 5. NEW DETAILED HISTORY TIMELINE 🟢
    let historyHtml = '<div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto; padding-right: 5px;">';
    let displayDates = [...uniqueDates].reverse(); // Show newest dates first
    let recordsFound = false;

    displayDates.forEach(dateStr => {
        const d = new Date(dateStr);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayStr = dayNames[d.getDay()];
        
        const dayLogs = sLogs.filter(l => l.date === dateStr);
        const isScheduled = student.assignedDays && student.assignedDays.includes(dayStr);
        
        // Skip days they weren't scheduled for AND didn't log anything
        if (!isScheduled && dayLogs.length === 0) return; 
        
        recordsFound = true;
        
        let inText = '<span style="color: var(--error); font-weight: bold;">Absent</span>';
        let outText = '<span style="color: var(--error); font-weight: bold;">Absent</span>';
        let rowBg = 'rgba(255,255,255,0.02)';
        
        const inLog = dayLogs.find(l => l.action.includes('Time In'));
        const outLog = dayLogs.find(l => l.action.includes('Time Out'));
        const exemptLog = dayLogs.find(l => l.action.includes('Exempted'));
        
        if (exemptLog) {
            inText = '<span style="color: #66fcf1; font-weight: bold;">Exempted</span>';
            outText = '<span style="color: #66fcf1; font-weight: bold;">Exempted</span>';
        } else {
            if (inLog) {
                const color = inLog.action.includes('Late') ? '#f59e0b' : 'var(--success)';
                const status = inLog.action.includes('Late') ? '<span style="font-size: 10px; opacity: 0.8;">(Late)</span>' : '';
                inText = `<span style="color: ${color}; font-weight: bold;">${inLog.time} ${status}</span>`;
            }
            if (outLog) {
                const color = outLog.action.includes('Late') ? '#f59e0b' : 'var(--success)';
                const status = outLog.action.includes('Late') ? '<span style="font-size: 10px; opacity: 0.8;">(Late)</span>' : '';
                outText = `<span style="color: ${color}; font-weight: bold;">${outLog.time} ${status}</span>`;
            }
        }

        historyHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: ${rowBg}; border: 1px solid #333a45; padding: 10px 15px; border-radius: 6px;">
                <span style="color: var(--text-main); font-weight: bold; font-size: 13px; width: 90px;">${dateStr}</span>
                <div style="display: flex; gap: 20px; flex: 1; justify-content: space-around;">
                    <span style="font-size: 12px; color: var(--text-muted);">In: ${inText}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">Out: ${outText}</span>
                </div>
            </div>
        `;
    });
    
    if (!recordsFound) {
        historyHtml += '<span style="color: var(--text-muted); font-style: italic; font-size: 13px;">No history records available yet.</span>';
    }
    historyHtml += '</div>';

    // 6. Draw Dashboard
    contentEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
            <div>
                <h2 style="margin: 0; color: var(--text-main); font-size: 1.8rem;">${student.name}</h2>
                <div style="margin-top: 5px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <span style="color: var(--text-muted); font-size: 12px; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">ID: <strong>${student.id}</strong></span>
                    <span style="color: var(--text-muted); font-size: 12px; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">Class: <strong>${student.classLevel || 'Freshmen'}</strong></span>
                    <span style="color: var(--text-muted); font-size: 12px; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">GC: <strong>${student.gcHandle || 'None'}</strong></span>
                </div>
            </div>
            
            <div style="text-align: right; background: rgba(0,0,0,0.2); padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-right: 20px;">
                <span style="display: block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: bold; margin-bottom: 2px;">Overall Rate</span>
                <span id="perf-anim-target" style="font-size: 2.2rem; font-weight: bold; color: ${initialColor}; line-height: 1;">${startValue}%</span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 10px;">
            <div style="background: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.2); padding: 15px; border-radius: 8px; text-align: center;">
                <span style="display: block; font-size: 11px; color: var(--success); text-transform: uppercase; margin-bottom: 8px; font-weight: bold;">On-Time (In)</span>
                <span style="font-size: 1.8rem; font-weight: bold; color: var(--success);">${onTimeIn}</span>
            </div>
            <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); padding: 15px; border-radius: 8px; text-align: center;">
                <span style="display: block; font-size: 11px; color: #f59e0b; text-transform: uppercase; margin-bottom: 8px; font-weight: bold;">Late (In)</span>
                <span style="font-size: 1.8rem; font-weight: bold; color: #f59e0b;">${lateIn}</span>
            </div>
            <div style="background: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.2); padding: 15px; border-radius: 8px; text-align: center;">
                <span style="display: block; font-size: 11px; color: var(--success); text-transform: uppercase; margin-bottom: 8px; font-weight: bold;">On-Time (Out)</span>
                <span style="font-size: 1.8rem; font-weight: bold; color: var(--success);">${onTimeOut}</span>
            </div>
            <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); padding: 15px; border-radius: 8px; text-align: center;">
                <span style="display: block; font-size: 11px; color: #f59e0b; text-transform: uppercase; margin-bottom: 8px; font-weight: bold;">Late (Out)</span>
                <span style="font-size: 1.8rem; font-weight: bold; color: #f59e0b;">${lateOut}</span>
            </div>
            <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 8px; text-align: center;">
                <span style="display: block; font-size: 11px; color: var(--error); text-transform: uppercase; margin-bottom: 8px; font-weight: bold;">Total Absents</span>
                <span style="font-size: 1.8rem; font-weight: bold; color: var(--error);">${absents}</span>
            </div>
        </div>

        <div style="margin-top: 15px; background: #16181d; padding: 20px; border-radius: 8px; border: 1px solid #2d313c;">
            <h4 style="color: var(--text-main); margin: 0 0 15px 0; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                📅 Detailed Attendance History
            </h4>
            ${historyHtml}
        </div>
    `;

    animateCounting("perf-anim-target", startValue, finalRoundedRate); 
}

let currentPerfRateTracker = 0; 
let perfAnimTimer = null;

function animateCounting(elementId, startValue, endValue) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    clearInterval(perfAnimTimer);
    let currentVal = startValue;
    
    if (startValue === endValue) {
        el.textContent = endValue + "%";
        el.style.color = endValue >= 80 ? 'var(--success)' : (endValue >= 50 ? '#f59e0b' : 'var(--error)');
        return;
    }

    const isCountingUp = endValue > startValue;
    const speed = 25; 

    perfAnimTimer = setInterval(() => {
        if (isCountingUp) {
            currentVal += 1;
            if (currentVal >= endValue) {
                currentVal = endValue;
                clearInterval(perfAnimTimer);
            }
        } else {
            currentVal -= 1;
            if (currentVal <= endValue) {
                currentVal = endValue;
                clearInterval(perfAnimTimer);
            }
        }
        
        let rateColor = currentVal >= 80 ? 'var(--success)' : (currentVal >= 50 ? '#f59e0b' : 'var(--error)');
        el.style.color = rateColor;
        el.textContent = currentVal + "%";
        
    }, speed);
}

async function updateActiveAdminsTracker() {
    if (!isAuthenticated()) return;
    
    try {
        const sessionToken = sessionStorage.getItem('adminSessionToken'); 

        const response = await fetch(`${API_BASE_URL}/accounts`, { 
            cache: 'no-store',
            headers: {
                'X-Admin-Key': sessionToken 
            }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        let activeCount = 0;
        const now = Date.now();
        
        data.forEach(account => {
            if (account.lastOnline) {
                const seconds = Math.floor((now - account.lastOnline) / 1000);
                if (seconds < 60) { 
                    activeCount++; // Counts anyone online in the last 60 seconds ("Just now")
                }
            }
        });
        
        const countEl = document.getElementById('active-admins-count');
        if (countEl) {
            countEl.textContent = activeCount;
            
            // 🟢 Fixed: Now it glows even if you are the only 1 online!
            if (activeCount >= 1) { 
                countEl.style.color = '#66fcf1'; 
                countEl.style.textShadow = '0 0 8px rgba(102, 252, 241, 0.6)';
            } else {
                countEl.style.color = 'var(--text-muted)';
                countEl.style.textShadow = 'none';
            }
        }
    } catch (error) {
        console.error("Tracker: Failed to sync active admins.");
    }
}

setInterval(updateActiveAdminsTracker, 20000);

document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        setTimeout(updateActiveAdminsTracker, 1000);
    }
});

function updateLiveAttendanceCounters() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const shift = getShiftDateDetails();
    
    const targetDayStr = shift.dayStr;
    const todayStr = shift.dateStr;

    const scheduledStudents = students.filter(s => s.id !== 'SYS_CONFIG_X99' && s.id !== 'SYS_WIPE_ALL' && s.assignedDays && s.assignedDays.includes(targetDayStr));
    const todayLogs = logs.filter(l => l.date === todayStr);

    let completedTotal = 0;
    let completedUpper = 0;
    let completedFresh = 0;

    scheduledStudents.forEach(s => {
        const sLogs = todayLogs.filter(l => String(l.id) === String(s.id));
        const hasIn = sLogs.some(l => l.action.includes('Time In') || l.action.includes('Exempted'));
        const hasOut = sLogs.some(l => l.action.includes('Time Out') || l.action.includes('Exempted'));
        
        if (hasIn && hasOut) {
            completedTotal++;
            const lvl = (s.classLevel || 'UpperClassmen').toLowerCase();
            if (lvl === 'freshmen') completedFresh++;
            else completedUpper++;
        }
    });

    if (document.getElementById('live-completed-total')) document.getElementById('live-completed-total').textContent = completedTotal;
    if (document.getElementById('live-completed-upper')) document.getElementById('live-completed-upper').textContent = completedUpper;
    if (document.getElementById('live-completed-fresh')) document.getElementById('live-completed-fresh').textContent = completedFresh;
}

function viewTodayShiftDetails(studentId) {
    const shift = getShiftDateDetails();
    openDetailsModal(studentId, shift.dateStr);
}
