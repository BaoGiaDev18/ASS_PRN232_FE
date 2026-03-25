# ?? SWP Q&A Tools - Backend API Documentation

> **T�i li?u m� t? chi ti?t Backend API d�nh cho Frontend Team**
>
> C?p nh?t: 2025-07-15

---

## ?? M?c l?c

- [1. T?ng quan Project](#1-t?ng-quan-project)
- [2. Base URL & Swagger](#2-base-url--swagger)
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
- [7. DTO Reference](#7-dto-reference)
- [8. Ghi ch� cho FE Team](#8-ghi-ch�-cho-fe-team)

---

## 1. T?ng quan Project

| Th�ng tin | Chi ti?t |
|-----------|----------|
| **Framework** | ASP.NET Core Web API (.NET 8) |
| **Authentication** | JWT Bearer Token |
| **Architecture** | 3-Layer: API ? BusinessLogicLayer ? DataAccessLayer |
| **Database** | SQL Server (`swp_qa_tools`) |
| **Password Hashing** | SHA256 (Hex string) |

### C?u tr�c Solution

```
PRN232_Group03_SwpQATool/
??? SWP_Q&A_Tools_APIs/          # API Layer (Controllers, Program.cs)
??? BusinessLogicLayer/          # Business Logic (Services, DTOs)
??? DataAccessLayer/             # Data Access (Models, Repositories)
```

---

## 2. Base URL & Swagger

### Development URLs

| Profile | URL |
|---------|-----|
| **HTTP** | `http://localhost:5192` |
| **HTTPS** | `https://localhost:7443` |
| **IIS Express HTTP** | `http://localhost:12650` |
| **IIS Express HTTPS** | `https://localhost:44345` |

### Swagger UI

```
http://localhost:5192/swagger/index.html
https://localhost:7443/swagger/index.html
```

> ?? Swagger ch? kh? d?ng trong m�i tr??ng **Development**.

---

## 3. Authentication (JWT)

### ? C� s? d?ng JWT Bearer Token

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
- **Token Lifetime**: **480 ph�t (8 gi?)**
- **ClockSkew**: `TimeSpan.Zero` (kh�ng cho ph�p sai l?ch th?i gian)

### C�ch g?i Token trong Request

**C�ch 1 � Chu?n (khuy?n ngh?):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**C�ch 2 � Kh�ng c� prefix "Bearer" (BE h? tr?):**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**C�ch 3 � Qua Query String:**
```
GET /api/some-endpoint?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### JWT Token Claims

Khi decode token, s? c� c�c claims sau:

| Claim | Key | V� d? |
|-------|-----|-------|
| User ID | `nameid` (ClaimTypes.NameIdentifier) | `"3fa85f64-5717-4562-b3fc-2c963f66afa6"` |
| Full Name | `name` (ClaimTypes.Name) | `"System Admin"` |
| Email | `email` (ClaimTypes.Email) | `"admin@swp.com"` |
| Role | `role` (ClaimTypes.Role) | `"Admin"` |
| User Code | `UserCode` (custom) | `"ADM001"` |
| JWT ID | `jti` | `"guid"` |

---

## 4. User Roles

| Role | M� t? | Quy?n ch�nh |
|------|--------|-------------|
| **Admin** | Qu?n tr? vi�n h? th?ng | CRUD Users, Topics, Groups; xem History |
| **Supervisor** | Gi�m s�t vi�n nh�m | Xem questions trong nh�m m�nh qu?n l�; Approve/Reject questions |
| **Reviewer** | Ng??i ?�nh gi�/tr? l?i | Xem questions thu?c topic m�nh ph? tr�ch; Answer questions |
| **Student** | Sinh vi�n | T?o c�u h?i *(ch?a c� controller ri�ng trong code hi?n t?i)* |

### Default Admin Account (Seed khi DB tr?ng)

| Field | Value |
|-------|-------|
| Email | `admin@swp.com` |
| Password | `Admin@123` |
| User Code | `ADM001` |
| Full Name | `System Admin` |

---

## 5. Error Response Format

### Chu?n Error Response

T?t c? c�c error ??u tr? v? JSON v?i format:

```json
{
  "message": "M� t? l?i ? ?�y"
}
```

### HTTP Status Codes s? d?ng

| Status Code | � ngh?a | Khi n�o tr? v? |
|-------------|----------|----------------|
| `200` | OK | Request th�nh c�ng |
| `201` | Created | T?o resource m?i th�nh c�ng |
| `204` | No Content | X�a th�nh c�ng |
| `400` | Bad Request | Validation fail ho?c request kh�ng h?p l? |
| `401` | Unauthorized | Thi?u/sai token ho?c kh�ng x�c ??nh ???c user |
| `403` | Forbidden | Kh�ng ?? quy?n (role kh�ng ph� h?p) |
| `404` | Not Found | Resource kh�ng t?n t?i |
| `409` | Conflict | D? li?u tr�ng l?p (v� d?: email ?� t?n t?i) |

### Validation Error Response (ModelState)

Khi validation DTO fail, tr? v? format chu?n ASP.NET:

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

> ?? Login: **AllowAnonymous** � kh�ng c?n token
> ?? Me: **Authorize** � c?n token (b?t k? role n�o)

---

#### 6.1.1. `POST /api/auth/login` � ??ng nh?p

| | |
|---|---|
| **Auth** | ? Kh�ng c?n token |
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
| `email` | `string` | ? | Ph?i ?�ng format email |
| `password` | `string` | ? | 6 � 100 k� t? |

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

#### 6.1.2. `GET /api/auth/me` � L?y th�ng tin user hi?n t?i

| | |
|---|---|
| **Auth** | ?? Bearer Token (b?t k? role) |

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

**Response `401 Unauthorized`:** Token kh�ng h?p l? ho?c h?t h?n.

---

### 6.2. Admin - User Management (`/api/users`)

> ?? T?t c? endpoints y�u c?u: `Authorization: Bearer {token}` v?i role **Admin**

---

#### 6.2.1. `GET /api/users` � L?y danh s�ch users

**Query Parameters:**

| Param | Type | Required | M� t? |
|-------|------|----------|-------|
| `role` | `string` | ? | Filter theo role: `Admin`, `Supervisor`, `Reviewer`, `Student` |
| `unassigned` | `bool` | ? | `true` = ch? l?y users ch?a ???c g�n v�o group. Default: `false` |

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

#### 6.2.2. `GET /api/users/{id}` � L?y user theo ID

**Path Parameters:**

| Param | Type | M� t? |
|-------|------|-------|
| `id` | `Guid` | User ID |

**Response `200 OK`:** `UserListDto` object

**Response `404 Not Found`:**

```json
{
  "message": "Kh�ng t�m th?y user."
}
```

---

#### 6.2.3. `POST /api/users` � T?o user m?i

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
| `userCode` | `string` | ? | Max 50 k� t? |
| `fullName` | `string` | ? | Max 100 k� t? |
| `email` | `string` | ? | Email format, max 100 k� t? |
| `password` | `string` | ? | Min 8 k� t? |
| `role` | `string` | ? | `Admin`, `Supervisor`, `Reviewer`, `Student` |

**Response `201 Created`:** `UserListDto` object + header `Location`

**Response `409 Conflict`:** Email ?� t?n t?i.

---

#### 6.2.4. `PUT /api/users/{id}` � C?p nh?t user

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
| `fullName` | `string` | ? | Max 100 k� t? |
| `email` | `string` | ? | Email format, max 100 k� t? |
| `role` | `string` | ? | `Admin`, `Supervisor`, `Reviewer`, `Student` |
| `password` | `string` | ? | Min 8 k� t? |

> ?? Ch? g?i c�c field c?n update. C�c field kh�ng g?i s? gi? nguy�n gi� tr? c?.

**Response `200 OK`:** `UserListDto` object

**Response `404 Not Found`:** User kh�ng t?n t?i.

**Response `409 Conflict`:** Email m?i ?� b? tr�ng.

---

#### 6.2.5. `DELETE /api/users/{id}` � X�a user

**Path Parameters:** `id` (Guid)

**Response `204 No Content`:** X�a th�nh c�ng.

**Response `404 Not Found`:** User kh�ng t?n t?i.

**Response `400 Bad Request`:** Kh�ng th? t? x�a ch�nh m�nh.

---

### 6.3. Admin - Topic Management (`/api/topics`)

> ?? T?t c? endpoints y�u c?u: `Authorization: Bearer {token}` v?i role **Admin**

---

#### 6.3.1. `GET /api/topics` � L?y danh s�ch topics

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

#### 6.3.2. `GET /api/topics/{id}` � L?y topic theo ID

**Path Parameters:** `id` (Guid)

**Response `200 OK`:** `TopicDto` object

**Response `404 Not Found`:**

```json
{
  "message": "Topic not found."
}
```

---

#### 6.3.3. `POST /api/topics` � T?o topic m?i

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
| `topicName` | `string` | ? | Max 100 k� t? |
| `description` | `string` | ? | M� t? topic |
| `reviewerId` | `Guid` | ? | ID c?a reviewer ph? tr�ch topic |

**Response `201 Created`:** `TopicDto` object

**Response `400 Bad Request`:** Validation fail ho?c reviewerId kh�ng h?p l?.

---

#### 6.3.4. `PUT /api/topics/{id}` � C?p nh?t topic

**Path Parameters:** `id` (Guid)

**Request Body:** Gi?ng `POST` request body.

**Response `200 OK`:** `TopicDto` object

**Response `404 Not Found`:** Topic kh�ng t?n t?i.

---

#### 6.3.5. `DELETE /api/topics/{id}` � X�a topic

**Path Parameters:** `id` (Guid)

**Response `204 No Content`:** X�a th�nh c�ng.

**Response `404 Not Found`:** Topic kh�ng t?n t?i.

**Response `400 Bad Request`:** Topic ?ang c� d? li?u li�n quan.

---

### 6.4. Admin - Group Management (`/api/groups`)

> ?? T?t c? endpoints y�u c?u: `Authorization: Bearer {token}` v?i role **Admin**

---

#### 6.4.1. `GET /api/groups` � L?y danh s�ch groups

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

#### 6.4.2. `GET /api/groups/{id}` � L?y chi ti?t group (bao g?m members)

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

#### 6.4.3. `POST /api/groups` � T?o group m?i

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
| `groupName` | `string` | ? | Max 100 k� t? |
| `topicId` | `Guid` | ? | ID c?a topic li�n k?t |
| `supervisorId` | `Guid` | ? | ID c?a supervisor qu?n l� group |

**Response `201 Created`:** `GroupDto` object

---

#### 6.4.4. `PUT /api/groups/{id}` � C?p nh?t group

**Path Parameters:** `id` (Guid)

**Request Body:** Gi?ng `POST` request body.

**Response `200 OK`:** `GroupDto` object

**Response `404 Not Found`:** Group kh�ng t?n t?i.

---

#### 6.4.5. `DELETE /api/groups/{id}` � X�a group

**Path Parameters:** `id` (Guid)

**Response `204 No Content`:** X�a th�nh c�ng.

**Response `404 Not Found`:** Group kh�ng t?n t?i.

---

#### 6.4.6. `POST /api/groups/{id}/members` � Th�m student v�o group

**Path Parameters:** `id` (Guid) � Group ID

**Request Body:**

```json
{
  "studentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `studentId` | `Guid` | ? | ID c?a student c?n th�m |

**Response `200 OK`:**

```json
{
  "message": "Member added successfully."
}
```

**Response `404 Not Found`:** Group kh�ng t?n t?i.

**Response `400 Bad Request`:** Student kh�ng t?n t?i ho?c ?� l� member.

---

#### 6.4.7. `DELETE /api/groups/{id}/members/{studentId}` � X�a student kh?i group

**Path Parameters:**

| Param | Type | M� t? |
|-------|------|-------|
| `id` | `Guid` | Group ID |
| `studentId` | `Guid` | Student ID c?n x�a |

**Response `204 No Content`:** X�a th�nh c�ng.

**Response `404 Not Found`:** Group kh�ng t?n t?i.

---

### 6.5. Admin - History (`/api/admin/history`)

> ?? Y�u c?u: `Authorization: Bearer {token}` v?i role **Admin**

---

#### 6.5.1. `GET /api/admin/history` � L?y l?ch s? x? l� c�u h?i

**Query Parameters:**

| Param | Type | Required | M� t? |
|-------|------|----------|-------|
| `status` | `string` | ? | Filter theo tr?ng th�i c�u h?i |
| `topic_id` | `Guid` | ? | Filter theo topic |
| `group_id` | `Guid` | ? | Filter theo group |
| `from_date` | `string` | ? | Ng�y b?t ??u (format: `YYYY-MM-DD`) |
| `to_date` | `string` | ? | Ng�y k?t th�c (format: `YYYY-MM-DD`) |
| `search` | `string` | ? | T�m ki?m theo keyword |

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

> ?? T?t c? endpoints y�u c?u: `Authorization: Bearer {token}` v?i role **Supervisor**
>
> Supervisor ch? th?y questions thu?c c�c groups m� m�nh qu?n l�.

---

#### 6.6.1. `GET /api/supervisor/questions/groups/me` � L?y danh s�ch groups c?a supervisor

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

#### 6.6.2. `GET /api/supervisor/questions/groups/{groupId}/questions` � L?y questions theo group

**Path Parameters:** `groupId` (Guid)

**Query Parameters:**

| Param | Type | Required | M� t? |
|-------|------|----------|-------|
| `status` | `string` | ? | `Pending Approval`, `Approved`, `Rejected`, ... |
| `search` | `string` | ? | T�m ki?m theo keyword |

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

**Response `404 Not Found`:** Group kh�ng t?n t?i ho?c kh�ng thu?c supervisor.

---

#### 6.6.3. `GET /api/supervisor/questions` � L?y t?t c? questions c?a supervisor

**Query Parameters:**

| Param | Type | Required | M� t? |
|-------|------|----------|-------|
| `status` | `string` | ? | Filter theo tr?ng th�i |
| `topic_id` | `Guid` | ? | Filter theo topic |
| `search` | `string` | ? | T�m ki?m theo keyword |

**Response `200 OK`:** M?ng `QuestionListDto`

---

#### 6.6.4. `GET /api/supervisor/questions/{id}` � L?y chi ti?t question

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

N?u question ?� ???c tr? l?i, field `answer` s? c� gi� tr?:

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

#### 6.6.5. `POST /api/supervisor/questions/{id}/approve` � Duy?t c�u h?i

**Path Parameters:** `id` (Guid)

**Request Body:** ? Kh�ng c?n body

**Response `200 OK`:** `QuestionDetailDto` object (status ?� chuy?n th�nh `Approved`)

**Response `404 Not Found`:** Question kh�ng t?n t?i.

**Response `400 Bad Request`:** Question kh�ng ? tr?ng th�i c� th? approve.

---

#### 6.6.6. `POST /api/supervisor/questions/{id}/reject` � T? ch?i c�u h?i

**Path Parameters:** `id` (Guid)

**Request Body:**

```json
{
  "rejectReason": "C�u h?i kh�ng r� r�ng, c?n b? sung th�m context."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `rejectReason` | `string` | ? | Min 5 k� t? |

**Response `200 OK`:** `QuestionDetailDto` object (status ?� chuy?n th�nh `Rejected`)

**Response `404 Not Found`:** Question kh�ng t?n t?i.

**Response `400 Bad Request`:** Question kh�ng ? tr?ng th�i c� th? reject.

---

### 6.7. Reviewer APIs (`/api/reviewer/questions`)

> ?? T?t c? endpoints y�u c?u: `Authorization: Bearer {token}` v?i role **Reviewer**
>
> Reviewer ch? th?y questions thu?c topic m� m�nh ph? tr�ch.

---

#### 6.7.1. `GET /api/reviewer/questions` � L?y danh s�ch questions

**Query Parameters:**

| Param | Type | Required | M� t? |
|-------|------|----------|-------|
| `status` | `string` | ? | `Approved`, `Answered`, ... |
| `topic_id` | `Guid` | ? | Filter theo topic |
| `search` | `string` | ? | T�m ki?m theo keyword |

**Response `200 OK`:** M?ng `QuestionListDto`

---

#### 6.7.2. `GET /api/reviewer/questions/{id}` � L?y chi ti?t question

**Path Parameters:** `id` (Guid)

**Response `200 OK`:** `QuestionDetailDto` object

**Response `404 Not Found`:**

```json
{
  "message": "Question not found."
}
```

---

#### 6.7.3. `POST /api/reviewer/questions/{id}/answer` � Tr? l?i c�u h?i

**Path Parameters:** `id` (Guid)

**Request Body:**

```json
{
  "answerContent": "OOP has 4 principles: Encapsulation, Abstraction, Inheritance, Polymorphism..."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `answerContent` | `string` | ? | Min 5 k� t? |

**Response `200 OK`:** `QuestionDetailDto` object (?� bao g?m answer)

**Response `404 Not Found`:** Question kh�ng t?n t?i.

**Response `409 Conflict`:** Question ?� ???c tr? l?i r?i.

**Response `400 Bad Request`:** Question ch?a ? tr?ng th�i c� th? tr? l?i.

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

## 8. Ghi ch� cho FE Team

### ?? Token Management

1. Sau khi login th�nh c�ng, l?u `accessToken` v�o `localStorage` ho?c `sessionStorage`.
2. G?n token v�o m?i request qua header: `Authorization: Bearer {token}`.
3. Token h?t h?n sau **8 gi?** ? redirect v? trang login khi nh?n `401`.
4. G?i `GET /api/auth/me` khi reload trang ?? verify token c�n h?p l? v� l?y l?i th�ng tin user.

### ??? Role-Based UI

- Ki?m tra `user.role` t? response login ?? hi?n th? menu/features ph� h?p.
- Backend ?� enforce authorization ? server-side, nh?ng FE n�n ?n c�c menu kh�ng thu?c quy?n.

| Role | Menu items g?i � |
|------|-------------------|
| Admin | Dashboard, Users, Topics, Groups, History |
| Supervisor | My Groups, Questions, Approve/Reject |
| Reviewer | My Questions, Answer |
| Student | My Questions, Create Question |

### ?? Date/Time Format

- **Response t? BE**: ISO 8601 format � `"2025-07-15T10:00:00"` (local timezone SE Asia Standard Time, UTC+7)
- **G?i filter dates**: String format `YYYY-MM-DD` (v� d?: `2025-07-15`)
- BE s? d?ng custom `DateTimeJsonConverter` cho serialization.

### ?? ID Format

- T?t c? IDs ??u l� **GUID (UUID)**.
- Format: `"3fa85f64-5717-4562-b3fc-2c963f66afa6"`

### ?? CORS

- N?u FE v� BE ch?y tr�n c�c port kh�c nhau, c?n ??m b?o BE ?� config CORS.
- Hi?n t?i **ch?a c� CORS config** trong `Program.cs` ? c?n th�m n?u FE ch?y ? origin kh�c.

### ?? L?u � v? Student

- Hi?n t?i **ch?a c� `StudentController`** trong source code.
- Ch?c n?ng t?o question c?a Student c� th? ?ang ???c ph�t tri?n ho?c c?n b? sung.

---

## ?? API Summary Table

| # | Method | Endpoint | Auth | Role |
|---|--------|----------|------|------|
| 1 | `POST` | `/api/auth/login` | ? | - |
| 2 | `GET` | `/api/auth/me` | ? | Any |
| 3 | `GET` | `/api/users` | ? | Admin |
| 4 | `GET` | `/api/users/{id}` | ? | Admin |
| 5 | `POST` | `/api/users` | ? | Admin |
| 6 | `PUT` | `/api/users/{id}` | ? | Admin |
| 7 | `DELETE` | `/api/users/{id}` | ? | Admin |
| 8 | `GET` | `/api/topics` | ? | Admin |
| 9 | `GET` | `/api/topics/{id}` | ? | Admin |
| 10 | `POST` | `/api/topics` | ? | Admin |
| 11 | `PUT` | `/api/topics/{id}` | ? | Admin |
| 12 | `DELETE` | `/api/topics/{id}` | ? | Admin |
| 13 | `GET` | `/api/groups` | ? | Admin |
| 14 | `GET` | `/api/groups/{id}` | ? | Admin |
| 15 | `POST` | `/api/groups` | ? | Admin |
| 16 | `PUT` | `/api/groups/{id}` | ? | Admin |
| 17 | `DELETE` | `/api/groups/{id}` | ? | Admin |
| 18 | `POST` | `/api/groups/{id}/members` | ? | Admin |
| 19 | `DELETE` | `/api/groups/{id}/members/{studentId}` | ? | Admin |
| 20 | `GET` | `/api/admin/history` | ? | Admin |
| 21 | `GET` | `/api/supervisor/questions/groups/me` | ? | Supervisor |
| 22 | `GET` | `/api/supervisor/questions/groups/{groupId}/questions` | ? | Supervisor |
| 23 | `GET` | `/api/supervisor/questions` | ? | Supervisor |
| 24 | `GET` | `/api/supervisor/questions/{id}` | ? | Supervisor |
| 25 | `POST` | `/api/supervisor/questions/{id}/approve` | ? | Supervisor |
| 26 | `POST` | `/api/supervisor/questions/{id}/reject` | ? | Supervisor |
| 27 | `GET` | `/api/reviewer/questions` | ? | Reviewer |
| 28 | `GET` | `/api/reviewer/questions/{id}` | ? | Reviewer |
| 29 | `POST` | `/api/reviewer/questions/{id}/answer` | ? | Reviewer |
