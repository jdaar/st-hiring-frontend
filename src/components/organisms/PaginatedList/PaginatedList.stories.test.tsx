import { runStories } from '../../../test/run-stories'
import * as listStories from './PaginatedList.stories'
import * as connectedStories from '../EventsList/EventsListContainer.stories'

runStories('PaginatedList stories', listStories)
runStories('PaginatedList/Connected stories', connectedStories)
