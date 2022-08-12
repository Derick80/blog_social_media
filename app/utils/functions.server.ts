export const handleFileUpload = async (file: File) => {
  let inputFormData = new FormData();
  inputFormData.append("postImg", file);
  const response = await fetch("/image", {
    method: "POST",
    body: inputFormData,
  });

  const { imageUrl } = await response.json();
  console.log("imageUrl", imageUrl);

  setFormData({
    ...formData,
    postImg: imageUrl,
  });
};
