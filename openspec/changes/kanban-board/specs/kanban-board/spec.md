## ADDED Requirements

### Requirement: Layout Kanban Empat Kolom

Board menampilkan tepat empat kolom dalam urutan horizontal tetap: Backlog, Todo, In Progress, Done. Setiap kolom menampilkan nama, badge jumlah task, dan daftar kartu task yang bisa di-scroll vertikal.

#### Scenario: Board merender empat kolom
- **WHEN** user memuat halaman root
- **THEN** board menampilkan empat kolom secara berurutan: "Backlog", "Todo", "In Progress", "Done"
- **THEN** setiap header kolom menampilkan nama kolom dan jumlah task dalam tanda kurung

#### Scenario: Kolom bisa di-scroll secara independen
- **WHEN** sebuah kolom memiliki lebih banyak task dari area yang terlihat
- **THEN** kolom tersebut scroll vertikal tanpa mempengaruhi kolom lain

#### Scenario: Board bisa di-scroll horizontal di layar kecil
- **WHEN** lebar viewport kurang dari 768px
- **THEN** board scroll horizontal untuk menampilkan keempat kolom
- **THEN** setiap kolom memiliki lebar minimum 280px

### Requirement: Drag and Drop Antar Kolom

User dapat men-drag kartu task dari satu kolom ke kolom lain untuk mengubah status task. Board memberikan feedback visual selama operasi drag.

#### Scenario: Drag task ke kolom berbeda
- **WHEN** user men-drag kartu task dari kolom "Todo"
- **AND** menjatuhkannya ke kolom "In Progress"
- **THEN** status task berubah menjadi "in-progress"
- **THEN** task muncul di kolom "In Progress" pada posisi drop
- **THEN** jumlah task di kedua kolom diperbarui

#### Scenario: Feedback visual saat drag
- **WHEN** user mulai men-drag kartu task
- **THEN** drag overlay (clone visual) mengikuti kursor
- **THEN** kartu asli menampilkan placeholder dengan opacity berkurang
- **THEN** target drop yang valid (kolom) menampilkan indikator highlight

#### Scenario: Drag and drop yang aksesibel via keyboard
- **WHEN** user memfokuskan kartu task dan menekan Space atau Enter
- **THEN** kartu masuk ke mode drag
- **WHEN** user menekan tombol panah
- **THEN** kartu berpindah antar posisi/kolom
- **WHEN** user menekan Space atau Enter lagi
- **THEN** kartu dijatuhkan pada posisi saat ini

### Requirement: Mengurutkan Ulang Task Dalam Kolom

User dapat men-drag kartu task dalam kolom yang sama untuk mengurutkan ulang.

#### Scenario: Reorder dalam kolom yang sama
- **WHEN** user men-drag kartu task dalam kolom yang sama
- **AND** menjatuhkannya pada posisi berbeda
- **THEN** urutan task diperbarui dan semua kartu di kolom tersebut diurutkan ulang
- **THEN** status tetap tidak berubah

### Requirement: Tampilan Task Card

Setiap kartu task menampilkan ringkasan properti kunci task untuk pemindaian cepat.

#### Scenario: Kartu task menampilkan informasi esensial
- **WHEN** kartu task dirender
- **THEN** menampilkan: judul task (bold, dipotong jika panjang), badge prioritas (berwarna), avatar atau inisial assignee, dan due date (jika ada)
- **THEN** badge prioritas menggunakan warna: Urgent=merah, High=oranye, Medium=kuning, Low=abu-abu

#### Scenario: Klik kartu task membuka tampilan detail
- **WHEN** user mengklik kartu task (bukan drag)
- **THEN** panel Sheet slide-over terbuka menampilkan detail lengkap task

### Requirement: Header Board

Board memiliki header dengan judul board dan aksi utama.

#### Scenario: Header menampilkan judul board dan aksi
- **WHEN** board dirender
- **THEN** header menampilkan "Kanban Board" sebagai judul
- **THEN** tombol "+ New Task" ditampilkan secara menonjol

#### Scenario: Tombol new task membuka dialog pembuatan
- **WHEN** user mengklik tombol "+ New Task"
- **THEN** modal Dialog terbuka dengan form pembuatan task

### Requirement: Drag and Drop yang Aksesibel

Sistem drag-and-drop harus aksesibel untuk screen reader dan pengguna keyboard.

#### Scenario: Pengumuman screen reader
- **WHEN** task diambil untuk di-drag
- **THEN** screen reader mengumumkan "Picked up task: {title}"
- **WHEN** task dipindahkan ke atas kolom
- **THEN** screen reader mengumumkan "Task {title} is over {column name}"
- **WHEN** task dijatuhkan
- **THEN** screen reader mengumumkan "Task {title} was moved to {column name}"
