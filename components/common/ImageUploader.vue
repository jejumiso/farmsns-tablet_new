<template>
  <div class="space-y-2">
    <!-- 업로드 영역 -->
    <div
      class="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-blue-400"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        @change="handleFileChange"
        accept="image/*"
        multiple
      />
      <p class="text-sm text-gray-600">이미지를 클릭하거나 드래그해서 업로드하세요</p>
    </div>

    <!-- 이미지 목록 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      <div
        v-for="(url, index) in images"
        :key="url"
        class="relative aspect-square border rounded overflow-hidden group"
      >
        <img :src="url" class="object-cover w-full h-full" />

        <!-- 썸네일 표시 -->
        <div
          class="absolute top-1 left-1 text-xs px-1 py-0.5 rounded bg-blue-600 text-white"
          v-if="THUMBNAIL_PREFIX + url === thumbnail"
        >
          썸네일
        </div>

        <!-- 버튼 영역 -->
        <div
          class="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition"
        >
          <template v-if="THUMBNAIL_PREFIX + url === thumbnail">
            <div class="text-xs bg-white text-blue-600 font-semibold px-2 py-1 rounded shadow">
              현재 썸네일
            </div>
            <button
              type="button"
              class="bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
              @click.stop="removeImage(index)"
            >
              삭제
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              class="bg-white text-xs px-2 py-1 rounded shadow"
              @click.stop="setThumbnail(url)"
            >
              썸네일 지정
            </button>
            <button
              type="button"
              class="bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
              @click.stop="removeImage(index)"
            >
              삭제
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { THUMBNAIL_PREFIX } from '~/shared-constants/constants'

// v-models
const images = defineModel<string[]>({ default: () => [] })
const thumbnail = defineModel<string>('thumbnail', { default: '' })

// props
const props = defineProps<{
  maxCount?: number
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  await uploadFiles(Array.from(files))
  if (fileInput.value) fileInput.value.value = ''
}

async function handleDrop(e: DragEvent) {
  const files = Array.from(e.dataTransfer?.files || [])
  await uploadFiles(files)
}

async function uploadFiles(files: File[]) {
  const max = props.maxCount ?? Infinity
  const remaining = max - images.value.length

  if (remaining <= 0) {
    alert(`이미지는 최대 ${max}개까지 등록할 수 있습니다.`)
    return
  }

  const limitedFiles = files.slice(0, remaining)

  for (const file of limitedFiles) {
    try {
      const url = await uploadImage(file)
      images.value.push(url)
      if (!thumbnail.value) {
        thumbnail.value = await createThumbnailAPI(url)
      }
    } catch (err) {
      console.error('업로드 실패', err)
    }
  }

  if (files.length > remaining) {
    alert(`${remaining}개만 업로드 되었어요. 최대 ${max}개까지 가능합니다.`)
  }
}

async function removeImage(index: number) {
  const removed = images.value.splice(index, 1)[0]
  if (THUMBNAIL_PREFIX + removed === thumbnail.value) {
    if (images.value[0]) {
      thumbnail.value = await createThumbnailAPI(images.value[0])
    } else {
      thumbnail.value = ''
    }
  }
}

async function setThumbnail(url: string) {
  thumbnail.value = await createThumbnailAPI(url)
}

// 실제 이미지 업로드 함수 (Firebase, S3 등 연동 가능)
async function uploadImage(file: File): Promise<string> {
  // TODO: 여기서 실제 이미지 업로드 API 연동
  return URL.createObjectURL(file) // 예시: 실제에선 서버 URL로 대체
}

async function createThumbnailAPI(originalImageUrl: string): Promise<string> {
  // TODO: 서버에서 썸네일 생성 요청
  return THUMBNAIL_PREFIX + originalImageUrl
}
</script>
