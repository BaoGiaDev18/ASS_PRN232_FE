# SWP Q&A Tools - Backend API Documentation

> **Tai lieu mo ta chi tiet Backend API danh cho Frontend Team**
>
> Cap nhat: 2025-07-15

---

## Muc luc

- [1. Tong quan Project](#1-tong-quan-project)
- [2. Base URL va Swagger](#2-base-url-va-swagger)
- [3. Authentication (JWT)](#3-authentication-jwt)
- [4. User Roles](#4-user-roles)
- [5. Error Response Format](#5-error-response-format)
- [6. API Endpoints](#6-api-endpoints)
  - [6.1. Auth APIs](#61-auth-apis-apiauth)
  - [6.2. Admin - User Management](#62-admin---user-management-apiusers)
  - [6.3. Admin - Topic Management](#63-admin---topic-management-apitopics)
  - [6.4. Admin - Group Management](#64-admin---group-management-apigroups)
  - [6.5. Admin - History](#65-admin---history-apiadminhistory)
  - [6.6. Supervisor APIs](#66-supervisor-apis-apisupervisorquestions)
  - [6.7. Reviewer APIs](#67-reviewer-apis-apireviewerquestions)
  - [6.8. Student APIs](#68-student-apis-apistudent)
- [7. DTO Reference](#7-dto-reference)
- [8. Ghi chu cho FE Team](#8-ghi-chu-cho-fe-team)

---

## 1. Tong quan Project

| Thong tin | Chi tiet |
|-----------|----------|
| **Framework** | ASP.NET Core Web API (.NET 8) |
| **Authentication** | JWT Bearer Token |
| **Architecture** | 3-Layer: API -> BusinessLogicLayer -> DataAccessLayer |
| **Database** | SQL Server (`swp_qa_tools`) |
| **Password Hashing** | SHA256 (Hex string) |
| **CORS** | Da cau hinh cho FE tai `http://localhost:5173` |

### Cau truc Solution

```
PRN232_Group03_SwpQATool/
|-- SWP_QA_Tools_APIs/          # API Layer (Controllers, Program.cs)
|-- BusinessLogicLayer/          # Business Logic (Services, DTOs)
|-- DataAccessLayer/             # Data Access (Models, Repositories)
```

---

## 2. Base URL va Swagger

### Development URLs

| Profile | URL |
|---------|-----|
| **HTTP** | `http://localhost:5050` |
| **HTTPS** | `https://localhost:7443` |
| **IIS Express HTTP** | `http://localhost:12650` |
| **IIS Express HTTPS** | `https://localhost:44345` |

### Frontend Origin (CORS)

```
http://localhost:5173
```

### Swagger UI

```
http://localhost:5050/swagger/index.html
https://localhost:7443/swagger/index.html
```

> Swagger chi kha dung trong moi truong **Development**.

---

## 3. Authentication (JWT)

### Co su dung JWT Bearer Token

### JWT Configuration

```json
{
  "Jwt": {
    "Issuer": "SWP_QA_Tools",
    "Audience": "SWP_QA_Tools_Client",
    "Key": "<secret_key>",
    "ExpiresMinutes": 480
  }
}
```

- **Algorithm**: `HmacSha256`
- **Token Lifetime**: **480 phut (8 gio)**
- **ClockSkew**: `TimeSpan.Zero` (khong cho phep sai lech thoi gian)
- **RoleClaimType**: `ClaimTypes.Role` (bat buoc de authorize theo role hoat dong)

### Cach gui Token trong Request

**Cach 1 - Chuan (khuyen nghi):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**Cach 2 - Khong co prefix "Bearer" (BE ho tro):**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**Cach 3 - Qua Query String:**
```
GET /api/some-endpoint?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### JWT Token Claims

Khi decode token, se co cac claims sau:

| Claim | Key | Vi du |
|-------|-----|-------|
| User ID | `nameid` (ClaimTypes.NameIdentifier) | `"3fa85f64-5717-4562-b3fc-2c963f66afa6"` |
| Full Name | `name` (ClaimTypes.Name) | `"System Admin"` |
| Email | `email` (ClaimTypes.Email) | `"admin@swp.com"` |
| Role | `role` (ClaimTypes.Role) | `"Admin"` |
| User Code | `UserCode` (custom) | `"ADM001"` |
| JWT ID | `jti` | `"guid"` |

---

## 4. User Roles

| Role | Mo ta | Quyen chinh |
|------|-------|-------------|
| **Admin** | Quan tri vien he thong | CRUD Users, Topics, Groups; xem History |
| **Supervisor** | Giam sat vien nhom | Xem questions trong nhom minh quan ly; Approve/Reject questions |
| **Reviewer** | Nguoi danh gia/tra loi | Xem questions thuoc topic minh phu trach; Answer questions |
| **Student** | Sinh vien | Tao cau hoi, sua cau hoi bi reject, xem thong bao |

### Default Admin Account (Seed khi DB trong)

| Field | Value |
|-------|-------|
| Email | `admin@swp.com` |
| Password | `Admin@123` |
| User Code | `ADM001` |
| Full Name | `System Admin` |

---

## 5. Error Response Format

### Chuan Error Response

Tat ca cac error deu tra ve JSON voi format:

```json
{
  "message": "Mo ta loi o day"
}
```

### HTTP Status Codes su dung

| Status Code | Y nghia | Khi nao tra ve |
|-------------|---------|----------------|
| `200` | OK | Request thanh cong |
| `201` | Created | Tao resource moi thanh cong |
| `204` | No Content | Xoa thanh cong |
| `400` | Bad Request | Validation fail hoac request khong hop le |
| `401` | Unauthorized | Thieu/sai token hoac khong xac dinh duoc user |
| `403` | Forbidden | Khong du quyen (role khong phu hop) |
| `404` | Not Found | Resource khong ton tai |
| `409` | Conflict | Du lieu trung lap (vi du: email da ton tai) |

### Validation Error Response (ModelState)

Khi validation DTO fail, tra ve format chuan ASP.NET:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Email": ["Email is required"],
    "Password": ["Password must be between 6 and 100 characters"]
  }
}
```

---

## 6. API Endpoints

---

### 6.1. Auth APIs (`/api/auth`)

> Login: **AllowAnonymous** - khong can token
> Me: **Authorize** - can token (bat ky role nao)

---

#### 6.1.1. `POST /api/auth/login` - Dang nhap

| | |
|---|---|
| **Auth** | Khong can token |
| **Content-Type** | `application/json` |

**Request Body:**

```json
{
  "email": "admin@swp.com",
  "password": "Admin@123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | `string` | Yes | Phai dung format email |
| `password` | `string` | Yes | 6 - 100 ky tu |

**Response `200 OK`:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAtUtc": "2025-07-16T08:00:00Z",
  "user": {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "fullName": "System Admin",
    "email": "admin@swp.com",
    "role": "Admin",
    "userCode": "ADM001"
  }
}
```

**Response `401 Unauthorized`:**

```json
{
  "message": "Invalid email or password."
}
```

---

#### 6.1.2. `GET /api/auth/me` - Lay thong tin user hien tai

| | |
|---|---|
| **Auth** | Bearer Token (bat ky role) |

**Response `200 OK`:**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "fullName": "System Admin",
  "email": "admin@swp.com",
  "role": "Admin",
  "userCode": "ADM001"
}
```

**Response `401 Unauthorized`:** Token khong hop le hoac het han.

---

### 6.2. Admin - User Management (`/api/users`)

> Tat ca endpoints yeu cau: `Authorization: Bearer {token}` voi role **Admin**

---

#### 6.2.1. `GET /api/users` - Lay danh sach users

**Query Parameters:**

| Param | Type | Required | Mo ta |
|-------|------|----------|-------|
| `role` | `string` | No | Filter theo role: `Admin`, `Supervisor`, `Reviewer`, `Student` |
| `unassigned` | `bool` | No | `true` = chi lay users chua duoc gan vao group. Default: `false` |

**Response `200 OK`:**

```json
[
  {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "userCode": "ADM001",
    "fullName": "System Admin",
    "email": "admin@swp.com",
    "role": "Admin",
    "createdAt": "2025-07-15T10:00:00"
  }
]
```

---

#### 6.2.2. `GET /api/users/{id}` - Lay user theo ID

**Path Parameters:**

| Param | Type | Mo ta |
|-------|------|-------|
| `id` | `Guid` | User ID |

**Response `200 OK`:** `UserListDto` object

**Response `404 Not Found`:**

```json
{
  "message": "Khong tim thay user."
}
```

---

#### 6.2.3. `POST /api/users` - Tao user moi

**Request Body:**

```json
{
  "userCode": "SE170001",
  "fullName": "Nguyen Van A",
  "email": "student@example.com",
  "password": "Password@123",
  "role": "Student"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `userCode` | `string` | Yes | Max 50 ky tu |
| `fullName` | `string` | Yes | Max 100 ky tu |
| `email` | `string` | Yes | Email format, max 100 ky tu |
| `password` | `string` | Yes | Min 8 ky tu |
| `role` | `string` | Yes | `Admin`, `Supervisor`, `Reviewer`, `Student` |

**Response `201 Created`:** `UserListDto` object + header `Location`

**Response `409 Conflict`:** Email da ton tai.

---

#### 6.2.4. `PUT /api/users/{id}` - Cap nhat user

**Path Parameters:** `id` (Guid)

**Request Body:**

```json
{
  "fullName": "Updated Name",
  "email": "newemail@example.com",
  "role": "Reviewer",
  "password": "NewPassword@123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullName` | `string` | No | Max 100 ky tu |
| `email` | `string` | No | Email format, max 100 ky tu |
| `role` | `string` | No | `Admin`, `Supervisor`, `Reviewer`, `Student` |
| `password` | `string` | No | Min 8 ky tu |

> Chi gui cac field can update. Cac field khong gui se giu nguyen gia tri cu.

**Response `200 OK`:** `UserListDto` object

**Response `404 Not Found`:** User khong ton tai.

**Response `409 Conflict`:** Email moi da bi trung.

---

#### 6.2.5. `DELETE /api/users/{id}` - Xoa user

**Path Parameters:** `id` (Guid)

**Response `204 No Content`:** Xoa thanh cong.

**Response `404 Not Found`:** User khong ton tai.

**Response `400 Bad Request`:** Khong the tu xoa chinh minh.

---

### 6.3. Admin - Topic Management (`/api/topics`)

> Tat ca endpoints yeu cau: `Authorization: Bearer {token}` voi role **Admin**

---

#### 6.3.1. `GET /api/topics` - Lay danh sach topics

**Response `200 OK`:**

```json
[
  {
    "topicId": "guid",
    "topicName": "OOP Concepts",
    "description": "Object-Oriented Programming questions",
    "reviewerId": "guid",
    "reviewerName": "Reviewer Name",
    "reviewerEmail": "reviewer@example.com",
    "createdAt": "2025-07-15T10:00:00"
  }
]
```

---

#### 6.3.2. `GET /api/topics/{id}` - Lay topic theo ID

**Path Parameters:** `id` (Guid)

**Response `200 OK`:** `TopicDto` object

**Response `404 Not Found`:**

```json
{
  "message": "Topic not found."
}
```

---

#### 6.3.3. `POST /api/topics` - Tao topic moi

**Request Body:**

```json
{
  "topicName": "OOP Concepts",
  "description": "Object-Oriented Programming questions",
  "reviewerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `topicName` | `string` | Yes | Max 100 ky tu |
| `description` | `string` | No | Mo ta topic |
| `reviewerId` | `Guid` | Yes | ID cua reviewer phu trach topic |

**Response `201 Created`:** `TopicDto` object

**Response `400 Bad Request`:** Validation fail hoac reviewerId khong hop le.

---

#### 6.3.4. `PUT /api/topics/{id}` - Cap nhat topic

**Path Parameters:** `id` (Guid)

**Request Body:** Giong `POST` request body.

**Response `200 OK`:** `TopicDto` object

**Response `404 Not Found`:** Topic khong ton tai.

---

#### 6.3.5. `DELETE /api/topics/{id}` - Xoa topic

**Path Parameters:** `id` (Guid)

**Response `204 No Content`:** Xoa thanh cong.

**Response `404 Not Found`:** Topic khong ton tai.

**Response `400 Bad Request`:** Topic dang co du lieu lien quan.

---

### 6.4. Admin - Group Management (`/api/groups`)

> Tat ca endpoints yeu cau: `Authorization: Bearer {token}` voi role **Admin**

---

#### 6.4.1. `GET /api/groups` - Lay danh sach groups

**Response `200 OK`:**

```json
[
  {
    "groupId": "guid",
    "groupName": "Group A",
    "topicId": "guid",
    "topicName": "OOP Concepts",
    "supervisorId": "guid",
    "supervisorName": "Supervisor Name",
    "memberCount": 5,
    "createdAt": "2025-07-15T10:00:00"
  }
]
```

---

#### 6.4.2. `GET /api/groups/{id}` - Lay chi tiet group (bao gom members)

**Path Parameters:** `id` (Guid)

**Response `200 OK`:**

```json
{
  "groupId": "guid",
  "groupName": "Group A",
  "topicId": "guid",
  "topicName": "OOP Concepts",
  "supervisorId": "guid",
  "supervisorName": "Supervisor Name",
  "createdAt": "2025-07-15T10:00:00",
  "members": [
    {
      "studentId": "guid",
      "userCode": "SE170001",
      "fullName": "Nguyen Van A",
      "email": "student@example.com"
    }
  ]
}
```

**Response `404 Not Found`:**

```json
{
  "message": "Group not found."
}
```

---

#### 6.4.3. `POST /api/groups` - Tao group moi

**Request Body:**

```json
{
  "groupName": "Group A",
  "topicId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "supervisorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `groupName` | `string` | Yes | Max 100 ky tu |
| `topicId` | `Guid` | Yes | ID cua topic lien ket |
| `supervisorId` | `Guid` | Yes | ID cua supervisor quan ly group |

**Response `201 Created`:** `GroupDto` object

---

#### 6.4.4. `PUT /api/groups/{id}` - Cap nhat group

**Path Parameters:** `id` (Guid)

**Request Body:** Giong `POST` request body.

**Response `200 OK`:** `GroupDto` object

**Response `404 Not Found`:** Group khong ton tai.

---

#### 6.4.5. `DELETE /api/groups/{id}` - Xoa group

**Path Parameters:** `id` (Guid)

**Response `204 No Content`:** Xoa thanh cong.

**Response `404 Not Found`:** Group khong ton tai.

---

#### 6.4.6. `POST /api/groups/{id}/members` - Them student vao group

**Path Parameters:** `id` (Guid) - Group ID

**Request Body:**

```json
{
  "studentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `studentId` | `Guid` | Yes | ID cua student can them |

**Response `200 OK`:**

```json
{
  "message": "Member added successfully."
}
```

**Response `404 Not Found`:** Group khong ton tai.

**Response `400 Bad Request`:** Student khong ton tai hoac da la member.

---

#### 6.4.7. `DELETE /api/groups/{id}/members/{studentId}` - Xoa student khoi group

**Path Parameters:**

| Param | Type | Mo ta |
|-------|------|-------|
| `id` | `Guid` | Group ID |
| `studentId` | `Guid` | Student ID can xoa |

**Response `204 No Content`:** Xoa thanh cong.

**Response `404 Not Found`:** Group khong ton tai.

---

### 6.5. Admin - History (`/api/admin/history`)

> Yeu cau: `Authorization: Bearer {token}` voi role **Admin**

---

#### 6.5.1. `GET /api/admin/history` - Lay lich su xu ly cau hoi

**Query Parameters:**

| Param | Type | Required | Mo ta |
|-------|------|----------|-------|
| `status` | `string` | No | Filter theo trang thai cau hoi |
| `topic_id` | `Guid` | No | Filter theo topic |
| `group_id` | `Guid` | No | Filter theo group |
| `from_date` | `string` | No | Ngay bat dau (format: `YYYY-MM-DD`) |
| `to_date` | `string` | No | Ngay ket thuc (format: `YYYY-MM-DD`) |
| `search` | `string` | No | Tim kiem theo keyword |

**Response `200 OK`:**

```json
{
  "data": [
    {
      "questionId": "guid",
      "title": "What is OOP?",
      "status": "Answered",
      "rejectReason": null,
      "groupName": "Group A",
      "topicName": "OOP Concepts",
      "createdByName": "Nguyen Van A",
      "createdByCode": "SE170001",
      "createdAt": "2025-07-10T09:00:00",
      "approvedByName": "Supervisor Name",
      "approvedAt": "2025-07-10T10:00:00",
      "answeredByName": "Reviewer Name",
      "answeredAt": "2025-07-10T12:00:00",
      "processingMinutes": 180
    }
  ],
  "summary": {
    "total": 50,
    "answered": 20,
    "approved": 15,
    "rejected": 5,
    "pending": 10
  }
}
```

---

### 6.6. Supervisor APIs (`/api/supervisor/questions`)

> Tat ca endpoints yeu cau: `Authorization: Bearer {token}` voi role **Supervisor**
>
> Supervisor chi thay questions thuoc cac groups ma minh quan ly.

---

#### 6.6.1. `GET /api/supervisor/questions/groups/me` - Lay danh sach groups cua supervisor

**Response `200 OK`:**

```json
[
  {
    "groupId": "guid",
    "groupName": "Group A",
    "topicId": "guid",
    "topicName": "OOP Concepts",
    "memberCount": 5
  }
]
```

---

#### 6.6.2. `GET /api/supervisor/questions/groups/{groupId}/questions` - Lay questions theo group

**Path Parameters:** `groupId` (Guid)

**Query Parameters:**

| Param | Type | Required | Mo ta |
|-------|------|----------|-------|
| `status` | `string` | No | `Pending Approval`, `Approved`, `Rejected`, ... |
| `search` | `string` | No | Tim kiem theo keyword |

**Response `200 OK`:**

```json
[
  {
    "questionId": "guid",
    "title": "What is OOP?",
    "status": "Pending Approval",
    "groupName": "Group A",
    "topicName": "OOP Concepts",
    "createdByName": "Nguyen Van A",
    "createdAt": "2025-07-10T09:00:00"
  }
]
```

**Response `404 Not Found`:** Group khong ton tai hoac khong thuoc supervisor.

---

#### 6.6.3. `GET /api/supervisor/questions` - Lay tat ca questions cua supervisor

**Query Parameters:**

| Param | Type | Required | Mo ta |
|-------|------|----------|-------|
| `status` | `string` | No | Filter theo trang thai |
| `topic_id` | `Guid` | No | Filter theo topic |
| `search` | `string` | No | Tim kiem theo keyword |

**Response `200 OK`:** Mang `QuestionListDto`

---

#### 6.6.4. `GET /api/supervisor/questions/{id}` - Lay chi tiet question

**Path Parameters:** `id` (Guid)

**Response `200 OK`:**

```json
{
  "questionId": "guid",
  "title": "What is OOP?",
  "content": "Please explain the 4 principles of OOP...",
  "status": "Pending Approval",
  "rejectReason": null,
  "createdById": "guid",
  "createdByName": "Nguyen Van A",
  "groupId": "guid",
  "groupName": "Group A",
  "topicId": "guid",
  "topicName": "OOP Concepts",
  "approvedBy": null,
  "approvedByName": null,
  "approvedAt": null,
  "createdAt": "2025-07-10T09:00:00",
  "updatedAt": null,
  "answer": null
}
```

Neu question da duoc tra loi, field `answer` se co gia tri:

```json
{
  "answer": {
    "answerId": "guid",
    "answerContent": "OOP has 4 principles: Encapsulation, Abstraction...",
    "reviewerId": "guid",
    "reviewerName": "Reviewer Name",
    "answeredAt": "2025-07-10T12:00:00"
  }
}
```

**Response `404 Not Found`:**

```json
{
  "message": "Question not found."
}
```

---

#### 6.6.5. `POST /api/supervisor/questions/{id}/approve` - Duyet cau hoi

**Path Parameters:** `id` (Guid)

**Request Body:** Khong can body

**Response `200 OK`:** `QuestionDetailDto` object (status da chuyen thanh `Approved`)

**Response `404 Not Found`:** Question khong ton tai.

**Response `400 Bad Request`:** Question khong o trang thai co the approve.

---

#### 6.6.6. `POST /api/supervisor/questions/{id}/reject` - Tu choi cau hoi

**Path Parameters:** `id` (Guid)

**Request Body:**

```json
{
  "rejectReason": "Cau hoi khong ro rang, can bo sung them context."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `rejectReason` | `string` | Yes | Min 5 ky tu |

**Response `200 OK`:** `QuestionDetailDto` object (status da chuyen thanh `Rejected`)

**Response `404 Not Found`:** Question khong ton tai.

**Response `400 Bad Request`:** Question khong o trang thai co the reject.

---

### 6.7. Reviewer APIs (`/api/reviewer/questions`)

> Tat ca endpoints yeu cau: `Authorization: Bearer {token}` voi role **Reviewer**
>
> Reviewer chi thay questions thuoc topic ma minh phu trach.

---

#### 6.7.1. `GET /api/reviewer/questions` - Lay danh sach questions

**Query Parameters:**

| Param | Type | Required | Mo ta |
|-------|------|----------|-------|
| `status` | `string` | No | `Approved`, `Answered`, ... |
| `topic_id` | `Guid` | No | Filter theo topic |
| `search` | `string` | No | Tim kiem theo keyword |

**Response `200 OK`:** Mang `QuestionListDto`

---

#### 6.7.2. `GET /api/reviewer/questions/{id}` - Lay chi tiet question

**Path Parameters:** `id` (Guid)

**Response `200 OK`:** `QuestionDetailDto` object

**Response `404 Not Found`:**

```json
{
  "message": "Question not found."
}
```

---

#### 6.7.3. `POST /api/reviewer/questions/{id}/answer` - Tra loi cau hoi

**Path Parameters:** `id` (Guid)

**Request Body:**

```json
{
  "answerContent": "OOP has 4 principles: Encapsulation, Abstraction, Inheritance, Polymorphism..."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `answerContent` | `string` | Yes | Min 5 ky tu |

**Response `200 OK`:** `QuestionDetailDto` object (da bao gom answer)

**Response `404 Not Found`:** Question khong ton tai.

**Response `409 Conflict`:** Question da duoc tra loi roi.

**Response `400 Bad Request`:** Question chua o trang thai co the tra loi.

---

### 6.8. Student APIs (`/api/student`)

> Tat ca endpoints yeu cau: `Authorization: Bearer {token}` voi role **Student**
>
> Student chi thay questions thuoc group ma minh la thanh vien.

---

#### 6.8.1. `GET /api/student/questions` - Lay danh sach cau hoi cua student

**Query Parameters:**

| Param | Type | Required | Default | Mo ta |
|-------|------|----------|---------|-------|
| `status` | `string` | No | `null` | Filter theo trang thai: `Pending Approval`, `Approved`, `Rejected`, `Answered` |
| `keyword` | `string` | No | `null` | Tim kiem theo title cau hoi |
| `page` | `int` | No | `1` | Trang hien tai (pagination) |
| `pageSize` | `int` | No | `10` | So luong item moi trang |

> **Luu y:** Student API dung `keyword` de tim kiem, khac voi cac API khac dung `search`.

**Response `200 OK`:**

```json
[
  {
    "questionId": "guid",
    "title": "What is OOP?",
    "status": "Pending Approval",
    "groupName": "Group A",
    "topicName": "OOP Concepts",
    "createdByName": "Nguyen Van A",
    "createdAt": "2025-07-10T09:00:00"
  }
]
```

---

#### 6.8.2. `GET /api/student/questions/{id}` - Lay chi tiet cau hoi

**Path Parameters:** `id` (Guid)

**Response `200 OK`:**

```json
{
  "questionId": "guid",
  "title": "What is OOP?",
  "content": "Please explain the 4 principles of OOP...",
  "status": "Pending Approval",
  "rejectReason": null,
  "createdById": "guid",
  "createdByName": "Nguyen Van A",
  "groupId": "guid",
  "groupName": "Group A",
  "topicId": "guid",
  "topicName": "OOP Concepts",
  "approvedBy": null,
  "approvedByName": null,
  "approvedAt": null,
  "createdAt": "2025-07-10T09:00:00",
  "updatedAt": null,
  "answer": null
}
```

**Response `404 Not Found`:**

```json
{
  "message": "Question not found."
}
```

---

#### 6.8.3. `POST /api/student/questions` - Tao cau hoi moi

**Request Body:**

```json
{
  "title": "What is OOP?",
  "content": "Please explain the 4 principles of Object-Oriented Programming."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | `string` | Yes | Khong duoc rong |
| `content` | `string` | Yes | Khong duoc rong |

> Cau hoi se tu dong duoc gan vao group cua student va co status `"Pending Approval"`.
> TopicId se lay tu group cua student.

**Response `200 OK`:**

```json
{
  "questionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Response `400 Bad Request`:**

```
"Student is not assigned to any group."
```

hoac

```
"Title must not be empty."
```

hoac

```
"Content must not be empty."
```

---

#### 6.8.4. `PUT /api/student/questions/{id}` - Sua cau hoi bi rejected

**Path Parameters:** `id` (Guid)

**Request Body:**

```json
{
  "title": "Updated question title",
  "content": "Updated question content with more details..."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | `string` | Yes | Khong duoc rong |
| `content` | `string` | Yes | Khong duoc rong |

> Chi cho phep sua khi question co `status = "Rejected"`.
> Sau khi sua thanh cong, status tu dong chuyen thanh `"Pending Approval"`.

**Response `200 OK`:** Thanh cong (khong co response body).

**Response `400 Bad Request`:**

```
"Only rejected questions can be edited, or you do not have permission."
```

---

#### 6.8.5. `GET /api/student/notifications` - Lay danh sach thong bao

**Query Parameters:**

| Param | Type | Required | Default | Mo ta |
|-------|------|----------|---------|-------|
| `isRead` | `bool` | No | `null` | `true` = da doc, `false` = chua doc, `null` = tat ca |

**Response `200 OK`:**

```json
[
  {
    "notificationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "message": "Your question has been approved.",
    "isRead": false,
    "createdAt": "2025-07-15T10:00:00"
  }
]
```

---

#### 6.8.6. `POST /api/student/notifications/{id}/read` - Danh dau thong bao da doc

**Path Parameters:** `id` (Guid) - Notification ID

**Request Body:** Khong can body

**Response `200 OK`:** Thanh cong (khong co response body).

**Response `400 Bad Request`:**

```
"Notification not found or not yours."
```

---

## 7. DTO Reference

### Auth DTOs

#### `LoginRequestDto`

```typescript
{
  email: string;      // Required, email format
  password: string;   // Required, 6-100 chars
}
```

#### `LoginResponseDto`

```typescript
{
  accessToken: string;
  expiresAtUtc: string;   // ISO 8601 UTC
  user: UserDto;
}
```

#### `UserDto`

```typescript
{
  userId: string;      // GUID
  fullName: string;
  email: string;
  role: string;        // "Admin" | "Supervisor" | "Reviewer" | "Student"
  userCode: string;
}
```

### User DTOs

#### `UserListDto`

```typescript
{
  userId: string;
  userCode: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string | null;
}
```

#### `CreateUserRequestDto`

```typescript
{
  userCode: string;    // Required, max 50
  fullName: string;    // Required, max 100
  email: string;       // Required, email format, max 100
  password: string;    // Required, min 8
  role: string;        // Required
}
```

#### `UpdateUserRequestDto`

```typescript
{
  fullName?: string;   // Optional, max 100
  email?: string;      // Optional, email format, max 100
  role?: string;       // Optional
  password?: string;   // Optional, min 8
}
```

### Topic DTOs

#### `TopicDto`

```typescript
{
  topicId: string;
  topicName: string;
  description: string | null;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  createdAt: string | null;
}
```

#### `TopicRequestDto`

```typescript
{
  topicName: string;     // Required, max 100
  description?: string;  // Optional
  reviewerId: string;    // Required, GUID
}
```

### Group DTOs

#### `GroupDto`

```typescript
{
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  supervisorId: string;
  supervisorName: string;
  memberCount: number;
  createdAt: string | null;
}
```

#### `GroupDetailDto`

```typescript
{
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  supervisorId: string;
  supervisorName: string;
  createdAt: string | null;
  members: StudentDto[];
}
```

#### `StudentDto`

```typescript
{
  studentId: string;
  userCode: string;
  fullName: string;
  email: string;
}
```

#### `SupervisorGroupDto`

```typescript
{
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  memberCount: number;
}
```

#### `GroupRequestDto`

```typescript
{
  groupName: string;     // Required, max 100
  topicId: string;       // Required, GUID
  supervisorId: string;  // Required, GUID
}
```

#### `AddMemberDto`

```typescript
{
  studentId: string;     // Required, GUID
}
```

### Question DTOs

#### `QuestionListDto`

```typescript
{
  questionId: string;
  title: string;
  status: string;
  groupName: string;
  topicName: string;
  createdByName: string;
  createdAt: string | null;
}
```

#### `QuestionDetailDto`

```typescript
{
  questionId: string;
  title: string;
  content: string;
  status: string;
  rejectReason: string | null;
  createdById: string;
  createdByName: string;
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  answer: AnswerInfoDto | null;
}
```

#### `AnswerInfoDto`

```typescript
{
  answerId: string;
  answerContent: string;
  reviewerId: string;
  reviewerName: string;
  answeredAt: string | null;
}
```

#### `RejectQuestionRequestDto`

```typescript
{
  rejectReason: string;  // Required, min 5 chars
}
```

#### `AnswerQuestionRequestDto`

```typescript
{
  answerContent: string; // Required, min 5 chars
}
```

#### `CreateQuestionRequestDto` (Student)

```typescript
{
  title: string;     // Required, khong duoc rong
  content: string;   // Required, khong duoc rong
}
```

#### `UpdateQuestionRequestDto` (Student)

```typescript
{
  title: string;     // Required, khong duoc rong
  content: string;   // Required, khong duoc rong
}
```

### Notification DTOs

#### `NotificationDto`

```typescript
{
  notificationId: string;  // GUID
  message: string;
  isRead: boolean;
  createdAt: string;       // ISO 8601
}
```

### History DTOs

#### `HistoryResponseDto`

```typescript
{
  data: HistoryItemDto[];
  summary: HistorySummaryDto;
}
```

#### `HistoryItemDto`

```typescript
{
  questionId: string;
  title: string;
  status: string;
  rejectReason: string | null;
  groupName: string;
  topicName: string;
  createdByName: string;
  createdByCode: string;
  createdAt: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  answeredByName: string | null;
  answeredAt: string | null;
  processingMinutes: number | null;
}
```

#### `HistorySummaryDto`

```typescript
{
  total: number;
  answered: number;
  approved: number;
  rejected: number;
  pending: number;
}
```

---

## 8. Ghi chu cho FE Team

### Token Management

1. Sau khi login thanh cong, luu `accessToken` vao `localStorage` hoac `sessionStorage`.
2. Gan token vao moi request qua header: `Authorization: Bearer {token}`.
3. Token het han sau **8 gio** -> redirect ve trang login khi nhan `401`.
4. Goi `GET /api/auth/me` khi reload trang de verify token con hop le va lay lai thong tin user.

### Role-Based UI

- Kiem tra `user.role` tu response login de hien thi menu/features phu hop.
- Backend da enforce authorization o server-side, nhung FE nen an cac menu khong thuoc quyen.

| Role | Menu items goi y |
|------|-------------------|
| Admin | Dashboard, Users, Topics, Groups, History |
| Supervisor | My Groups, Questions, Approve/Reject |
| Reviewer | My Questions, Answer |
| Student | My Questions, Create Question, Notifications |

### Date/Time Format

- **Response tu BE**: ISO 8601 format - `"2025-07-15T10:00:00"` (local timezone SE Asia Standard Time, UTC+7)
- **Gui filter dates**: String format `YYYY-MM-DD` (vi du: `2025-07-15`)
- BE su dung custom `DateTimeJsonConverter` cho serialization.

### ID Format

- Tat ca IDs deu la **GUID (UUID)**.
- Format: `"3fa85f64-5717-4562-b3fc-2c963f66afa6"`

### CORS

- Da cau hinh CORS cho FE origin: `http://localhost:5173`
- Cac method duoc phep: tat ca (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`)
- Cac header duoc phep: tat ca (bao gom `Authorization` cho JWT)
- Credentials: cho phep

### Luu y ve Search Parameter

| Controller | Search param name |
|------------|-------------------|
| Supervisor APIs | `search` |
| Reviewer APIs | `search` |
| Admin History | `search` |
| **Student APIs** | **`keyword`** (khac biet!) |

### Student API co Pagination

Chi Student API (`GET /api/student/questions`) ho tro pagination voi `page` va `pageSize`.
Cac API khac (Supervisor, Reviewer, Admin) tra ve toan bo ket qua khong phan trang.

### Question Status Flow

```
[Student tao] --> "Pending Approval"
                      |
          +-----------+-----------+
          |                       |
    [Supervisor Approve]    [Supervisor Reject]
          |                       |
      "Approved"             "Rejected"
          |                       |
    [Reviewer Answer]    [Student Edit & Resubmit]
          |                       |
      "Answered"          "Pending Approval" (quay lai)
```

---

## API Summary Table

| # | Method | Endpoint | Auth | Role |
|---|--------|----------|------|------|
| 1 | `POST` | `/api/auth/login` | No | - |
| 2 | `GET` | `/api/auth/me` | Yes | Any |
| 3 | `GET` | `/api/users` | Yes | Admin |
| 4 | `GET` | `/api/users/{id}` | Yes | Admin |
| 5 | `POST` | `/api/users` | Yes | Admin |
| 6 | `PUT` | `/api/users/{id}` | Yes | Admin |
| 7 | `DELETE` | `/api/users/{id}` | Yes | Admin |
| 8 | `GET` | `/api/topics` | Yes | Admin |
| 9 | `GET` | `/api/topics/{id}` | Yes | Admin |
| 10 | `POST` | `/api/topics` | Yes | Admin |
| 11 | `PUT` | `/api/topics/{id}` | Yes | Admin |
| 12 | `DELETE` | `/api/topics/{id}` | Yes | Admin |
| 13 | `GET` | `/api/groups` | Yes | Admin |
| 14 | `GET` | `/api/groups/{id}` | Yes | Admin |
| 15 | `POST` | `/api/groups` | Yes | Admin |
| 16 | `PUT` | `/api/groups/{id}` | Yes | Admin |
| 17 | `DELETE` | `/api/groups/{id}` | Yes | Admin |
| 18 | `POST` | `/api/groups/{id}/members` | Yes | Admin |
| 19 | `DELETE` | `/api/groups/{id}/members/{studentId}` | Yes | Admin |
| 20 | `GET` | `/api/admin/history` | Yes | Admin |
| 21 | `GET` | `/api/supervisor/questions/groups/me` | Yes | Supervisor |
| 22 | `GET` | `/api/supervisor/questions/groups/{groupId}/questions` | Yes | Supervisor |
| 23 | `GET` | `/api/supervisor/questions` | Yes | Supervisor |
| 24 | `GET` | `/api/supervisor/questions/{id}` | Yes | Supervisor |
| 25 | `POST` | `/api/supervisor/questions/{id}/approve` | Yes | Supervisor |
| 26 | `POST` | `/api/supervisor/questions/{id}/reject` | Yes | Supervisor |
| 27 | `GET` | `/api/reviewer/questions` | Yes | Reviewer |
| 28 | `GET` | `/api/reviewer/questions/{id}` | Yes | Reviewer |
| 29 | `POST` | `/api/reviewer/questions/{id}/answer` | Yes | Reviewer |
| 30 | `GET` | `/api/student/questions` | Yes | Student |
| 31 | `GET` | `/api/student/questions/{id}` | Yes | Student |
| 32 | `POST` | `/api/student/questions` | Yes | Student |
| 33 | `PUT` | `/api/student/questions/{id}` | Yes | Student |
| 34 | `GET` | `/api/student/notifications` | Yes | Student |
| 35 | `POST` | `/api/student/notifications/{id}/read` | Yes | Student |
