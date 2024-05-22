<template>
    <div>
        <div>this is popup page</div>
        <img src="@/assets/logo.png" alt="">
        <div>popup的输出在自己的世界里，对着popup的弹出右键可以审查元素。</div>
        <div>popup has it's isolated running world, right click to trigger context menu and inspect.</div>
    </div>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
