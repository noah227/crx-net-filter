<template>
    <div class="test-modal">
        <textarea v-model="content"></textarea>
        <div class="result"></div>
        <div class="buttons">
            <button @click="testRule">测试</button>
            <button @click="closeModal">关闭</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(["update:modelValue"])
const initialContent = JSON.stringify({
    initiator: "https://music.163.com",
    method: "get",
    tabId: 0,
    type: "xmlhttprequest",
    // url: "https://www.baidu.com"
    url: "https://music.163.com/weapi/comment/resource/comments/get?csrf_token="
}, null, 4)

const content = ref(initialContent)
const validTestData = computed(() => {
    try {
        const data = JSON.parse(content.value)
        return Object.entries(data).reduce((ret, [k, v]) => {
            if (v) ret[k] = v
            return ret
        }, {} as { [index: string]: any })
    } catch (e) {
        return null
    }
})

const closeModal = () => emits("update:modelValue", false)

/**
 * 这玩意儿目前在 `@types/chrome` 里面还没有
 * @see https://developer.chrome.google.cn/docs/extensions/reference/api/declarativeNetRequest?hl=en#method-testMatchOutcome
 */
const testRule = () => {
    // return console.warn("仅开发时可用，暂时不启用；需要输入内容才能进行匹配");
    if (validTestData.value) {
        console.log(validTestData.value, "<<");
        (chrome.declarativeNetRequest as any).testMatchOutcome({
            ...validTestData.value
        }).then((res: any) => console.log(res))
    }
}
</script>

<style lang="scss" scoped>
.test-modal {
    position: fixed;
    z-index: 3333;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    height: 380px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    box-shadow: 0 0 3px;

    > * {
        width: 100%;
        box-sizing: border-box;
    }

    > textarea {
        flex-grow: 1;
    }

    div:last-child {
        text-align: right;
    }
}
</style>
