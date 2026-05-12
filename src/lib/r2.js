import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env";

const { accessKeyId, secretAccessKey, endpoint, bucketName } = env.r2;

let s3Client = null;

export function getR2Client() {
  if (s3Client) return s3Client;

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    console.warn("Cloudflare R2 credentials are not fully configured.");
    return null;
  }

  s3Client = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  return s3Client;
}

/**
 * Upload a file to Cloudflare R2
 * @param {Buffer | Uint8Array} buffer File content
 * @param {string} path Destination path in bucket
 * @param {string} contentType MIME type
 * @returns {Promise<string>} Public proxy URL
 */
export async function uploadToR2(buffer, path, contentType) {
  const client = getR2Client();
  if (!client) throw new Error("R2 Client not initialized");

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: path,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  return `/api/storage/r2/${path}`;
}

/**
 * Delete a file from Cloudflare R2
 * @param {string} path Path in bucket
 */
export async function deleteFromR2(path) {
  const client = getR2Client();
  if (!client) return;

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: path,
  });

  await client.send(command);
}

/**
 * Get public proxy URL for R2 file
 * @param {string} path Path in bucket
 * @returns {string}
 */
export function getR2PublicUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `/api/storage/r2/${path}`;
}
