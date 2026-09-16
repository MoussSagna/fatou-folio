const API_URL = "http://localhost:3000/api";

interface UploadImageResponse {
    url: string;
    publicId: string;
}

export async function uploadImage(
    file: File,
): Promise<UploadImageResponse> {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
        `${API_URL}/uploads/image`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        },
    );

    if (!response.ok) {
        const errorBody = await response.text();

        console.error(
            "UPLOAD IMAGE STATUS:",
            response.status,
        );

        console.error(
            "UPLOAD IMAGE RESPONSE:",
            errorBody,
        );

        throw new Error(
            `Unable to upload image (${response.status})`,
        );
    }

    return (await response.json()) as UploadImageResponse;
}

export async function deleteImage(
    publicId: string,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/uploads/image`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                publicId,
            }),
        },
    );

    if (!response.ok) {
        const errorBody = await response.text();

        console.error(
            "DELETE IMAGE STATUS:",
            response.status,
        );

        console.error(
            "DELETE IMAGE RESPONSE:",
            errorBody,
        );

        throw new Error(
            `Unable to delete image (${response.status})`,
        );
    }
}