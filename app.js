// Biến lưu trữ database mô phỏng
let database = {};

// Fetch database.json khi load trang
async function loadDatabase() {
    try {
        const response = await fetch('./database.json');
        database = await response.json();
    } catch (e) {
        console.log("Chưa có database hoặc lỗi load data.");
    }
}
loadDatabase();

// Hàm tạo Hash SHA-256 cho file ảnh
async function calculateHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Xử lý khi chọn ảnh
document.getElementById('imageInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const statusMsg = document.getElementById('statusMessage');
    statusMsg.innerHTML = "Đang kiểm tra ảnh...";

    const fileHash = await calculateHash(file);
    
    // Đối chiếu với database
    if (database[fileHash]) {
        statusMsg.innerHTML = `<span class="warning">⚠️ Ảnh này đã tồn tại trong hệ thống!</span>`;
        document.getElementById('tikzCode').value = database[fileHash].tikzCode;
        document.getElementById('uploadBtn').disabled = true;
    } else {
        statusMsg.innerHTML = `<span style="color: green;">✅ Ảnh mới. Có thể tiến hành viết code và lưu trữ.</span>`;
        document.getElementById('uploadBtn').disabled = false;
    }
});

// Xử lý Compile TikZ
document.getElementById('compileBtn').addEventListener('click', () => {
    const rawCode = document.getElementById('tikzCode').value;
    const previewArea = document.getElementById('preview-area');
    
    // Reset khu vực hiển thị
    previewArea.innerHTML = ''; 

    // Tạo thẻ script cho TikzJax xử lý
    const script = document.createElement('script');
    script.type = 'text/tikz';
    script.textContent = rawCode;
    previewArea.appendChild(script);
});
