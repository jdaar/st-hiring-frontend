import { runStories } from '../../test/run-stories'
import * as eventSummary from './EventSummary/EventSummary.stories'
import * as labeledSelect from './LabeledSelect/LabeledSelect.stories'

runStories('EventSummary stories', eventSummary)
runStories('LabeledSelect stories', labeledSelect)
