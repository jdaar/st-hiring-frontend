import { describe, it } from 'vitest'
import { STORY_TIMEOUT, runStory, storyCases } from '../../../test/run-stories'
import * as stories from './SettingsTabs.stories'

describe('SettingsTabs stories', () => {
  it.each(storyCases(stories))('%s', runStory, STORY_TIMEOUT)
})
