# Bun S3 Workflow Bug Reproduction

This repo reproduces a bug where Bun's native S3 client fails inside Mastra workflow steps with `ReferenceError: Bun is not defined`.

## Bug Description

When running a Mastra app with Bun runtime and using Bun's native S3 client (`Bun.s3`) inside a workflow step, the workflow throws an error saying "Bun is not defined". This happens because Mastra workflows run under Node.js runtime even when the app is started with Bun.

## Steps to Reproduce

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the dev server:
   ```bash
   bun dev
   ```

3. Create a workflow run:
   ```bash
   curl -X POST http://localhost:4111/api/workflows/bun-s3-workflow/create-run
   ```
   
   Copy the `runId` from the response.

4. Start the workflow:
   ```bash
   curl -X POST "http://localhost:4111/api/workflows/bun-s3-workflow/start?runId=<runId>" \
     -H "Content-Type: application/json" \
     -d '{"inputData": {"content": "Hello from Bun!", "key": "test-file.txt"}}'
   ```

5. Check the terminal running `bun dev` - you'll see the error:
   ```
   Error executing step workflow.bun-s3-workflow.step.upload-to-s3: ReferenceError: Bun is not defined
   ```

## Expected Behavior

Bun's native S3 client should be available inside workflow steps when running the app with Bun.

## Actual Behavior

Workflow steps run under Node.js runtime, making Bun-specific APIs unavailable.

## Environment

- Bun v1.3.2
- @mastra/core v1.0.0-beta.11
- macOS
