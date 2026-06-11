---
name: deploy-docker-production
description: >
 Optimized automation script for checking version and deploying.
---
# --- [CONFIGURATION] ---
IMAGE_NAME="nextjs-wha-app"
VERSION="1.0.0"
FULL_IMAGE_TAG="${IMAGE_NAME}:${VERSION}"

CONTAINER_NAME="my-nextjs-wha-app"
PORT_MAPPING="3000:3000"
ENV_FILE=".env.production"

echo "========================================================================"
echo "🤖 Starting Agent Skill: Docker Lifecycle (Build & Run)"
echo "========================================================================"

# --- [STEP 1: PRE-FLIGHT CHECK] ---
# ตรวจสอบความพร้อมของ Docker Daemon
if ! docker info > /dev/null 2>&1; then
    echo "❌ [ERROR]: Docker daemon is not running. Please start Docker service."
    exit 1
fi

# ตรวจสอบว่ามีไฟล์ .env.production อยู่จริงหรือไม่ เพื่อป้องกันคำสั่ง run พังภายหลัง
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ [ERROR]: Environment file '${ENV_FILE}' not found in current directory."
    exit 1
fi


# --- [STEP 2: VERSION CHECK & BUILD MANAGEMENT] ---
echo "🔍 [CHECKING]: Searching for local image: '${FULL_IMAGE_TAG}'..."
IMAGE_ID=$(docker images -q "${FULL_IMAGE_TAG}" 2> /dev/null)

if [ -n "${IMAGE_ID}" ]; then
    echo "⚠️  [NOTIFICATION]: Image '${FULL_IMAGE_TAG}' already exists locally (ID: ${IMAGE_ID})."
    echo "⏭️  [ACTION]: Skipping build process to save resources."
else
    echo "📦 [NOT FOUND]: Local image does not exist. Initializing Docker Build..."
    echo "🚀 [EXECUTING]: docker build -t ${FULL_IMAGE_TAG} ."
    echo "------------------------------------------------------------------------"
    
    if docker build -t "${FULL_IMAGE_TAG}" .; then
        echo "------------------------------------------------------------------------"
        echo "✅ [SUCCESS]: Image built successfully."
    else
        echo "------------------------------------------------------------------------"
        echo "❌ [ERROR]: Docker build failed. Exiting pipeline."
        exit 1
    fi
fi


# --- [STEP 3: RUN TIME & CONTAINER CLEANUP] ---
echo "🔄 [MANAGING CONTAINER]: Checking for existing container: '${CONTAINER_NAME}'..."

# ตรวจสอบว่ามี Container ชื่อนี้รันหรือค้างอยู่หรือไม่ (รวมสถานะ exited)
EXISTING_CONTAINER=$(docker ps -a -q -f name="^${CONTAINER_NAME}$")

if [ -n "$EXISTING_CONTAINER" ]; then
    echo "⚠️  [NOTIFICATION]: Found old container with name '${CONTAINER_NAME}'."
    echo "🛑 [ACTION]: Stopping and removing existing container to prevent port conflicts..."
    docker rm -f "$EXISTING_CONTAINER" > /dev/null 2>&1
fi


# --- [STEP 4: EXECUTE NEW CONTAINER] ---
echo "🚀 [DEPLOYING]: Launching new container instance..."
echo "🐳 [COMMAND]: docker run --restart=always -d --name ${CONTAINER_NAME} --env-file ${ENV_FILE} -p ${PORT_MAPPING} ${FULL_IMAGE_TAG}"
echo "------------------------------------------------------------------------"

NEW_CONTAINER_ID=$(docker run --restart=always -d \
    --name "${CONTAINER_NAME}" \
    --env-file "${ENV_FILE}" \
    -p ${PORT_MAPPING} \
    "${FULL_IMAGE_TAG}" 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ [DEPLOY SUCCESS]: Container started successfully!"
    echo "🆔 [CONTAINER ID]: ${NEW_CONTAINER_ID:0:12}"
    echo "🌐 [URL]: http://localhost:${PORT_MAPPING%%:*}"
    echo "========================================================================"
    exit 0
else
    echo "❌ [DEPLOY ERROR]: Failed to start container."
    echo "📝 [LOGS]: ${NEW_CONTAINER_ID}"
    echo "========================================================================"
    exit 1
fi