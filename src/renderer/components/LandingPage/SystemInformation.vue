<template>
  <div>
    Version:
    <span id="version">1.4.0</span>
    <p>{{ message }}</p>
    <p>{{ version }}</p>
    <p>{{ width }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      electron: process.versions.electron,
      name: this.$route.name,
      node: process.versions.node,
      path: this.$route.path,
      platform: require("os").platform(),
      vue: require("vue/package.json").version,
      only_update: false,
      check_update: false,
      message: "",
      version: "",
      width: ""
    };
  },
  methods: {
    checkUpdate() {
      this.$electron.ipcRenderer.send("quitAndInstall");
    }
  },
  mounted() {
    this.$electron.ipcRenderer.on("message", (event, text) => {
      this.message = text;
    });

    this.$electron.ipcRenderer.on("version", (event, text) => {
      this.version = text;
    });

    this.$electron.ipcRenderer.on("download-progress", (event, text) => {
      this.width = text;
    });
  }
};
</script>

<style scoped>
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}

.items {
  margin-top: 8px;
}

.item {
  display: flex;
  margin-bottom: 6px;
}

.item .name {
  color: #6a6a6a;
  margin-right: 6px;
}

.item .value {
  color: #35495e;
  font-weight: bold;
}
</style>
