import { describe, it } from 'vitest'
import { STORY_TIMEOUT, runStory, storyCases } from '../../../test/run-stories'
import * as formStories from './SettingsForm.stories'
import * as connectedStories from './SettingsFormContainer.stories'

describe('SettingsForm stories', () => {
  it.each(storyCases(formStories))('%s', runStory, STORY_TIMEOUT)
})
describe('SettingsForm/Connected stories', () => {
  it.each(storyCases(connectedStories))('%s', runStory, STORY_TIMEOUT)
})
