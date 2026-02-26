## Context

Ini adalah proyek greenfield Next.js 16. Codebase saat ini hanya berisi scaffolding default — root layout, halaman boilerplate, dan konfigurasi Tailwind CSS v4. Kita perlu membangun Kanban board yang sepenuhnya interaktif sebagai antarmuka utama.

Board ini merupakan pengalaman interaktif yang sepenuhnya berjalan di client-side (drag-and-drop, modal, pengurutan ulang), sehingga komponen inti akan berupa Client Components. Namun, page shell dan layout tetap sebagai Server Components untuk performa optimal.

**State saat ini:** Aplikasi Next.js 16 kosong dengan Tailwind CSS v4 dan font Geist yang sudah dikonfigurasi.
**Target state:** Kanban board yang berfungsi dengan empat kolom, task card yang bisa di-drag, dan modal CRUD.

## Goals / Non-Goals

**Goals:**
- Membuat Kanban board yang responsif, aksesibel, dengan drag-and-drop yang smooth
- Menggunakan `@dnd-kit` untuk drag-and-drop (aksesibel, performant, kompatibel React 19)
- Menyimpan data task di client-side menggunakan React Context + `useReducer` untuk state yang predictable
- Mengisi board dengan sample data agar langsung bisa digunakan saat pertama kali dimuat
- Menggunakan komponen shadcn/ui untuk semua UI primitives (Button, Dialog, Sheet, Badge, dll.)
- Mendukung navigasi keyboard dan screen reader melalui fitur aksesibilitas `@dnd-kit`

**Non-Goals:**
- Persistensi server-side atau integrasi database (v1 hanya client-side)
- Autentikasi, multi-user, atau sinkronisasi real-time
- Multiple boards atau fitur manajemen proyek di luar single board
- Layout board khusus mobile (horizontal scroll di mobile sudah cukup)

## Decisions

### 1. Library Drag-and-Drop: `@dnd-kit` dibanding alternatif lain

**Keputusan:** Menggunakan `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`.

**Mengapa `@dnd-kit`:**
- Dibangun untuk React dengan API berbasis hooks — integrasi bersih dengan React 19
- Aksesibilitas first-class: navigasi keyboard, pengumuman screen reader
- Mendukung DnD lintas container (kolom-ke-kolom) dan dalam container (reorder)
- Drag overlay yang sangat customizable (feedback visual saat drag)
- Terawat dengan baik, ringan (~12kb gzipped)

**Alternatif yang dipertimbangkan:**
- `react-beautiful-dnd` — Deprecated, tidak mendukung React 19
- `react-dnd` — Lebih low-level, membutuhkan lebih banyak boilerplate, aksesibilitas lebih lemah
- Native HTML Drag API — Tidak ada aksesibilitas, perilaku cross-browser tidak konsisten

### 2. State Management: React Context + `useReducer`

**Keputusan:** Menggunakan `TaskContext` provider dengan `useReducer` untuk semua state task.

**Alasan:**
- Seluruh board adalah satu tampilan client-side — tidak perlu server state
- `useReducer` menyediakan transisi state yang predictable untuk aksi kompleks (pindah, urut ulang, CRUD)
- Context membuat state dapat diakses oleh semua komponen nested tanpa prop drilling
- Mudah diperluas nanti dengan menyimpan state reducer ke localStorage atau API

**Alternatif yang dipertimbangkan:**
- Zustand — Bagus, tapi berlebihan untuk single-page app tanpa kebutuhan middleware kompleks
- Redux Toolkit — Terlalu berat untuk scope ini
- `useState` saja — Menjadi sulit dikelola dengan banyak operasi task (pindah + urut ulang + CRUD)

### 3. Data Model: Flat task array dengan field `status` + `order`

**Keputusan:** Menyimpan semua task dalam satu array flat. Setiap task memiliki field `status` (kolom) dan `order` (posisi dalam kolom).

**Alasan:**
- Lebih sederhana dari struktur nested berbasis kolom (kolom diturunkan melalui filtering)
- Lebih mudah memindahkan task antar kolom (cukup update field `status`)
- Single source of truth — tidak perlu sinkronisasi array kolom
- Field `order` memungkinkan pengurutan stabil dalam setiap kolom

