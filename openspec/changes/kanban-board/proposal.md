## Why

Tim saat ini belum memiliki tools terpusat untuk memvisualisasikan dan mengelola alur kerja task. Tanpa board yang jelas menunjukkan apa yang ada di backlog, sedang dikerjakan, dan sudah selesai, task sering terlewat dan koordinasi tim menjadi buruk. Kanban board menyediakan cara yang intuitif dan visual untuk melacak pekerjaan melalui empat tahap — Backlog, Todo, In Progress, dan Done — dengan kemudahan drag-and-drop.

## What Changes

- **Halaman Kanban Board baru** — Board interaktif full-page dengan empat kolom (Backlog, Todo, In Progress, Done) sebagai tampilan utama dashboard
- **Task Cards** — Kartu visual di setiap kolom yang menampilkan judul, badge prioritas, avatar assignee, dan due date
- **Drag & Drop** — Kemampuan memindahkan kartu task antar kolom untuk mengubah status, serta mengurutkan ulang dalam satu kolom
- **Task CRUD** — Membuat task baru melalui modal form, mengedit task yang ada, dan menghapus task dengan konfirmasi
- **Panel Detail Task** — Panel slide-over yang menampilkan detail lengkap task (deskripsi, label, informasi lainnya)
- **Data Layer** — Penyimpanan data in-memory menggunakan React Context (tanpa database untuk v1) dengan TypeScript types untuk semua model
- **Layout Responsif** — Board scroll horizontal di layar kecil; kartu tersusun dengan baik

## Non-goals

- Autentikasi atau akun multi-user (diasumsikan single-user/tim)
- Database backend persisten (v1 menggunakan in-memory/local state; persistensi bisa ditambahkan nanti)
- Multiple boards atau proyek (hanya satu board untuk v1)
- Kolaborasi real-time atau sinkronisasi WebSocket
- Komentar, lampiran, atau riwayat aktivitas pada task
- Notifikasi atau integrasi email

## Capabilities

### New Capabilities

- `kanban-board`: UI utama Kanban board — layout empat kolom (Backlog, Todo, In Progress, Done) dengan perpindahan task drag-and-drop, jumlah task per kolom, dan horizontal scroll di mobile
- `task-management`: Operasi CRUD task — membuat, membaca, mengubah, menghapus task dengan properti (judul, deskripsi, status, prioritas, assignee, due date, label, urutan). Termasuk modal form task dan panel slide-over detail task
- `data-store`: Data layer client-side menggunakan React Context dan TypeScript types — menyediakan manajemen state task, transisi status, dan logika pengurutan tanpa backend

### Modified Capabilities

_Tidak ada — ini adalah implementasi greenfield._

## Impact

- **File baru**: ~15-20 file component, hook, type, dan utility baru
- **Dependencies**: Perlu menambahkan `@dnd-kit/core` dan `@dnd-kit/sortable` untuk drag-and-drop yang aksesibel, serta komponen shadcn/ui (Button, Dialog, Sheet, Badge, Avatar, Input, Textarea, Select, DropdownMenu)
- **Routing**: Halaman root (`app/page.tsx`) akan diganti dengan Kanban board sebagai tampilan utama
- **Styling**: Token tema Tailwind baru untuk warna spesifik Kanban (background kolom, badge prioritas, indikator status)
- **Tidak ada breaking changes**: Ini adalah proyek baru tanpa fungsionalitas yang perlu dipertahankan
