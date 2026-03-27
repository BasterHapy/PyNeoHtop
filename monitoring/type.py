from dataclasses import dataclass
from typing import Dict, List, NamedTuple, Optional, Tuple, TypedDict

from psutil._ntuples import snetio


# @dataclass
class ProcessData:
    pid: int
    name: str
    cmd: tuple[str]
    user_id: Optional[str]
    cpu_usage: float
    memory: int
    status: str  # 这里可能有一些问题
    ppid: Optional[int]
    environ: Tuple[str]
    root: str
    virtual_memory: int
    start_time: int
    run_time: int
    disk_usage: NamedTuple
    session_id: Optional[int]


# @dataclass
class ProcessStaticInfo:
    name: str
    command: str
    user: str


# @dataclass
class ProcessInfo:
    pid: int
    ppid: int
    name: str
    cpu_usage: int
    memory_usage: int
    status: str
    user: str
    command: str
    threads: Optional[int]
    environ: Tuple[str]
    root: str
    virtual_memory: int
    start_time: int
    run_time: int
    disk_usage: Tuple[int, int]
    session_id: Optional[int]


class SpeedInfo(TypedDict):
    upload_speed: float
    download_speed: float


@dataclass
class NetworkInfo:
    networks: Dict[str, SpeedInfo]


@dataclass
class SystemStats:
    cpu_usage: List[float]
    memory_total: int
    memory_used: int
    memory_free: int
    memory_cached: int | None
    uptime: int
    load_avg: Tuple[float, float, float]
    network_usage: Dict[str, snetio]
    disk_total_bytes: int
    disk_used_bytes: int
    disk_free_bytes: int
