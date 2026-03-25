# 🔴 YÊU CẦU BACKEND TEAM FIX CORS

## Vấn đề hiện tại:

Frontend không thể gọi API từ `http://localhost:5173` đến backend `https://localhost:7443` vì **CORS Policy** chặn request.

### Lỗi cụ thể:
```
Access to XMLHttpRequest at 'https://localhost:7443/api/auth/login' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## ✅ GIẢI PHÁP: Thêm CORS vào Backend

### File cần sửa: `Program.cs`

### Bước 1: Thêm CORS Service

Tìm dòng:
```csharp
var builder = WebApplication.CreateBuilder(args);
```

**Thêm NGAY SAU dòng đó:**

```csharp
// Add CORS Policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",  // Vite dev server
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:3000"   // Alternative ports
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Bước 2: Sử dụng CORS Middleware

Tìm dòng:
```csharp
var app = builder.Build();
```

**Thêm NGAY SAU dòng đó (QUAN TRỌNG: PHẢI TRƯỚC `app.UseAuthorization()`):**

```csharp
// Enable CORS
app.UseCors();
```

### Thứ tự middleware QUAN TRỌNG:

```csharp
var app = builder.Build();

app.UseCors();              // ← Phải đặt ở đây
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

### Bước 3: Restart Backend

- Stop backend (Ctrl + C)
- Chạy lại: `dotnet run` hoặc F5

---

## 🧪 TEST SAU KHI FIX:

1. Mở Swagger: https://localhost:7443/swagger
2. Mở frontend: http://localhost:5173/login
3. Đăng nhập với:
   - Email: `admin@swp.com`
   - Password: `123456`
4. Không còn lỗi CORS

---

## ❓ Nếu vẫn lỗi:

### Option 2: AllowAnyOrigin (CHỈ DÙNG CHO DEV)

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()   // Allow tất cả origins (DEV ONLY!)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

**Lưu ý**: `AllowAnyOrigin()` không thể kết hợp với `.AllowCredentials()`. Nếu cần credentials, phải dùng `WithOrigins()`.

---

## 📚 TÀI LIỆU THAM KHẢO:

- [Microsoft Docs - Enable CORS in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/cors)
- [CORS Policy Middleware Order](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/#middleware-order)

---

**GỬI FILE NÀY CHO BACKEND TEAM ĐỂ FIX!** 🚀
