import { s3, Bucket } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: Request) {
  try {
    const formdata = await req.formData();

    const body: { key: string; folder: string } = JSON.parse(
      formdata.get('data') as string
    );
    const file = formdata.get('file');

    let url = '';
    if (file instanceof Blob) {
      const Body = Buffer.from(await file.arrayBuffer());

      const folder = (body.folder || '').replace(/^\/|\/$/g, '') + '/';
      const fileExtension = file.name.split('.').pop();

      const Key = `${folder}${body.key}.${fileExtension}`;
      const response = await s3.send(
        new PutObjectCommand({ Bucket, Key, Body })
      );
      if (!response || response.$metadata.httpStatusCode !== 200) {
        throw new Error('Failed to upload file to S3');
      }
      url = `https://${Bucket}.s3.amazonaws.com/${Key}`;
    }

    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('An unknown error occurred', { status: 500 });
  }
}
