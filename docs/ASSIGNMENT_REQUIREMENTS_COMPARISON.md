# Assignment Requirements Comparison (Project vs. Upgraded Exercises)

Cap nhat: 2026-03-27

Tai lieu nay tong hop doi chieu giua:

- Cac yeu cau bai tap nang cap qua tung buoi (Inventory, Auth, User/Role, Category API, UI bang quan ly, Soft delete...)
- Trang thai du an hien tai (`backend_nodejs` + `techhome-e-commerce`)
- Muc do phu hop voi thuc te web thong dung

Muc tieu: lam tai lieu de doi chieu va xem lai sau nay.

---

## 1) Tong ket nhanh

- **Da dat/gan dat:** Login + `/auth/me`, `change-password` co validate, JWT da dung `RS256`, categories/products CRUD co slug/filter co ban.
- **Con thieu lon:** Inventory module rieng (stock/reserved/soldCount), Role CRUD thuc su, `enable/disable user`, comments/posts CRUD, soft delete nhat quan.
- **Diem manh du an:** Co tai lieu API/Postman ro, middleware auth/permission, DTO mapping, cau truc backend/frontend tach ro.
- **Diem yeu so voi bai tap + web thong dung:** Nhieu endpoint nghiep vu nang cao chua co hoac dang placeholder; mot so chuc nang UI bang chua day du tieu chi de bai.

---

## 2) Ma tran doi chieu chi tiet

| Nhom yeu cau | Yeu cau bai tap | Trang thai du an | Danh gia |
|---|---|---|---|
| Inventory model + flows | Tao inventory khi tao product; get all/by id co join product; add/remove/reservation/sold | Chua co schema/route inventory rieng | **Chua dat** |
| Auth login + /me | Chup anh test login va /me | Co `POST /auth/login`, `GET /auth/me` | **Dat ve code API** (anh bang chung thi tuy quy trinh nop bai) |
| Change password | Route can dang nhap, old/new password, validate new password | Co `POST /auth/change-password` + legacy `/auth/changepassword`; co strong-password validator | **Dat** |
| JWT RS256 | Chuyen JWT sang RS256 | Da dung RS256 voi private/public key | **Dat** |
| User + Role model CRUD + soft delete | User/Role day du fields, CRUD, xoa mem | Users co CRUD nhung xoa cung; Roles API dang placeholder/501 | **Dat mot phan / Chua dat** |
| /enable va /disable user | POST email + username de bat/tat status | Chua co endpoint tuong ung | **Chua dat** |
| Category API | getall/getById/getBySlug/create/edit/delete; getall query name; `/categories/{id}/products` | Co CRUD + getBySlug; co `GET /products?category=...`; chua thay route `/categories/:id/products` | **Dat mot phan** |
| UI bang quan ly | Zebra den-trang, hien thi hinh, search title onChange, page size 5/10/20, sort gia/ten tang-giam | Co search onChange + pagination + image; chua co page-size 5/10/20 va sort day du; zebra chua dung yeu cau | **Dat mot phan** |
| Soft delete + ID string max+1 + comments | Xoa mem, ID chuoi max+1, hien thi post da xoa co gach ngang, thao tac comments | Product co `isDeleted` nhung delete van hard delete; ID dang so; khong thay module posts/comments | **Chua dat** |

---

## 3) Doi chieu tung phan va ben nao tot hon

## 3.1 Inventory

- **Theo bai tap:** can module inventory rieng, co `stock`, `reserved`, `soldCount`, va cac luong cap nhat ton kho.
- **Du an hien tai:** ton kho dang gan trong product, chua tach inventory endpoint.
- **Danh gia voi web thong dung:** bai tap o phan nay **tot hon** (dung huong nghiep vu e-commerce), du an can nang cap de an toan hon khi co nhieu giao dich dong thoi.

## 3.2 Auth (/login, /me, change password, RS256)

- **Du an hien tai:** da co day du va kha chuan:
  - login + me
  - doi mat khau co validation manh
  - JWT RS256 (key pair)
- **Danh gia voi web thong dung:** du an o phan nay **tot hon muc bai tap co ban** vi da ho tro ca route spec + legacy va co tai lieu test ro.

## 3.3 User/Role + enable/disable