**Alternatif yang dipertimbangkan:**
- Column-keyed map (`{ backlog: Task[], todo: Task[] }`) — Pemindahan lebih kompleks, lebih sulit di-serialize
- Linked list — Terlalu kompleks untuk dataset kecil

### 4. Arsitektur Komponen

```
app/page.tsx                          # Server Component — merender KanbanBoard
  └── components/kanban/
      ├── kanban-board.tsx            # "use client" — DndContext provider + kolom
      ├── kanban-column.tsx           # SortableContext + droppable column
      ├── task-card.tsx               # Draggable task card
      ├── task-card-overlay.tsx       # Drag overlay (visual clone saat drag)
      ├── create-task-dialog.tsx      # Dialog untuk membuat task baru
      ├── edit-task-dialog.tsx        # Dialog untuk mengedit task
      ├── task-detail-sheet.tsx       # Sheet (slide-over) untuk detail task
      └── board-header.tsx            # Judul board + tombol "New Task"
  └── components/ui/                  # shadcn/ui primitives
  └── lib/
      ├── task-context.tsx            # TaskContext provider + useReducer
      ├── task-reducer.ts             # Reducer dengan aksi: ADD, UPDATE, DELETE, MOVE, REORDER
      ├── sample-data.ts              # Seed data untuk pemuatan pertama
      └── utils.ts                    # Utility cn()
  └── types/
      └── kanban.ts                   # Tipe Task, Column, Priority, Status
  └── hooks/
      └── use-tasks.ts                # Hook untuk mengonsumsi TaskContext
```

### 5. Alur Drag-and-Drop

1. `KanbanBoard` membungkus semua dalam `<DndContext>` dengan sensor (pointer + keyboard)
2. Setiap `KanbanColumn` membungkus kartu-kartunya dalam `<SortableContext>` dengan strategi list vertikal
3. Setiap `TaskCard` menggunakan `useSortable` agar bisa di-drag + di-sort
4. Pada `onDragStart` — set active task untuk rendering drag overlay
5. Pada `onDragOver` — deteksi perpindahan lintas kolom dan update posisi secara optimistic
6. Pada `onDragEnd` — finalisasi perpindahan dan update state reducer (status + order)
7. `<DragOverlay>` merender `TaskCardOverlay` — clone bergaya dari kartu yang di-drag

### 6. Routing: Single page di root

**Keputusan:** Kanban board berada di `/` (root route). Tidak ada halaman tambahan untuk v1.

**Alasan:** Ini adalah tool single-purpose. Board ADALAH aplikasinya. Menambahkan kompleksitas routing untuk satu tampilan tidak memberikan nilai tambah.

## Risks / Trade-offs

- **[Kehilangan data saat reload]** → v1 menggunakan state in-memory saja. Mitigasi: bisa menambahkan persistensi `localStorage` sebagai follow-up cepat. Arsitektur reducer membuat ini trivial (serialize state saat berubah, hydrate saat mount).
- **[Performa dengan banyak task]** → `@dnd-kit` dengan virtualization bisa menangani ratusan task, tapi kita tidak menambahkan virtualization di v1. Mitigasi: untuk use case yang diharapkan (<50 task per kolom), performa akan baik-baik saja.
- **[Tidak ada undo/redo]** → Perpindahan yang tidak disengaja tidak bisa di-undo. Mitigasi: pola reducer membuat undo/redo mudah ditambahkan nanti (action history stack).
- **[Bundle CSS awal yang besar]** → Menambahkan banyak komponen shadcn/ui meningkatkan bundle. Mitigasi: Tailwind CSS v4 melakukan tree-shake secara agresif; komponen shadcn diimpor satu per satu.

## Open Questions

- Haruskah kita menyimpan state ke `localStorage` di v1, atau menunda untuk follow-up? _(Rekomendasi: tambahkan — effort minimal dan mencegah kehilangan data)_
- Apakah kita perlu aksi bulk "hapus semua task done"? _(Rekomendasi: tunda ke v2)_
