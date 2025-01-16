// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000; // 서버가 실행될 포트 번호

// CORS 설정
const corsOptions = {
  origin: "http://127.0.0.1:5173", // 프론트엔드 도메인
  optionsSuccessStatus: 200,
};

// 미들웨어 설정
app.use(cors(corsOptions)); // 도메인에서의 요청을 허용
app.use(express.json()); // JSON 요청 본문을 파싱

// 더미 데이터 (예시)
const data = [
  { id: 1, name: "홍길동", age: 30, job: "개발자" },
  { id: 2, name: "김철수", age: 25, job: "디자이너" },
  { id: 3, name: "이영희", age: 28, job: "마케터" },
  // 추가 데이터...
];

// API 엔드포인트: 데이터 가져오기
app.get("/api/data", (req, res) => {
  res.json(data);
});

// API 엔드포인트: 데이터 추가하기 (POST 요청 예시)
app.post("/api/data", (req, res) => {
  const newData = req.body;
  if (newData.name && newData.age && newData.job) {
    data.push(newData);
    res.status(201).json({ message: "데이터가 성공적으로 추가되었습니다." });
  } else {
    res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
