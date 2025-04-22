import { defineStore } from 'pinia'
import { createEmptyTabletSettings, type TabletSettings } from '~/shared-types/tablet-settings/tabletSettings'
import { watchTabletSettings, stopTabletSettingsWatcher } from '~/utils/watchTabletSettings'

export const useTabletSettingsStore = defineStore('tabletSettings', {
  state: () => ({
    settings: createEmptyTabletSettings(),
  }),

  actions: {
    async listen(companyId: string) {
      let tabletNumber = Number(localStorage.getItem('tabletNumber'))
      if (!tabletNumber || isNaN(tabletNumber)) {
        tabletNumber = 1
        localStorage.setItem('tabletNumber', '1')
      }

      watchTabletSettings(companyId, tabletNumber)
    },

    stop() {
      stopTabletSettingsWatcher()
    },

    reset() {
      this.settings = createEmptyTabletSettings()
    }
  }
})
