const dataKey = "RULE-DATA-LIST"

type Rule = any
type TCustomizedRule = Omit<Rule, "id">

type TDataItemRaw = {
    id: string
    title: string
    createdAt: number
    data: TCustomizedRule[]
    enabled: boolean
}

const updateRules = async () => {
    console.log("update rules...")
    const dataList: TDataItemRaw[] = (await chrome.storage.local.get(dataKey))[dataKey] || []
    const addRules = dataList.reduce((rules, {enabled, data}, index) => {
        if (enabled && data) {
            const itemRules = data.map((_, _index) => ({
                ..._,
                id: index + _index + 1
            }))
            rules = rules.concat(itemRules)
        }
        return rules
    }, [] as Rule[])
    console.log("addRules: ", addRules)
    // // 先获取已有的
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
    /**
     * ！！！要声明host_permissions，不然像是redirect的类型是操作不了的。而且也不报错，这是一大坑。
     */
    chrome.declarativeNetRequest.updateDynamicRules({
        // 销毁已存在的
        removeRuleIds: existingRules.map(rule => rule.id),
        addRules
    }, () => {
        console.log("已更新")
    })
    chrome.declarativeNetRequest.getDynamicRules().then(res => {
        console.log("rules>>>>>", res)
    })
}

(() => {
    // https://developer.chrome.com/docs/extensions/develop/concepts/service-workers
    // see also https://developer.chrome.google.cn/docs/extensions/develop/concepts/service-workers?hl=zh-cn (zh)
    // console.log("It's called background.js. And now it's called ServiceWorker")
    // console.log("这是background.js。现在叫ServiceWorker了")
    // console.log(chrome)
    // 这里再对rules进行处理
    chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(info => {
        console.log("NET DEBUG>>>", info)
    })
    void updateRules()
    chrome.storage.local.onChanged.addListener(() => {
        setTimeout(() => {
            void updateRules()
        }, 0)
    })
})()
