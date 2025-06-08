import React, { useRef, useState } from "react";
import axios from "axios";

export default function FileUpload({ taskId, onUpload }) {
  const fileInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/tasks/${taskId}/attachments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onUpload(res.data.file);
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
      fileInput.current.value = "";
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: "inline-block" }}
      />
      {uploading && <span style={{ marginLeft: 8 }}>Uploading...</span>}
      {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
    </div>
  );
}
