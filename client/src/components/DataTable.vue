<!-- src/components/DataTable.vue -->
<template>
  <v-container>
    <ExcelHandler
      :data="items"
      :headers="headers"
      @importedData="handleImportedData"
    />

    <v-row class="my-4">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="primary" @click="copyToClipboard">
          선택한 데이터 복사
        </v-btn>
        <v-btn color="secondary" @click="copyAllToClipboard" class="ml-2">
          모든 데이터 복사
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="items"
          item-key="id"
          class="elevation-1"
          show-select
          v-model:select="selected"
        >
          <!-- 필요한 경우 슬롯을 사용하여 커스터마이징 -->
        </v-data-table>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="justify-center">
      <v-col cols="12" class="d-flex justify-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Snackbar for feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios"; // axios 임포트
import ExcelHandler from "./ExelHandler.vue"; // ExcelHandler 컴포넌트 임포트

// 데이터 테이블 헤더더
const headers = ref([
  { text: "ID", value: "id" },
  { text: "이름", value: "name" },
  { text: "나이", value: "age" },
  { text: "직업", value: "job" },
]);

const items = ref([]); // 초기 데이터는 비워둡니다.
const selected = ref([]); // 선택된 행을 저장
const loading = ref(false); // 로딩 상태

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
  timeout: 2000,
});

const showSnackbar = (message, color = "success") => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};

// 데이터 가져오기
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/api/data"); // API 엔드포인트
    items.value = response.data;
    console.log(items.value);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    showSnackbar("데이터를 로드하는 데 실패했습니다.", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// 엑셀에서 가져온 데이터를 처리하는 함수
const handleImportedData = (importedData) => {
  // 필요한 경우 데이터 검증 또는 변환
  items.value = importedData;
  showSnackbar("엑셀 데이터를 성공적으로 가져왔습니다!");
};

// HTML 테이블을 문자열로 변환하는 함수
const generateHTMLTable = (data) => {
  let html = "<table border='1'><thead><tr>";
  headers.value.forEach((header) => {
    html += `<th>${header.text}</th>`;
  });
  html += "</tr></thead><tbody>";
  data.forEach((item) => {
    html += "<tr>";
    headers.value.forEach((header) => {
      html += `<td>${item[header.value]}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table>";
  return html;
};

// 특정 데이터를 클립보드에 HTML 형식으로 복사 (Clipboard API 사용)
const copyToClipboard = async () => {
  if (selected.value.length === 0) {
    showSnackbar("복사할 데이터를 선택해주세요.", "warning");
    return;
  }

  const htmlTable = generateHTMLTable(selected.value);

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([htmlTable], { type: "text/html" }),
        "text/plain": new Blob([htmlTable], { type: "text/plain" }),
      }),
    ]);
    showSnackbar("선택한 데이터가 클립보드에 복사되었습니다!");
  } catch (error) {
    console.error("클립보드 복사 실패:", error);
    showSnackbar("클립보드 복사에 실패했습니다.", "error");
  }
};

// 모든 데이터를 클립보드에 HTML 형식으로 복사 (Clipboard API 사용)
const copyAllToClipboard = async () => {
  if (items.value.length === 0) {
    showSnackbar("복사할 데이터가 없습니다.", "warning");
    return;
  }

  const htmlTable = generateHTMLTable(items.value);

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([htmlTable], { type: "text/html" }),
        "text/plain": new Blob([htmlTable], { type: "text/plain" }),
      }),
    ]);
    showSnackbar("모든 데이터가 클립보드에 복사되었습니다!");
  } catch (error) {
    console.error("클립보드 복사 실패:", error);
    showSnackbar("클립보드 복사에 실패했습니다.", "error");
  }
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
