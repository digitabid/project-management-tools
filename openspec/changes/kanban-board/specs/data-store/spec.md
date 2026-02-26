## ADDED Requirements

### Requirement: Task Context Provider

React Context provider yang membungkus board dan menyediakan state task + dispatch ke semua child component.

#### Scenario: Provider membungkus board
- **WHEN** komponen `KanbanBoard` dimount
- **THEN** dibungkus dalam `TaskProvider` yang menyediakan array `tasks` dan fungsi `dispatch` melalui context

#### Scenario: State awal dengan sample data
- **WHEN** aplikasi dimuat untuk pertama kali
- **THEN** board diisi dengan sample task (minimal 2–3 per kolom) agar board tidak kosong
- **THEN** sample task mencakup keempat status dan prioritas yang bervariasi

### Requirement: Aksi Task Reducer

Reducer menangani semua mutasi state melalui aksi yang di-type.

#### Scenario: Aksi ADD_TASK
- **WHEN** `dispatch({ type: "ADD_TASK", payload: newTask })` dipanggil
- **THEN** task baru ditambahkan ke array tasks dengan `order` diset ke urutan berikutnya yang tersedia di kolom statusnya

#### Scenario: Aksi UPDATE_TASK
- **WHEN** `dispatch({ type: "UPDATE_TASK", payload: { id, updates } })` dipanggil
- **THEN** properti task yang cocok digabungkan dengan updates
- **THEN** jika `status` berubah, `order` diset ke akhir kolom baru

#### Scenario: Aksi DELETE_TASK
- **WHEN** `dispatch({ type: "DELETE_TASK", payload: { id } })` dipanggil
- **THEN** task dengan ID yang cocok dihapus dari array
- **THEN** task yang tersisa di kolom yang sama mempertahankan urutan relatifnya

#### Scenario: Aksi MOVE_TASK (lintas kolom)
- **WHEN** `dispatch({ type: "MOVE_TASK", payload: { taskId, newStatus, newOrder } })` dipanggil
- **THEN** `status` task diperbarui ke `newStatus`
- **THEN** `order` task diperbarui ke `newOrder`
- **THEN** task lain di kolom asal dan tujuan memiliki nilai `order` yang disesuaikan untuk mempertahankan urutan

#### Scenario: Aksi REORDER_TASK (dalam kolom)
- **WHEN** `dispatch({ type: "REORDER_TASK", payload: { taskId, newOrder } })` dipanggil
- **THEN** task berpindah ke posisi order baru dalam kolom yang sama
- **THEN** task lain di kolom tersebut menggeser nilai `order` mereka sesuai

### Requirement: Custom Hook untuk Task Context

Hook `useTasks` menyediakan akses type-safe ke task context.

#### Scenario: Hook mengembalikan tasks dan dispatch
- **WHEN** sebuah komponen memanggil `useTasks()`
- **THEN** menerima `{ tasks, dispatch }` dengan TypeScript types yang tepat
- **THEN** jika dipanggil di luar `TaskProvider`, melempar error: "useTasks must be used within a TaskProvider"

### Requirement: Helper Data Turunan

Fungsi utility untuk menghitung data board dari flat task array.

#### Scenario: Mendapatkan task berdasarkan kolom
- **WHEN** `getTasksByStatus(tasks, "todo")` dipanggil
- **THEN** mengembalikan array task dengan `status === "todo"`, diurutkan berdasarkan `order` ascending

#### Scenario: Mendapatkan nilai order berikutnya
- **WHEN** `getNextOrder(tasks, "backlog")` dipanggil
- **THEN** mengembalikan `maxOrder + 1` untuk kolom tersebut, atau `0` jika kolom kosong

#### Scenario: Menghasilkan ID task unik
- **WHEN** `generateTaskId()` dipanggil
- **THEN** mengembalikan string ID unik (misalnya menggunakan `crypto.randomUUID()`)

### Requirement: Sample Data

Task sample siap pakai untuk penggunaan pertama kali.

#### Scenario: Sample data mencakup semua status
- **WHEN** sample data dimuat
- **THEN** berisi task di keempat kolom:
  - Backlog: "Research competitor tools", "Define user personas"
  - Todo: "Design database schema", "Create wireframes"
  - In Progress: "Implement authentication", "Build API endpoints"
  - Done: "Set up project repository", "Configure CI/CD pipeline"
- **THEN** task memiliki prioritas yang bervariasi (low, medium, high, urgent)
- **THEN** beberapa task memiliki assignee dan due date, beberapa tidak
