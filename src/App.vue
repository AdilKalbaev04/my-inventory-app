<template>
  <div class="app">
    <h1>Мой инвентарь</h1>
    <div class="inventory-list">
      <InventoryItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @delete="deleteItem"
      />
    </div>
    <div class="add-item">
      <input
        type="text"
        placeholder="Название предмета"
        v-model="newItem.name"
      />
      <input
        type="text"
        placeholder="Детали предмета"
        v-model="newItem.details"
      />
      <button @click="addItem">Добавить предмет</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import InventoryItem from "./components/InventoryItem.vue";
import axios from "axios";

export default {
  components: {
    InventoryItem,
  },
  setup() {
    const items = ref([]);

    const newItem = ref({
      name: "",
      details: "",
    });

    async function fetchItems() {
      try {
        const response = await axios.get("http://localhost:3000/api/items");
        items.value = response.data;
      } catch (error) {
        console.error("Error fetching items", error);
      }
    }

    async function addItem() {
      try {
        const response = await axios.post("http://localhost:3000/api/items", {
          name: newItem.value.name,
          details: newItem.value.details,
        });

        items.value.push(response.data);
        clearForm();
      } catch (error) {
        console.error("Error adding item", error);
      }
    }

    async function deleteItem(itemId) {
      try {
        await axios.delete(`http://localhost:3000/api/items/${itemId}`);
        items.value = items.value.filter((item) => item.id !== itemId);
      } catch (error) {
        console.error("Error deleting item", error);
      }
    }

    function clearForm() {
      newItem.value.name = "";
      newItem.value.details = "";
    }

    onMounted(fetchItems);

    return {
      items,
      newItem,
      addItem,
      deleteItem,
    };
  },
};
</script>

<style>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.inventory-list {
  margin-top: 20px;
}

.add-item {
  margin-top: 20px;
}

.add-item input {
  width: 200px;
  margin-right: 10px;
}

.add-item button {
  padding: 5px 10px;
}
</style>
