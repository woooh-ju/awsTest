# Seminar Backend API

Express.js와 AWS RDS를 활용한 세미나 정보 제공 백엔드입니다.

## 프로젝트 구조

```
.
├── config/
│   └── database.js        # RDS 데이터베이스 연결 설정
├── controllers/
│   └── seminarController.js   # 비즈니스 로직
├── routes/
│   └── seminars.js        # API 라우트
├── server.js              # 메인 서버 파일
├── .env                   # 환경 변수 (RDS 연결 정보)
├── .gitignore             # Git 무시 파일
└── package.json           # 프로젝트 의존성
```

## 설치 및 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일에서 AWS RDS 연결 정보를 입력하세요:
```
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_password
DB_NAME=seminar_db
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

### 3. 데이터베이스 테이블 생성
RDS에서 다음 SQL을 실행하여 테이블을 생성하세요:
```sql
CREATE TABLE seminars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATETIME NOT NULL,
  location VARCHAR(255),
  speaker VARCHAR(255),
  capacity INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 실행

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 1. 모든 세미나 조회
**요청:**
```
GET /api/seminars
```

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Web Development 101",
      "description": "웹 개발 기초 강좌",
      "date": "2024-02-15T10:00:00Z",
      "location": "Seoul",
      "speaker": "John Doe",
      "capacity": 100
    }
  ],
  "count": 1
}
```

### 2. 특정 세미나 조회
**요청:**
```
GET /api/seminars/:id
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Web Development 101",
    "description": "웹 개발 기초 강좌",
    "date": "2024-02-15T10:00:00Z",
    "location": "Seoul",
    "speaker": "John Doe",
    "capacity": 100
  }
}
```

### 3. 새로운 세미나 추가
**요청:**
```
POST /api/seminars
Content-Type: application/json

{
  "title": "Web Development 101",
  "description": "웹 개발 기초 강좌",
  "date": "2024-02-15T10:00:00Z",
  "location": "Seoul",
  "speaker": "John Doe",
  "capacity": 100
}
```

**응답:**
```json
{
  "success": true,
  "message": "세미나가 등록되었습니다.",
  "id": 1
}
```

### 4. 세미나 정보 수정
**요청:**
```
PUT /api/seminars/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "date": "2024-02-20T10:00:00Z",
  "location": "Busan",
  "speaker": "Jane Doe",
  "capacity": 150
}
```

**응답:**
```json
{
  "success": true,
  "message": "세미나 정보가 수정되었습니다."
}
```

### 5. 세미나 삭제
**요청:**
```
DELETE /api/seminars/:id
```

**응답:**
```json
{
  "success": true,
  "message": "세미나가 삭제되었습니다."
}
```

## AWS EC2 배포 방법

### 1. EC2 인스턴스 생성
- Ubuntu 20.04 LTS 또는 최신 버전 선택
- 보안 그룹에서 포트 3000 허용

### 2. Node.js 설치
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. 프로젝트 배포
```bash
git clone your-repo-url
cd seminar-backend
npm install
```

### 4. PM2로 프로세스 관리
```bash
sudo npm install -g pm2
pm2 start server.js --name "seminar-api"
pm2 startup
pm2 save
```

### 5. Nginx 리버스 프록시 설정 (선택사항)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: AWS RDS (MySQL)
- **Server**: AWS EC2
- **ORM**: mysql2 (promise 기반)

## 라이선스

ISC
