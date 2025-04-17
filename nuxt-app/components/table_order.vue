<template>
  <div class="data-table">
    <div class="filters">
      <input
          v-model="filters.search"
          placeholder="Поиск по названию"
          class="search-input"
      />
      <select v-model="filters.status" class="status-filter">
        <option value="">Все статусы</option>
        <option value="active">В наличии</option>
        <option value="out_of_stock">Нет в наличии</option>
      </select>
    </div>
    <table>
      <thead>
      <tr>
        <th @click="sortBy('id')"><div class="column-header"><span>№</span> <span>▲▼</span></div> </th>
        <th @click="sortBy('name')"><div class="column-header"><span>Название</span> <span>▲▼</span></div></th>
        <th @click="sortBy('brand')"><div class="column-header"><span>Бренд</span> <span>▲▼</span></div></th>
        <th @click="sortBy('price')"><div class="column-header"><span>Цена</span> <span>▲▼</span></div> </th>
        <th @click="sortBy('date_created')"><div class="column-header"><span>Дата доставки</span> <span>▲▼</span></div> </th>
        <th >Статус</th>

      </tr>
      </thead>
      <tbody>
      <tr v-for="item in paginatedData" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{item.brand}}</td>
        <td>{{item.price}}</td>
        <td>{{ item.date_created.split('T')[0] }}</td>
        <td>
            <span :class="['status-badge', item.status === 'active' ? 'active' : 'out_of_stock']">
              {{ item.status === "active" ? 'В наличии' : 'Нет в наличии' }}
            </span>
        </td>

      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="page-btn"
      >
        Назад
      </button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="page-btn"
      >
        Вперед
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ProductItem {
  id?: number;
  name?: string;
  body?: string;
  status?: string | number;
  date_created?: string;
  [key: string]: any;
}

interface FilterOptions {
  search: string;
  status: string;
  date: string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const userData = useState<{ product?: ProductItem[] }>('user');
const items = computed<ProductItem[]>(() => {
  try {
    return userData.value?.product || [];
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    return [];
  }
});

const filters = ref<FilterOptions>({
  search: '',
  status: '',
  date: ''
});

const sortConfig = ref<SortConfig>({
  key: 'id',
  direction: 'asc'
});

const currentPage = ref<number>(1);
const itemsPerPage = 5;

const filteredData = computed<ProductItem[]>(() => {
  try {
    return (items.value || []).filter(item => {
      if (!item) return false;

      const title = item.name || '';
      const body = item.body || '';
      const status = item.status?.toString() || '';
      const date = item.date_created ? new Date(item.date_created) : null;

      const matchesSearch = filters.value.search === '' ||
          title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
          body.toLowerCase().includes(filters.value.search.toLowerCase());

      const matchesStatus = filters.value.status === '' ||
          status === filters.value.status;

      const matchesDate = filters.value.date === '' ||
          (date && isSameDay(date, filters.value.date));

      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      if (!a || !b) return 0;

      let modifier = 1;
      if (sortConfig.value.direction === 'desc') modifier = -1;

      // сортируем по дате
      if (sortConfig.value.key === 'date_created') {
        const aDate = a.date_created ? new Date(a.date_created) : null;
        const bDate = b.date_created ? new Date(b.date_created) : null;

        if (!aDate || !bDate) return 0;
        return (aDate.getTime() - bDate.getTime()) * modifier;
      }

      const aValue = a[sortConfig.value.key];
      const bValue = b[sortConfig.value.key];

      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return modifier;
      return 0;
    });
  } catch (error) {
    console.error('Ошибка фильтрации и сортировки:', error);
    return [];
  }
});

const totalPages = computed<number>(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

const paginatedData = computed<ProductItem[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredData.value.slice(start, end);
});

const sortBy = (key: string): void => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortConfig.value.key = key;
    sortConfig.value.direction = 'asc';
  }
};

const nextPage = (): void => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

function isSameDay(date: Date, dateString: string): boolean {
  if (!date || !dateString) return false;

  const comparisonDate = new Date(dateString);
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date.toISOString().split('T')[0] === dateString;
  }

  return (
      date.getFullYear() === comparisonDate.getFullYear() &&
      date.getMonth() === comparisonDate.getMonth() &&
      date.getDate() === comparisonDate.getDate()
  );
}
</script>
<style></style>
