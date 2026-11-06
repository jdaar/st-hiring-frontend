import { describe, it } from 'vitest'
import { STORY_TIMEOUT, runStory, storyCases } from '../../../test/run-stories'
import * as stories from './SettingsDialog.stories'

describe('SettingsDialog stories', () => {
  it.each(storyCases(stories))('%s', runStory, STORY_TIMEOUT)
})
