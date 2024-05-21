# crx-net-filter

> 一个网络拦截扩展

## 技术要点

* [declarativeNetRequest](https://developer.chrome.google.cn/docs/extensions/reference/api/declarativeNetRequest?hl=en)

## 功能特性

- [x] 
  能够自定义规则（关于自定义规则，参见 [type-UpdateRuleOptions](https://developer.chrome.google.cn/docs/extensions/reference/api/declarativeNetRequest?hl=en#type-UpdateRuleOptions)
  ）
    - [x] 支持规则的启用/停用
- [x] 支持规则的导入导出

## 使用

> 示例规则

百度重定向到本地地址

```json
[
    {
        "action": {
            "redirect": {
                "url": "https://127.0.0.1"
            },
            "type": "redirect"
        },
        "condition": {
            "resourceTypes": [
                "main_frame"
            ],
            "urlFilter": "https://www.baidu.com/*"
        },
        "priority": 1
    }
]
```

## 注意事项

* 拦截器处理重定向时需要host_permission权限，否则会没有反应
