import { describe, it } from 'vitest'
import { STORY_TIMEOUT, runStory, storyCases } from '../../test/run-stories'
import * as banner from './Banner/Banner.stories'
import * as dialog from './Dialog/Dialog.stories'
import * as progressBar from './ProgressBar/ProgressBar.stories'
import * as select from './Select/Select.stories'
import * as tabs from './Tabs/Tabs.stories'

describe('ProgressBar stories', () => {
  it.each(storyCases(progressBar))('%s', runStory, STORY_TIMEOUT)
})
describe('Select stories', () => {
  it.each(storyCases(select))('%s', runStory, STORY_TIMEOUT)
})
describe('Banner stories', () => {
  it.each(storyCases(banner))('%s', runStory, STORY_TIMEOUT)
})
describe('Dialog stories', () => {
  it.each(storyCases(dialog))('%s', runStory, STORY_TIMEOUT)
})
describe('Tabs stories', () => {
  it.each(storyCases(tabs))('%s', runStory, STORY_TIMEOUT)
})
