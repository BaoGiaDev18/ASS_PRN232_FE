# SWP Q&A Tools - Hướng dẫn dự án Frontend

## Cấu trúc thư mục

```
src/
├── api/                  → Tầng gọi API
│   ├── axiosInstance.ts  → Cấu hình axios (BASE_URL, interceptors, token)
│   ├── questionService.ts→ Các hàm gọi API cho Question
│   └── types.ts          → Định nghĩa TypeScript interfaces (User, Group, Topic, Question, Answer...)
│
├── assets/               → Hình ảnh, icon tĩnh
│
├── components/           → Components dùng chung (không chứa logic nghiệp vụ)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── StatCard.tsx
│   └── StatusBadge.tsx
│
├── context/
│   └── AuthContext.tsx   → Quản lý đăng nhập / đăng xuất / chuyển role
│
├── layouts/
│   ├── AuthLayout.tsx    → Layout trang Login (không sidebar)
│   └── MainLayout.tsx    → Layout chính (sidebar + header + breadcrumb)
│
├── pages/                → Các trang theo từng role
│   ├── auth/LoginPage.tsx
│   ├── student/          → StudentDashboard, CreateQuestion, QuestionDetail
│   ├── supervisor/       → SupervisorDashboard (duyệt câu hỏi)
│   ├── reviewer/         → ReviewerDashboard (trả lời câu hỏi)
│   └── admin/            → AdminDashboard, UserManagement, GroupManagement, TopicManagement, HistoryLogs
│
├── routes/
│   ├── index.tsx         → Định nghĩa tất cả routes + phân quyền theo role
│   └── ProtectedRoute.tsx→ Guard kiểm tra đăng nhập & role
│
├── utils/
│   ├── helpers.ts        → Hàm tiện ích (formatDate...)
│   └── mockData.ts       → ⚠️ Dữ liệu giả (thay bằng API khi có BE)
│
├── App.tsx               → Entry component (RouterProvider)
├── main.tsx              → Mount React vào DOM
└── index.css             → Tailwind CSS config + global styles
```

---

## Khi BE cung cấp API — Cần thay đổi ở đâu?

### 1. Cập nhật BASE_URL → `src/api/axiosInstance.ts`

```ts
// Thay URL thật từ BE vào đây
const api = axios.create({
  baseURL: "https://your-backend-url.com/api",
});
```

### 2. Thêm JWT Token → `src/api/axiosInstance.ts`

Thêm interceptor gắn token vào mỗi request:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Viết các service gọi API → `src/api/`

Tạo thêm file hoặc bổ sung vào các file có sẵn:

| File cần tạo/sửa         | Mục đích                     |
| ------------------------ | ---------------------------- |
| `questionService.ts`     | CRUD câu hỏi, duyệt, từ chối |
| `userService.ts`         | Đăng nhập, CRUD user         |
| `groupService.ts`        | CRUD group, group members    |
| `topicService.ts`        | CRUD topic                   |
| `answerService.ts`       | Gửi câu trả lời              |
| `notificationService.ts` | Lấy thông báo                |

### 4. Thay mockData trong từng page → `src/pages/`

Mỗi page hiện đang import từ `mockData.ts`. Khi có API, thay bằng lời gọi API thật.

**Ví dụ — StudentDashboard.tsx:**

```ts
// ❌ Hiện tại (mock)
import { mockQuestions } from "../../utils/mockData";
const questions = mockQuestions.filter(...);

// ✅ Sau khi có API
import { getMyQuestions } from "../../api/questionService";
const [questions, setQuestions] = useState([]);
useEffect(() => {
  getMyQuestions().then(setQuestions);
}, []);
```

### 5. Cập nhật AuthContext → `src/context/AuthContext.tsx`

Thay login mock bằng API login thật, lưu token vào localStorage:

```ts
const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  setUser(res.data.user);
};
```

---

## Tóm tắt

| Việc cần làm                | File                          |
| --------------------------- | ----------------------------- |
| Đổi BASE_URL                | `src/api/axiosInstance.ts`    |
| Gắn JWT token               | `src/api/axiosInstance.ts`    |
| Viết các hàm gọi API        | `src/api/*.ts`                |
| Thay mock → API trong pages | `src/pages/**/*.tsx`          |
| Login thật + lưu token      | `src/context/AuthContext.tsx` |
| Xóa mock data (khi xong)    | `src/utils/mockData.ts`       |
