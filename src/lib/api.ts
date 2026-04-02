const LAMBDA_URL = "https://vfh2rowcts3ypzvfkhsye42h5y0fjrke.lambda-url.us-east-1.on.aws/";

export async function createAlbum(): Promise<{ shareToken: string; albumId: string }> {
  const res = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create_album" }),
  });
  if (!res.ok) throw new Error("Failed to create album");
  return res.json();
}

export async function getUploadUrl(shareToken: string, fileName: string, fileType: string): Promise<string> {
  const res = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_upload_url", shareToken, fileName, fileType }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  const data = await res.json();
  return data.uploadUrl;
}

export async function getPhotos(shareToken: string): Promise<string[]> {
  const res = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get_photos", shareToken }),
  });
  if (!res.ok) throw new Error("Failed to get photos");
  const data = await res.json();
  return data.urls;
}

export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error("Failed to upload file");
}
