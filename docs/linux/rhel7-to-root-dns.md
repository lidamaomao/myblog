---
title: rhel7系列每天凌晨访问根域名服务器
date: 2021-06-30
categories:
  - Linux
tags:
  - Linux
---

### 问题

近期，安全组发现内部多台rhel7系服务器会在凌晨11:50之后去直接请求外网根域名IP。

查看`/var/log/messages`信息，只能在时间段内找到服务器上的DNSSEC验证信息。

```bash
Starting update of the root trust anchor for DNSSEC validation in unbound...
```

查询得知

> [Unbound](https://unbound.net/) 是一个具有验证，递归和缓存等功能的 DNS 解析器。

因为内部网络环境中没有防备DNS缓存投毒的需求，所以决定关闭 unbound服务。

### 解决方案

```
# systemctl stop unbound-anchor.timer
# systemctl disable unbound-anchor.timer
```

