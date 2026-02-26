## 1. Setup Proyek & Dependencies

- [ ] 1.1 [FE] Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` via pnpm
  - **Acceptance:** `pnpm install` selesai, package muncul di `package.json` dependencies
- [ ] 1.2 [FE] Inisialisasi shadcn/ui dengan `pnpm dlx shadcn@latest init` — konfigurasi path alias, CSS variables, dan kompatibilitas Tailwind CSS v4
  - **Acceptance:** `components.json` ada, `lib/utils.ts` dengan `cn()` di-generate, globals.css diperbarui dengan token tema shadcn
- [ ] 1.3 [FE] Menambahkan komponen shadcn/ui yang dibutuhkan: `button`, `dialog`, `sheet`, `badge`, `input`, `textarea`, `select`, `dropdown-menu`, `avatar`, `label`, `separator`
  - **Acceptance:** Semua file komponen ada di `components/ui/`, import resolve dengan benar

## 2. TypeScript Types & Data Layer

- [ ] 2.1 [FE] Membuat `types/kanban.ts` — mendefinisikan tipe `TaskStatus`, `TaskPriority`, `Task`, dan `Column` sesuai spesifikasi task-management
  - **Acceptance:** Tipe tereksport, interface `Task` memiliki semua field yang dibutuhkan (id, title, description, status, priority, assignee, dueDate, labels, order, createdAt)
- [ ] 2.2 [FE] Membuat `lib/task-reducer.ts` — implementasi task reducer dengan aksi: `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `MOVE_TASK`, `REORDER_TASK`
  - **Acceptance:** Setiap aksi memutasi state dengan benar sesuai skenario spesifikasi data-store. `MOVE_TASK` mengupdate status + order. `REORDER_TASK` menyesuaikan posisi dalam kolom.
- [ ] 2.3 [FE] Membuat `lib/task-context.tsx` — implementasi `TaskProvider` dengan `useReducer` dan `TaskContext`, plus helper turunan (`getTasksByStatus`, `getNextOrder`, `generateTaskId`)
  - **Acceptance:** Provider membungkus children dan menyediakan `{ tasks, dispatch }`. Melempar error jika `useTasks()` dipanggil di luar provider.
- [ ] 2.4 [FE] Membuat `hooks/use-tasks.ts` — wrapper hook tipis yang mengonsumsi `TaskContext` dengan return type-safe
  - **Acceptance:** Hook mengembalikan `{ tasks, dispatch }` yang ter-type, melempar error deskriptif di luar provider
- [ ] 2.5 [FE] Membuat `lib/sample-data.ts` — seed data dengan 8+ task di keempat kolom dengan prioritas bervariasi, beberapa dengan assignee dan due date
  - **Acceptance:** Sample data sesuai spesifikasi data-store: task di semua status, prioritas bervariasi, campuran assignee/date

## 3. Layout Kanban Board

- [ ] 3.1 [FE] Membuat `components/kanban/board-header.tsx` — judul board "Kanban Board" dengan tombol "+ New Task" menggunakan shadcn Button
  - **Acceptance:** Header merender judul + tombol, tombol memicu callback `onNewTask`
- [ ] 3.2 [FE] Membuat `components/kanban/kanban-column.tsx` — komponen kolom tunggal yang menampilkan judul kolom, badge jumlah task, dan daftar vertikal kartu task. Membungkus kartu dalam `SortableContext`.
  - **Acceptance:** Kolom merender judul dengan jumlah, scroll vertikal saat overflow, lebar minimum 280px
- [ ] 3.3 [FE] Membuat `components/kanban/kanban-board.tsx` — layout board utama sebagai komponen `"use client"`. Membungkus kolom dalam `DndContext`, merender empat kolom berurutan (Backlog, Todo, In Progress, Done), menyertakan `TaskProvider`.
  - **Acceptance:** Board merender 4 kolom horizontal, scroll horizontal di mobile (<768px), semua terbungkus DndContext + TaskProvider

## 4. Task Card & Overlay

- [ ] 4.1 [FE] Membuat `components/kanban/task-card.tsx` — kartu task draggable menggunakan `useSortable`. Menampilkan judul (bold, terpotong), badge prioritas (berwarna), inisial assignee, due date.
  - **Acceptance:** Kartu merender semua info task, menggunakan warna prioritas yang benar (urgent=merah, high=oranye, medium=kuning, low=abu-abu), memotong judul panjang
