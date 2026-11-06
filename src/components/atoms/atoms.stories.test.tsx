import { runStories } from '../../test/run-stories'
import * as progressBar from './ProgressBar/ProgressBar.stories'
import * as select from './Select/Select.stories'

runStories('ProgressBar stories', progressBar)
runStories('Select stories', select)
