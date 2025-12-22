import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

/**
 * This workflow attempts to use Bun's native S3 client.
 * When running under Mastra's workflow execution context,
 * this may fail with "bun not found" error because workflows
 * might run under Node.js runtime instead of Bun.
 */

const uploadToS3Step = createStep({
  id: 'upload-to-s3',
  description: 'Attempts to upload data to S3 using Bun native S3 client',
  inputSchema: z.object({
    content: z.string().describe('Content to upload'),
    key: z.string().describe('S3 object key'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    // Use Bun's native S3 client directly
    const s3File = Bun.s3('my-bucket', inputData.key);
    await s3File.write(inputData.content);

    return {
      success: true,
      message: `Successfully uploaded to s3://my-bucket/${inputData.key}`,
    };
  },
});

const bunS3Workflow = createWorkflow({
  id: 'bun-s3-workflow',
  inputSchema: z.object({
    content: z.string().describe('Content to upload'),
    key: z.string().describe('S3 object key'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
}).then(uploadToS3Step);

bunS3Workflow.commit();

export { bunS3Workflow };
