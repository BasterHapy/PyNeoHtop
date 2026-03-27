from cpuinfo import get_cpu_info

if __name__ == "__main__":
    # while True:
    #     net_io_start = net_io_counters(pernic=True)
    #     time.sleep(1.0)
    #     net_io_end = net_io_counters(pernic=True)
    #     stop_time = time.time()

    #     result = {}
    #     for name, network_usage in net_io_start.items():
    #         # 获取两次采样的数据
    #         start_stats = net_io_start[name]
    #         end_stats = net_io_end[name]

    #         # 计算差值
    #         bytes_sent_diff = end_stats.bytes_sent - start_stats.bytes_sent
    #         bytes_recv_diff = end_stats.bytes_recv - start_stats.bytes_recv

    #         # 计算速率（字节/秒）
    #         upload_speed = bytes_sent_diff / 1
    #         download_speed = bytes_recv_diff / 1

    #         # 转换为更易读的单位
    #         def format_speed(speed):
    #             """格式化速率显示"""
    #             if speed < 1024:
    #                 return f"{speed:.2f} B/s"
    #             elif speed < 1024 * 1024:
    #                 return f"{speed / 1024:.2f} KB/s"
    #             else:
    #                 return f"{speed / (1024 * 1024):.2f} MB/s"

    #         result[name] = {
    #             "upload_speed": upload_speed,
    #             "download_speed": download_speed,
    #         }
    #         print(result)
    # main()
    info = get_cpu_info()["brand_raw"]
    print(info)
