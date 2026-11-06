import { runStories } from '../../../test/run-stories'
import * as formStories from './SettingsForm.stories'
import * as connectedStories from './SettingsFormContainer.stories'

runStories('SettingsForm stories', formStories)
runStories('SettingsForm/Connected stories', connectedStories)
