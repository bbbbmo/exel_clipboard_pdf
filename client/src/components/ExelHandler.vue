<!-- src/components/ExcelHandler.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-end">
        <!-- 엑셀 내보내기 버튼 -->
        <v-btn color="success" @click="exportToExcel" class="mr-2">
          엑셀로 내보내기
        </v-btn>

        <!-- 엑셀 가져오기 버튼 -->
        <v-btn color="info" @click="$refs.fileInput.click()">
          엑셀 가져오기
        </v-btn>
        <input
          type="file"
          ref="fileInput"
          accept=".xlsx, .xls, .csv"
          @change="importFromExcel"
          style="display: none"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import * as XLSX from "xlsx";

// 부모 컴포넌트로부터 데이터를 받기 위한 props 정의
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
});

// 부모 컴포넌트로 데이터를 전달하기 위한 emit 정의
const emit = defineEmits(["importedData"]);

// 엑셀 내보내기 함수
const exportToExcel = () => {
  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(props.data);

  // 워크북 생성 및 워크시트 추가
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // 엑셀 파일 생성 및 다운로드
  XLSX.writeFile(workbook, "data.xlsx");
};

// 엑셀 가져오기 함수
const importFromExcel = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // 첫 번째 시트 선택
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // JSON 데이터로 변환
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 부모 컴포넌트로 데이터 전달
    emit("importedData", jsonData);
  };

  reader.readAsArrayBuffer(file);
};
</script>

<style scoped></style>
