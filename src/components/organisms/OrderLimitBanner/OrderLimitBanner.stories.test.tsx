import { describe, it } from 'vitest'
import { STORY_TIMEOUT, runStory, storyCases } from '../../../test/run-stories'
import * as stories from './OrderLimitBanner.stories'
import * as connectedStories from './OrderLimitBannerContainer.stories'

describe('OrderLimitBanner stories', () => {
  it.each(storyCases(stories))('%s', runStory, STORY_TIMEOUT)
})
describe('OrderLimitBanner/Connected stories', () => {
  it.each(storyCases(connectedStories))('%s', runStory, STORY_TIMEOUT)
})
