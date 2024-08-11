document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    formData.append('image', fileField.files[0]);

    try {
        const response = await fetch('http://localhost:3002/images', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload file.');
        }

        loadFiles();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to upload file.');
    }
});

async function loadFiles() {
    try {
        const response = await fetch('http://localhost:3002/images');
        if (!response.ok) {
            throw new Error('Failed to fetch files.');
        }
        const files = await response.json();

        const imageContainer = document.getElementById('imageContainer');
        const pdfCanvas = document.getElementById('pdfCanvas');

        imageContainer.innerHTML = '';
        pdfCanvas.style.display = 'none'; // Oculta el canvas por defecto

        files.forEach(file => {
            if (file.mimetype.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = `http://localhost:3002/uploads/${file.filename}`;
                img.alt = file.filename;
                img.classList.add('uploaded-image');
                imageContainer.appendChild(img);
            } else if (file.mimetype === 'application/pdf') {
                pdfCanvas.style.display = 'block'; // Muestra el canvas si hay PDFs

                const pdfUrl = `http://localhost:3002/uploads/${file.filename}`;
                renderPDF(pdfUrl);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch files.');
    }
}

async function renderPDF(url) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;

    // Obtén la primera página del PDF
    const page = await pdf.getPage(1);

    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    // Prepara el canvas usando el tamaño del viewport
    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Renderiza la página en el canvas
    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    await page.render(renderContext).promise;
}

// Cargar las imágenes y PDFs al cargar la página
loadFiles();
