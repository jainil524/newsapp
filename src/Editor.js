import React, { useState, useRef } from "react";

const Editor = () => {
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [content, setContent] = useState("");
    const [reporter, setReporter] = useState("");
    const [images, setImages] = useState([]);
    const canvasRef = useRef(null);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 2) {
            alert("You can only upload a maximum of 2 images.");
        } else {
            setImages(files);
        }
    };

    const indianDateConverter = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Load background image
        const backgroundImg = new Image();
        backgroundImg.src = "/Templete.jpg";
        backgroundImg.onload = () => {
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

            // Helper function to draw text with line breaks
            const drawText = (text, x, y, color="white", fs="20") => {
                const lines = text.split('\n');
                const lineHeight = 30; // Adjust line height as needed

                ctx.font = fs+"px Arial";
                ctx.fillStyle = color;
                lines.forEach((line, index) => {
                    ctx.fillText(line, x, y + index * lineHeight);
                });
            };

            // Helper function to wrap text
            const wrapText = (text, x, y, maxWidth) => {
                const words = text.split(' ');
                let line = '';
                const lineHeight = 30; // Adjust line height as needed

                words.forEach((word) => {
                    const testLine = line + word + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth) {
                        ctx.fillStyle = "black";
                        ctx.fillText(line, x, y);
                        line = word + ' ';
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                });

                ctx.fillText(line, x, y);
            };




            drawText(indianDateConverter(date), 410, 227);
            drawText(location, 610, 227, "black");
            wrapText(content, 30, 630, 700);
            drawText(reporter, 128, 1070, "white", "24");

            // Image placement logic
            const placeImage = (img, x, y, width, height) => {
                img.onload = () => {
                    ctx.drawImage(img, x, y, width, height);
                };
            };

            if (images.length === 1) {
                // Single Image - Fit within the combined area of both image areas
                const singleImage = new Image();
                const combinedArea = [20, 270, 750, 589]; // Combined area of Image 1 and Image 2

                const [x1, y1, x2, y2] = combinedArea;
                const imgWidth = x2 - x1;
                const imgHeight = y2 - y1;

                const reader = new FileReader();
                reader.onload = (event) => {
                    singleImage.src = event.target.result;
                    placeImage(singleImage, x1, y1, imgWidth, imgHeight);
                };
                reader.readAsDataURL(images[0]);
            } else if (images.length === 2) {
                // Two Images - Placed in their respective areas
                const [image1, image2] = images;

                const image1Area = [30, 285, 335, 300];
                const image2Area = [400, 285, 340, 300];

                const reader1 = new FileReader();
                reader1.onload = (event) => {
                    const img1 = new Image();
                    img1.src = event.target.result;
                    placeImage(img1, ...image1Area);
                };
                reader1.readAsDataURL(image1);

                const reader2 = new FileReader();
                reader2.onload = (event) => {
                    const img2 = new Image();
                    img2.src = event.target.result;
                    placeImage(img2, ...image2Area);
                };
                reader2.readAsDataURL(image2);
            }

            // Allow time for images to load and then export
            setTimeout(() => {
                const dataURL = canvas.toDataURL("image/jpeg");
                const link = document.createElement("a");
                link.href = dataURL;
                link.download = "news-template.jpg";
                link.click();
            }, 2000);
        };
    };

    return (
        <div>
            <form>
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

                <label>Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>

                <label>Reporter:</label>
                <input type="text" value={reporter} onChange={(e) => setReporter(e.target.value)} />

                <label>Images:</label>
                <input type="file" multiple onChange={handleImageUpload} />

                <button type="button" onClick={handleSubmit}>
                    Generate Image
                </button>
            </form>
            <canvas ref={canvasRef} width={768} height={1086} style={{ display: "none" }}></canvas>
        </div>
    );
};

export default Editor;