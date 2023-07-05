import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    console.log("handler");
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission with the selected file
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      // ... Your logic here to handle the file
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="fileInput">
        <Form.Label>Select File</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default FileUploadForm;
