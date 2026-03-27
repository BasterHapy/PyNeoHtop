from platform import system
from time import sleep, time
from typing import Callable, Dict, Literal

from psutil import boot_time, cpu_percent, getloadavg
from psutil._ntuples import sdiskusage, snetio, svmem

from monitoring.type import NetworkInfo, SpeedInfo, SystemStats


class SystemMonitor:
    def collect_status(
        self,
        memory: svmem,
        networks: Dict[str, snetio],
        disks: sdiskusage,
    ) -> SystemStats:

        return SystemStats(
            cpu_usage=cpu_percent(interval=None, percpu=True),
            memory_total=memory.total,
            memory_used=memory.used,
            memory_free=memory.available,
            memory_cached=None if system() == "Windows" else memory.cached,
            uptime=int(time() - boot_time()),
            load_avg=getloadavg(),
            network_usage=networks,
            disk_total_bytes=disks.total,
            disk_used_bytes=disks.used,
            disk_free_bytes=disks.free,
        )

    def get_network_speed(
        self,
        networks_start: Callable[[Literal[True]], Dict[str, snetio]],
        networks_end: Callable[[Literal[True]], Dict[str, snetio]],
        interval: int = 1,
    ) -> NetworkInfo:

        io_start = networks_start(True)
        sleep(interval)
        io_end = networks_end(True)

        result: Dict[str, SpeedInfo] = {}
        for name, network_usage in io_start.items():
            # 获取两次采样的数据
            start_stats = io_start[name]
            end_stats = io_end[name]

            # 计算差值
            bytes_sent_diff = end_stats.bytes_sent - start_stats.bytes_sent
            bytes_recv_diff = end_stats.bytes_recv - start_stats.bytes_recv

            # 计算速率（字节/秒）
            upload_speed: float = bytes_sent_diff / interval
            download_speed: float = bytes_recv_diff / interval

            result[name] = {
                "upload_speed": upload_speed,
                "download_speed": download_speed,
            }
        return NetworkInfo(result)