- **Theo bai tap:** User va Role la 2 object rieng, CRUD day du, xoa mem, co enable/disable bang email + username.
- **Du an hien tai:** users CRUD co, nhung role chua support nghiep vu, enable/disable chua co, xoa mem user chua co.
- **Danh gia:** **bai tap tot hon** ve nghiep vu quan tri tai khoan.

## 3.4 Categories + products theo category

- **Du an hien tai:** categories CRUD + slug endpoint co; products co query theo category.
- **Lech bai tap:** chua co route dung dinh dang `/categories/{id}/products`.
- **Danh gia:** ve kha nang API thi du an **gan dat**, nhung de chuan de bai can them route mapping ro rang.

## 3.5 UI bang quan ly

- **Du an hien tai:** co search theo onChange, co phan trang, co hinh anh.
- **Con thieu theo bai tap:** sort gia/ten tang-giam, page-size 5/10/20, zebra row den-trang dung yeu cau.
- **Danh gia:** ve kien truc frontend (React/component) du an **tot hon** HTML/JS co ban; ve tieu chi cham bai, hien tai **chua dat du**.

## 3.6 Soft delete + comments/posts

- **Du an hien tai:** moi co dau hieu soft delete tren product (`isDeleted`) nhung hanh vi xoa van hard delete.
- **Con thieu lon:** ID chuoi max+1, danh dau hien thi post da xoa, CRUD comments.
- **Danh gia:** phan yeu cau bai tap **tot hon** va sat nghiep vu hon.

---

## 4) Cac muc du an da lam tot hon bai tap

- Co tai lieu Postman va status migration FE/BE ro rang, de theo doi tien do.
- Co middleware auth + permission va mo hinh route chia theo module.
- Co khung API song song `/api` va `/api/v1` de tuong thich.
- Co xu ly validate mat khau manh ngay tai tang API.

---

## 5) Cac muc can bo sung de dat de bai va hop web thuc te

## Uu tien 1 (thieu nghiep vu cot loi)

- Them module `inventory` day du (schema + service + routes):
  - Auto tao inventory khi tao product
  - get all/get by id co join product
  - add_stock, remove_stock, reservation, sold
  - dam bao update atomic/transaction de tranh loi dong thoi

## Uu tien 2 (quan tri tai khoan)

- Hoan thien `Role` CRUD that (khong placeholder 501)
- Bo sung `/users/enable` va `/users/disable` theo `email + username`
- Chuyen xoa user tu hard delete sang soft delete

## Uu tien 3 (API contract sat de bai)

- Them endpoint `/categories/:id/products` (co the tai su dung logic `GET /products?category=...`)
- Bo sung query theo `name` trong `GET /categories`

## Uu tien 4 (UI bang quan ly)

- Them sort theo gia/tieu de (tang/giam)
- Them select page size: 5/10/20
- Chinh style zebra row den-trang
- Dam bao hien thi du hinh theo yeu cau bai tap

## Uu tien 5 (soft delete + comments/posts)

- Chuan hoa soft delete nhat quan thay vi deleteOne truc tiep
- Neu de bai yeu cau cho posts/comments: bo sung module posts/comments CRUD day du
- Neu bat buoc id chuoi max+1: dieu chinh id strategy (hoac tai lieu hoa ro neu giu id so)

---

## 6) Checklist danh dau khi review lai

- [ ] Inventory module da co va test du 6 flow stock
- [ ] Product create auto tao inventory
- [ ] User enable/disable da co endpoint va test pass
- [ ] Role CRUD khong con 501
- [ ] Users/products delete da la soft delete nhat quan
- [ ] Co route `/categories/:id/products`
- [ ] UI bang co search onChange + sort + page size 5/10/20 + zebra
- [ ] Neu scope co posts/comments: da co CRUD va hien thi post da xoa (gach ngang)
- [ ] Bo sung bang chung test Postman (anh/collection/export) theo format nop bai

---

## 7) Ghi chu pham vi

- Tai lieu nay la doi chieu theo codebase hien tai va cac docs trang thai/manual test.
- Cac yeu cau ve "nop file Word co anh" la phan artifact nop bai, khong phai logic API; can xac nhan rieng trong quy trinh nop.

