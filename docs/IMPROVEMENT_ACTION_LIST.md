# Improvement Action List (From Assignment + Common Web Practices)

Cap nhat: 2026-03-27

Tai lieu nay liet ke cac dieu can cai thien duoc tong hop tu:

- Yeu cau bai tap nang cap da ban
- Doi chieu voi thuc te cac web thong dung (e-commerce/admin systems)

Muc tieu: lam checklist thuc thi de nang cap du an theo tung dot.

---

## 1) Uu tien P0 - Core gaps (bat buoc cho assignment + project)

## 1.1 Inventory module day du

- [ ] Tao schema `Inventory`:
  - `product` (ref product, unique, required)
  - `stock` (min 0)
  - `reserved` (min 0)
  - `soldCount` (min 0)
- [ ] Khi tao `product` => auto tao `inventory` tuong ung.
- [ ] Bo sung API:
  - [ ] `GET /inventories`
  - [ ] `GET /inventories/:id` (join/populate product)
  - [ ] `POST /inventories/add-stock` ({ product, quantity })
  - [ ] `POST /inventories/remove-stock` ({ product, quantity })
  - [ ] `POST /inventories/reservation` ({ product, quantity })
  - [ ] `POST /inventories/sold` ({ product, quantity })
- [ ] Validate nghiep vu:
  - [ ] Khong cho stock/reserved am
  - [ ] Khong cho reservation > stock
  - [ ] Khong cho sold > reserved

## 1.2 User/Role gap vs current TechHome auth model

- [ ] Hoan thien `Role` CRUD that (khong con placeholder `501`).
- [ ] Chot huong `Option B` (giu model User hien tai, them compatibility DTO cho assignment).
- [ ] Mapping user fields theo assignment qua DTO (khong buoc doi schema ngay):
  - [ ] `username` <- map tu `email` hoac rule duoc chot
  - [ ] `fullName` <- map tu `name`
  - [ ] `avatarUrl` <- map tu `avatar_url`
  - [ ] `status` <- map theo account state (neu chua co thi dinh nghia default ro)
  - [ ] `loginCount` <- map/placeholder theo policy assignment
- [ ] Chuyen xoa user sang xoá mềm.
- [ ] Bo sung endpoint compatibility:
  - [ ] `POST /api/users/enable` va `POST /api/v1/users/enable` (email + username => status true)
  - [ ] `POST /api/users/disable` va `POST /api/v1/users/disable` (email + username => status false)

---

## 2) Uu tien P1 - Contract alignment (Assignment vs TechHome API)

## 2.1 Categories API parity with assignment

- [ ] Bo sung `GET /api/categories/:id/products` va `/api/v1/categories/:id/products`.
- [ ] Ghi chu mapping logic: route moi tai su dung tuong duong `GET /products?category=<id>`.
- [ ] Bo sung query `name` trong `GET /categories` (tim kiem ten danh muc).
- [ ] Bao dam `getAll/getById/getBySlug/create/edit/delete` hoat dong nhat quan.

## 2.2 Soft delete nhat quan

- [ ] Chuyen cac route `DELETE` dang hard delete sang soft delete o cac module lien quan.
- [ ] Chuan hoa filter public/admin:
  - [ ] Public khong tra ve ban ghi da xoa mem
  - [ ] Admin co tuy chon xem da xoa
- [ ] Them truong phu tro de quan tri:
  - [ ] `deletedAt`
  - [ ] `deletedBy` (neu co user context)

## 2.3 ID strategy decision (keep numeric in TechHome or add assignment mode)

- [ ] Neu can assignment compatibility mode (id chuoi):
  - [ ] Chuyen id tao moi theo `maxId + 1` dang chuoi
  - [ ] Cap nhat validator/mapping de tuong thich
- [ ] Neu giu id so cho TechHome (huong khuyen nghi hien tai):
  - [ ] Tai lieu hoa ro ly do khac de bai
  - [ ] Dam bao khong gay vo FE/BE contract

---

## 3) Uu tien P2 - Admin table parity (assignment UI + TechHome UI)

## 3.1 Chuc nang bang quan ly

- [ ] Zebra row den-trang (1 dong den, 1 dong trang theo yeu cau bai).
- [ ] Dam bao hien thi day du hinh anh trong bang.
- [ ] Search theo `title`/`name` va cap nhat `onChange`.
- [ ] Them phan trang co page size tuy chon:
  - [ ] 5
  - [ ] 10
  - [ ] 20
- [ ] Them nut sap xep:
  - [ ] Gia tang/giam
  - [ ] Ten tang/giam

## 3.2 Nang cap UX theo web thong dung

- [ ] Bo sung loading/error/empty state ro rang cho bang.
- [ ] Dong bo query params (`search`, `sort`, `page`, `size`) len URL.
- [ ] Debounce search + reset page khi doi dieu kien loc/sap xep.
- [ ] Accessible labels cho button sort/pagination/filter.

---

## 4) Uu tien P3 - Optional assignment modules + submission artifacts

## 4.1 Optional module (outside current TechHome scope): posts/comments

- [ ] Bo sung toan bo thao tac CRUD voi comments.
- [ ] Hien thi post xoá mềm bang gach ngang.
- [ ] Tach ro post active vs post deleted trong UI.

## 4.2 Artifact nop bai

- [ ] Collection Postman cho cac API chinh.

---

## 5) Nang cap ky thuat theo web thong dung (khuyen nghi manh)

## 5.1 Do tin cay nghiep vu ton kho

- [ ] Dung update atomic/transaction cho stock/reserved/sold.
- [ ] Chong race condition khi nhieu request dong thoi.
- [ ] Them idempotency key cho thao tac quan trong (reservation/sold) neu can.

## 5.2 Bao mat va auth

- [ ] Rotation key RS256 va quy trinh quan ly key an toan.
- [ ] Access token + refresh token (neu mo rong production-ready).
- [ ] Audit trail cho hanh dong admin nhay cam.

## 5.3 Chat luong va van hanh

- [ ] Bo sung test:
  - [ ] Unit test cho service/validator
  - [ ] Integration test cho route nghiep vu
- [ ] Them logging co cau truc (request id, actor, action, result).
- [ ] Bo sung dashboard monitor loi va latency endpoint.

---

## 6) Ke hoach thuc thi de xuat (ngan gon)

## Dot 1

- Inventory schema + routes + validator + postman tests.
- Chuyen delete product sang soft delete nhat quan.

## Dot 2

- Role CRUD + user enable/disable + user soft delete.
- Bo sung `GET /categories/:id/products`.

## Dot 3

- Hoan thien UI bang: sort + page size + zebra + URL state.
- Chuan hoa artifact nop bai (anh + tai lieu).

## Dot 4

- Hardening: transaction, tests, logging, monitoring.

---

## 7) Dinh nghia "Done"

- [ ] Toan bo yeu cau bai tap co endpoint/chuc nang tuong ung.
- [ ] Khong con route placeholder cho nghiep vu bi yeu cau.
- [ ] Cac luong inventory va auth da test pass tren Postman.
- [ ] Frontend bang quan ly dat du tieu chi de bai (sort/search/paging/style).
- [ ] Co tai lieu doi chieu + bang chung thuc thi de nop va review.

