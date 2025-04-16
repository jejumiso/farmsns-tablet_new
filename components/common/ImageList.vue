<template>
  <div class="space-y-2">
    <div class="text-sm text-gray-500">💡 이미지를 드래그하여 순서를 변경할 수 있어요</div>

    <div v-if="images.length">
      <draggable
        v-model="images"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
      >
        <template #item="{ element: fileName, index }">
          <div class="relative aspect-square border rounded overflow-hidden group">
            <img :src="getImageUrl(fileName)" class="object-cover w-full h-full" />

            <div
              class="absolute top-1 left-1 text-xs px-1 py-0.5 rounded bg-blue-600 text-white"
              v-if="thumbnail === THUMBNAIL_PREFIX + fileName"
            >
              썸네일
            </div>

            <div
              v-if="showControls"
              class="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition"
            >
              <template v-if="thumbnail === THUMBNAIL_PREFIX + fileName">
                <div class="text-xs bg-white text-blue-600 font-semibold px-2 py-1 rounded shadow">현재 썸네일</div>
                <button
                  class="bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
                  @click.stop="removeImage(index)"
                >
                  삭제
                </button>
              </template>
              <template v-else>
                <button
                  class="bg-white text-xs px-2 py-1 rounded shadow"
                  @click.stop="setThumbnail(fileName)"
                >
                  썸네일 지정
                </button>
                <button
                  class="bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
                  @click.stop="removeImage(index)"
                >
                  삭제
                </button>
              </template>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div v-else class="text-sm text-gray-500">등록된 이미지가 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
import { defineModel, defineProps, watch } from 'vue'
import { STORAGE_BASE_URL, THUMBNAIL_PREFIX } from '@/shared-constants/constants'
import draggable from 'vuedraggable'

const images = defineModel<string[]>({ default: () => [] })
const thumbnail = defineModel<string>('thumbnail', { default: '' })

const props = defineProps<{
  showControls?: boolean
}>()

// 파일 이름 → 전체 URL 변환 함수
const getImageUrl = (fileName: string) => `${STORAGE_BASE_URL}/${fileName}`

watch(
  () => images.value.length,
  (newLen, oldLen) => {
    if (oldLen === 0 && newLen > 0 && !thumbnail.value) {
      setThumbnail(images.value[0])
    }
  }
)

const removeImage = (index: number) => {
  const removed = images.value.splice(index, 1)[0]
  if (thumbnail.value === THUMBNAIL_PREFIX + removed) {
    thumbnail.value = images.value[0] ? THUMBNAIL_PREFIX + images.value[0] : ''
  }
}

const setThumbnail = (fileName: string) => {
  thumbnail.value = THUMBNAIL_PREFIX + fileName
}
</script>
