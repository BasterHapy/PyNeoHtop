// --- 网卡列表展开/收缩功能 ---
let networkExpanded = false;

function toggleNetworkList() {
  networkExpanded = !networkExpanded;
  const container = document.getElementById("network-list-container");
  const icon = document.getElementById("toggle-icon");

  if (networkExpanded) {
    // 展开
    container.style.maxHeight = container.scrollHeight + "px";
    icon.style.transform = "rotate(180deg)";
  } else {
    // 收缩
    container.style.maxHeight = "0";
    icon.style.transform = "rotate(0deg)";
  }
}

// 页面加载完成后绑定事件
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("network-toggle")
    .addEventListener("click", toggleNetworkList);
});

// --- 工具函数 ---

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatSpeed(bytesPerSec, decimals = 2) {
  if (bytesPerSec === 0) return "0 B/s";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B/s", "KB/s", "MB/s", "GB/s"];
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
  return (
    parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
}
/**
 * 渲染网卡列表
 * @param {Object} networks - 网卡速度数据 {网卡名: {upload_speed, download_speed}}
 */
function renderNetworkList(networks) {
  const container = document.getElementById("network-list-container");

  // 计算总计
  let totalUpload = 0;
  let totalDownload = 0;

  const networkNames = Object.keys(networks);

  // 检查网卡数量是否变化，如果变化则重新生成DOM
  const currentCount = container.querySelectorAll(".network-item").length;
  if (currentCount !== networkNames.length) {
    container.innerHTML = "";
    for (const name of networkNames) {
      const div = document.createElement("div");
      div.className = "network-item";
      div.id = `network-${name}`;
      div.innerHTML = `
                            <div class="stat-row" style="font-weight: 600; margin-bottom: 5px;">
                                <span class="stat-label">${name}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">↓ 下载</span>
                                <span class="stat-value download-speed" id="net-${name}-download">0 B/s</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">↑ 上传</span>
                                <span class="stat-value upload-speed" id="net-${name}-upload">0 B/s</span>
                            </div>
                        `;
      container.appendChild(div);
    }
    // 如果当前是展开状态，更新 maxHeight
    if (networkExpanded) {
      container.style.maxHeight = container.scrollHeight + "px";
    }
  }

  // 更新每个网卡的速度
  for (const [name, speed] of Object.entries(networks)) {
    totalUpload += speed.upload_speed;
    totalDownload += speed.download_speed;

    const downloadEl = document.getElementById(`net-${name}-download`);
    const uploadEl = document.getElementById(`net-${name}-upload`);
    if (downloadEl && uploadEl) {
      downloadEl.innerText = formatSpeed(speed.download_speed);
      uploadEl.innerText = formatSpeed(speed.upload_speed);
    }
  }

  // 更新总计
  document.getElementById("net-total-download").innerText =
    formatSpeed(totalDownload);
  document.getElementById("net-total-upload").innerText =
    formatSpeed(totalUpload);
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  let str = "";
  if (d > 0) str += `${d}天 `;
  if (h > 0 || d > 0) str += `${h}时 `;
  str += `${m}分 ${s}秒`;
  return str;
}

function renderCpuCores(cores) {
  const container = document.getElementById("cpu-cores-container");
  if (container.children.length !== cores.length) {
    container.innerHTML = "";
    cores.forEach((_, index) => {
      const div = document.createElement("div");
      div.className = "core-box";
      div.innerHTML = `
                            <div class="core-label">Core ${index}</div>
                            <div class="core-val" id="core-val-${index}">0%</div>
                            <div class="core-bar"><div class="core-bar-fill" id="core-bar-${index}" style="width:0%"></div></div>
                        `;
      container.appendChild(div);
    });
  }

  cores.forEach((usage, index) => {
    const valEl = document.getElementById(`core-val-${index}`);
    const barEl = document.getElementById(`core-bar-${index}`);
    if (valEl && barEl) {
      valEl.innerText = usage.toFixed(1) + "%";
      barEl.style.width = usage + "%";

      if (usage > 80) barEl.style.background = "#ff4d4f";
      else if (usage > 50) barEl.style.background = "#faad14";
      else barEl.style.background = "#1890ff";
    }
  });
}

let maxNetSpeed = 100 * 1024;

// --- 获取 CPU 名字 ---
async function updateCpuName() {
  try {
    const cpuName = await pywebview.api.get_cpu_name();
    document.getElementById("cpu-name").innerText = cpuName;
  } catch (error) {
    console.error("获取 CPU 名字失败:", error);
  }
}

// --- 主更新函数 ---
async function updateStats() {
  try {
    const response = await pywebview.api.get_system_stats();
    const data = response;

    // 1. CPU
    if (Array.isArray(data.cpu_usage)) {
      const total =
        data.cpu_usage.reduce((a, b) => a + b, 0) / data.cpu_usage.length;
      document.getElementById("cpu-total-val").innerText =
        total.toFixed(1) + "%";
      document.getElementById("cpu-total-bar").style.width = total + "%";
      renderCpuCores(data.cpu_usage);
    }

    // 2. 内存
    const memTotal = data.memory_total;
    const memUsed = data.memory_used;
    const memPercent = (memUsed / memTotal) * 100;
    const cachedValue = data.memory_cached || 0;
    const row = document.getElementById("mem-cached").closest(".stat-row");

    document.getElementById("mem-percent").innerText =
      memPercent.toFixed(1) + "%";
    document.getElementById("mem-bar").style.width = memPercent + "%";
    document.getElementById("mem-total").innerText = formatBytes(memTotal);
    document.getElementById("mem-used").innerText = formatBytes(memUsed);
    document.getElementById("mem-free").innerText = formatBytes(
      data.memory_free,
    );
    cachedValue === 0
      ? (row.style.display = "none")
      : ((row.style.display = "flex"),
        (document.getElementById("mem-cached").innerText =
          formatBytes(cachedValue)));

    // 3. 磁盘
    const diskTotal = data.disk_total_bytes;
    const diskUsed = data.disk_used_bytes;
    const diskPercent = (diskUsed / diskTotal) * 100;

    document.getElementById("disk-percent").innerText =
      diskPercent.toFixed(1) + "%";
    document.getElementById("disk-bar").style.width = diskPercent + "%";
    document.getElementById("disk-total").innerText = formatBytes(diskTotal);
    document.getElementById("disk-used").innerText = formatBytes(diskUsed);
    document.getElementById("disk-free").innerText = formatBytes(
      data.disk_free_bytes,
    );

    // 4. 系统
    document.getElementById("uptime").innerText = formatUptime(data.uptime);
    if (data.load_avg) {
      document.getElementById("load-avg").innerText =
        `${data.load_avg[0].toFixed(2)} | ${data.load_avg[1].toFixed(2)} | ${data.load_avg[2].toFixed(2)}`;
    }
  } catch (error) {
    console.error("更新数据失败:", error);
  }
}

// --- 网络速度更新函数 ---
async function updateNetworkSpeed() {
  try {
    const networks = await pywebview.api.get_network_speed();
    renderNetworkList(networks);
  } catch (error) {
    console.error("更新网络速度失败:", error);
  }
}
// --- 启动逻辑 ---
window.addEventListener("pywebviewready", function () {
  console.log("Pywebview API Ready");
  // 获取 CPU 名字（只需一次）
  updateCpuName();
  // 系统状态每1秒更新一次
  setInterval(updateStats, 1000);
  updateStats();

  // 网络速度每1秒更新一次
  setInterval(updateNetworkSpeed, 1000);
  updateNetworkSpeed();
});

let checkApi = setInterval(function () {
  if (typeof pywebview !== "undefined" && pywebview.api) {
    clearInterval(checkApi);
    console.log("Pywebview API Detected");

    // 获取 CPU 名字（只需一次）
    updateCpuName();
    // 系统状态每2秒更新一次
    setInterval(updateStats, 1000);
    updateStats();

    // 网络速度每1秒更新一次
    setInterval(updateNetworkSpeed, 1000);
    updateNetworkSpeed();
  }
}, 200);
