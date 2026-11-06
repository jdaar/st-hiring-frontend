import { describe, it } from 'vitest'
import { STORY_TIMEOUT, runStory, storyCases } from '../../test/run-stories'
import * as eventSummary from './EventSummary/EventSummary.stories'
import * as expandable from './Expandable/Expandable.stories'
import * as labeledSelect from './LabeledSelect/LabeledSelect.stories'

describe('EventSummary stories', () => {
  it.each(storyCases(eventSummary))('%s', runStory, STORY_TIMEOUT)
})
describe('LabeledSelect stories', () => {
  it.each(storyCases(labeledSelect))('%s', runStory, STORY_TIMEOUT)
})
describe('Expandable stories', () => {
  it.each(storyCases(expandable))('%s', runStory, STORY_TIMEOUT)
})
