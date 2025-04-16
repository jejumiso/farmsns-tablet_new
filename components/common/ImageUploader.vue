<template>
  <div class="space-y-2">
    <!-- 제한사항 요약 툴팁 -->
    <div class="flex items-center gap-1 text-sm text-gray-600">
      
      <div class="relative group">업로드 제한사항
        <span class="cursor-help text-blue-500 font-bold">?</span>
        <div
          class="absolute z-10 w-60 text-xs text-white bg-gray-800 rounded p-2 shadow-md opacity-0 group-hover:opacity-100 transition pointer-events-none mt-1 left-1/2 -translate-x-1/2"
        >
          최대 {{ MAX_COUNT ?? '무제한' }}개<br />
          최대 용량: {{ MAX_SIZE_KB ?? '제한 없음' }}KB<br />
          크기: {{ MIN_WIDTH ?? '-' }}~{{ MAX_WIDTH ?? '-' }}px 가로 /
          {{ MIN_HEIGHT ?? '-' }}~{{ MAX_HEIGHT ?? '-' }}px 세로<br />
          비율:
          {{ MIN_ASPECT_RATIO ? `최소 ${MIN_ASPECT_RATIO}` : '제한 없음' }}
          ~
          {{ MAX_ASPECT_RATIO ? `최대 ${MAX_ASPECT_RATIO}` : '제한 없음' }}
        </div>
      </div>
    </div>

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
      <p class="text-sm text-gray-600">
        이미지를 클릭하거나 드래그해서 업로드하세요
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/services/image'


const images = defineModel<string[]>({ default: () => [] })
const isUploading = ref(false)

const props = defineProps<{
  imageType: 'company' | 'product'
  companyId: string
  maxCount?: number
  maxSizeKb?: number
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
  minAspectRatio?: number
  maxAspectRatio?: number
}>()

// ✅ 기본값 정의 (한눈에 보기 좋게 정리)
const MAX_COUNT = props.maxCount ?? 10 // 최대 이미지 개수
const MAX_SIZE_KB = props.maxSizeKb ?? 1024 * 5 // 5MB = 5120KB
const MAX_WIDTH = props.maxWidth ?? 1000
const MAX_HEIGHT = props.maxHeight ?? 1000
const MIN_WIDTH = props.minWidth ?? 30
const MIN_HEIGHT = props.minHeight ?? 30
const MIN_ASPECT_RATIO = props.minAspectRatio ?? 0 // 0 = 제한 없음
const MAX_ASPECT_RATIO = props.maxAspectRatio ?? Infinity

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  const uploadedUrls = await uploadFiles(Array.from(files))
  if (fileInput.value) fileInput.value.value = ''
}

async function handleDrop(e: DragEvent) {
  const files = Array.from(e.dataTransfer?.files || [])
  const uploadedUrls = await uploadFiles(files)
}

async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadedFileNames : string[] = []
  const remaining = MAX_COUNT - images.value.length

  if (remaining <= 0) {
    alert(`이미지는 최대 ${MAX_COUNT}개까지 등록할 수 있습니다.`)
    return []
  }

  if (files.length > remaining) {
    alert(`${remaining}개만 업로드 되었어요. 최대 ${MAX_COUNT}개까지 가능합니다.`)
  }

  const limitedFiles = files.slice(0, remaining)
  isUploading.value = true

  for (const file of limitedFiles) {
    try {
      if (file.size > MAX_SIZE_KB * 1024) {
        alert(`파일 크기는 ${MAX_SIZE_KB}KB 이하여야 합니다.`)
        continue
      }

      const { resizedBlob, isValid } = await resizeAndValidateImage(file)
      if (!isValid) continue


      // 예: 서비스 레이어 함수 호출
      const res = await uploadImage(resizedBlob,props.companyId, props.imageType)
      if (res.isSuccess !== true) {
        alert('이미지 업로드에 실패했습니다.')
        continue
      }
      uploadedFileNames .push(res.data!.fileName)

    } catch (err) {
      console.error('업로드 실패:', err)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    }
  }

  isUploading.value = false

  // ✅ 업로드된 이미지들을 images에 반영!
  images.value.push(...uploadedFileNames )

  return uploadedFileNames 
}

async function resizeAndValidateImage(file: File): Promise<{ resizedBlob: Blob, isValid: boolean }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      const aspectRatio = width / height

      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        alert(`이미지 크기는 최소 ${MIN_WIDTH}x${MIN_HEIGHT}px 이상이어야 합니다.`)
        return resolve({ resizedBlob: file, isValid: false })
      }

      if (MIN_ASPECT_RATIO === MAX_ASPECT_RATIO) {
        if (aspectRatio !== MIN_ASPECT_RATIO) {
          alert(`가로:세로 비율은 ${MIN_ASPECT_RATIO}:1 이어야 합니다.`)
          return resolve({ resizedBlob: file, isValid: false })
        }
      } else {
        if (aspectRatio < MIN_ASPECT_RATIO) {
          alert(`가로:세로 비율이 너무 작습니다. 최소 비율은 ${MIN_ASPECT_RATIO}입니다.`)
          return resolve({ resizedBlob: file, isValid: false })
        }
        if (aspectRatio > MAX_ASPECT_RATIO) {
          alert(`가로:세로 비율이 너무 큽니다. 최대 비율은 ${MAX_ASPECT_RATIO}입니다.`)
          return resolve({ resizedBlob: file, isValid: false })
        }
      }

      let newWidth = width
      let newHeight = height
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
        newWidth = Math.round(width * ratio)
        newHeight = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      canvas.toBlob(blob => {
        if (blob) {
          resolve({ resizedBlob: blob, isValid: true })
        } else {
          reject(new Error('리사이즈 실패'))
        }
      }, 'image/jpeg', 0.9)
    }

    img.onerror = () => {
      alert('이미지를 로드하는 데 실패했습니다.')
      reject(new Error('이미지 로드 실패'))
    }
    img.src = URL.createObjectURL(file)
  })
}
</script>