- [ ] 4.2 [FE] Membuat `components/kanban/task-card-overlay.tsx` — drag overlay visual clone untuk feedback drag yang smooth
  - **Acceptance:** Overlay sesuai tampilan kartu, mengikuti kursor saat drag, kartu asli menampilkan opacity berkurang

## 5. Logika Drag & Drop

- [ ] 5.1 [FE] Implementasi handler `onDragStart` di `kanban-board.tsx` — set active task ID untuk rendering overlay
  - **Acceptance:** Men-drag kartu menampilkan overlay, set state active task
- [ ] 5.2 [FE] Implementasi handler `onDragOver` — deteksi perpindahan lintas kolom dan update posisi task secara optimistic
  - **Acceptance:** Men-drag kartu ke kolom berbeda menampilkan kartu berpindah ke kolom tersebut secara real-time
- [ ] 5.3 [FE] Implementasi handler `onDragEnd` — finalisasi perpindahan/pengurutan ulang dengan dispatch aksi `MOVE_TASK` atau `REORDER_TASK`
  - **Acceptance:** Menjatuhkan kartu di kolom baru mengupdate status. Menjatuhkan di kolom yang sama mengurutkan ulang. Jumlah kolom diperbarui.
- [ ] 5.4 [FE] Menambahkan sensor keyboard dan pengumuman screen reader (prop `announcements` pada DndContext)
  - **Acceptance:** Bisa mengambil kartu dengan Space/Enter, pindah dengan tombol panah, jatuhkan dengan Space/Enter. Screen reader mengumumkan aksi.

## 6. Dialog CRUD Task

- [ ] 6.1 [FE] Membuat `components/kanban/create-task-dialog.tsx` — Dialog dengan form untuk membuat task. Field: Title (wajib), Description, Status (select), Priority (select), Assignee, Due Date, Labels.
  - **Acceptance:** Form memvalidasi title wajib diisi. Submit membuat task, menutup dialog, task muncul di kolom yang benar.
- [ ] 6.2 [FE] Membuat `components/kanban/edit-task-dialog.tsx` — Dialog terisi dengan nilai task yang ada untuk pengeditan
  - **Acceptance:** Terbuka dengan nilai saat ini, menyimpan perubahan saat submit, mengupdate task di board, menangani perubahan status (pindah kolom)
- [ ] 6.3 [FE] Membuat `components/kanban/task-detail-sheet.tsx` — Sheet (slide-over dari kanan) menampilkan detail lengkap task dengan tombol aksi Edit dan Delete
  - **Acceptance:** Terbuka saat klik kartu (bukan drag), menampilkan semua properti, Edit membuka dialog edit, Delete menampilkan konfirmasi
- [ ] 6.4 [FE] Menambahkan dropdown menu pada kartu task (tombol "...") dengan opsi "Edit" dan "Delete"
  - **Acceptance:** Menu muncul saat klik, Edit membuka dialog edit, Delete menampilkan dialog konfirmasi sebelum menghapus task

## 7. Styling & Theme

- [ ] 7.1 [FE] Update `app/globals.css` — menambahkan token tema khusus Kanban (warna background kolom, warna badge prioritas, indikator status) di blok `@theme inline`
  - **Acceptance:** Token tema berfungsi di light dan dark mode, warna sesuai spesifikasi (prioritas: urgent=merah, high=oranye, medium=kuning, low=abu-abu)
- [ ] 7.2 [FE] Styling semua komponen dengan utility Tailwind — memastikan spacing, typography, hover/focus states yang konsisten mengikuti konvensi shadcn
  - **Acceptance:** Board terlihat polished, kartu memiliki efek hover, focus ring pada elemen interaktif, konsisten dengan estetika shadcn

## 8. Integrasi Halaman & Polish

- [ ] 8.1 [FE] Update `app/page.tsx` — mengganti konten default Next.js dengan komponen `KanbanBoard` sebagai tampilan utama
  - **Acceptance:** Halaman root merender Kanban board, tidak ada boilerplate Next.js default tersisa
- [ ] 8.2 [FE] Update `app/layout.tsx` — mengatur judul halaman ("Kanban Board") dan deskripsi metadata yang benar
  - **Acceptance:** Tab browser menampilkan "Kanban Board", meta description relevan
- [ ] 8.3 [FE] Verifikasi alur lengkap — membuat, mengedit, menghapus, drag antar kolom, reorder dalam kolom, scroll responsif di mobile
  - **Acceptance:** Semua interaksi user dari spesifikasi berfungsi end-to-end tanpa error di console
