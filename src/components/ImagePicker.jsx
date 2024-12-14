// import React, { useState } from "react";

// function ImagePicker({ handleFileChange }) {
//   const [dragging, setDragging] = useState(false);
//   const [preview, setPreview] = useState(null);

//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(false);

//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const file = e.dataTransfer.files[0];
//       handleFileChange({ target: { files: [file] } });
//       previewFile(file); // Preview the file
//       e.dataTransfer.clearData();
//     }
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     handleFileChange(e);
//     previewFile(file); // Preview the file
//   };

//   const previewFile = (file) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setPreview(reader.result); // Set preview to the file's Base64 URL
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div
//       className={`image-picker ${dragging ? "dragging" : ""}`}
//       onDragEnter={handleDragEnter}
//       onDragLeave={handleDragLeave}
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//       style={{
//         border: dragging ? "2px dashed #ff0000" : "2px dashed #00ccff",
//         padding: "20px",
//         borderRadius: "10px",
//         backgroundColor: dragging ? "#111" : "#222",
//         color: "#fff",
//         textAlign: "center",
//         cursor: "pointer",
//         transition: "background-color 0.3s, border-color 0.3s",
//       }}
//     >
//       {preview ? (
//         <img
//           src={preview}
//           alt="Uploaded Preview"
//           style={{
//             maxWidth: "100%",
//             maxHeight: "200px",
//             borderRadius: "10px",
//             marginBottom: "10px",
//           }}
//         />
//       ) : (
//         <p>Drag and drop an image file here, or click to select</p>
//       )}
//       <input
//         type="file"
//         id="fileInput"
//         onChange={handleFileSelect}
//         accept="image/*"
//         style={{ display: "none" }}
//       />
//       <label
//         htmlFor="fileInput"
//         style={{
//           display: "inline-block",
//           padding: "10px 20px",
//           marginTop: "10px",
//           backgroundColor: "#ff0000",
//           color: "#fff",
//           borderRadius: "5px",
//           cursor: "pointer",
//           transition: "background-color 0.3s",
//         }}
//       >
//         Select File
//       </label>
//     </div>
//   );
// }

// export default ImagePicker;
