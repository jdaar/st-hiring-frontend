import { describe, it } from 'vitest'
import { STORY_TIMEOUT, runStory, storyCases } from '../../../test/run-stories'
import * as listStories from './PaginatedList.stories'
import * as connectedStories from '../EventsList/EventsListContainer.stories'

describe('PaginatedList stories', () => {
  it.each(storyCases(listStories))('%s', runStory, STORY_TIMEOUT)
})
describe('PaginatedList/Connected stories', () => {
  it.each(storyCases(connectedStories))('%s', runStory, STORY_TIMEOUT)
})
