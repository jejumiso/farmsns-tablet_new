// src/stores/tablet/useTabletSettingsStore.ts
import { defineStore } from 'pinia'
import { createEmptyTabletSettings, type TabletSettings } from '~/shared-types/tablet-settings/tabletSettings'

export const useTabletSettingsStore = defineStore('tabletSettings', {
  state: () => ({
    settings: createEmptyTabletSettings(),
  }),

  actions: {
    set(settings: TabletSettings) {
      this.settings = settings
    },

    reset() {
      this.settings = createEmptyTabletSettings()
    }
  }
})
