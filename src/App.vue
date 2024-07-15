<template>
  <div class="app" :class="theme">
    <h1>Мой инвентарь</h1>
    <button @click="toggleTheme">
      {{ theme === "light" ? "Темная тема" : "Светлая тема" }}
    </button>
    <div class="content">
      <div class="inventory-list">
        <InventoryItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @select="selectItem"
          @delete="deleteItem"
        />
      </div>
      <div class="item-details" v-if="selectedItem">
        <ItemModal
          :item="selectedItem"
          @close="selectedItem = null"
          @delete="deleteItem"
        />
      </div>
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
      <input type="file" @change="onFileChange" />
      <button @click="addItem">Добавить предмет</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import InventoryItem from "./components/InventoryItem.vue";
import ItemModal from "./components/ItemModal.vue";
import axios from "axios";

export default {
  components: {
    InventoryItem,
    ItemModal,
  },
  setup() {
    const items = ref([]);
    const selectedItem = ref(null);
    const newItem = ref({
      name: "",
      details: "",
      image: null,
    });

    const theme = ref("light");

    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/items");
        items.value = response.data;
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };

    const addItem = async () => {
      const formData = new FormData();
      formData.append("name", newItem.value.name);
      formData.append("details", newItem.value.details);
      if (newItem.value.image) {
        formData.append("image", newItem.value.image);
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/items",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        items.value.push(response.data);
        clearForm();
      } catch (error) {
        console.error("Error adding item", error);
      }
    };

    const deleteItem = async (itemId) => {
      try {
        await axios.delete(`http://localhost:3000/api/items/${itemId}`);
        items.value = items.value.filter((item) => item.id !== itemId);
        if (selectedItem.value && selectedItem.value.id === itemId) {
          selectedItem.value = null;
        }
      } catch (error) {
        console.error("Error deleting item", error);
      }
    };

    const selectItem = (item) => {
      selectedItem.value = item;
    };

    const onFileChange = (event) => {
      newItem.value.image = event.target.files[0];
    };

    const clearForm = () => {
      newItem.value.name = "";
      newItem.value.details = "";
      newItem.value.image = null;
    };

    const toggleTheme = () => {
      theme.value = theme.value === "light" ? "dark" : "light";
    };

    onMounted(fetchItems);

    return {
      items,
      newItem,
      selectedItem,
      addItem,
      deleteItem,
      selectItem,
      onFileChange,
      theme,
      toggleTheme,
    };
  },
};
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content {
  display: flex;
}

.inventory-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item-details {
  flex: 1;
  margin-left: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
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

/* Dark Theme */
.app.dark {
  background-color: #121212;
  color: #ffffff;
}

.app.dark .item-details {
  background-color: #1e1e1e;
  border-color: #333;
}

.app.dark .add-item input,
.app.dark .add-item button {
  background-color: #333;
  color: #ffffff;
  border-color: #444;
}

/* Light Theme */
.app.light {
  background-color: #ffffff;
  color: #000000;
}

.app.light .item-details {
  background-color: #f9f9f9;
  border-color: #ccc;
}

.app.light .add-item input,
.app.light .add-item button {
  background-color: #ffffff;
  color: #000000;
  border-color: #ccc;
}
</style>
