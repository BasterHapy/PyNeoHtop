import os
from dataclasses import asdict
from typing import Dict

import webview
from cpuinfo import get_cpu_info
from psutil import disk_usage, net_io_counters, virtual_memory

from monitoring.system_monitor import SystemMonitor
from monitoring.type import SpeedInfo


def get_resource_path(relative_path: str) -> str:
    if "__compiled__" in globals():
        base_path = os.path.dirname(__file__)
    else:
        base_path = os.path.dirname(__file__)
    return os.path.join(base_path, relative_path)


class Api:
    def __init__(self) -> None:
        self.monitor = SystemMonitor()

    def get_cpu_name(self) -> str:
        return get_cpu_info()["brand_raw"]

    def get_system_stats(self):
        status = self.monitor.collect_status(
            virtual_memory(), net_io_counters(pernic=True), disk_usage("/")
        )
        return asdict(status)

    def get_network_speed(self) -> Dict[str, SpeedInfo]:
        speed_info = self.monitor.get_network_speed(
            net_io_counters, net_io_counters, interval=1
        )
        return speed_info.networks


def main():
    api = Api()
    html_path = get_resource_path("static/index.html")
    webview.create_window(
        "PyNeoHtop", f"file://{html_path}", js_api=api, width=1200, height=550
    )
    webview.start()


if __name__ == "__main__":
    main()
