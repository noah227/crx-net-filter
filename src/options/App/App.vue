<template>
    <div id="options">
        <div>
            <strong id="title">测试</strong>
            <span>
                <button @click="addNew">Add</button>
                <button @click="testRule">Test</button>
                <button @click="ImportData">Import</button>
                <button @click="exportData">Export</button>
            </span>
        </div>
        <table>
            <thead>
            <tr>
                <th>名称</th>
                <th>创建时间</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in renderDataList" :key="index">
                <td>{{ item.title }}</td>
                <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
                <td>
                    <button @click="currentIndex=index">编辑</button>
                    <button @click="switchStatus(item)">{{ item.enabled ? "禁用" : "启用" }}</button>
                    <button class="danger" @click="removeItem(index)">删除</button>
                </td>
            </tr>
            </tbody>
        </table>
        <div v-if="currentItem" id="editor-wrapper" @click.self="closeEditor">
            <div>
                <div>
                    <input type="text" v-model="currentItem.title">
                    <div>
                        <button @click="saveCurrent">保存</button>
                        <button @click="closeEditor">关闭</button>
                    </div>
                </div>
                <Editor ref="refEditor" v-model="currentItem.data" language="json"></Editor>
            </div>
        </div>
        <TestModal v-if="showTestModal" v-model="showTestModal"></TestModal>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, shallowRef} from "vue";
import Editor from "./Editor.vue"
import TestModal from "./Modal.Test.vue"
import {dataKey, TDataItem, TDataItemRaw} from "@/options/App/App";
const uuid = require("uuid")

const refEditor = shallowRef()
const initialContent = JSON.stringify(require("./sample.json"), null, 4)
const currentIndex = ref(-1)
const currentItem = computed<TDataItem | null>(() => currentIndex.value >= 0 ? dataList.value[currentIndex.value] : null)

const dataList = ref<TDataItem[]>([])
const renderDataList = computed(() => dataList.value.filter(item => !item.id.startsWith("NEW-")))

const loadDataList = () => {
    chrome.storage.local.get(dataKey).then(res => {
        const dataListRaw = (res[dataKey] || []) as TDataItemRaw[]
        dataList.value = dataListRaw.map(item => ({
            ...item,
            data: JSON.stringify(item.data, null, 4)
        }))
    })
}

const closeEditor = () => {
    currentIndex.value = -1
    // 直接重载了，不用移除了
    loadDataList()
}
const addNew = () => {
    dataList.value.push({
        id: `NEW-${Date.now()}`,
        title: "新建",
        createdAt: Date.now(),
        data: initialContent,
        enabled: true
    })
    currentIndex.value = dataList.value.length - 1
}
const saveCurrent = () => {
    if (confirm("保存？")) {
        saveDataList(true)
    }
}
const saveDataList = (reloadData = false) => new Promise((resolve, reject) => {
    chrome.storage.local.set({
        [dataKey]: dataList.value.map(item => ({
            ...item,
            id: item.id.startsWith("NEW-") ? uuid.v4() : item.id,
            data: JSON.parse(item.data)
        }))
    }).then((res) => {
        reloadData && loadDataList()
        resolve(res)
    }).catch(reject)
})
const switchStatus = (item: TDataItem) => {
    item.enabled = !item.enabled
    saveDataList(true)
}
const removeItem = (index: number) => {
    if (confirm("Remove this?")) {
        dataList.value.splice(index, 1)
        saveDataList(true)
    }
}

const showTestModal = ref(false)
const testRule = () => {
    showTestModal.value = true
}
const ImportData = () => alert("暂未开放！")
const exportData = () => alert("暂未开放！")
onMounted(() => {
    console.log(chrome)
    loadDataList()
})

</script>
<style lang="scss">
@import "common.table-bordered";

html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0
}

* {
    font-size: 14px;
}

#app {
    width: 100%;
    height: 100%;
}

#options {
    width: 75%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    > div:first-child {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    #title {
        font-size: 3rem;
        color: #0000;
        background-image: linear-gradient(90deg, pink, #FFC0CBa0, aqua, #00FFFF20);
        -webkit-background-clip: text;
    }
    > div:first-child {
        > span:last-child {
            button {
                margin-left: 12px;
            }
        }
    }

    > div:last-child {
        flex-grow: 1;
    }
}

table {
    text-align: left;
}

th, td {
    padding: 12px;
}

td button {
    margin-right: 12px;

    &:first-child {
        color: #fff;
        background-color: $color-primary;
    }

    &:last-child {
        color: #fff;
        background-color: $color-danger;
    }
}

#editor-wrapper {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #c0c0c0c0;

    > div {
        position: absolute;
        width: 50%;
        height: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        box-shadow: 0 0 3px;
        display: flex;
        flex-direction: column;
        background-color: #fff;

        > div:not(:last-child) {
            display: flex;
            justify-content: space-between;
            align-items: center;

            > :first-child {
                flex-grow: 1;
            }

            > div > button {
                color: #fff;

                &:first-child {
                    background-color: $color-success;
                }

                &:last-child {
                    background-color: $color-danger;
                }
            }
        }

        > div:last-child {
            width: 100%;
            flex-grow: 1;
            margin: 0;
        }
    }
}
</style>