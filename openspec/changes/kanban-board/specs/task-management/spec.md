## ADDED Requirements

### Requirement: Membuat Task

User dapat membuat task baru melalui form dialog modal dengan field wajib dan opsional.

#### Scenario: Membuka dialog pembuatan task
- **WHEN** user mengklik tombol "+ New Task" di header board
- **THEN** modal Dialog muncul dengan form berisi: Title (input teks wajib), Description (textarea opsional), Status (select dropdown, default "Backlog"), Priority (select dropdown, default "Medium"), Assignee (input teks, opsional), Due Date (date picker, opsional), Labels (input teks dipisah koma, opsional)

#### Scenario: Submit task yang valid
- **WHEN** user mengisi minimal field Title
- **AND** mengklik "Create Task"
- **THEN** task baru dibuat dengan ID unik
- **THEN** task muncul di kolom status yang dipilih di bagian bawah
- **THEN** dialog tertutup
- **THEN** jumlah task di kolom bertambah

#### Scenario: Validasi mencegah title kosong
- **WHEN** user mencoba submit form tanpa title
- **THEN** pesan error validasi muncul: "Title is required"
- **THEN** form tidak di-submit

### Requirement: Mengedit Task

User dapat mengedit properti task yang ada melalui dialog modal.

#### Scenario: Membuka dialog edit dari detail task
- **WHEN** user mengklik tombol "Edit" di Sheet detail task
- **THEN** modal Dialog muncul dengan nilai-nilai task saat ini yang sudah terisi

#### Scenario: Menyimpan task yang diedit
- **WHEN** user mengubah field apapun dan mengklik "Save Changes"
- **THEN** task diperbarui dengan nilai baru
- **THEN** jika status berubah, task berpindah ke kolom baru
- **THEN** dialog tertutup

#### Scenario: Edit melalui context menu
- **WHEN** user klik kanan atau mengklik menu "..." pada kartu task
- **THEN** dropdown menu muncul dengan opsi "Edit" dan "Delete"
- **WHEN** user mengklik "Edit"
- **THEN** dialog edit terbuka

### Requirement: Menghapus Task

User dapat menghapus task dengan langkah konfirmasi untuk mencegah penghapusan tidak sengaja.

#### Scenario: Hapus dari context menu
- **WHEN** user mengklik "Delete" dari dropdown menu kartu task
- **THEN** dialog konfirmasi muncul: "Apakah Anda yakin ingin menghapus '{task title}'?"
- **WHEN** user mengonfirmasi
- **THEN** task dihapus dari board
- **THEN** jumlah task di kolom berkurang

#### Scenario: Hapus dari detail task
- **WHEN** user mengklik tombol "Delete" di Sheet detail task
- **THEN** dialog konfirmasi yang sama muncul
- **WHEN** user mengonfirmasi
- **THEN** task dihapus dan Sheet tertutup

#### Scenario: Membatalkan penghapusan
- **WHEN** user mengklik "Cancel" pada konfirmasi hapus
- **THEN** task tidak dihapus dan dialog tertutup

### Requirement: Tampilan Detail Task

User dapat melihat detail lengkap task di panel slide-over.

#### Scenario: Membuka detail task
- **WHEN** user mengklik kartu task
- **THEN** Sheet (panel slide-over) terbuka dari sisi kanan
- **THEN** menampilkan semua properti task: Title, Description (dirender sebagai teks), Status (dengan badge berwarna), Priority (dengan badge berwarna), Assignee, Due Date (terformat), Labels (sebagai komponen Badge), tanggal dibuat

#### Scenario: Menutup detail task
- **WHEN** user mengklik tombol close atau mengklik di luar Sheet
- **THEN** Sheet tertutup

#### Scenario: Aksi di detail task
- **WHEN** Sheet detail task terbuka
- **THEN** tombol aksi "Edit" dan "Delete" terlihat di header Sheet

### Requirement: TypeScript Interface untuk Task

Semua struktur data task harus didefinisikan sebagai TypeScript interface di `types/kanban.ts`.

#### Scenario: Definisi type
- **WHEN** file types didefinisikan
- **THEN** mengekspor:
  ```typescript
  type TaskStatus = "backlog" | "todo" | "in-progress" | "done"
  type TaskPriority = "low" | "medium" | "high" | "urgent"

  interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    assignee: string
    dueDate: string | null
    labels: string[]
    order: number
    createdAt: string
  }

  interface Column {
    id: TaskStatus
    title: string
  }
  ```
