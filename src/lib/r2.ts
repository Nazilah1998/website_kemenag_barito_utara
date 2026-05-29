import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";
import { logWarn } from "@/lib/logger";

const { accessKeyId, secretAccessKey, endpoint, bucketName } = env.r2;

let s3Client: S3Client | null = null;

export function getR2Client(): S3Client | null {
  if (s3Client) return s3Client;

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    logWarn("r2_credentials_missing");
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

export async function uploadToR2(buffer: Buffer | Uint8Array, path: string, contentType: string): Promise<string> {
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

export async function deleteFromR2(path: string): Promise<void> {
  const client = getR2Client();
  if (!client) return;

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: path,
  });

  await client.send(command);
}

export async function getPresignedR2Url(path: string, expiresIn = 3600): Promise<string> {
  const client = getR2Client();
  if (!client) throw new Error("R2 Client not initialized");

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: path,
  });

  const url = await getSignedUrl(client, command, { expiresIn });
  return url;
}

export function getR2PublicUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `/api/storage/r2/${path}`;
}
