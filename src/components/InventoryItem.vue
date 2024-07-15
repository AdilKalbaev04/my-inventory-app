<template>
    <div class="inventory-item">
      <h3>{{ item.name }}</h3>
      <button @click="toggleDetailsPanel">Показать детали</button>
      <div v-if="showDetailsPanel" class="details-panel">
        <p>{{ item.details }}</p>
      </div>
      <button @click="deleteItem">Удалить</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showDetailsPanel: false,
      };
    },
    methods: {
      toggleDetailsPanel() {
        this.showDetailsPanel = !this.showDetailsPanel;
      },
      deleteItem() {
        this.$emit("delete", this.item.id);
      },
    },
  };
  </script>
  
  <style scoped>
  .inventory-item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .details-panel {
    background-color: #f0f0f0;
    padding: 10px;
    margin-top: 5px;
  }
  
  button {
    margin-top: 5px;
    padding: 5px 10px;
  }
  </style>
  