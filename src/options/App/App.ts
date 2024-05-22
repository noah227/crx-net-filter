import Rule = chrome.declarativeNetRequest.Rule;

/**
 * id字段由插件创建时自动分配
 */
type TCustomizedRule = Omit<Rule, "id">

type TDataItemBase = {
    id: string
    title: string
    createdAt: number
    updatedAt: number
    enabled: boolean
}
export type TDataItemRaw = TDataItemBase & {
    data: TCustomizedRule[]
}

export type TDataItem = TDataItemBase & {
    data: string
}

export const dataKey = "RULE-DATA-LIST"



